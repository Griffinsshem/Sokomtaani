# 🛍️ SokoMtaani – Online Marketplace

SokoMtaani is a **full-stack web marketplace application** that allows users to buy and sell items online.  
It is built with a **Flask backend** (REST API) and a **Next.js + React frontend**.  

The platform enables users to:

- Create accounts and log in securely.
- Post listings (ads) for products and services.
- Browse and filter listings by category.
- Mark listings as sold or delete them.
- Favorite/save listings to view later.
- Explore categories and search for items.

---

## 📂 Project Structure

```
📦 project-root
├── 📂 backend
│ ├── 📂 app
│ │ ├── init.py
│ │ ├── config.py
│ │ ├── extension.py
│ │ ├── 📂 models
│ │ │ ├── init.py
│ │ │ ├── categories.py
│ │ │ ├── favorites.py
│ │ │ ├── listing.py
│ │ │ └── user.py
│ │ ├── 📂 routes
│ │ │ ├── init.py
│ │ │ ├── auth_routes.py
│ │ │ ├── category_routes.py
│ │ │ ├── favorite_routes.py
│ │ │ └── listing_routes.py
│ │ └── 📂 utils
│ │ └── auth.py
│ ├── venv/
│ ├── requirements.txt
│ └── wsgi.py
│
├── 📂 frontend
│ ├── .gitignore
│ ├── eslint.config.mjs
│ ├── jsconfig.json
│ ├── next.config.mjs
│ ├── package-lock.json
│ ├── package.json
│ ├── postcss.config.mjs
│ ├── README.md
│ ├── 📂 public
│ └── 📂 src
│ ├── 📂 app
│ │ ├── favorites
│ │ │ └── page.js
│ │ ├── listing-form
│ │ │ └── page.js
│ │ ├── login
│ │ │ └── page.js
│ │ ├── my-listings
│ │ │ └── page.js
│ │ ├── signup
│ │ │ └── page.js
│ │ ├── favicon.ico
│ │ ├── global.css
│ │ ├── layout.js
│ │ └── page.js # homepage
│ │
│ ├── 📂 components
│ │ ├── categoryFilter.jsx
│ │ ├── footer.jsx
│ │ ├── listingCard.jsx
│ │ └── Navbar.jsx
│ │
│ ├── 📂 context
│ │ └── AuthContext.jsx
│ │
│ ├── 📂 hooks
│ │ └── useAuth.jsx
│ │
│ └── 📂 lib
│ └── api.jsx
```


---

## 🧩 MVP Features

### 1. Models & Relationships

**User**
- Fields: `id`, `name`, `email`, `password_hash`
- Relationships:
  - One-to-Many → Listings
  - Many-to-Many → Listings through Favorites

**Listing**
- Fields: `id`, `title`, `description`, `price`, `image_url`, `is_sold`, `created_at`, `user_id`, `category_id`
- Relationships:
  - Belongs to User
  - Belongs to Category
  - Many-to-Many with Users via Favorites

**Category**
- Fields: `id`, `name` (e.g., Electronics, Furniture, Vehicles, Farm tools)
- Relationships:
  - One-to-Many → Listings

**Favorite**
- Fields: `id`, `user_id`, `listing_id`, `date_added`
- Many-to-Many: User ↔ Listings
- Extra attribute = `date_added`

✅ Requirements Met:
- 3+ Models: User, Listing, Category, Favorite
- 2 One-to-Many: User → Listings, Category → Listings
- 1 Many-to-Many: User ↔ Listings via Favorites

---

### 2. User Journey

1. **Sign Up / Login**
   - User creates an account (`/signup`) or logs in (`/login`).
   - Session handled with JWT.
   
2. **Browse Listings**
   - Homepage shows all listings grouped by category.
   - Each listing shows title, price, category, and seller contact.

3. **Post a New Listing**
   - User clicks "Post Ad" → form submission (`/listing-form`).
   - Data saved under `Listing`.

4. **My Listings**
   - Logged-in user sees their ads in `/my-listings`.
   - Can mark as sold or delete listings.

5. **Favorite a Listing**
   - Logged-in user can click "♥ Save".
   - Entry saved in `Favorite` with `date_added`.

6. **Explore Categories**
   - Clicking a category filters listings.

---

### 3. API Routes

#### 🔑 Auth
- `POST /api/auth/signup` → Create user
- `POST /api/auth/login` → Authenticate user

#### 📦 Listings
- `GET /api/listings` → All listings
- `POST /api/listings` → Create listing (auth required)
- `GET /api/listings/:id` → Single listing
- `PATCH /api/listings/:id` → Update/mark sold
- `DELETE /api/listings/:id` → Delete listing
- `GET /api/listings/mine` → Current user’s listings

#### 🏷️ Categories
- `GET /api/categories` → All categories
- `POST /api/categories` → Add category (admin only, optional)

#### ❤️ Favorites
- `POST /api/favorites` → Add favorite
- `GET /api/favorites` → Get user’s favorites
- `DELETE /api/favorites/:id` → Remove favorite

---

### 4. Frontend Pages

- `/signup` → Registration form
- `/login` → Login form
- `/` → Homepage (listings, search, category filter)
- `/listing-form` → Create new listing
- `/my-listings` → User’s ads (edit, mark sold, delete)
- `/favorites` → User’s saved ads
- `/listings/[id]` → Single listing details

---

## 🛠️ Tech Stack

- **Backend:** Python, Flask, Flask-JWT, SQLAlchemy, Alembic (migrations)
- **Frontend:** Next.js, React, Tailwind CSS
- **Database:** SQLite / PostgreSQL (configurable)
- **Validation:** Formik + Yup (frontend), Marshmallow (backend optional)
- **Auth:** JWT (JSON Web Tokens)

---

## ⚡ Installation & Setup

### 🔹 Backend Setup

1. Navigate to `backend/`:
   ```bash
   cd backend


2. Create virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate
