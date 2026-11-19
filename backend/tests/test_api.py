from conftest import ORIGIN, PASSWORD, bearer, login, signup


def make_listing(client, token, cat_id, **overrides):
    payload = {
        "title": "Sukuma wiki", "description": "Fresh", "price": 50.0,
        "image_url": "https://example.com/a.jpg", "category_id": cat_id, **overrides,
    }
    return client.post("/api/listings/", headers=bearer(token), json=payload)


# ---------------------------------------------------------------- auth
def test_signup_validation(client):
    assert signup(client, "weak@x.co", "0711111111", "password").status_code == 400
    assert signup(client, "not-an-email", "0711111111").status_code == 400
    assert signup(client, "p@x.co", "abc").status_code == 400


def test_signup_starts_a_session(client):
    r = signup(client, "new@x.co", "0711111111")
    assert r.status_code == 201
    body = r.get_json()
    assert body["token"] and "password_hash" not in str(body)
    cookies = r.headers.getlist("Set-Cookie")
    assert any(c.startswith("access_token_cookie=") and "HttpOnly" in c for c in cookies)
    assert any(c.startswith("csrf_access_token=") for c in cookies)
    # The cookie alone authenticates the next request.
    me = client.get("/api/auth/me", headers=ORIGIN)
    assert me.status_code == 200 and me.get_json()["user"]["email"] == "new@x.co"


def test_duplicate_email_case_insensitive(client):
    signup(client, "dup@x.co", "0711111111")
    assert signup(client, "DUP@x.co", "0799999999").status_code == 400


def test_login_and_enumeration(client, users):
    assert login(client, "Alice@X.co").status_code == 200
    bad = login(client, "alice@x.co", "Nope!123A")
    unknown = login(client, "ghost@x.co")
    assert bad.status_code == unknown.status_code == 401
    assert bad.get_json() == unknown.get_json()


def test_me_requires_auth(client):
    assert client.get("/api/auth/me", headers=ORIGIN).status_code == 401


def test_cookie_writes_require_csrf(client, users, category_id):
    login(client, "alice@x.co")
    payload = {"title": "Eggs", "price": 10, "category_id": category_id}
    # Cookie present but no CSRF header -> rejected.
    assert client.post("/api/listings/", headers=ORIGIN, json=payload).status_code == 401
    csrf = client.get_cookie("csrf_access_token").value
    ok = client.post("/api/listings/", headers={**ORIGIN, "X-CSRF-TOKEN": csrf}, json=payload)
    assert ok.status_code == 201


def test_logout_revokes_and_clears(client, users):
    token = users["alice"]
    assert client.post("/api/auth/logout", headers=bearer(token)).status_code == 200
    assert client.get("/api/listings/my", headers=bearer(token)).status_code == 401
    # Logging out without a session still succeeds.
    assert client.post("/api/auth/logout", headers=ORIGIN).status_code == 200


def test_bad_token_is_401(client):
    r = client.get("/api/listings/my", headers=bearer("abc.def.ghi"))
    assert r.status_code == 401


def test_change_password(client, users):
    h = bearer(users["alice"])
    r = client.post("/api/auth/change-password", headers=h,
                    json={"current_password": "wrong", "new_password": "N3w!Passw0rd"})
    assert r.status_code == 400
    r = client.post("/api/auth/change-password", headers=h,
                    json={"current_password": PASSWORD, "new_password": "weak"})
    assert r.status_code == 400
    r = client.post("/api/auth/change-password", headers=h,
                    json={"current_password": PASSWORD, "new_password": "N3w!Passw0rd"})
    assert r.status_code == 200 and r.get_json()["token"]
    assert client.get("/api/listings/my", headers=h).status_code == 401  # old token revoked
    assert login(client, "alice@x.co", "N3w!Passw0rd").status_code == 200


