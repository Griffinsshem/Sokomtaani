"use client";

import { useEffect, useState } from "react";
import { fetchFavorites, removeFavorite } from "../../lib/api";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load favorites
  useEffect(() => {
    async function loadFavorites() {
      try {
        setLoading(true);
        const res = await fetchFavorites();
        setFavorites(res.data);
      } catch (err) {
        console.error("Error loading favorites:", err);
        setError("Failed to load favorites. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    loadFavorites();
  }, []);

  // Remove favorite
  const handleRemove = async (id) => {
    try {
      await removeFavorite(id);
      setFavorites((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error("Error removing favorite:", err);
      alert("Failed to remove favorite. Try again.");
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading favorites...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Favorites</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-500">You don’t have any favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="border rounded-lg p-4 shadow hover:shadow-md bg-white"
            >
              {fav.listing?.image_url && (
                <img
                  src={fav.listing.image_url}
                  alt={fav.listing.title}
                  className="w-full h-40 object-cover rounded"
                />
              )}
              <h2 className="mt-3 font-semibold">{fav.listing?.title}</h2>
              <p className="text-sm text-gray-600">{fav.listing?.description}</p>
              {fav.listing?.price && (
                <p className="mt-1 font-bold text-green-600">
                  Ksh {fav.listing.price}
                </p>
              )}

              <button
                onClick={() => handleRemove(fav.id)}
                className="mt-3 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
