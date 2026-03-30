from datetime import datetime
from ..extension import db

class Listing(db.Model):
    __tablename__ = "listings"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(500))
    is_sold = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    location = db.Column(db.String(255))
    contacts = db.Column(db.String(255))

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"))

    user = db.relationship("User", back_populates="listings")
    category = db.relationship("Category", back_populates="listings")
    favorites = db.relationship("Favorite", back_populates="listing", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "price": self.price,
            "image_url": self.image_url,
            "is_sold": self.is_sold,
            "created_at": self.created_at.isoformat(),
            "location": self.location,
            "contacts": self.contacts,
            "user": self.user.to_dict() if self.user else None,
            "category": self.category.to_dict() if self.category else None
        }
