// src/app/ClientWrapper.jsx
"use client";

import { useState, useEffect } from "react";
import { AuthProvider } from "../context/AuthContext";

export default function ClientWrapper({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only render after hydration to avoid SSR mismatch
  return <AuthProvider>{isClient ? children : null}</AuthProvider>;
}
