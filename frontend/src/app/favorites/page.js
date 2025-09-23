"use client";

import { useEffect, useState } from "react";
import { fetchFavorites, removeFavorite } from "../../lib/api";
import ListingCard from "../../components/listingCard";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadFavorites() {
      try {
        setLoading(true);
        const res = await fetchFavorites();
        if (!mounted) return;
        setFavorites(res.data ?? []);
      } catch (err) {
        console.error("Error loading favorites:", err);
        if (!mounted) return;
        setError("Failed to load favorites. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadFavorites();
    return () => {
      mounted = false;
    };
  }, []);

  const handleRemove = async (favorite) => {
    const listingId = favorite?.listing?.id;
    if (!listingId) {
      alert("Cannot determine listing id for this favorite.");
      return;
    }

    if (!confirm("Remove this listing from your favorites?")) return;

    try {
      setRemovingId(listingId);
      await removeFavorite(listingId);
      setFavorites((prev) => prev.filter((f) => f.listing?.id !== listingId));
    } catch (err) {
      console.error("Error removing favorite:", err);
      alert("Failed to remove favorite. Try again.");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading favorites...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {error}
        <div className="mt-3">
          <button
            onClick={() => {
              setError("");
              setLoading(true);
              (async () => {
                try {
                  const res = await fetchFavorites();
                  setFavorites(res.data ?? []);
                } catch (e) {
                  setError("Failed to load favorites. Please try again.");
                } finally {
                  setLoading(false);
                }
              })();
            }}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Favorites</h1>

      {favorites.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500">You don’t have any favorites yet.</p>
          <Link href="/homepage" className="text-green-600 underline mt-3 inline-block">
            Browse listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <ListingCard
              key={fav.id}
              listing={fav.listing}
              showRemoveFavorite={true}
              removing={removingId === fav.listing?.id}
              onRemoveFavorite={() => handleRemove(fav)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
