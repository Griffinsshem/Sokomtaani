from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import jwt_required

from app.extensions import db
from app.models.favorite import Favorite
from app.models.listings import Listing
from app.utils.auth import current_user_id
from app.utils.validation import parse_int

favorites_bp = Blueprint("favorites", __name__)


@favorites_bp.route("/", methods=["GET"])
@jwt_required()
def get_favorites():
    user_id = current_user_id()
    favorites = (
        Favorite.query.filter_by(user_id=user_id)
        .order_by(Favorite.date_added.desc())
        .all()
    )

    results = []
    for fav in favorites:
        listing = db.session.get(Listing, fav.listing_id)
        if not listing:
            continue

        listing_data = {
            "id": listing.id,
            "title": listing.title,
            "description": listing.description,
            "price": listing.price,
            "image_url": listing.image_url,
            "is_sold": getattr(listing, "is_sold", False),
            "created_at": listing.created_at.isoformat() if listing.created_at else None,
            "user_id": listing.user_id,
            "category_id": listing.category_id,
            "category_name": listing.category.name if listing.category else None,
        }

        results.append({
            "id": fav.id,
            "date_added": fav.date_added.isoformat() if fav.date_added else None,
            "listing": listing_data,
        })

    return jsonify(results), 200


@favorites_bp.route("/", methods=["POST"])
@jwt_required()
def add_favorite():
    user_id = current_user_id()
    data = request.get_json(silent=True) or {}
    listing_id = parse_int(data.get("listing_id"))

    if not listing_id:
        return jsonify({"error": "Listing ID is required"}), 400

    if db.session.get(Listing, listing_id) is None:
        return jsonify({"error": "Listing not found"}), 404

    existing = Favorite.query.filter_by(user_id=user_id, listing_id=listing_id).first()
    if existing:
        return jsonify({"error": "Already favorited"}), 400

    new_fav = Favorite(user_id=user_id, listing_id=listing_id)
    try:
        db.session.add(new_fav)
        db.session.commit()
        return jsonify({
            "message": "Favorite added",
            "id": new_fav.id,
            "listing_id": listing_id,
        }), 201
    except Exception:
        db.session.rollback()
        current_app.logger.exception("favorites.add_failed user_id=%s", user_id)
        return jsonify({"error": "Could not add favorite"}), 500


@favorites_bp.route("/<int:listing_id>", methods=["DELETE"])
@jwt_required()
def delete_favorite(listing_id):
    user_id = current_user_id()
    favorite = Favorite.query.filter_by(user_id=user_id, listing_id=listing_id).first()

    if not favorite:
        return jsonify({"error": "Favorite not found"}), 404

    try:
        db.session.delete(favorite)
        db.session.commit()
        return jsonify({"message": "Favorite removed"}), 200
    except Exception:
        db.session.rollback()
        current_app.logger.exception("favorites.remove_failed user_id=%s", user_id)
        return jsonify({"error": "Could not remove favorite"}), 500
