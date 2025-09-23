// src/pages/HomePage.jsx
"use client";

import React, { useEffect, useState } from "react";
import ListingCard from "../../components/ListingCard";
import api from "../../lib/api";
import { motion } from "framer-motion";

const HomePage = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get("/listings");
        setListings(res.data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 overflow-hidden">
      {/* Animated background blobs */}
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

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Page Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-green-700 mb-12 text-center drop-shadow-md">
          Sokomtaani Marketplace
        </h1>

        {/* Listings */}
        {listings.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">
            No listings available at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <ListingCard listing={listing} />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
