"use client";

import React, { useState, useEffect } from "react";
import api from "../../utils/api";

export default function HomePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        console.log(" Fetching listings from:", api.defaults.baseURL + "listings/");
        const res = await api.get("listings/");
        console.log(" Listings fetched successfully:", res.data.length, "items");
        setListings(res.data);
      } catch (error) {
        console.error(" Error fetching listings:", error);
        console.error("Error details:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading agricultural products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-6">
          Fresh Agricultural Products
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-xl font-semibold text-green-700">{listing.title}</h3>
              <p className="text-gray-600 mt-2">{listing.description}</p>
              <p className="text-green-600 font-bold mt-2">KSh {listing.price}</p>
              <p className="text-sm text-gray-500 mt-2">{listing.location}</p>
            </div>
          ))}
        </div>

        {listings.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No agricultural products available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
