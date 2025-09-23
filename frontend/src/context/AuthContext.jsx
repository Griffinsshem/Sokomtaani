"use client";

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


