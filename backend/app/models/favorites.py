from datetime import datetime
from ..extension import db

class Favorite(db.Model):
    __tablename__ = "favorites"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    listing_id = db.Column(db.Integer, db.ForeignKey("listings.id"), nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="favorites")
    listing = db.relationship("Listing", back_populates="favorites")

    def to_dict(self):
        return {"id": self.id, "user_id": self.user_id, "listing_id": self.listing_id, "date_added": self.date_added.isoformat(), "listing": self.listing.to_dict() if self.listing else None}
