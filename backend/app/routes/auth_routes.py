from flask import Blueprint, request, jsonify
from ..extension import db
from ..models.user import User
from flask_jwt_extended import create_access_token

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    if not data:
        return jsonify({"msg": "Missing JSON"}), 400
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    phone_number = data.get("phone_number")
    location = data.get("location")

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already registered"}), 400

    user = User(name=name, email=email, phone_number=phone_number, location=location)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    access_token = create_access_token(identity=user.id)
    return jsonify({"token": access_token, "user": user.to_dict()}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"msg": "Bad credentials"}), 401
    token = create_access_token(identity=user.id)
    return jsonify({"token": token, "user": user.to_dict()}), 200
