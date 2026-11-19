from flask import Blueprint, jsonify, request
from app import db
from app.models.categories import Category
from flask_jwt_extended import jwt_required

categories_bp = Blueprint("categories", __name__, url_prefix="/api/categories")

# Handle OPTIONS requests for CORS
@categories_bp.route("/", methods=["OPTIONS"])
def handle_options():
    return "", 200

@categories_bp.route("/", methods=["GET"])
def get_categories():
    categories = Category.query.all()
    return jsonify([cat.to_dict() for cat in categories]), 200

@categories_bp.route("/", methods=["POST"])
@jwt_required()
def add_category():
    data = request.get_json()
    name = data.get("name")

    if not name:
        return jsonify({"error": "Category name is required"}), 400

    # Prevent duplicates
    if Category.query.filter_by(name=name).first():
        return jsonify({"error": "Category already exists"}), 400

    new_category = Category(name=name)
    db.session.add(new_category)
    db.session.commit()

    return jsonify(new_category.to_dict()), 201
