# app/schemas/user_schema.py
from app.models.user import User
from app import ma

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ("password_hash", "listings", "favorites")  # exclude relationships

# Initialize schema instances
user_schema = UserSchema()
users_schema = UserSchema(many=True)
