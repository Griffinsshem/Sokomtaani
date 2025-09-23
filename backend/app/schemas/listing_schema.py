from app.extensions import ma
from app.models.listings import Listing

class ListingSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Listing
        load_instance = True
        exclude = ("user", "favorites", "category")  

# Schema instances
listing_schema = ListingSchema()
listings_schema = ListingSchema(many=True)
