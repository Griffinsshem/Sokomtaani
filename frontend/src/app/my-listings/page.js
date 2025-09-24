"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ListingCard from "@/components/ListingCard";
import NavBar from "@/components/NavBar"; 
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function MyListingsPage() {
  const { token } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch current user's listings
  const fetchListings = async () => {
    try {
      const res = await api.get("/listings/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(res.data);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchListings();
  }, [token]);

 
  const markSold = async (id) => {
    try {
      await api.patch(`/listings/${id}/sold`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, is_sold: true } : l))
      );
    } catch (err) {
      console.error("Error marking sold:", err);
    }
  };


  const deleteListing = async (id) => {
    try {
      await api.delete(`/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error("Error deleting listing:", err);
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading your listings...</p>;

  if (!token) {
    return (
      <p className="text-center mt-10">
        Please log in to view your listings.
      </p>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 overflow-hidden">
      {/* Animated Background Blobs */}
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

      {/* Navbar */}
      <NavBar />

      {/* Content */}
      <main className="relative z-10 p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-green-700">My Listings</h1>
        {listings.length === 0 ? (
          <p>You have not posted any listings yet.</p>
        ) : (
          listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              showControls={true}
              onMarkSold={() => markSold(listing.id)}
              onDelete={() => deleteListing(listing.id)}
            />
          ))
        )}
      </main>
    </div>
  );
}
