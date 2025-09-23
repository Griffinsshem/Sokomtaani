"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col items-center justify-center overflow-hidden">
      {/* Floating Background Blobs */}
      <motion.div 
        animate={{ y: [0, 20, 0] }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-120px] left-[-120px] w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      ></motion.div>
      <motion.div 
        animate={{ y: [0, -20, 0] }} 
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-150px] right-[-150px] w-[28rem] h-[28rem] bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      ></motion.div>

      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 bg-white/70 backdrop-blur-2xl shadow-2xl border border-white/30 rounded-3xl p-12 text-center max-w-lg w-full"
      >
        {/* Hero Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-5 bg-green-100 rounded-full shadow-lg">
            <ShoppingCart className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-5xl font-extrabold text-green-700 mb-4 tracking-tight">
          FreshMarket
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10">
          Buy, Sell, and Connect with Ease. Fresh deals at your fingertips.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-6 justify-center flex-wrap">
          <Link href="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold shadow-lg hover:shadow-2xl transition"
            >
              Get Started
            </motion.button>
          </Link>
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-xl border-2 border-green-600 text-green-700 font-semibold bg-white hover:bg-green-50 transition shadow-sm"
            >
              Login
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} FreshMarket. All Rights Reserved.
      </footer>
    </div>
  );
}
