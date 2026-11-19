"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import api from "../lib/api";
import { safeNextPath } from "../lib/format";

const AuthContext = createContext(null);
const USER_CACHE_KEY = "user";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function readCachedUser() {
  try {
    const raw = localStorage.getItem(USER_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCachedUser(user) {
  try {
    if (user) {
      // Only non-sensitive profile fields; the session itself is an HttpOnly cookie.
      const { id, name, email, phone, location } = user;
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify({ id, name, email, phone, location }));
    } else {
      localStorage.removeItem(USER_CACHE_KEY);
    }
    localStorage.removeItem("token"); // legacy: tokens are no longer stored in JS
  } catch {
    // storage unavailable (private mode etc.)
  }
}

function hasSessionHint() {
  // The CSRF cookie is readable and exists exactly while a session cookie does.
  return typeof document !== "undefined" && document.cookie.includes("csrf_access_token=");
}

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  // `ready` = we know whether the visitor is logged in.
  const [ready, setReady] = useState(false);

  const clearSession = useCallback(() => {
    setUser(null);
    writeCachedUser(null);
  }, []);

  // Restore + verify the session on first load.
  useEffect(() => {
    const cached = readCachedUser();
    if (!hasSessionHint()) {
      writeCachedUser(null);
      setReady(true);
      return;
    }
    if (cached) {
      setUser(cached); // optimistic: instant UI while we verify
      setReady(true);
    }
    let active = true;
    api
      .get("auth/me")
      .then((res) => {
        if (!active) return;
        setUser(res.data.user);
        writeCachedUser(res.data.user);
      })
      .catch((error) => {
        if (!active) return;
        if (error.response?.status === 401) {
          clearSession();
          api.post("auth/logout").catch(() => {}); // clear the stale cookie
        }
        // Network errors: keep the cached user; the API may just be waking up.
      })
      .finally(() => active && setReady(true));
    return () => {
      active = false;
    };
  }, [clearSession]);

  // Any 401 from a protected call means the session ended.
  useEffect(() => {
    const onExpired = () => clearSession();
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, [clearSession]);

  const startSession = useCallback(
    (sessionUser, next) => {
      setUser(sessionUser);
      writeCachedUser(sessionUser);
      setReady(true);
      router.push(safeNextPath(next, "/"));
      router.refresh();
    },
    [router]
  );

  const login = useCallback(
    async (email, password, next) => {
      const res = await api.post("auth/login", { email, password });
      startSession(res.data.user, next);
    },
    [startSession]
  );

  const signup = useCallback(
    async (formData, next) => {
      // The API now signs new users in immediately.
      const res = await api.post("auth/signup", formData);
      startSession(res.data.user, next);
    },
    [startSession]
  );

  const logout = useCallback(async () => {
    try {
      await api.post("auth/logout");
    } catch {
      // still log out locally
    }
    clearSession();
    router.push("/login");
    router.refresh();
  }, [clearSession, router]);

  const forgotPassword = useCallback(async (email) => {
    const res = await api.post("auth/forgot-password", { email });
    return res.data.message;
  }, []);

  const resetPassword = useCallback(async (token, password) => {
    const res = await api.post("auth/reset-password", { token, password });
    return res.data.message;
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    const res = await api.post("auth/change-password", {
      current_password: currentPassword,
      new_password: newPassword,
    });
    setUser(res.data.user);
    writeCachedUser(res.data.user);
    return res.data.message;
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      // kept for backwards compatibility with existing components
      loading: !ready,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      forgotPassword,
      resetPassword,
      changePassword,
    }),
    [user, ready, login, signup, logout, forgotPassword, resetPassword, changePassword]
  );

  // Always render children (pages are server-rendered; no blank screen).
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
