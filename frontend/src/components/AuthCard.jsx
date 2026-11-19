"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

/** Shared layout for login / signup / password pages. */
export default function AuthCard({ title, children, footer }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-100 px-4 py-10">
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[-120px] top-[-120px] h-96 w-96 rounded-full bg-green-300 opacity-30 mix-blend-multiply blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-150px] right-[-150px] h-[28rem] w-[28rem] rounded-full bg-yellow-200 opacity-30 mix-blend-multiply blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/30 bg-white/80 p-8 shadow-2xl backdrop-blur-2xl sm:p-12"
      >
        <Link href="/" className="mb-6 block text-center text-sm font-semibold text-green-700 hover:underline">
          ← SokoMtaani home
        </Link>
        <h1 className="mb-6 text-center text-3xl font-bold text-green-700">{title}</h1>
        {children}
        {footer && <div className="mt-6 space-y-2 text-center text-sm text-gray-700">{footer}</div>}
      </motion.div>
    </main>
  );
}
