from flask import Blueprint, jsonify, request
from app import db
from app.models.categories import Category

category_routes = Blueprint("categories", __name__, url_prefix="/api/categories")

@category_routes.route("/", methods=["GET"])
def get_categories():
    categories = Category.query.all()
    return jsonify([c.to_dict() for c in categories]), 200

@category_routes.route("/", methods=["POST"])
def add_category():
    data = request.json
    name = data.get("name")
    if not name:
        return jsonify({"error": "Name is required"}), 400
    
    existing = Category.query.filter_by(name=name).first()
    if existing:
        return jsonify({"error": "Category already exists"}), 400

    try:
        new_category = Category(name=name)
        db.session.add(new_category)
        db.session.commit()
        return jsonify(new_category.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500
