// src/pages/HomePage.jsx
"use client";

import React, { useEffect, useState } from "react";
import ListingCard from "../../components/ListingCard";
import Navbar from "../../components/NavBar";
import api from "../../lib/api";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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


  const filteredListings = listings.filter((listing) =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* background blobs */}
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
        <h1 className="text-4xl sm:text-5xl font-extrabold text-green-700 mb-6 text-center drop-shadow-md">
          Sokomtaani Marketplace
        </h1>

        {/* Search Bar */}
        <div className="flex justify-center mb-8 relative w-full sm:w-1/2 mx-auto">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search Produce by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm text-black placeholder-gray-500"
          />
        </div>

        {/* Listings */}
        {filteredListings.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">
            No Products Found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((listing, index) => (
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
