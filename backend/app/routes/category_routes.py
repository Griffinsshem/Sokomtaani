from flask import Blueprint, current_app, jsonify, request

from app import db
from app.models.categories import Category
from app.utils.auth import admin_required, current_user_id
from app.utils.validation import clean_str

categories_bp = Blueprint("categories", __name__)


@categories_bp.route("/", methods=["GET"])
def get_categories():
    categories = Category.query.order_by(Category.id).all()
    return jsonify([cat.to_dict() for cat in categories]), 200


# Managing the category list is an admin task (ADMIN_EMAILS env var),
# not something every seller can do.
@categories_bp.route("/", methods=["POST"])
@admin_required
def add_category():
    data = request.get_json(silent=True) or {}
    name = clean_str(data.get("name"), 100)

    if not name:
        return jsonify({"error": "Category name is required"}), 400

    # Prevent duplicates
    if Category.query.filter(db.func.lower(Category.name) == name.lower()).first():
        return jsonify({"error": "Category already exists"}), 400

    new_category = Category(name=name)
    db.session.add(new_category)
    db.session.commit()
    current_app.logger.info(
        "category.created category_id=%s by_user_id=%s", new_category.id, current_user_id()
    )

    return jsonify(new_category.to_dict()), 201
