from app.extensions import ma
from app.models.user import User
from .listing_schema import ListingSchema  

class UserSchema(ma.SQLAlchemyAutoSchema):
    listings = ma.Nested(ListingSchema, many=True)  

    class Meta:
        model = User
        load_instance = True
        exclude = ("password_hash", "favorites")

user_schema = UserSchema()
users_schema = UserSchema(many=True)
