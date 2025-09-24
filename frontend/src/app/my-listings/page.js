"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";
import ListingCard from "@/components/ListingCard";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function MyListingsPage() {
  const { user, token } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch user's listings
  useEffect(() => {
    const load = async () => {
      try {
        if (token) {
          const res = await api.get("/listings/my");
          setListings(res.data);
        } else if (user?.email) {
          const res = await api.get(`/listings?email=${encodeURIComponent(user.email)}`);
          setListings(res.data);
        } else {
          setListings([]);
        }
      } catch (err) {
        console.error("Error fetching listings:", err);
        setMessage("❌ Failed to fetch your listings.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token, user]);

  // Mark listing as sold
  const markSold = async (id) => {
    try {
      await api.patch(
        `/listings/${id}/sold`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, is_sold: true } : l))
      );
      setMessage("✅ Listing marked as sold!");
    } catch (err) {
      console.error("Error marking sold:", err);
      setMessage("❌ Failed to mark listing as sold.");
    }
  };

  // Delete listing
  const deleteListing = async (id) => {
    try {
      await api.delete(`/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings((prev) => prev.filter((l) => l.id !== id));
      setMessage("✅ Listing deleted successfully!");
    } catch (err) {
      console.error("Error deleting listing:", err);
      setMessage("❌ Failed to delete listing.");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-700">Loading your listings...</p>
    );

  if (!token && !user?.email)
    return (
      <p className="text-center mt-10 text-gray-700">
        Please log in to view your listings.
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <NavBar />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          My Listings
        </h1>
        {message && (
          <p className="mb-4 font-medium text-center text-gray-800">{message}</p>
        )}
        {listings.length === 0 ? (
          <p className="text-center text-gray-700">
            You have no listings yet. Post one to get started!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listings.map((listing) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ListingCard listing={listing}>
                  {!listing.is_sold && (
                    <button
                      onClick={() => markSold(listing.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600 transition"
                    >
                      Mark Sold
                    </button>
                  )}
                  <button
                    onClick={() => deleteListing(listing.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </ListingCard>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
