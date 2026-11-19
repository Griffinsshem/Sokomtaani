from datetime import datetime

from app.extensions import db


class TokenBlocklist(db.Model):
    """JWT ids (jti) revoked by logout. Rows can be purged after they expire."""

    __tablename__ = "token_blocklist"

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(64), nullable=False, unique=True, index=True)
    expires_at = db.Column(db.DateTime, nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
