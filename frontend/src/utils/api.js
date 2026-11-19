import axios from 'axios';


// NEXT_PUBLIC_API_URL may be set with or without the trailing "/api"
// (e.g. "https://sokomtaani6.onrender.com"). Normalise it so every request
// hits the Flask routes, which all live under /api.
const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://sokomtaani6.onrender.com";
const API_BASE_URL = RAW_API_URL.replace(/\/+$/, "").replace(/(\/api)?$/, "/api");

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;