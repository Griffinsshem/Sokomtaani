import os
import re
import secrets


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


def _admin_emails():
    raw = os.environ.get("ADMIN_EMAILS", "")
    return {e.strip().lower() for e in raw.split(",") if e.strip()}


class Config:
    # Development-only fallbacks: random per process, never a known constant.
    SECRET_KEY = os.environ.get("SECRET_KEY") or secrets.token_hex(32)
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY") or secrets.token_hex(32)

    SQLALCHEMY_DATABASE_URI = _database_url()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True}

    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24h, same as before

    # Browser sessions use an HttpOnly cookie (not readable by JavaScript).
    # The Authorization header keeps working for API clients.
    JWT_TOKEN_LOCATION = ["headers", "cookies"]
    JWT_COOKIE_SECURE = False  # True in production (HTTPS only)
    JWT_COOKIE_SAMESITE = "Lax"
    JWT_SESSION_COOKIE = False  # persistent cookie that expires with the token
    JWT_ACCESS_COOKIE_PATH = "/"
    # Double-submit CSRF protection for cookie-authenticated writes: the
    # frontend echoes the readable csrf_access_token cookie in X-CSRF-TOKEN.
    JWT_COOKIE_CSRF_PROTECT = True
    JWT_CSRF_IN_COOKIES = True
    JWT_ACCESS_CSRF_COOKIE_PATH = "/"

    CORS_ORIGINS = _cors_origins()
    ADMIN_EMAILS = _admin_emails()

    # Shared secret proving a request came through the Next.js proxy, so the
    # client IP it forwards can be trusted for rate limiting.
    PROXY_SHARED_SECRET = os.environ.get("PROXY_SHARED_SECRET", "")

    # Public site URL, used in password-reset emails.
    FRONTEND_URL = os.environ.get("FRONTEND_URL", "https://sokomtaani.vercel.app").rstrip("/")
    PASSWORD_RESET_MAX_AGE = 3600  # 1 hour

    # Outgoing email (password reset). If SMTP_HOST is unset, emails are not
    # sent and a warning is logged instead.
    SMTP_HOST = os.environ.get("SMTP_HOST", "")
    SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
    SMTP_USERNAME = os.environ.get("SMTP_USERNAME", "")
    SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
    MAIL_FROM = os.environ.get("MAIL_FROM", os.environ.get("SMTP_USERNAME", ""))

    # Rate limiting (Flask-Limiter). In-memory storage is fine for a single
    # instance; set RATELIMIT_STORAGE_URI to a Redis URL when scaling out.
    RATELIMIT_STORAGE_URI = os.environ.get("RATELIMIT_STORAGE_URI", "memory://")
    RATELIMIT_HEADERS_ENABLED = True

    MAX_CONTENT_LENGTH = 1 * 1024 * 1024  # JSON bodies only; 1 MB is plenty

    ENV_NAME = "development"


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False
    ENV_NAME = "production"
    JWT_COOKIE_SECURE = True
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True


class TestingConfig(Config):
    TESTING = True
    ENV_NAME = "testing"
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    RATELIMIT_ENABLED = False


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


def validate_production_config(app):
    """Fail closed: refuse to start in production without real secrets."""
    if app.config.get("ENV_NAME") != "production":
        return
    missing = [k for k in ("SECRET_KEY", "JWT_SECRET_KEY") if not os.environ.get(k)]
    if missing:
        raise RuntimeError(
            "Missing required environment variables in production: "
            + ", ".join(missing)
        )
    for key in ("SECRET_KEY", "JWT_SECRET_KEY"):
        if len(os.environ[key]) < 32:
            raise RuntimeError(f"{key} must be at least 32 characters long")
