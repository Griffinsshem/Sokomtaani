import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  // Do not set Content-Type globally; axios/fetch will set correct boundaries for FormData
});

// Attach JWT token if available
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

// ✅ Categories
export async function fetchCategories() {
  return api.get("/categories");
}

// ✅ Favorites
export async function fetchFavorites() {
  return api.get("/favorites");
}

// ✅ NEW: remove favorite
export async function removeFavorite(id) {
  return api.delete(`/favorites/${id}`);
}

// Keep default export for flexibility
export default api;
