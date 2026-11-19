import axios from "axios";

// NEXT_PUBLIC_API_URL may be set with or without the trailing "/api"
// (e.g. "https://sokomtaani6.onrender.com"). Normalise it so every request
// hits the Flask routes, which all live under /api.
const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://sokomtaani6.onrender.com";
const API_BASE_URL = RAW_API_URL.replace(/\/+$/, "").replace(/(\/api)?$/, "/api");

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // localStorage not available (e.g. SSR)
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export async function fetchCategories() {
  return api.get("/categories/");
}

export async function fetchFavorites() {
  return api.get("/favorites/");
}

export async function removeFavorite(id) {
  return api.delete(`/favorites/${id}`);
}

export default api;