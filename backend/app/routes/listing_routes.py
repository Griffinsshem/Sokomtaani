from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.listings import Listing
from app.models.user import User
from app.models.categories import Category
from app.schemas.listing_schema import ListingSchema
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from werkzeug.utils import secure_filename
import os

listings_bp = Blueprint("listings", __name__)
UPLOAD_FOLDER = "static/uploads"

listing_schema = ListingSchema()
listings_schema = ListingSchema(many=True)


# -------------------------------
# CREATE: Post a new listing
# -------------------------------
@listings_bp.route("", methods=["POST"])
def create_listing():
    try:
        # Optional auth: attach to logged-in user if token provided, else guest
        user = None
        try:
            user_id = get_jwt_identity()
            if user_id:
                user = User.query.get(user_id)
        except Exception:
            user = None

        data = request.form

        # Required fields
        required_fields_always = ["title", "price", "contacts"]
        for field in required_fields_always:
            if field not in data or not data[field].strip():
                return jsonify({"error": f"{field} is required"}), 400

        # Resolve category via id or name
        category_id_val = None
        category_id_raw = data.get("category_id", "").strip()
        category_name_raw = data.get("category", "").strip()
        if category_id_raw:
            try:
                found = Category.query.get(int(category_id_raw))
                if found:
                    category_id_val = found.id
            except Exception:
                category_id_val = None
        if category_id_val is None:
            if not category_name_raw:
                # Map known static ids 1..7 to default names if provided without names
                static_names = {
                    "1": "Vegetables",
                    "2": "Fruits",
                    "3": "Livestock",
                    "4": "Seeds & Seedlings",
                    "5": "Farm Tools",
                    "6": "Cereals",
                    "7": "Agricultural Equipment",
                }
                if category_id_raw and category_id_raw in static_names:
                    category_name_raw = static_names[category_id_raw]
                else:
                    return jsonify({"error": "category or category_id is required"}), 400
            # get or create by name
            cat = Category.query.filter_by(name=category_name_raw).first()
            if cat is None:
                cat = Category(name=category_name_raw)
                db.session.add(cat)
                db.session.flush()
            category_id_val = cat.id

        # Handle image upload
        image_file = request.files.get("image")
        image_url = None
        if image_file:
            if not os.path.exists(UPLOAD_FOLDER):
                os.makedirs(UPLOAD_FOLDER)
            filename = f"{datetime.utcnow().timestamp()}_{image_file.filename}"
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            image_file.save(filepath)
            image_url = f"/{filepath}"

        # Contacts: frontend sends a single "contacts"; use as phone if not an email
        contacts_val = data.get("contacts", "").strip()
        contact_email = (user.email if user else None) or "unknown@example.com"
        contact_phone = (user.phone if user else None) or "N/A"
        if contacts_val:
            if "@" in contacts_val:
                contact_email = contacts_val
            else:
                contact_phone = contacts_val

        new_listing = Listing(
            title=data["title"],
            description=data.get("description", ""),
            price=float(data["price"]),
            category_id=int(category_id_val),
            location=(data.get("location") or (user.location if user else None) or "Unknown"),
            contact_email=contact_email,
            contact_phone=contact_phone,
            image_url=image_url,
            user_id=(user.id if user else None) or 0,
        )

        db.session.add(new_listing)
        db.session.commit()

        # Plain JSON response to avoid schema-related 422s
        response_payload = {
            "id": new_listing.id,
            "title": new_listing.title,
            "description": new_listing.description,
            "price": new_listing.price,
            "category_id": new_listing.category_id,
            "location": new_listing.location,
            "contact_email": new_listing.contact_email,
            "contact_phone": new_listing.contact_phone,
            "image_url": new_listing.image_url,
            "user_id": new_listing.user_id,
            "created_at": new_listing.created_at.isoformat() if getattr(new_listing, "created_at", None) else None,
        }
        return jsonify(response_payload), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Create listing failed: {str(e)}"}), 500


# -------------------------------
# READ: Get all listings
# -------------------------------
@listings_bp.route("", methods=["GET"])
def get_listings():
    # Optional filter by email for "my listings" without requiring auth
    email = request.args.get("email", type=str)
    query = Listing.query
    if email:
        query = query.filter(Listing.contact_email == email)
    listings = query.order_by(Listing.created_at.desc()).all()
    return jsonify(listings_schema.dump(listings)), 200


# Convenience route for authenticated user's listings if token available
@listings_bp.route("/my", methods=["GET"])
def get_my_listings():
    try:
        user_id = None
        try:
            user_id = get_jwt_identity()
        except Exception:
            user_id = None
        if user_id:
            listings = Listing.query.filter_by(user_id=user_id).order_by(Listing.created_at.desc()).all()
            return jsonify(listings_schema.dump(listings)), 200
        # Fallback to email query param
        email = request.args.get("email", type=str)
        if email:
            listings = Listing.query.filter(Listing.contact_email == email).order_by(Listing.created_at.desc()).all()
            return jsonify(listings_schema.dump(listings)), 200
        return jsonify([]), 200
    except Exception as e:
        return jsonify({"error": f"Fetch my listings failed: {str(e)}"}), 500


# -------------------------------
# READ: Get a single listing by ID
# -------------------------------
@listings_bp.route("/<int:listing_id>", methods=["GET"])
def get_listing(listing_id):
    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404
    return jsonify(listing_schema.dump(listing)), 200


# -------------------------------
# UPDATE: Edit a listing
# -------------------------------
@listings_bp.route("/<int:listing_id>", methods=["PATCH"])
@jwt_required()
def update_listing(listing_id):
    user_id = get_jwt_identity()
    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404

    if listing.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.form

    # Update fields
    for field in ["title", "description", "price", "category_id", "location"]:
        if field in data and data[field].strip():
            if field == "price":
                setattr(listing, field, float(data[field]))
            elif field == "category_id":
                listing.category_id = int(data[field])
            else:
                setattr(listing, field, data[field])

    # Update image if provided
    image_file = request.files.get("image")
    if image_file:
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)
        safe_name = secure_filename(image_file.filename)
        filename = f"{datetime.utcnow().timestamp()}_{safe_name}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        image_file.save(filepath)
        listing.image_url = filepath

    db.session.commit()
    return jsonify(listing_schema.dump(listing)), 200


# -------------------------------
# DELETE: Remove a listing
# -------------------------------
@listings_bp.route("/<int:listing_id>", methods=["DELETE"])
@jwt_required()
def delete_listing(listing_id):
    user_id = get_jwt_identity()
    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404

    if listing.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(listing)
    db.session.commit()
    return jsonify({"message": "Listing deleted successfully"}), 200
