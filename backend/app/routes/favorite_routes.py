from flask import Blueprint, jsonify
from app.extensions import db
from app.models.favorite import Favorite
from app.models.listings import Listing
from flask_jwt_extended import jwt_required, get_jwt_identity

favorites_bp = Blueprint("favorites", __name__)

@favorites_bp.route("/", methods=["GET"])
@jwt_required()
def get_favorites():
    user_id = get_jwt_identity()
    favorites = Favorite.query.filter_by(user_id=user_id).order_by(Favorite.date_added.desc()).all()

    results = []
    for fav in favorites:
        listing = Listing.query.get(fav.listing_id)
        listing_data = None
        if listing:
            listing_data = {
                "id": listing.id,
                "title": listing.title,
                "description": listing.description,
                "price": listing.price,
                "image_url": listing.image_url,
                "is_sold": listing.is_sold,
                "created_at": listing.created_at.isoformat() if listing.created_at else None,
                "user_id": listing.user_id,
                "category_id": listing.category_id,
            }
        results.append({
            "id": fav.id,
            "date_added": fav.date_added.isoformat() if fav.date_added else None,
            "listing": listing_data
        })

    return jsonify({"data": results}), 200



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
