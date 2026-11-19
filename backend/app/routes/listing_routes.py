from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import jwt_required

from app.extensions import client_ip, db, limiter
from app.models.categories import Category
from app.models.listings import Listing
from app.models.user import User
from app.schemas.listing_schema import listing_schema, listings_schema
from app.utils.auth import current_user_id
from app.utils.validation import clean_str, is_safe_image_url, parse_int, parse_price

listings_bp = Blueprint("listings", __name__)

MAX_PER_PAGE = 50
SORTS = {
    "newest": (Listing.created_at.desc(), Listing.id.desc()),
    "oldest": (Listing.created_at.asc(), Listing.id.asc()),
    "price_asc": (Listing.price.asc(), Listing.id.desc()),
    "price_desc": (Listing.price.desc(), Listing.id.desc()),
}


def _validate_fields(data, partial):
    """Validate listing fields. Returns (clean_dict, error_message)."""
    out = {}

    if not partial or "title" in data:
        title = clean_str(data.get("title"), None)
        if not title or len(title) > 150:
            return None, "title must be 1-150 characters"
        out["title"] = title

    if not partial or "description" in data:
        description = clean_str(data.get("description", ""), None) or ""
        if len(description) > 5000:
            return None, "description must be at most 5000 characters"
        out["description"] = description

    if not partial or "price" in data:
        price = parse_price(data.get("price"))
        if price is None:
            return None, "price must be a non-negative number"
        out["price"] = price

    if not partial or "category_id" in data:
        category_id = parse_int(data.get("category_id"))
        if category_id is None or db.session.get(Category, category_id) is None:
            return None, "category_id is invalid"
        out["category_id"] = category_id

    if not partial or "image_url" in data:
        image_url = clean_str(data.get("image_url", ""), None) or ""
        if not is_safe_image_url(image_url):
            return None, "image_url must be an http(s) URL"
        out["image_url"] = image_url

    if "is_sold" in data:
        if not isinstance(data["is_sold"], bool):
            return None, "is_sold must be true or false"
        out["is_sold"] = data["is_sold"]

    return out, None


# list listings (homepage). Without ?page it returns the full array (legacy
# shape); with ?page it returns a paginated, searchable, filterable result.
@listings_bp.route("/", methods=["GET"])
def get_all_listings():
    args = request.args
    query = Listing.query

    q = clean_str(args.get("q"), 100)
    if q:
        like = f"%{q}%"
        query = query.filter(
            Listing.title.ilike(like) | Listing.description.ilike(like) | Listing.location.ilike(like)
        )

    category_id = parse_int(args.get("category_id"))
    if category_id:
        query = query.filter(Listing.category_id == category_id)

    if args.get("available") in ("1", "true"):
        query = query.filter(Listing.is_sold.is_(False))

    query = query.order_by(*SORTS.get(args.get("sort", "newest"), SORTS["newest"]))

    if "page" not in args:
        return jsonify(listings_schema.dump(query.all())), 200

    page = max(parse_int(args.get("page")) or 1, 1)
    per_page = min(max(parse_int(args.get("per_page")) or 12, 1), MAX_PER_PAGE)
    result = query.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        "items": listings_schema.dump(result.items),
        "page": result.page,
        "per_page": result.per_page,
        "total": result.total,
        "pages": result.pages,
    }), 200


# single listing (public detail page)
@listings_bp.route("/<int:id>", methods=["GET"])
def get_listing(id):
    listing = db.session.get(Listing, id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404
    data = listing_schema.dump(listing)
    data["category_name"] = listing.category.name if listing.category else None
    data["seller_name"] = listing.user.name if listing.user else None
    return jsonify(data), 200


# get listings for the current user
@listings_bp.route("/my", methods=["GET"])
@jwt_required()
def get_my_listings():
    user_id = current_user_id()
    listings = (
        Listing.query.filter_by(user_id=user_id)
        .order_by(Listing.created_at.desc())
        .all()
    )
    return jsonify(listings_schema.dump(listings)), 200


# create a new listing
@listings_bp.route("/", methods=["POST"])
@jwt_required()
@limiter.limit("30 per hour")
def create_listing():
    data = request.get_json(silent=True) or {}
    user_id = current_user_id()
    user = db.session.get(User, user_id) if user_id else None

    if not user:
        return jsonify({"error": "User not found"}), 404

    for field in ("title", "price", "category_id"):
        if field not in data or data[field] in (None, ""):
            return jsonify({"error": f"{field} is required"}), 400

    fields, error = _validate_fields(data, partial=False)
    if error:
        return jsonify({"error": error}), 400

    new_listing = Listing(
        **fields,
        location=user.location,
        contact_email=user.email,
        contact_phone=user.phone,
        user_id=user.id,
    )

    db.session.add(new_listing)
    db.session.commit()
    current_app.logger.info("listing.created listing_id=%s user_id=%s", new_listing.id, user.id)

    return jsonify(listing_schema.dump(new_listing)), 201


# update a listing (owner only), including marking it sold
@listings_bp.route("/<int:id>", methods=["PATCH"])
@jwt_required()
@limiter.limit("60 per hour")
def update_listing(id):
    user_id = current_user_id()
    listing = db.session.get(Listing, id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404
    if listing.user_id != user_id:
        current_app.logger.warning(
            "security.update_denied listing_id=%s owner_id=%s user_id=%s ip=%s",
            id, listing.user_id, user_id, client_ip(),
        )
        return jsonify({"error": "You can only edit your own listings"}), 403

    data = request.get_json(silent=True) or {}
    fields, error = _validate_fields(data, partial=True)
    if error:
        return jsonify({"error": error}), 400
    if not fields:
        return jsonify({"error": "No changes supplied"}), 400

    for key, value in fields.items():
        setattr(listing, key, value)
    db.session.commit()
    current_app.logger.info(
        "listing.updated listing_id=%s user_id=%s fields=%s", id, user_id, sorted(fields)
    )
    return jsonify(listing_schema.dump(listing)), 200


# delete a listing (owner only)
@listings_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_current_listing(id):
    user_id = current_user_id()
    listing = db.session.get(Listing, id)

    if not listing:
        return jsonify({"error": "Listing not found"}), 404

    if listing.user_id != user_id:
        current_app.logger.warning(
            "security.delete_denied listing_id=%s owner_id=%s user_id=%s ip=%s",
            id, listing.user_id, user_id, client_ip(),
        )
        return jsonify({"error": "You can only delete your own listings"}), 403

    db.session.delete(listing)
    db.session.commit()
    current_app.logger.info("listing.deleted listing_id=%s user_id=%s", id, user_id)

    return jsonify({"message": f"Listing {id} deleted successfully"}), 200
