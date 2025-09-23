from app import db  # or from .. import db if inside package

class Listing(db.Model):
    __tablename__ = "listings"  # optional
    id = db.Column(db.Integer, primary_key=True)
    # other columns...
