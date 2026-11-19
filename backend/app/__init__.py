from flask import Flask
from flask_cors import CORS
from .extensions import db, migrate, jwt, ma
from .config import get_config

def create_app(config_class=None):
    app = Flask(__name__)
    app.config.from_object(config_class or get_config())

    # CORS: flask-cors is the single source of truth for CORS headers.
    # Do not add Access-Control-* headers anywhere else, or browsers will
    # see duplicate Access-Control-Allow-Origin values and block requests.
    # Auth uses a Bearer token (not cookies), so credentials are not needed.
    CORS(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    )

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)

    from app.models import Category, User, Listing, Favorite
    
    # Register blueprints
    from .routes.auth_routes import auth_bp
    from .routes.listing_routes import listings_bp
    from .routes.category_routes import categories_bp
    from .routes.favorite_routes import favorites_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(listings_bp, url_prefix="/api/listings")
    app.register_blueprint(categories_bp, url_prefix="/api/categories")
    app.register_blueprint(favorites_bp, url_prefix="/api/favorites")

    # Add welcome route
    @app.route('/')
    def welcome():
        return {
            'message': 'Sokomtaani Agricultural Marketplace API',
            'version': '1.0',
            'endpoints': {
                'categories': '/api/categories/',
                'listings': '/api/listings/',
                'auth': '/api/auth/',
                'favorites': '/api/favorites/'
            }
        }

    return app

# Export db for use in other modules
from .extensions import db
