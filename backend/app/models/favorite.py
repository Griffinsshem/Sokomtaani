from app.extensions import db
from datetime import datetime

class Favorite(db.Model):
    __tablename__ = "favorites"

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    listing_id = db.Column(db.Integer, db.ForeignKey("listings.id"), nullable=False)

    # Relationships
    user = db.relationship("User", back_populates="favorites")
    listing = db.relationship("Listing", back_populates="favorites")
