import os
import sys

import pytest

BACKEND = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BACKEND)

ORIGIN = {"Origin": "https://sokomtaani.vercel.app"}
PASSWORD = "Passw0rd!x"


@pytest.fixture()
def app(tmp_path, monkeypatch):
    # Real bootstrap path (create_all + seed) on a throwaway database.
    monkeypatch.setenv("DATABASE_URL", os.environ.get("TEST_DATABASE_URL", f"sqlite:///{tmp_path / 't.db'}"))
    monkeypatch.setenv("ADMIN_EMAILS", "admin@soko.co.ke")
    monkeypatch.setenv("PROXY_SHARED_SECRET", "test-proxy-secret")
    monkeypatch.delenv("RENDER", raising=False)
    monkeypatch.delenv("APP_ENV", raising=False)

    import importlib

    import app.config as config_module
    importlib.reload(config_module)  # pick up env vars set above
    from app import create_app
    from app.extensions import db, limiter

    application = create_app(config_module.DevelopmentConfig)
    limiter.reset()
    yield application
    with application.app_context():
        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


def signup(client, email, phone, pw=PASSWORD, **extra):
    return client.post("/api/auth/signup", headers=ORIGIN, json={
        "name": "Test User", "email": email, "phone": phone,
        "location": "Nairobi", "password": pw, **extra,
    })


def login(client, email, pw=PASSWORD):
    return client.post("/api/auth/login", headers=ORIGIN, json={"email": email, "password": pw})


def bearer(token):
    return {**ORIGIN, "Authorization": f"Bearer {token}"}


@pytest.fixture()
def users(client):
    from app.extensions import limiter
    out = {}
    for name, phone in (("alice", "0712345678"), ("bob", "0723456789")):
        signup(client, f"{name}@x.co", phone)
        limiter.reset()
        out[name] = login(client, f"{name}@x.co").get_json()["token"]
    signup(client, "admin@soko.co.ke", "0734567890")
    out["admin"] = login(client, "admin@soko.co.ke").get_json()["token"]
    limiter.reset()
    # Fresh cookie jar so cookie-based tests start logged out.
    client._cookies.clear()
    return out


@pytest.fixture()
def category_id(client):
    return client.get("/api/categories/", headers=ORIGIN).get_json()[0]["id"]
