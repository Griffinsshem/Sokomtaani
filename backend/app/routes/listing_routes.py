from flask import Blueprint, request, jsonify
from app.models import db, Listing
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity

listings_bp = Blueprint("listings", __name__)

@listings_bp.route("/api/listings", methods=["POST"])
@jwt_required()
def create_listing():
    data = request.get_json()

    title = data.get("title")
    description = data.get("description")
    price = data.get("price")
    image_url = data.get("image_url")
    category_id = data.get("category_id")

    # validation (basic)
    if not title or not price or not category_id:
        return jsonify({"error": "Title, price, and category are required"}), 400

    user_id = get_jwt_identity()  # who is posting

    new_listing = Listing(
        title=title,
        description=description,
        price=price,
        image_url=image_url,
        is_sold=False,
        created_at=datetime.utcnow(),
        user_id=user_id,
        category_id=category_id
    )

    db.session.add(new_listing)
    db.session.commit()

    return jsonify(new_listing.to_dict()), 201
