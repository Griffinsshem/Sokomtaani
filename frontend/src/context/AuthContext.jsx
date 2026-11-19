"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../utils/api";

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

  // Load user from localStorage on first render
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Failed to load user from storage:", err);
    }
    setLoading(false);
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      console.log("Attempting login...");
      
      const response = await api.post("auth/login", {
        email,
        password,
      });
      
      console.log("Login response received:", response.data);
      
      const { user, token } = response.data;

      // Set user state
      setUser(user);
      
      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      console.log("Login successful, redirecting to homepage");
      router.push("/"); // Redirect to main homepage instead of /homepage
    } catch (error) {
      console.error("Full login error:", error);
      console.error("Error response:", error.response?.data);
      throw error;
    }
  };

  // Signup
  const signup = async (formData) => {
    try {
      const response = await api.post("auth/signup", formData);
      const { user, token } = response.data;

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      router.push("/"); // Redirect to main homepage
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
      await api.post("auth/forgot-password", { email });
    } catch (error) {
      console.error(
        "Forgot password error:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

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
