from ..extension import db

class Category(db.Model):
    __tablename__ = "categories"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)

    listings = db.relationship("Listing", back_populates="category", cascade="all, delete-orphan")

    def to_dict(self):
        return {"id": self.id, "name": self.name}
