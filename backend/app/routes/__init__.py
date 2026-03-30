from .auth_routes import auth_bp
from .category_routes import category_bp
from .listing_routes import listing_bp
from .favorite_routes import favorite_bp

def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(category_bp, url_prefix="/api/categories")
    app.register_blueprint(listing_bp, url_prefix="/api/listings")
    app.register_blueprint(favorite_bp, url_prefix="/api/favorites")
