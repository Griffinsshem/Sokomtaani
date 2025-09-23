from flask import Blueprint

auth_bp = Blueprint("auth", __name__)

# Example route
@auth_bp.route("/login")
def login():
    return "Login page"
