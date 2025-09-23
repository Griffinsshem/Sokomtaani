from flask import Blueprint, jsonify, request
from app.extension import db
from app.models.favorites import Favorite
from app.models.listing import Listing
from app.utils.auth import login_required, current_user

bp = Blueprint("favorites", __name__, url_prefix="/api/favorites")

@bp.route("/", methods=["GET"])
@login_required
def get_favorites():
    user = current_user()
    favorites = Favorite.query.filter_by(user_id=user.id).order_by(Favorite.date_added.desc()).all()
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

@bp.route("/<int:listing_id>", methods=["DELETE"])
@login_required
def delete_favorite(listing_id):
    user = current_user()
    favorite = Favorite.query.filter_by(user_id=user.id, listing_id=listing_id).first()
    if not favorite:
        return jsonify({"error": "Favorite not found"}), 404
    try:
        db.session.delete(favorite)
        db.session.commit()
        return jsonify({"message": "Favorite removed"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Could not remove favorite", "details": str(e)}), 500
