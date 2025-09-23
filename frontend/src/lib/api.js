import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("token")) {
    req.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }
  return req;
});

// Handle errors
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

// Categories
export const fetchCategories = () => API.get("/categories");

// Favorites
export const fetchFavorites = () => API.get("/favorites");
export const addFavorite = (listing_id) => API.post("/favorites", { listing_id });
export const removeFavorite = (id) => API.delete(`/favorites/${id}`);