def test_forgot_and_reset_password(client, users, app, monkeypatch):
    sent = []
    monkeypatch.setattr("app.routes.auth_routes.send_email",
                        lambda to, subject, text: sent.append((to, text)) or True)

    unknown = client.post("/api/auth/forgot-password", headers=ORIGIN, json={"email": "ghost@x.co"})
    known = client.post("/api/auth/forgot-password", headers=ORIGIN, json={"email": "alice@x.co"})
    assert unknown.status_code == known.status_code == 200
    assert unknown.get_json() == known.get_json()  # no account enumeration
    assert len(sent) == 1 and sent[0][0] == "alice@x.co"

    token = sent[0][1].split("token=")[1].split()[0]
    bad = client.post("/api/auth/reset-password", headers=ORIGIN, json={"token": "x", "password": "N3w!Passw0rd"})
    assert bad.status_code == 400
    ok = client.post("/api/auth/reset-password", headers=ORIGIN, json={"token": token, "password": "N3w!Passw0rd"})
    assert ok.status_code == 200
    # Link is single-use.
    again = client.post("/api/auth/reset-password", headers=ORIGIN, json={"token": token, "password": "An0ther!Pass"})
    assert again.status_code == 400
    assert login(client, "alice@x.co", "N3w!Passw0rd").status_code == 200


# ---------------------------------------------------------------- listings
def test_create_listing_validation(client, users, category_id):
    t = users["alice"]
    r = make_listing(client, t, category_id)
    assert r.status_code == 201
    assert r.get_json()["contact_email"] == "alice@x.co"
    assert r.get_json()["is_sold"] is False
    for bad in ({"price": -5}, {"price": "abc"}, {"category_id": 9999},
                {"image_url": "javascript:alert(1)"}, {"title": "x" * 151}):
        assert make_listing(client, t, category_id, **bad).status_code == 400
    assert client.post("/api/listings/", headers=ORIGIN, json={}).status_code == 401


def test_listing_detail(client, users, category_id):
    lid = make_listing(client, users["alice"], category_id).get_json()["id"]
    r = client.get(f"/api/listings/{lid}", headers=ORIGIN)
    assert r.status_code == 200
    body = r.get_json()
    assert body["seller_name"] == "Test User" and body["category_name"]
    assert client.get("/api/listings/99999", headers=ORIGIN).status_code == 404


def test_update_listing_owner_only(client, users, category_id):
    lid = make_listing(client, users["alice"], category_id).get_json()["id"]
    assert client.patch(f"/api/listings/{lid}", headers=ORIGIN, json={"price": 1}).status_code == 401
    assert client.patch(f"/api/listings/{lid}", headers=bearer(users["bob"]), json={"price": 1}).status_code == 403
    r = client.patch(f"/api/listings/{lid}", headers=bearer(users["alice"]),
                     json={"title": "Kale", "price": 75, "is_sold": True})
    assert r.status_code == 200
    body = r.get_json()
    assert body["title"] == "Kale" and body["price"] == 75 and body["is_sold"] is True
    assert client.patch(f"/api/listings/{lid}", headers=bearer(users["alice"]), json={"price": -1}).status_code == 400
    assert client.patch(f"/api/listings/{lid}", headers=bearer(users["alice"]), json={"is_sold": "yes"}).status_code == 400


def test_delete_owner_only(client, users, category_id):
    lid = make_listing(client, users["alice"], category_id).get_json()["id"]
    assert client.delete(f"/api/listings/{lid}", headers=ORIGIN).status_code == 401
    assert client.delete(f"/api/listings/{lid}", headers=bearer(users["bob"])).status_code == 403
    assert client.delete(f"/api/listings/{lid}", headers=bearer(users["alice"])).status_code == 200


def test_listing_search_filter_sort_paginate(client, users, category_id):
    t = users["alice"]
    cats = client.get("/api/categories/", headers=ORIGIN).get_json()
    other_cat = cats[1]["id"]
    make_listing(client, t, category_id, title="Tomatoes", price=100)
    make_listing(client, t, category_id, title="Onions", price=30)
    sold_id = make_listing(client, t, other_cat, title="Honey jar", price=500).get_json()["id"]
    client.patch(f"/api/listings/{sold_id}", headers=bearer(t), json={"is_sold": True})

    legacy = client.get("/api/listings/", headers=ORIGIN).get_json()
    assert isinstance(legacy, list) and len(legacy) == 3

    page = client.get("/api/listings/?page=1&per_page=2", headers=ORIGIN).get_json()
    assert page["total"] == 3 and page["pages"] == 2 and len(page["items"]) == 2

    q = client.get("/api/listings/?page=1&q=tomat", headers=ORIGIN).get_json()
    assert [i["title"] for i in q["items"]] == ["Tomatoes"]

    c = client.get(f"/api/listings/?page=1&category_id={other_cat}", headers=ORIGIN).get_json()
    assert [i["title"] for i in c["items"]] == ["Honey jar"]

    s = client.get("/api/listings/?page=1&sort=price_asc", headers=ORIGIN).get_json()
    assert [i["price"] for i in s["items"]] == [30, 100, 500]

    a = client.get("/api/listings/?page=1&available=1", headers=ORIGIN).get_json()
    assert a["total"] == 2

    big = client.get("/api/listings/?page=1&per_page=1000", headers=ORIGIN).get_json()
    assert big["per_page"] == 50


