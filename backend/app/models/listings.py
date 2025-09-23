from app.extensions import db
from datetime import datetime

class Listing(db.Model):
    _tablename_ = "listings"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(250), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Contact/location snapshot from User at creation
    contact_email = db.Column(db.String(120), nullable=False)
    contact_phone = db.Column(db.String(15), nullable=False)
    location = db.Column(db.String(100), nullable=False)

    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=False)

    # Relationships
    user = db.relationship("User", back_populates="listings")
    category = db.relationship("Category", back_populates="listings")
    favorites = db.relationship(
        "Favorite",
        back_populates="listing",
        lazy=True,
        cascade="all, delete-orphan"
    )