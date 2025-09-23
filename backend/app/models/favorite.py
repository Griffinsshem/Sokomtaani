from app import db  # or from .. import db if inside package

class Favorite(db.Model):
    __tablename__ = "favorites"  # optional
    id = db.Column(db.Integer, primary_key=True)
    # other columns...
