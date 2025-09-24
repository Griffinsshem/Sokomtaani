from flask import Blueprint, jsonify

categories_bp = Blueprint("categories", __name__, url_prefix="/api/categories")

@categories_bp.route("", methods=["GET"])
def get_categories():
    names = ["Vegetables", "Fruits", "Livestock", "Seeds & Seedlings", "Farm Tools", "Cereals", "Agricultural Equipment"]
    data = [{"id": i + 1, "name": n} for i, n in enumerate(names)]
    return jsonify(data), 200
