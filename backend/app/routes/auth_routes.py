from datetime import datetime, timedelta, timezone

from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt, jwt_required
from werkzeug.security import check_password_hash, generate_password_hash

from app.extensions import db, limiter
from app.models.token_blocklist import TokenBlocklist
from app.models.user import User
from app.schemas.user_schemas import user_schema
from app.utils.auth import current_user_id
from app.utils.validation import (
    clean_str,
    is_strong_password,
    is_valid_email,
    is_valid_phone,
)

auth_bp = Blueprint("auth", __name__)

# Used to spend the same hashing time whether or not the email exists,
# so login response time doesn't reveal which emails are registered.
_DUMMY_HASH = generate_password_hash("timing-equaliser-not-a-real-password")


def _client_ip():
    return request.remote_addr or "-"


@auth_bp.route("/signup", methods=["POST"])
@limiter.limit("5 per minute; 30 per hour")
def signup():
    data = request.get_json(silent=True) or {}

    name = clean_str(data.get("name"), 100)
    email = (clean_str(data.get("email"), 120) or "").lower()
    phone = clean_str(data.get("phone"), 15)
    location = clean_str(data.get("location"), 100)
    password = data.get("password")

    if not all([name, email, phone, location, password]):
        return jsonify({"message": "All fields are required"}), 400
    if not is_valid_email(email):
        return jsonify({"message": "Invalid email address"}), 400
    if not is_valid_phone(phone):
        return jsonify({"message": "Invalid phone number"}), 400
    if not is_strong_password(password):
        return jsonify({
            "message": "Password must be 8+ chars, include uppercase, lowercase, number & special char"
        }), 400

    if User.query.filter((db.func.lower(User.email) == email) | (User.phone == phone)).first():
        current_app.logger.info("auth.signup_duplicate ip=%s", _client_ip())
        return jsonify({"message": "Email or phone already registered"}), 400

    new_user = User(name=name, email=email, phone=phone, location=location)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    current_app.logger.info("auth.signup user_id=%s ip=%s", new_user.id, _client_ip())
    return jsonify({
        "message": "User registered successfully",
        "user": user_schema.dump(new_user),
    }), 201


@auth_bp.route("/login", methods=["POST"])
@limiter.limit("10 per minute; 50 per hour")
def login():
    data = request.get_json(silent=True) or {}
    email = (clean_str(data.get("email"), 120) or "").lower()
    password = data.get("password")

    if not email or not isinstance(password, str) or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user = User.query.filter(db.func.lower(User.email) == email).first()
    if user is None:
        check_password_hash(_DUMMY_HASH, password)  # constant-time path
        current_app.logger.warning("auth.login_failed reason=unknown_email ip=%s", _client_ip())
        return jsonify({"message": "Invalid email or password"}), 401
    if not user.check_password(password):
        current_app.logger.warning(
            "auth.login_failed reason=bad_password user_id=%s ip=%s", user.id, _client_ip()
        )
        return jsonify({"message": "Invalid email or password"}), 401

    access_token = create_access_token(
        identity=str(user.id),  # JWT "sub" must be a string
        expires_delta=timedelta(hours=24),
    )
    current_app.logger.info("auth.login user_id=%s ip=%s", user.id, _client_ip())

    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "user": user_schema.dump(user),
    }), 200


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    """Revoke the current token so it can't be reused after logout."""
    claims = get_jwt()
    expires_at = datetime.fromtimestamp(claims["exp"], tz=timezone.utc).replace(tzinfo=None)
    db.session.add(TokenBlocklist(jti=claims["jti"], expires_at=expires_at))
    # Opportunistic cleanup of entries that have expired anyway.
    TokenBlocklist.query.filter(TokenBlocklist.expires_at < datetime.utcnow()).delete()
    db.session.commit()
    current_app.logger.info("auth.logout user_id=%s", current_user_id())
    return jsonify({"message": "Logged out"}), 200
