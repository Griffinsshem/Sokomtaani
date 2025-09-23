from app.extensions import db

class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

    # Relationships
    listings = db.relationship(
        "Listing",
        back_populates="category",
        lazy=True,
        cascade="all, delete-orphan"
    )
