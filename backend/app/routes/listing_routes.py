from flask import Blueprint, jsonify, request
from app.extension import db
from app.models.listing import Listing
from app.models.user import User

bp = Blueprint("listings", __name__, url_prefix="/api/listings")

@bp.route("/", methods=["GET"])
def get_listings():
    q = request.args.get("search", type=str)
    category_id = request.args.get("category_id", type=int)
    page = request.args.get("page", type=int, default=1)
    per_page = request.args.get("per_page", type=int, default=50)

    query = Listing.query

    if category_id:
        query = query.filter_by(category_id=category_id)

    if q:
        like_q = f"%{q}%"
        query = query.filter(Listing.title.ilike(like_q))

    query = query.order_by(Listing.created_at.desc())

    paged = query.paginate(page=page, per_page=per_page, error_out=False)
    listings = []
    for l in paged.items:
        seller = User.query.get(l.user_id)
        seller_data = None
        if seller:
            seller_data = {
                "id": seller.id,
                "name": seller.name,
                "email": getattr(seller, "email", None),
                "phone_number": getattr(seller, "phone_number", None)
            }
        listings.append({
            "id": l.id,
            "title": l.title,
            "description": l.description,
            "price": l.price,
            "image_url": l.image_url,
            "is_sold": l.is_sold,
            "created_at": l.created_at.isoformat() if l.created_at else None,
            "user_id": l.user_id,
            "category_id": l.category_id,
            "seller": seller_data
        })

    return jsonify({
        "data": listings,
        "meta": {
            "page": paged.page,
            "per_page": paged.per_page,
            "total": paged.total,
            "pages": paged.pages
        }
    }), 200
