from flask import Blueprint, request, jsonify
from ..extension import db
from ..models.favorites import Favorite
from ..models.listing import Listing
from flask_jwt_extended import jwt_required, get_jwt_identity

favorite_bp = Blueprint("favorites", __name__)

@favorite_bp.route("/", methods=["GET"])
@jwt_required()
def get_favorites():
    user_id = get_jwt_identity()
    favs = Favorite.query.filter_by(user_id=user_id).all()
    return jsonify([f.to_dict() for f in favs])

@favorite_bp.route("/", methods=["POST"])
@jwt_required()
def add_favorite():
    user_id = get_jwt_identity()
    data = request.get_json()
    listing_id = data.get("listing_id")
    if not listing_id:
        return jsonify({"msg":"listing_id required"}), 400
    # Prevent duplicates
    existing = Favorite.query.filter_by(user_id=user_id, listing_id=listing_id).first()
    if existing:
        return jsonify(existing.to_dict()), 200
    fav = Favorite(user_id=user_id, listing_id=listing_id)
    db.session.add(fav)
    db.session.commit()
    return jsonify(fav.to_dict()), 201

@favorite_bp.route("/<int:listing_id>", methods=["DELETE"])
@jwt_required()
def remove_favorite(listing_id):
    user_id = get_jwt_identity()
    fav = Favorite.query.filter_by(user_id=user_id, listing_id=listing_id).first()
    if not fav:
        return jsonify({"msg":"Not found"}), 404
    db.session.delete(fav)
    db.session.commit()
    return jsonify({"msg":"Removed"}), 200
