from flask import Blueprint, jsonify

categories_bp = Blueprint("categories", __name__)

@categories_bp.route("/", methods=["GET"])
def get_categories():
    return jsonify(["Vegetables", "Fruits", "Livestock", "Seeds & Seedlings", "Farm Tools", "Cereals", "Agricultural Equipment"]), 200
