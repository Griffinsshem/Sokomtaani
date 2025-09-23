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
    app.register_blueprint(auth_bp)

    return app
