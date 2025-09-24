import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
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

// Keep default export for flexibility
export default api;
