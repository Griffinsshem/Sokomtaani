from app.extensions import ma
from app.models.listings import Listing
from marshmallow import fields

class ListingSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Listing
        load_instance = True
        exclude = ("user", "favorites", "category")  

    # Explicitly handle fields
    price = fields.Float()
    created_at = fields.DateTime(format="iso")

# Schema instances
listing_schema = ListingSchema()
listings_schema = ListingSchema(many=True)
