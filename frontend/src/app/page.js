"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingCart, Users, Truck, Leaf } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 overflow-hidden flex items-center justify-center">
      {/* Background Blobs */}
      <motion.div 
        animate={{ y: [0, 20, 0] }} 
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-120px] left-[-120px] w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      />
      <motion.div 
        animate={{ y: [0, -20, 0] }} 
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-150px] right-[-150px] w-[28rem] h-[28rem] bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      />

      {/* Hero + How It Works Cards */}
      <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-7xl px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white/70 backdrop-blur-2xl shadow-2xl border border-white/30 rounded-3xl p-12 flex flex-col items-center w-full max-w-5xl relative"
        >
          {/* Top Right Links */}
          <div className="absolute top-6 right-6 flex gap-4">
            <Link href="/signup" className="text-green-700 font-semibold hover:text-green-800">
              Sign Up
            </Link>
            <Link href="/login" className="text-green-700 font-semibold hover:text-green-800">
              Login
            </Link>
          </div>

          {/* Hero Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-5 bg-green-100 rounded-full shadow-lg">
              <ShoppingCart className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Hero Text */}
          <h1 className="text-5xl font-extrabold text-green-700 mb-4 text-center">
            Sokomtaani Marketplace
          </h1>
          <p className="text-lg text-gray-700 text-center mb-10">
            Connecting farmers directly to buyers and wholesalers. Fresh produce, fair prices, seamless transactions.
          </p>

          {/* How It Works Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-md hover:shadow-xl transition text-center"
            >
              <Leaf className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Farmers</h3>
              <p className="text-gray-600 text-sm">
                List fresh produce directly to the market and reach buyers without intermediaries.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-md hover:shadow-xl transition text-center"
            >
              <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Buyers</h3>
              <p className="text-gray-600 text-sm">
                Find fresh produce at fair prices directly from trusted farmers and local suppliers.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-md hover:shadow-xl transition text-center"
            >
              <Truck className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Wholesalers</h3>
              <p className="text-gray-600 text-sm">
                Source bulk produce efficiently and connect with multiple farmers in one place.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 text-gray-500 text-sm w-full text-center">
        © {new Date().getFullYear()} Sokomtaani. All Rights Reserved.
      </footer>
    </div>
  );
}
