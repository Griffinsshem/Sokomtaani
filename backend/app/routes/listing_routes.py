from flask import Blueprint, request, jsonify
from ..extension import db
from ..models.listing import Listing
from ..models.user import User
from ..models.categories import Category
from flask_jwt_extended import jwt_required, get_jwt_identity

listing_bp = Blueprint("listings", __name__)

@listing_bp.route("/", methods=["GET"])
def all_listings():
    listings = Listing.query.order_by(Listing.created_at.desc()).all()
    return jsonify([l.to_dict() for l in listings])

@listing_bp.route("/<int:listing_id>", methods=["GET"])
def single_listing(listing_id):
    l = Listing.query.get_or_404(listing_id)
    return jsonify(l.to_dict())

@listing_bp.route("/", methods=["POST"])
@jwt_required()
def create_listing():
    user_id = get_jwt_identity()
    data = request.get_json()
    title = data.get("title")
    description = data.get("description")
    price = data.get("price")
    image_url = data.get("image_url")
    category_id = data.get("category_id")
    location = data.get("location")
    contacts = data.get("contacts")

    user = User.query.get_or_404(user_id)
    category = Category.query.get(category_id) if category_id else None

    listing = Listing(
        title=title, description=description, price=price, image_url=image_url,
        user=user, category=category, location=location, contacts=contacts
    )
    db.session.add(listing)
    db.session.commit()
    return jsonify(listing.to_dict()), 201

@listing_bp.route("/mine", methods=["GET"])
@jwt_required()
def my_listings():
    user_id = get_jwt_identity()
    listings = Listing.query.filter_by(user_id=user_id).order_by(Listing.created_at.desc()).all()
    return jsonify([l.to_dict() for l in listings])

@listing_bp.route("/<int:listing_id>", methods=["PATCH"])
@jwt_required()
def update_listing(listing_id):
    user_id = get_jwt_identity()
    listing = Listing.query.get_or_404(listing_id)
    if listing.user_id != user_id:
        return jsonify({"msg":"Forbidden"}), 403
    data = request.get_json()
    if "is_sold" in data:
        listing.is_sold = bool(data.get("is_sold"))
    for field in ("title","description","price","image_url","category_id","location","contacts"):
        if field in data:
            setattr(listing, field, data.get(field))
    db.session.commit()
    return jsonify(listing.to_dict())

@listing_bp.route("/<int:listing_id>", methods=["DELETE"])
@jwt_required()
def delete_listing(listing_id):
    user_id = get_jwt_identity()
    listing = Listing.query.get_or_404(listing_id)
    if listing.user_id != user_id:
        return jsonify({"msg":"Forbidden"}), 403
    db.session.delete(listing)
    db.session.commit()
    return jsonify({"msg":"Deleted"}), 200
