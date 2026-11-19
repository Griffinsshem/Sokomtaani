from app.utils.script_guard import refuse_in_production

refuse_in_production("check_db.py")

from app import create_app
from app.models import Category

app = create_app()

with app.app_context():
    categories = Category.query.all()
    print(f"Number of categories in database: {len(categories)}")
    for cat in categories:
        print(f"Category: {cat.name}")
