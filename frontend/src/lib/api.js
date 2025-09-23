const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

function authHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchFavorites() {
  const res = await fetch(`${API_BASE}/favorites/`, { method: "GET", headers: authHeaders() });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to fetch favorites");
  }
  return res.json();
}

export async function removeFavorite(listingId) {
  const res = await fetch(`${API_BASE}/favorites/${listingId}`, { method: "DELETE", headers: authHeaders() });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to remove favorite");
  }
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories/`, { method: "GET", headers: authHeaders() });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to fetch categories");
  }
  return res.json();
}

export async function fetchListings({ category_id = null, search = "", page = 1, per_page = 50 } = {}) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (category_id) params.append("category_id", category_id);
  if (page) params.append("page", page);
  if (per_page) params.append("per_page", per_page);
  const url = `${API_BASE}/listings/?${params.toString()}`;
  const res = await fetch(url, { method: "GET", headers: authHeaders() });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to fetch listings");
  }
  return res.json();
}
