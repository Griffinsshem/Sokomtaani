from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow
import hmac

from flask import current_app, request
from flask_limiter import Limiter

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
ma = Marshmallow()


def client_ip():
    """Best-effort real client IP.

    Requests proxied by the Next.js frontend carry X-Client-IP plus a shared
    secret; only then is X-Client-IP trusted. Otherwise use remote_addr
    (already corrected by ProxyFix for Render's own proxy).
    """
    secret = current_app.config.get("PROXY_SHARED_SECRET") or ""
    supplied = request.headers.get("X-Proxy-Secret", "")
    if secret and supplied and hmac.compare_digest(supplied, secret):
        forwarded = request.headers.get("X-Client-IP", "").split(",")[0].strip()
        if forwarded:
            return forwarded
    return request.remote_addr or "unknown"


# No global default limit: only sensitive endpoints are throttled explicitly,
# so normal browsing is unaffected.
limiter = Limiter(key_func=client_ip)