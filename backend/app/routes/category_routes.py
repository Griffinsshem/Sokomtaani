from flask import Blueprint, request, jsonify
from ..extension import db
from ..models.categories import Category

category_bp = Blueprint("category", __name__)

@category_bp.route("/", methods=["GET"])
def get_categories():
    cats = Category.query.all()
    return jsonify([c.to_dict() for c in cats])

@category_bp.route("/", methods=["POST"])
def add_category():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "Name required"}), 400
    if Category.query.filter_by(name=name).first():
        return jsonify({"msg":"Category exists"}), 400
    c = Category(name=name)
    db.session.add(c)
    db.session.commit()
    return jsonify(c.to_dict()), 201
