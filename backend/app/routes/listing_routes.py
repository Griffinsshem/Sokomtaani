from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import jwt_required

from app.extensions import db, limiter
from app.models.categories import Category
from app.models.listings import Listing
from app.models.user import User
from app.schemas.listing_schema import listing_schema, listings_schema
from app.utils.auth import current_user_id
from app.utils.validation import clean_str, is_safe_image_url, parse_int, parse_price

listings_bp = Blueprint("listings", __name__)


# delete a listing (owner only)
@listings_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_current_listing(id):
    user_id = current_user_id()
    listing = db.session.get(Listing, id)

    if not listing:
        return jsonify({"error": "Listing not found"}), 404

    if listing.user_id != user_id:
        current_app.logger.warning(
            "security.delete_denied listing_id=%s owner_id=%s user_id=%s ip=%s",
            id, listing.user_id, user_id, request.remote_addr,
        )
        return jsonify({"error": "You can only delete your own listings"}), 403

    db.session.delete(listing)
    db.session.commit()
    current_app.logger.info("listing.deleted listing_id=%s user_id=%s", id, user_id)

    return jsonify({"message": f"Listing {id} deleted successfully"}), 200


# get all listings (homepage)
@listings_bp.route("/", methods=["GET"])
def get_all_listings():
    listings = Listing.query.order_by(Listing.created_at.desc()).all()
    return jsonify(listings_schema.dump(listings)), 200


# get listings for the current user
@listings_bp.route("/my", methods=["GET"])
@jwt_required()
def get_my_listings():
    user_id = current_user_id()
    listings = (
        Listing.query.filter_by(user_id=user_id)
        .order_by(Listing.created_at.desc())
        .all()
    )
    return jsonify(listings_schema.dump(listings)), 200


# create a new listing
@listings_bp.route("/", methods=["POST"])
@jwt_required()
@limiter.limit("30 per hour")
def create_listing():
    data = request.get_json(silent=True) or {}
    user_id = current_user_id()
    user = db.session.get(User, user_id) if user_id else None

    if not user:
        return jsonify({"error": "User not found"}), 404

    required_fields = ["title", "price", "category_id"]
    for field in required_fields:
        if field not in data or data[field] in (None, ""):
            return jsonify({"error": f"{field} is required"}), 400

    title = clean_str(data.get("title"), None)
    if not title or len(title) > 150:
        return jsonify({"error": "title must be 1-150 characters"}), 400

    description = clean_str(data.get("description", ""), None) or ""
    if len(description) > 5000:
        return jsonify({"error": "description must be at most 5000 characters"}), 400

    price = parse_price(data.get("price"))
    if price is None:
        return jsonify({"error": "price must be a non-negative number"}), 400

    category_id = parse_int(data.get("category_id"))
    if category_id is None or db.session.get(Category, category_id) is None:
        return jsonify({"error": "category_id is invalid"}), 400

    image_url = clean_str(data.get("image_url", ""), None) or ""
    if not is_safe_image_url(image_url):
        return jsonify({"error": "image_url must be an http(s) URL"}), 400

    new_listing = Listing(
        title=title,
        description=description,
        price=price,
        image_url=image_url,
        location=user.location,
        contact_email=user.email,
        contact_phone=user.phone,
        user_id=user.id,
        category_id=category_id,
    )

    db.session.add(new_listing)
    db.session.commit()
    current_app.logger.info("listing.created listing_id=%s user_id=%s", new_listing.id, user.id)

    return jsonify(listing_schema.dump(new_listing)), 201
