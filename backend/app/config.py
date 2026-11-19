import os
import re


def _database_url():
    url = os.environ.get("DATABASE_URL", "sqlite:///soko.db")
    # Render/Heroku style URLs use "postgres://", which SQLAlchemy 2.x rejects.
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    return url


def _cors_origins():
    """Allowed frontend origins.

    Override with CORS_ORIGINS="https://a.com,https://b.com" if needed.
    Defaults to the production Vercel site, its preview deployments,
    and local Next.js dev.
    """
    raw = os.environ.get("CORS_ORIGINS")
    if raw:
        return [o.strip() for o in raw.split(",") if o.strip()]
    return [
        "https://sokomtaani.vercel.app",
        re.compile(r"^https://sokomtaani-[a-z0-9-]+\.vercel\.app$"),
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "REDACTED")
    SQLALCHEMY_DATABASE_URI = _database_url()
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "REDACTED")
    JWT_ACCESS_TOKEN_EXPIRES = 86400

    CORS_ORIGINS = _cors_origins()


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"


def get_config():
    """Pick config from the environment.

    Render sets RENDER=true on every service, so production never runs
    with DEBUG on. APP_ENV can force a specific config.
    """
    env = os.environ.get("APP_ENV", "").lower()
    if env == "testing":
        return TestingConfig
    if env == "production" or os.environ.get("RENDER"):
        return ProductionConfig
    return DevelopmentConfig
