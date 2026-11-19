"""Database bootstrap run at app start-up.

1. Creates any missing tables (safe: never alters or drops existing ones).
2. ONE-TIME: if the app points at Postgres, the Postgres DB is empty and the
   legacy SQLite file instance/soko.db is present, copy its rows across.
   This is how the existing listings/users move off the committed SQLite file.
3. Seeds the default categories when the categories table is empty, so a
   fresh database renders the same listing form as before.
"""
import os

from sqlalchemy import create_engine, inspect, text

from app.extensions import db

DEFAULT_CATEGORIES = [
    "Fresh Vegetables",
    "Fresh Fruits",
    "Grains & Cereals",
    "Livestock & Poultry",
    "Dairy Products",
    "Eggs",
    "Honey & Bee Products",
    "Herbs & Spices",
    "Organic Produce",
    "Seeds & Seedlings",
    "Fertilizers & Soil",
    "Farming Equipment",
    "Processed Foods",
    "Fish & Aquaculture",
    "Coffee & Tea",
    "Flowers & Plants",
]

# Parent tables first so foreign keys are satisfied.
IMPORT_ORDER = ["categories", "users", "listings", "favorites"]


def _legacy_sqlite_path(app):
    return os.path.join(app.instance_path, "soko.db")


def _import_legacy_sqlite(app):
    engine = db.engine
    if engine.dialect.name != "postgresql":
        return
    path = _legacy_sqlite_path(app)
    if not os.path.exists(path):
        return

    from app.models import Category, User

    if User.query.first() is not None or Category.query.first() is not None:
        return  # target already has data: never overwrite

    src = create_engine(f"sqlite:///{path}")
    src_tables = set(inspect(src).get_table_names())
    metadata = db.metadata
    copied = {}
    with src.connect() as s, engine.begin() as dst:
        for name in IMPORT_ORDER:
            if name not in src_tables:
                continue
            table = metadata.tables[name]
            cols = [c.name for c in table.columns]
            src_cols = {c["name"] for c in inspect(src).get_columns(name)}
            use = [c for c in cols if c in src_cols]
            rows = [
                dict(r._mapping)
                for r in s.execute(text(f"SELECT {', '.join(use)} FROM {name}"))
            ]
            if rows:
                dst.execute(table.insert(), rows)
            copied[name] = len(rows)
            # Keep SERIAL sequences ahead of the copied ids.
            dst.execute(
                text(
                    f"SELECT setval(pg_get_serial_sequence('{name}', 'id'), "
                    f"COALESCE((SELECT MAX(id) FROM {name}), 0) + 1, false)"
                )
            )
    src.dispose()
    app.logger.warning("bootstrap.legacy_sqlite_imported %s", copied)


def _seed_categories(app):
    from app.models import Category

    if Category.query.first() is None:
        db.session.add_all(Category(name=n) for n in DEFAULT_CATEGORIES)
        db.session.commit()
        app.logger.info("bootstrap.categories_seeded count=%d", len(DEFAULT_CATEGORIES))


def bootstrap_database(app):
    with app.app_context():
        from app import models as _models  # noqa: F401  (register all models)

        db.create_all()
        try:
            _import_legacy_sqlite(app)
        except Exception:
            app.logger.exception("bootstrap.legacy_sqlite_import_failed")
            raise
        _seed_categories(app)
