from flask import Blueprint

favorite_bp = Blueprint("favorite", __name__)

# Example route
@favorite_bp.route("/favorites")
def get_favorites():
    return "List of favorites"
