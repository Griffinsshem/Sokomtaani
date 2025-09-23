from app import db  # import the SQLAlchemy instance

# Import models so Alembic can detect them
from .user import User
from .categories import Category
from .listings import Listing
from .favorite import Favorite

__all__ = ["User", "Category", "Listing", "Favorite"]
