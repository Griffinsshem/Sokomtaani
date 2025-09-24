from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.listings import Listing
from app.models.user import User
from app.schemas.listing_schema import listing_schema, listings_schema
from flask_jwt_extended import jwt_required, get_jwt_identity

listings_bp = Blueprint("listings", __name__)

# get all listings (homepage)
@listings_bp.route("", methods=["GET"])
def get_all_listings():
    listings = Listing.query.order_by(Listing.created_at.desc()).all()
    return jsonify(listings_schema.dump(listings)), 200

# get listings for the current user
@listings_bp.route("/my", methods=["GET"])
@jwt_required()
def get_my_listings():
    user_id = get_jwt_identity()
    listings = Listing.query.filter_by(user_id=user_id).order_by(Listing.created_at.desc()).all()
    return jsonify(listings_schema.dump(listings)), 200

# create a new listing
@listings_bp.route("", methods=["POST"])
@jwt_required()
def create_listing():
    data = request.get_json()
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404

    required_fields = ["title", "price", "category_id"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400

    new_listing = Listing(
        title=data["title"],
        description=data.get("description", ""),
        price=data["price"],
        image_url=data.get("image_url", ""),
        location=user.location,
        contact_email=user.email,
        contact_phone=user.phone,
        user_id=user_id,
        category_id=data["category_id"]
    )

    db.session.add(new_listing)
    db.session.commit()

    return jsonify(listing_schema.dump(new_listing)), 201
