# SokoMtaani

A marketplace that connects Kenyan farmers directly with buyers. Farmers post their produce; buyers browse,
search, save favorites and contact sellers by phone, WhatsApp or email.

- **Live site:** https://sokomtaani.vercel.app
- **API:** https://sokomtaani6.onrender.com (reached by the site through its own `/api` proxy)

## Architecture

```
Browser ──► Next.js on Vercel ──(/api/* proxy, middleware)──► Flask API on Render ──► Render Postgres
             │  SSR pages, SEO, CSP nonce, route guard          │  JWT in HttpOnly cookie + CSRF
             └─ sitemap, robots, icons, OG image               └─ validation, rate limits, audit logs
```

| Part | Stack |
|---|---|
| `frontend/` | Next.js 15 (App Router), React 19, Tailwind CSS 4, Formik + Yup, axios |
| `backend/` | Flask 3, SQLAlchemy 2, Flask-JWT-Extended, Flask-Limiter, gunicorn |
| Database | PostgreSQL (production), SQLite (local development) |

### Security model (short version)

- Sessions are a JWT in an **HttpOnly, Secure, SameSite=Lax cookie**; writes need a matching
  `X-CSRF-TOKEN` header (double-submit). API clients can still use `Authorization: Bearer`.
- The browser only talks to `/api` on the site itself. `src/middleware.js` proxies to Render and adds a
  shared secret (`PROXY_SHARED_SECRET`) plus the real client IP, which the API trusts for rate limiting.
- Per-request **nonce-based Content-Security-Policy**; no inline scripts without the nonce.
- Owner-only edit/delete, admin-only categories (`ADMIN_EMAILS`), server-side validation, rate limits on
  login/signup/password endpoints, token revocation on logout, generic error responses.
- Production refuses to start without strong `SECRET_KEY` / `JWT_SECRET_KEY`.

## Running locally

**Backend** (Python 3.10):

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
flask --app wsgi run --port 5000          # creates instance/soko.db and seeds categories
```

**Frontend** (Node 20+):

```bash
cd frontend
npm ci
API_ORIGIN=http://127.0.0.1:5000 npm run dev   # http://localhost:3000
```

## Tests

```bash
cd backend && pytest                 # API + security tests (SQLite; set TEST_DATABASE_URL for Postgres)
cd frontend && npm test && npm run lint
```

GitHub Actions runs all of these on every push and pull request (`.github/workflows/ci.yml`).

## Configuration

### Render (backend service `Sokomtaani6`)

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | Render Postgres internal URL |
| `SECRET_KEY`, `JWT_SECRET_KEY` | yes | ≥32 random characters each |
| `PROXY_SHARED_SECRET` | yes | same value as on Vercel |
| `ADMIN_EMAILS` | no | comma-separated emails allowed to manage categories |
| `FRONTEND_URL` | no | defaults to `https://sokomtaani.vercel.app` (used in reset emails) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `MAIL_FROM` | for password reset | outgoing email; without them reset emails are only logged |
| `CORS_ORIGINS` | no | override allowed origins for direct API access |

### Vercel (project `sokomtaani`, root directory `frontend`)

| Variable | Required | Purpose |
|---|---|---|
| `PROXY_SHARED_SECRET` | yes | same value as on Render (server-only, never `NEXT_PUBLIC_`) |
| `API_ORIGIN` | no | defaults to `NEXT_PUBLIC_API_URL`, then `https://sokomtaani6.onrender.com` |
| `NEXT_PUBLIC_SITE_URL` | no | defaults to `https://sokomtaani.vercel.app` (canonical URLs, sitemap) |

## Database schema

Tables are created on start-up (`backend/app/bootstrap.py`): missing tables are created, newly added columns
(e.g. `listings.is_sold`) are added idempotently, and default categories are seeded into an empty database.
Seed scripts (`seed_*.py`) refuse to run in production unless `ALLOW_SEED=1`.

## Project structure

```
backend/
  app/
    routes/        auth, listings, categories, favorites
    models/        User, Listing, Category, Favorite, TokenBlocklist
    utils/         auth helpers, validation, mail, script guard
    bootstrap.py   schema + seed on start-up
  tests/           pytest suite
frontend/
  src/
    app/           pages (App Router), sitemap, robots, manifest, icons, OG image
    components/    UI (ListingCard, dialogs, toasts, forms, NavBar, Footer…)
    context/       AuthContext (cookie session)
    hooks/         useFavorites
    lib/           api client, server fetch, formatting, validation, config
    middleware.js  /api proxy, CSP nonce, route guard
```
