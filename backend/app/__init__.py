from flask import Flask
from .config import Config
from .extension import db, migrate, jwt, cors
from .routes import register_routes

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(
    app,
    resources={r"/api/*": {"origins": ["https://sokomtaani.vercel.app"]}},
    supports_credentials=True
)
    # register routes
    register_routes(app)

    return app
