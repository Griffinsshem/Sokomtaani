"""Database bootstrap run at app start-up.

1. Creates any missing tables (safe: never alters or drops existing ones).
2. Seeds the default categories when the categories table is empty, so a
   fresh database renders the same listing form as before.

Production data lives in Render Postgres (DATABASE_URL). Local development
falls back to an untracked SQLite file in instance/.
"""
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

def _seed_categories(app):
    from app.models import Category

    if Category.query.first() is None:
        db.session.add_all(Category(name=n) for n in DEFAULT_CATEGORIES)
        db.session.commit()
        app.logger.info("bootstrap.categories_seeded count=%d", len(DEFAULT_CATEGORIES))


def _ensure_columns(app):
    """Add columns introduced after a table was first created.

    db.create_all() never alters existing tables, so new nullable/defaulted
    columns are added here idempotently.
    """
    from sqlalchemy import inspect, text

    insp = inspect(db.engine)
    cols = {c["name"] for c in insp.get_columns("listings")}
    if "is_sold" not in cols:
        false = "false" if db.engine.dialect.name == "postgresql" else "0"
        with db.engine.begin() as conn:
            conn.execute(text(
                f"ALTER TABLE listings ADD COLUMN is_sold BOOLEAN NOT NULL DEFAULT {false}"
            ))
        app.logger.warning("bootstrap.column_added table=listings column=is_sold")


def bootstrap_database(app):
    with app.app_context():
        from app import models as _models  # noqa: F401  (register all models)

        db.create_all()
        _ensure_columns(app)
        _seed_categories(app)
