"use client";

import React from "react";
import { MotionConfig } from "framer-motion";

import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "./Toast";

export default function Providers({ children }) {
  return (
    // Respect the OS "reduce motion" setting for every framer-motion animation.
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <AuthProvider>{children}</AuthProvider>
      </ToastProvider>
    </MotionConfig>
  );
}
