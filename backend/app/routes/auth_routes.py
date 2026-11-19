from datetime import datetime, timedelta, timezone

from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    jwt_required,
    set_access_cookies,
    unset_jwt_cookies,
    verify_jwt_in_request,
)
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from werkzeug.security import check_password_hash, generate_password_hash

from app.extensions import client_ip, db, limiter
from app.models.token_blocklist import TokenBlocklist
from app.models.user import User
from app.schemas.user_schemas import user_schema
from app.utils.auth import current_user_id
from app.utils.mail import send_email
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

PASSWORD_RULE_MSG = "Password must be 8+ chars, include uppercase, lowercase, number & special char"


def _session_response(user, status, message=None):
    """Return the user and start a session (HttpOnly cookie + token in body)."""
    token = create_access_token(identity=str(user.id), expires_delta=timedelta(hours=24))
    resp = jsonify({
        "message": message or ("Login successful" if status == 200 else "User registered successfully"),
        "token": token,  # for non-browser API clients; the web app uses the cookie
        "user": user_schema.dump(user),
    })
    set_access_cookies(resp, token)
    return resp, status


def _revoke(claims):
    expires_at = datetime.fromtimestamp(claims["exp"], tz=timezone.utc).replace(tzinfo=None)
    if not TokenBlocklist.query.filter_by(jti=claims["jti"]).first():
        db.session.add(TokenBlocklist(jti=claims["jti"], expires_at=expires_at))
    TokenBlocklist.query.filter(TokenBlocklist.expires_at < datetime.utcnow()).delete()
    db.session.commit()


def _reset_serializer():
    return URLSafeTimedSerializer(current_app.config["SECRET_KEY"], salt="password-reset")


def _password_fingerprint(user):
    # Changes whenever the password changes, so a reset link works only once.
    return user.password_hash[-16:]


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
        return jsonify({"message": PASSWORD_RULE_MSG}), 400

    if User.query.filter((db.func.lower(User.email) == email) | (User.phone == phone)).first():
        current_app.logger.info("auth.signup_duplicate ip=%s", client_ip())
        return jsonify({"message": "Email or phone already registered"}), 400

    new_user = User(name=name, email=email, phone=phone, location=location)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    current_app.logger.info("auth.signup user_id=%s ip=%s", new_user.id, client_ip())
    # Sign the new user in straight away (previously the frontend expected a
    # token here but none was returned, leaving users half-logged-in).
    return _session_response(new_user, 201)


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
        current_app.logger.warning("auth.login_failed reason=unknown_email ip=%s", client_ip())
        return jsonify({"message": "Invalid email or password"}), 401
    if not user.check_password(password):
        current_app.logger.warning(
            "auth.login_failed reason=bad_password user_id=%s ip=%s", user.id, client_ip()
        )
        return jsonify({"message": "Invalid email or password"}), 401

    current_app.logger.info("auth.login user_id=%s ip=%s", user.id, client_ip())
    return _session_response(user, 200)


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user = db.session.get(User, current_user_id())
    if not user:
        return jsonify({"msg": "Authentication required", "error": "unknown_user"}), 401
    return jsonify({"user": user_schema.dump(user)}), 200


@auth_bp.route("/logout", methods=["POST"])
def logout():
    """Revoke the current token (if any) and clear the session cookies.

    Always succeeds, so a user with an expired/invalid session can still
    "log out" cleanly.
    """
    try:
        verify_jwt_in_request()
        _revoke(get_jwt())
        current_app.logger.info("auth.logout user_id=%s", current_user_id())
    except Exception:
        db.session.rollback()
    resp = jsonify({"message": "Logged out"})
    unset_jwt_cookies(resp)
    return resp, 200


@auth_bp.route("/change-password", methods=["POST"])
@jwt_required()
@limiter.limit("5 per minute; 20 per hour")
def change_password():
    data = request.get_json(silent=True) or {}
    current = data.get("current_password")
    new = data.get("new_password")

    user = db.session.get(User, current_user_id())
    if not user:
        return jsonify({"message": "Authentication required"}), 401
    if not isinstance(current, str) or not user.check_password(current):
        current_app.logger.warning("auth.change_password_failed user_id=%s", user.id)
        return jsonify({"message": "Current password is incorrect"}), 400
    if not is_strong_password(new):
        return jsonify({"message": PASSWORD_RULE_MSG}), 400
    if current == new:
        return jsonify({"message": "New password must be different"}), 400

    user.set_password(new)
    db.session.commit()
    current_app.logger.info("auth.password_changed user_id=%s", user.id)
    # Rotate the session: revoke the old token, issue a new one.
    _revoke(get_jwt())
    return _session_response(user, 200, message="Password updated")


@auth_bp.route("/forgot-password", methods=["POST"])
@limiter.limit("3 per minute; 10 per hour")
def forgot_password():
    data = request.get_json(silent=True) or {}
    email = (clean_str(data.get("email"), 120) or "").lower()
    generic = {"message": "If an account exists for that email, a reset link has been sent."}

    if not is_valid_email(email):
        return jsonify({"message": "Invalid email address"}), 400

    user = User.query.filter(db.func.lower(User.email) == email).first()
    if user:
        token = _reset_serializer().dumps({"uid": user.id, "fp": _password_fingerprint(user)})
        link = f"{current_app.config['FRONTEND_URL']}/reset-password?token={token}"
        send_email(
            user.email,
            "Reset your SokoMtaani password",
            f"Hello {user.name},\n\n"
            f"Use this link to set a new password (valid for 1 hour):\n{link}\n\n"
            "If you didn't ask for this, you can ignore this email.\n\n— SokoMtaani",
        )
        current_app.logger.info("auth.reset_requested user_id=%s ip=%s", user.id, client_ip())
    else:
        current_app.logger.info("auth.reset_requested_unknown ip=%s", client_ip())

    # Same response either way, so this can't be used to discover accounts.
    return jsonify(generic), 200


@auth_bp.route("/reset-password", methods=["POST"])
@limiter.limit("5 per minute; 20 per hour")
def reset_password():
    data = request.get_json(silent=True) or {}
    token = data.get("token")
    new = data.get("password")
    invalid = jsonify({"message": "This reset link is invalid or has expired."}), 400

    if not isinstance(token, str) or not token:
        return invalid
    try:
        payload = _reset_serializer().loads(
            token, max_age=current_app.config["PASSWORD_RESET_MAX_AGE"]
        )
    except (SignatureExpired, BadSignature):
        return invalid

    user = db.session.get(User, payload.get("uid"))
    if not user or payload.get("fp") != _password_fingerprint(user):
        return invalid
    if not is_strong_password(new):
        return jsonify({"message": PASSWORD_RULE_MSG}), 400

    user.set_password(new)
    db.session.commit()
    current_app.logger.info("auth.password_reset user_id=%s ip=%s", user.id, client_ip())
    return jsonify({"message": "Password updated. You can now log in."}), 200