# ---------------------------------------------------------------- favorites
def test_favorites(client, users, category_id):
    lid = make_listing(client, users["alice"], category_id).get_json()["id"]
    hb = bearer(users["bob"])
    assert client.post("/api/favorites/", headers=hb, json={"listing_id": lid}).status_code == 201
    assert client.post("/api/favorites/", headers=hb, json={"listing_id": lid}).status_code == 400
    r = client.post("/api/favorites/", headers=hb, json={"listing_id": 424242})
    assert r.status_code == 404 and "details" not in r.get_json()
    favs = client.get("/api/favorites/", headers=hb).get_json()
    assert len(favs) == 1
    item = favs[0]["listing"]
    assert item["contact_phone"] == "0712345678" and item["location"] == "Nairobi"
    assert client.delete(f"/api/favorites/{lid}", headers=hb).status_code == 200
    assert client.get("/api/favorites/", headers=hb).get_json() == []


# ---------------------------------------------------------------- categories
def test_categories_admin_only(client, users):
    assert len(client.get("/api/categories/", headers=ORIGIN).get_json()) == 16
    assert client.post("/api/categories/", headers=bearer(users["alice"]), json={"name": "Spam"}).status_code == 403
    assert client.post("/api/categories/", headers=bearer(users["admin"]), json={"name": "Mushrooms"}).status_code == 201


# ---------------------------------------------------------------- platform
def test_cors_and_headers(client):
    r = client.options("/api/auth/login", headers={
        **ORIGIN, "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type,authorization,x-csrf-token"})
    assert r.status_code == 200 and r.headers["Access-Control-Allow-Origin"] == ORIGIN["Origin"]
    assert client.get("/api/listings/", headers={"Origin": "https://evil.example"}).headers.get(
        "Access-Control-Allow-Origin") is None
    r = client.get("/api/listings/", headers=ORIGIN)
    assert len(r.headers.getlist("Access-Control-Allow-Origin")) == 1
    for h in ("X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Content-Security-Policy"):
        assert h in r.headers
    nf = client.get("/api/nope", headers=ORIGIN)
    assert nf.status_code == 404 and nf.is_json


def test_rate_limit_per_client_ip(client, users):
    from app.extensions import limiter
    limiter.reset()

    def attempt(headers):
        return client.post("/api/auth/login", headers={**ORIGIN, **headers},
                           json={"email": "bob@x.co", "password": "Wrong!123A"}).status_code

    proxy = {"X-Proxy-Secret": "test-proxy-secret"}
    codes = [attempt({**proxy, "X-Client-IP": "41.90.1.1"}) for _ in range(12)]
    assert 429 in codes
    # A different real client behind the same proxy is not affected...
    assert attempt({**proxy, "X-Client-IP": "41.90.2.2"}) == 401
    # ...and a forged X-Client-IP without the secret is ignored (uses remote_addr).
    limiter.reset()
    forged = [attempt({"X-Client-IP": f"10.0.0.{i}"}) for i in range(12)]
    assert 429 in forged


def test_production_requires_secrets(monkeypatch):
    import importlib

    import pytest

    monkeypatch.setenv("RENDER", "true")
    monkeypatch.delenv("SECRET_KEY", raising=False)
    monkeypatch.delenv("JWT_SECRET_KEY", raising=False)
    import app.config as config_module
    importlib.reload(config_module)
    from app import create_app
    with pytest.raises(RuntimeError):
        create_app(config_module.ProductionConfig)
