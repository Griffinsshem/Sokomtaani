"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Heart, Trash2 } from "lucide-react";

import api, { errorMessage } from "../../lib/api";
import { formatPrice } from "../../lib/format";
import { useAuth } from "../../context/AuthContext";
import ConfirmDialog from "../../components/ConfirmDialog";
import ContactDialog from "../../components/ContactDialog";
import Footer from "../../components/Footer";
import ListingCard from "../../components/ListingCard";
import NavBar from "../../components/NavBar";
import RequireAuth from "../../components/RequireAuth";
import { ErrorState, LoadingState } from "../../components/StatusMessage";
import { useToast } from "../../components/Toast";

function FavoritesInner() {
  const { user } = useAuth();
  const toast = useToast();
  const [favorites, setFavorites] = useState([]); // listing objects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contactListing, setContactListing] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [clearing, setClearing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("favorites/");
      setFavorites(res.data.map((f) => f.listing).filter(Boolean));
    } catch (err) {
      if (err.response?.status !== 401) setError(errorMessage(err, "We couldn't load your favorites."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const removeFavorite = async (listing) => {
    const previous = favorites;
    setFavorites((list) => list.filter((l) => l.id !== listing.id));
    try {
      await api.delete(`favorites/${listing.id}`);
      toast.success("Removed from favorites");
    } catch (err) {
      if (err.response?.status !== 404) {
        setFavorites(previous);
        toast.error(errorMessage(err, "Couldn't remove the favorite."));
      }
    }
  };

  const clearAll = async () => {
    setClearing(true);
    try {
      await Promise.allSettled(favorites.map((l) => api.delete(`favorites/${l.id}`)));
      setFavorites([]);
      toast.success("All favorites cleared");
      setConfirmClear(false);
    } finally {
      setClearing(false);
    }
  };

  const summary = useMemo(() => {
    const prices = favorites.map((f) => Number(f.price)).filter(Number.isFinite);
    const total = prices.reduce((a, b) => a + b, 0);
    return {
      count: favorites.length,
      total,
      average: prices.length ? total / prices.length : 0,
      locations: new Set(favorites.map((f) => f.location).filter(Boolean)).size,
    };
  }, [favorites]);

  return (
    <main id="main" className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8 text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100" aria-hidden="true">
            <Heart size={28} className="text-red-600" />
          </span>
          <h1 className="text-4xl font-bold text-green-800">My favorites</h1>
        </div>
        <p className="text-lg text-green-700">Your saved agricultural products</p>
      </div>

      {loading ? (
        <LoadingState label="Loading your favorites…" />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : favorites.length === 0 ? (
        <div className="rounded-lg bg-white py-12 text-center shadow-lg">
          <div className="mx-auto max-w-md">
            <h2 className="mb-2 text-xl font-semibold text-green-800">No favorites yet</h2>
            <p className="mb-6 text-green-800/80">Tap the heart on any product to save it here.</p>
            <Link
              href="/#products"
              className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
            >
              Browse products
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 rounded-lg bg-white p-6 shadow-lg">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div>
                <h2 className="text-xl font-semibold text-green-800">Hello, {user?.name}!</h2>
                <p className="text-green-800/80">
                  You have {favorites.length} favorite {favorites.length === 1 ? "product" : "products"}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700"
                >
                  Clear all
                </button>
                <Link
                  href="/#products"
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-green-700"
                >
                  <Eye size={20} aria-hidden="true" />
                  Browse more
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isFavorite
                onToggleFavorite={removeFavorite}
                onContact={setContactListing}
                actions={
                  <button
                    type="button"
                    onClick={() => removeFavorite(listing)}
                    className="flex items-center gap-1 rounded border border-red-600 px-3 py-2 text-sm text-red-700 transition-colors hover:bg-red-50"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    Remove
                  </button>
                }
              />
            ))}
          </div>

          <section className="mt-8 rounded-lg bg-white p-6 shadow-lg" aria-labelledby="fav-summary">
            <h2 id="fav-summary" className="mb-4 text-lg font-semibold text-green-800">
              Favorites summary
            </h2>
            <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: "Total favorites", value: summary.count, cls: "border-red-200 bg-red-50 text-red-800" },
                { label: "Total value", value: formatPrice(summary.total), cls: "border-green-200 bg-green-50 text-green-800" },
                { label: "Average price", value: formatPrice(summary.average), cls: "border-blue-200 bg-blue-50 text-blue-800" },
                { label: "Locations", value: summary.locations, cls: "border-purple-200 bg-purple-50 text-purple-800" },
              ].map((s) => (
                <div key={s.label} className={`rounded-lg border p-4 text-center ${s.cls}`}>
                  <dd className="text-2xl font-bold">{s.value}</dd>
                  <dt className="text-sm">{s.label}</dt>
                </div>
              ))}
            </dl>
          </section>
        </>
      )}

      <ContactDialog listing={contactListing} onClose={() => setContactListing(null)} />
      <ConfirmDialog
        open={confirmClear}
        title="Clear all favorites?"
        description="This removes every saved product from your favorites."
        confirmLabel="Clear all"
        destructive
        busy={clearing}
        onConfirm={clearAll}
        onCancel={() => setConfirmClear(false)}
      />
    </main>
  );
}

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <RequireAuth>
        <FavoritesInner />
      </RequireAuth>
      <Footer />
    </div>
  );
}
