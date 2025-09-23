import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState("");

    useEffect(() => {
        try {
            const saved = localStorage.getItem("token");
            if (saved) setToken(saved);
        } catch { }
    }, []);

    const login = (newToken) => {
        setToken(newToken || "");
        try {
            if (newToken) localStorage.setItem("token", newToken);
            else localStorage.removeItem("token");
        } catch { }
    };

    const logout = () => login("");

    const value = useMemo(() => ({ token, setToken: login, login, logout }), [token]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}


=======
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth Provider
export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { user, access_token } = response.data;

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", access_token);

      router.push("/homepage");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
  };

  // Signup
  const signup = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, formData);
      const { user, access_token } = response.data;

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", access_token);

      router.push("/homepage");
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      throw error;
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
    } catch (error) {
      console.error("Forgot password error:", error.response?.data || error.message);
      throw error;
    }
  };

  // Context Value
  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    forgotPassword, // <-- added for forgot password
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
