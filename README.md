# 🛒 SokoMtaani Marketplace  

SokoMtaani is a **full-stack web application** that connects buyers and sellers in a simple online marketplace.  
It allows users to **sign up, log in, post listings, browse items, mark favorites, and manage their ads**.  

This project is built with:  
- **Backend**: Flask (Python)  
- **Frontend**: Next.js (React)  
- **Database**: SQLite / PostgreSQL (via SQLAlchemy + Flask-Migrate)  

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
│ │ ├── favorites/page.js
│ │ ├── listing-form/page.js
│ │ ├── login/page.js
│ │ ├── my-listings/page.js
│ │ ├── signup/page.js
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
│ ├── 📂 hooks
│ │ └── useAuth.jsx
│ └── 📂 lib
│ └── api.jsx
```


---

## ⚙️ Models & Relationships  

### **User**
- Fields: `id`, `name`, `email`, `password_hash`  
- Relationships:  
  - One-to-Many → Listings (a user can post many listings).  
  - Many-to-Many → Listings (via Favorites).  

### **Listing**
- Fields: `id`, `title`, `description`, `price`, `image_url`, `is_sold`, `created_at`, `user_id`, `category_id`  
- Relationships:  
  - Belongs to User.  
  - Belongs to Category.  
  - Many-to-Many with Users (via Favorites).  

### **Category**
- Fields: `id`, `name` (e.g., Electronics, Furniture, Vehicles, Farm Tools).  
- Relationships:  
  - One-to-Many → Listings.  

### **Favorite**
- Fields: `id`, `user_id`, `listing_id`, `date_added`  
- Relationships:  
  - Many-to-Many: User ↔ Listings.  
  - Extra attribute: `date_added`.  

✅ Requirements Met:  
- **3+ Models**: User, Listing, Category, Favorite  
- **2 One-to-Many**: User → Listings, Category → Listings  
- **1 Many-to-Many**: User ↔ Listings (Favorites with extra field `date_added`)  

---

## 🚀 Features & User Journey  

### 1. Sign Up / Login  
- Users can register with `name, email, phone, location, password`.  
- JWT authentication is implemented.  

### 2. Browse Listings  
- Homepage shows all listings grouped by category.  
- Each listing displays: `title, price, category, seller`.  

### 3. Post a Listing  
- Users can post ads with: `title, description, price, category, image_url, location, contacts`.  
- Form validation with **Formik + Yup**.  

### 4. Manage Own Listings  
- Users can view their listings under `/my-listings`.  
- Options: mark as sold ✅ or delete ❌.  

### 5. Favorite a Listing  
- Users can save a listing by clicking ♥.  
- Favorites are stored with a `date_added` field.  

### 6. Explore Categories  
- Users can filter listings by category.  

### 7. Logout  
- Users can log out via the Navbar, clearing JWT from context.  

---

## 🌐 Backend API Routes  

### **Auth**  
- `POST /signup` → create user  
- `POST /login` → authenticate user  

### **Listings**  
- `GET /listings` → fetch all listings  
- `POST /listings` → create listing (auth required)  
- `GET /listings/:id` → get single listing  
- `PATCH /listings/:id` → update / mark as sold  
- `DELETE /listings/:id` → delete listing  

### **Categories**  
- `GET /categories` → all categories  
- `POST /categories` → add category (admin only)  

### **Favorites**  
- `POST /favorites` → add favorite  
- `GET /favorites` → fetch user’s favorites  
- `DELETE /favorites/:id` → remove favorite  

---

## 🎨 Frontend Routes (Next.js Pages)  

- `/` → homepage (listings, filter by category)  
- `/signup` → user registration  
- `/login` → user login  
- `/listing-form` → create listing  
- `/my-listings` → manage own listings  
- `/favorites` → saved ads  
- `/listings/[id]` → listing details  

---

## 🛠️ Components  

- **Navbar** → Home, Post Ad, My Listings, Favorites, Logout  
- **ListingCard** → Reusable card showing listing details + ♥ button  
- **ListingForm** → Formik + Yup for new listings  
- **CategoryFilter** → Dropdown to filter listings  
- **Footer** → Quick links, contact info, copyright  

---

## 📦 Setup Instructions  

### 🔹 Backend Setup  

1. Create virtual environment:  
   ```bash
   python3 -m venv venv
   source venv/bin/activate

2. Install dependencies:
   ```bash
   pip install -r requirements.txt

3. Initialize database:
   ```bash
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade

4. Run the Flask server:
   ```bash
   flask run

### 🔹 Frontend Setup

1. Navigate to frontend folder:
   ```bash
   cd frontend


2. Install dependencies:
   ```bash
   npm install


3. Run the Next.js development server:
   ```bash
   npm run dev

## 🔗 How Frontend Maps to Backend  

| Frontend Page   | Backend API            | Description             |
|-----------------|------------------------|-------------------------|
| `/signup`       | `POST /signup`         | Register new user       |
| `/login`        | `POST /login`          | User login              |
| `/` (homepage)  | `GET /listings`        | Browse listings         |
| `/listing-form` | `POST /listings`       | Create new listing      |
| `/my-listings`  | `GET /listings/mine`   | View user’s listings    |
| `/favorites`    | `GET /favorites`       | View saved listings     |
| `/favorites`    | `DELETE /favorites/:id`| Remove from favorites   |


## 📖 Tech Stack

- Frontend: Next.js, React, TailwindCSS, Formik, Yup

- Backend: Flask, Flask-JWT, Flask-Migrate, SQLAlchemy

- Database: SQLite / PostgreSQL

- Auth: JWT Authentication

## ✅ MVP Checklist 

 - Flask backend with REST API

 - Next.js frontend with routes

 - 3+ models (User, Listing, Category, Favorite)

 - 2 One-to-Many (User → Listings, Category → Listings)

 - 1 Many-to-Many (User ↔ Listings via Favorites)

 - CRUD operations for Listings

 - Form with validation (Formik + Yup)

 - Navigation with persistent Navbar

 - Favorites feature implemented

 ## 📌 Future Improvements

- Image uploads with Cloudinary or AWS S3

- Advanced search and filtering

- User profiles with ratings & reviews

- Mobile responsive UI

## 👨‍💻 Contributors

- Peter Munyambu → Backend and Frontend

- Griffins Ondeyo → Backend and Frontend

## 📜 License  

This project is licensed under the **MIT License** – you are free to use, modify, and distribute this project for personal or commercial purposes, provided proper attribution is given.  












