"""Guard for maintenance scripts (seeding, DB inspection)."""
import os
import sys


def refuse_in_production(script_name):
    """Exit unless running outside production or explicitly allowed.

    Seed scripts create demo data (including a demo user), which must never
    reach the production database by accident.
    """
    is_prod = os.environ.get("RENDER") or os.environ.get("APP_ENV", "").lower() == "production"
    if is_prod and os.environ.get("ALLOW_SEED") != "1":
        sys.exit(
            f"{script_name}: refusing to run in production. "
            "Set ALLOW_SEED=1 if you really mean it."
        )
