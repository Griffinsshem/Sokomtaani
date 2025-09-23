from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(15), unique=True, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # --- Relationships ---
    listings = db.relationship(
        "Listing",
        back_populates="user",
        lazy=True,
        cascade="all, delete-orphan"
    )
    favorites = db.relationship(
        "Favorite",
        back_populates="user",
        lazy=True,
        cascade="all, delete-orphan"
    )

    # --- Password Handling ---
    def set_password(self, password: str):
        """Hashes and sets the user's password."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        """Checks if the given password matches the stored hash."""
        return check_password_hash(self.password_hash, password)

    # --- Serialization for API responses ---
    def to_dict(self):
        """Return a dictionary representation of the user (without password)."""
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "location": self.location,
            "created_at": self.created_at.isoformat()  # JSON-friendly
        }

    # --- Debugging representation ---
    def __repr__(self):
        return f"<User {self.id} | {self.name} | {self.email}>"
