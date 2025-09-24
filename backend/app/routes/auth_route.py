from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user import User
from flask_jwt_extended import create_access_token
from datetime import timedelta
from app.schemas.user_schemas import user_schema



auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# Signup

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    
    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    location = data.get("location")
    password = data.get("password")

    # Validate required fields
    if not all([name, email, phone, location, password]):
        return jsonify({"message": "All fields are required"}), 400

    # Check if user exists
    if User.query.filter((User.email == email) | (User.phone == phone)).first():
        return jsonify({"message": "Email or phone already registered"}), 400

    # Create new user
    new_user = User(
        name=name,
        email=email,
        phone=phone,
        location=location
    )
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully",
        "user": user_schema.dump(new_user) 
    }), 201


# Login

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

  
    if not all([email, password]):
        return jsonify({"message": "Email and password are required"}), 400


    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid email or password"}), 401

   
    access_token = create_access_token(
        identity=user.id,
        expires_delta=timedelta(hours=24)
    )

    return jsonify({
    "message": "Login successful",
    "token": access_token,
    "user": user_schema.dump(user)
}), 200

