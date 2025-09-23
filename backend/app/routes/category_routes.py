from flask import Blueprint

category_bp = Blueprint("category", __name__)

# Example route
@category_bp.route("/categories")
def get_categories():
    return "List of categories"
