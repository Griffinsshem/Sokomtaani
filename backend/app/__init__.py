from flask import Flask
from flask_cors import CORS
from .extensions import db, migrate, jwt, ma
from .config import DevelopmentConfig

def create_app(config_class=DevelopmentConfig):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Fix CORS - configure it properly
    CORS(app, supports_credentials=True)

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

    # Add specific CORS handling for OPTIONS requests
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response

    return app

# Export db for use in other modules
from .extensions import db
