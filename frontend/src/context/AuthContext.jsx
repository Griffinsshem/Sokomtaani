"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Create Context
const AuthContext = createContext();

// Custom Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Provider Component
export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Load user from localStorage on first render
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Failed to load user from storage:", err);
    }
    setLoading(false);
  }, []);

  // -----------------------------
  // Login
  // -----------------------------
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      const { user, access_token } = response.data;

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", access_token);

      router.push("/homepage");
    } catch (error) {
      // Fix empty {} error: safely check for error.response
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Unknown login error";
      console.error("Login error:", message);
      throw new Error(message); // Throw readable error
    }
  };

  // -----------------------------
  // Signup
  // -----------------------------
  const signup = async (formData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/signup`,
        formData
      );
      const { user, access_token } = response.data;

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", access_token);

      router.push("/homepage");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Unknown signup error";
      console.error("Signup error:", message);
      throw new Error(message);
    }
  };

  // -----------------------------
  // Logout
  // -----------------------------
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  // -----------------------------
  // Forgot Password
  // -----------------------------
  const forgotPassword = async (email) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Unknown forgot password error";
      console.error("Forgot password error:", message);
      throw new Error(message);
    }
  };

  // Context Value
  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    forgotPassword,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
