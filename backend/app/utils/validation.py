"""Server-side input validation.

These mirror (and never relax) the rules the React forms already enforce,
so legitimate users see no difference, but direct API calls can no longer
bypass them.
"""
import math
import re
from urllib.parse import urlparse

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
# Same rule as frontend/src/app/signup/page.js:
# 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.
PASSWORD_RE = re.compile(
    r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$"
)
PHONE_RE = re.compile(r"^(?=.{7,15}$)\+?[0-9 ]+$")  # column is VARCHAR(15)


def clean_str(value, max_len):
    if value is None:
        return None
    if not isinstance(value, str):
        value = str(value)
    value = value.strip()
    return value[:max_len] if max_len else value


def is_valid_email(email):
    return bool(email) and len(email) <= 120 and bool(EMAIL_RE.match(email))


def is_strong_password(password):
    return isinstance(password, str) and bool(PASSWORD_RE.match(password))


def is_valid_phone(phone):
    return bool(phone) and bool(PHONE_RE.match(phone))


def parse_price(value):
    """Return a non-negative finite float, or None if invalid."""
    if isinstance(value, bool):
        return None
    try:
        price = float(value)
    except (TypeError, ValueError):
        return None
    if not math.isfinite(price) or price < 0 or price > 1_000_000_000:
        return None
    return round(price, 2)


def parse_int(value):
    if isinstance(value, bool):
        return None
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def is_safe_image_url(url):
    """Empty, or an absolute http(s) URL (blocks javascript:, data:, etc.)."""
    if not url:
        return True
    if len(url) > 250:
        return False
    parsed = urlparse(url)
    return parsed.scheme in ("http", "https") and bool(parsed.netloc)
