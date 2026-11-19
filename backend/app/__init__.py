import logging
import os

from flask import Flask, jsonify
from flask_cors import CORS
from werkzeug.exceptions import HTTPException
from werkzeug.middleware.proxy_fix import ProxyFix

from .config import get_config, validate_production_config
from .extensions import db, jwt, limiter, ma, migrate


def _configure_logging(app):
    if not app.debug:
        handler = logging.StreamHandler()
        handler.setFormatter(
            logging.Formatter("%(asctime)s %(levelname)s %(name)s %(message)s")
        )
        app.logger.handlers = [handler]
        app.logger.setLevel(logging.INFO)


def _register_jwt_handlers(app):
    from .models.token_blocklist import TokenBlocklist

    @jwt.token_in_blocklist_loader
    def is_revoked(_header, payload):
        jti = payload.get("jti")
        return db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar() is not None

    # Any bad/expired/revoked token -> 401, so the frontend's existing
    # "401 => go to /login" handling kicks in (previously some were 422).
    def _unauthorized(reason):
        return jsonify({"msg": "Authentication required", "error": reason}), 401

    jwt.unauthorized_loader(lambda _e: _unauthorized("missing_token"))
    jwt.invalid_token_loader(lambda _e: _unauthorized("invalid_token"))
    jwt.expired_token_loader(lambda _h, _p: _unauthorized("token_expired"))
    jwt.revoked_token_loader(lambda _h, _p: _unauthorized("token_revoked"))
    jwt.needs_fresh_token_loader(lambda _h, _p: _unauthorized("fresh_token_required"))


def _register_error_handlers(app):
    @app.errorhandler(HTTPException)
    def http_error(e):
        return jsonify({"error": e.name}), e.code

    @app.errorhandler(429)
    def too_many(_e):
        return jsonify({"error": "Too many requests. Please try again later."}), 429

    @app.errorhandler(Exception)
    def unhandled(e):
        # Log full details server-side; never leak internals to the client.
        app.logger.exception("unhandled_error")
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500


def _register_security_headers(app):
    production = app.config.get("ENV_NAME") == "production"

    @app.after_request
    def security_headers(response):
        h = response.headers
        h.setdefault("X-Content-Type-Options", "nosniff")
        h.setdefault("X-Frame-Options", "DENY")
        h.setdefault("Referrer-Policy", "no-referrer")
        h.setdefault("Cross-Origin-Resource-Policy", "cross-origin")
        # The API only returns JSON, so nothing should ever be rendered/framed.
        h.setdefault("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'")
        if production:
            h.setdefault("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
        h.pop("Server", None)
        return response


def create_app(config_class=None):
    app = Flask(__name__)
    app.config.from_object(config_class or get_config())
    validate_production_config(app)
    _configure_logging(app)

    # Render terminates TLS at its proxy: trust exactly one hop so
    # request.remote_addr is the real client IP (needed for rate limiting).
    if os.environ.get("RENDER") or app.config.get("ENV_NAME") == "production":
        app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)

    # CORS: flask-cors is the single source of truth for CORS headers,
    # including OPTIONS preflights. Auth uses a Bearer token, not cookies.
    CORS(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        max_age=600,
    )

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)
    limiter.init_app(app)

    from app.models import Category, User, Listing, Favorite, TokenBlocklist  # noqa: F401

    _register_jwt_handlers(app)
    _register_error_handlers(app)
    _register_security_headers(app)

    from .routes.auth_routes import auth_bp
    from .routes.listing_routes import listings_bp
    from .routes.category_routes import categories_bp
    from .routes.favorite_routes import favorites_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(listings_bp, url_prefix="/api/listings")
    app.register_blueprint(categories_bp, url_prefix="/api/categories")
    app.register_blueprint(favorites_bp, url_prefix="/api/favorites")

    @app.route("/")
    def welcome():
        return {
            "message": "Sokomtaani Agricultural Marketplace API",
            "version": "1.0",
            "endpoints": {
                "categories": "/api/categories/",
                "listings": "/api/listings/",
                "auth": "/api/auth/",
                "favorites": "/api/favorites/",
            },
        }

    if not app.config.get("TESTING"):
        from .bootstrap import bootstrap_database

        bootstrap_database(app)

    return app


# Export db for use in other modules
from .extensions import db  # noqa: E402,F811
