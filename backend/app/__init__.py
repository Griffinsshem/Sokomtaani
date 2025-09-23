from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

# Initialize extensions (but don’t bind them yet)
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    # Create the Flask app instance
    app = Flask(__name__)

    # Configurations (you can move to config.py if needed)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///soko.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = "supersecretkey"

    # Initialize extensions with the app
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    # Import and register blueprints
    from .routes.auth_routes import auth_bp
    from .routes.category_routes import category_bp
    from .routes.favorite_routes import favorite_bp
    from .routes.listing_routes import listing_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(category_bp, url_prefix="/categories")
    app.register_blueprint(favorite_bp, url_prefix="/favorites")
    app.register_blueprint(listing_bp, url_prefix="/listings")

    # Example root route
    @app.route("/")
    def index():
        return {"message": "Welcome to Sokomtaani API!"}

    return app
