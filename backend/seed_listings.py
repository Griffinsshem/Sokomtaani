from app import create_app
from app.models import Category, Listing, User
from app.extensions import db
from datetime import datetime

app = create_app()

with app.app_context():
    # Create a test user if none exists
    if User.query.count() == 0:
        test_user = User(
            name="Farmer John",
            email="john@example.com",
            phone="+254712345678",
            location="Nairobi, Kenya"
        )
        test_user.set_password("password123")
        db.session.add(test_user)
        db.session.commit()
        print("Created test user: Farmer John")
    else:
        user = User.query.first()
        print(f"Using existing user: {user.name}")
    
    # Add sample agricultural listings
    if Listing.query.count() == 0:
        vegetables = Category.query.filter_by(name="Fresh Vegetables").first()
        fruits = Category.query.filter_by(name="Fresh Fruits").first()
        dairy = Category.query.filter_by(name="Dairy Products").first()
        grains = Category.query.filter_by(name="Grains & Cereals").first()
        livestock = Category.query.filter_by(name="Livestock & Poultry").first()
        eggs = Category.query.filter_by(name="Eggs").first()
        honey = Category.query.filter_by(name="Honey & Bee Products").first()
        
        user = User.query.first()
        
        sample_listings = [
            {
                "title": "Organic Tomatoes", 
                "description": "Fresh organic tomatoes from my garden, harvested daily. Perfect for salads and cooking.", 
                "price": 250,
                "category": vegetables,
                "contact_email": user.email,
                "contact_phone": user.phone,
                "location": user.location
            },
            {
                "title": "Sweet Corn", 
                "description": "Sweet corn harvested this morning, perfect for grilling or boiling.", 
                "price": 120,
                "category": vegetables,
                "contact_email": user.email,
                "contact_phone": user.phone,
                "location": user.location
            },
            {
                "title": "Ripe Avocados", 
                "description": "Creamy Hass avocados, perfect for guacamole or sandwiches.", 
                "price": 300,
                "category": fruits,
                "contact_email": user.email,
                "contact_phone": user.phone,
                "location": user.location
            },
            {
                "title": "Fresh Milk", 
                "description": "Fresh dairy milk from grass-fed cows. Delivered daily.", 
                "price": 150,
                "category": dairy,
                "contact_email": user.email,
                "contact_phone": user.phone,
                "location": user.location
            },
            {
                "title": "Free-Range Eggs", 
                "description": "Organic free-range chicken eggs. Pack of 12.", 
                "price": 400,
                "category": eggs,
                "contact_email": user.email,
                "contact_phone": user.phone,
                "location": user.location
            },
            {
                "title": "Maize Grain", 
                "description": "High-quality maize grain for animal feed or human consumption. 1kg bag.", 
                "price": 80,
                "category": grains,
                "contact_email": user.email,
                "contact_phone": user.phone,
                "location": user.location
            },
            {
                "title": "Local Chicken", 
                "description": "Healthy free-range local chickens. Ready for slaughter.", 
                "price": 1200,
                "category": livestock,
                "contact_email": user.email,
                "contact_phone": user.phone,
                "location": user.location
            },
            {
                "title": "Organic Honey", 
                "description": "Pure organic honey from local bees. 500g jar.", 
                "price": 800,
                "category": honey,
                "contact_email": user.email,
                "contact_phone": user.phone,
                "location": user.location
            },
            {
                "title": "Sukuma Wiki", 
                "description": "Fresh kale (Sukuma Wiki) from the farm. Bunch of 10 leaves.", 
                "price": 50,
                "category": vegetables,
                "contact_email": user.email,
                "contact_phone": user.phone,
                "location": user.location
            },
            {
                "title": "Mangoes", 
                "description": "Sweet ripe mangoes from Eastern Kenya. Season's best.", 
                "price": 200,
                "category": fruits,
                "contact_email": user.email,
                "contact_phone": user.phone,
                "location": user.location
            }
        ]
        
        for listing_data in sample_listings:
            listing = Listing(
                title=listing_data["title"],
                description=listing_data["description"],
                price=listing_data["price"],
                category_id=listing_data["category"].id,
                user_id=user.id,
                contact_email=listing_data["contact_email"],
                contact_phone=listing_data["contact_phone"],
                location=listing_data["location"]
            )
            db.session.add(listing)
            print(f"Added: {listing_data['title']} - KSh {listing_data['price']}")
        
        db.session.commit()
        print(f"Added {len(sample_listings)} sample agricultural listings!")
    else:
        print("Listings already exist in database.")
        listings = Listing.query.all()
        for listing in listings:
            print(f"- {listing.title}: KSh {listing.price}")
    
    print("Database seeding complete!")
