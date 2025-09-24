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
