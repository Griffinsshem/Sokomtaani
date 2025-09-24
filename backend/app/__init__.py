from flask import Flask
from flask_cors import CORS
from .extensions import db, migrate, jwt, ma
from .config import DevelopmentConfig

def create_app(config_class=DevelopmentConfig):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)
    CORS(app)

    # JWT error handlers for clearer responses
    @jwt.unauthorized_loader
    def _unauthorized_callback(err_str):
        return ( {"error": f"Missing or invalid Authorization header: {err_str}"}, 401 )

    @jwt.invalid_token_loader
    def _invalid_token_callback(err_str):
        return ( {"error": f"Invalid token: {err_str}"}, 422 )

    @jwt.expired_token_loader
    def _expired_token_callback(jwt_header, jwt_payload):
        return ( {"error": "Token has expired"}, 401 )

    # Register blueprints
    from .routes.auth_route import auth_bp
    from .routes.listing_routes import listings_bp
    from .routes.category_routes import categories_bp
    from .routes.favorite_routes import favorites_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(listings_bp, url_prefix="/api/listings")
    app.register_blueprint(categories_bp, url_prefix="/api/categories")
    app.register_blueprint(favorites_bp, url_prefix="/api/favorites")

    return app
