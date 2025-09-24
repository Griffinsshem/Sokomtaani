from app.extensions import ma
from app.models.listings import Listing
from marshmallow import fields

class ListingSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Listing
        load_instance = True
        exclude = ("user", "favorites", "category")  

    # Explicitly handle fields that cause 422 errors
    price = fields.Float()  # convert Decimal → float
    created_at = fields.DateTime(format="iso")  # format datetime
    updated_at = fields.DateTime(format="iso")  # if exists

# Schema instances
listing_schema = ListingSchema()
listings_schema = ListingSchema(many=True)
