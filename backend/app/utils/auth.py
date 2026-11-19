"""Authentication / authorization helpers."""
from functools import wraps

from flask import current_app, jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request


def current_user_id():
    """Return the logged-in user's id as an int.

    Tokens store the id as a string ("sub" must be a string per RFC 7519).
    """
    identity = get_jwt_identity()
    try:
        return int(identity)
    except (TypeError, ValueError):
        return None


def admin_required(fn):
    """Allow only users whose email is listed in ADMIN_EMAILS."""

    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        from app.models.user import User

        user = User.query.get(current_user_id())
        admins = current_app.config.get("ADMIN_EMAILS", set())
        if not user or user.email.lower() not in admins:
            current_app.logger.warning(
                "security.admin_denied user_id=%s", getattr(user, "id", None)
            )
            return jsonify({"error": "Admin access required"}), 403
        return fn(*args, **kwargs)

    return wrapper
