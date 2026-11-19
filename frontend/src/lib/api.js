import axios from "axios";

/**
 * The single browser API client.
 *
 * Requests go to "/api" on this same site; middleware proxies them to the
 * Flask API. The session lives in an HttpOnly cookie (not readable by JS),
 * and writes carry the CSRF token from the readable csrf_access_token cookie.
 */
const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 70000, // the free API host can take ~1 minute to wake up
  xsrfCookieName: "csrf_access_token",
  xsrfHeaderName: "X-CSRF-TOKEN",
  withXSRFToken: true,
});

const SESSION_ENDPOINTS = ["auth/login", "auth/signup", "auth/me", "auth/logout"];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    if (status === 401 && !SESSION_ENDPOINTS.some((p) => url.includes(p))) {
      // Session expired or revoked: let AuthContext log the user out.
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth:expired"));
      }
    }
    return Promise.reject(error);
  }
);

/** Human-readable message for an API error. */
export function errorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (!error) return fallback;
  if (error.code === "ECONNABORTED") {
    return "The server took too long to respond. It may be waking up — please try again.";
  }
  if (!error.response) {
    return "Can't reach the server right now. Check your connection and try again.";
  }
  if (error.response.status === 429) {
    return "Too many attempts. Please wait a minute and try again.";
  }
  const data = error.response.data || {};
  return data.message || data.error || fallback;
}

export default api;
