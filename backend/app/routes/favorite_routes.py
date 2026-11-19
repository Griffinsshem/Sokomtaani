from flask import Blueprint, jsonify, request
from app.extensions import db
from app.models.favorite import Favorite
from app.models.listings import Listing
from flask_jwt_extended import jwt_required, get_jwt_identity

favorites_bp = Blueprint("favorites", __name__, url_prefix="/api/favorites")

@favorites_bp.route("/", methods=["GET"])
@jwt_required()
def get_favorites():
    user_id = get_jwt_identity()
    favorites = (
        Favorite.query.filter_by(user_id=user_id)
        .order_by(Favorite.date_added.desc())
        .all()
    )

    results = []
    for fav in favorites:
        listing = Listing.query.get(fav.listing_id)
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
    user_id = get_jwt_identity()
    data = request.get_json()
    listing_id = data.get("listing_id")

    if not listing_id:
        return jsonify({"error": "Listing ID is required"}), 400

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
            "listing_id": listing_id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Could not add favorite", "details": str(e)}), 500


@favorites_bp.route("/<int:listing_id>", methods=["DELETE"])
@jwt_required()
def delete_favorite(listing_id):
    user_id = get_jwt_identity()
    favorite = Favorite.query.filter_by(user_id=user_id, listing_id=listing_id).first()

    if not favorite:
        return jsonify({"error": "Favorite not found"}), 404

    try:
        db.session.delete(favorite)
        db.session.commit()
        return jsonify({"message": "Favorite removed"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Could not remove favorite", "details": str(e)}), 500