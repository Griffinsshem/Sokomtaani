from app import create_app
from app.models import Category
from app.extensions import db

app = create_app()

with app.app_context():
    # Check if categories exist
    if Category.query.count() == 0:
        print("Adding agricultural categories...")
        agricultural_categories = [
            "Fresh Vegetables",
            "Fresh Fruits",
            "Grains & Cereals",
            "Livestock & Poultry",
            "Dairy Products",
            "Eggs",
            "Honey & Bee Products",
            "Herbs & Spices",
            "Organic Produce",
            "Seeds & Seedlings",
            "Fertilizers & Soil",
            "Farming Equipment",
            "Processed Foods",
            "Fish & Aquaculture",
            "Coffee & Tea",
            "Flowers & Plants"
        ]
        
        for cat_name in agricultural_categories:
            # Check if category already exists (just to be safe)
            existing = Category.query.filter_by(name=cat_name).first()
            if not existing:
                category = Category(name=cat_name)
                db.session.add(category)
                print(f"Added: {cat_name}")
        
        db.session.commit()
        print("Agricultural categories added successfully!")
    else:
        print("Categories already exist in database.")
        categories = Category.query.all()
        for cat in categories:
            print(f"- {cat.name}")
