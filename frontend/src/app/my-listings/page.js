"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, CheckCircle, Edit, Eye, MapPin, Plus, RotateCcw, Trash2 } from "lucide-react";

import api, { errorMessage } from "../../lib/api";
import { formatDate, formatPrice } from "../../lib/format";
import { useAuth } from "../../context/AuthContext";
import ConfirmDialog from "../../components/ConfirmDialog";
import Footer from "../../components/Footer";
import ListingImage from "../../components/ListingImage";
import NavBar from "../../components/NavBar";
import RequireAuth from "../../components/RequireAuth";
import { ErrorState, LoadingState } from "../../components/StatusMessage";
import { useToast } from "../../components/Toast";

function MyListingsInner() {
  const { user } = useAuth();
  const toast = useToast();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("listings/my");
      setListings(res.data);
    } catch (err) {
      if (err.response?.status !== 401) setError(errorMessage(err, "We couldn't load your listings."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.delete(`listings/${toDelete.id}`);
      setListings((list) => list.filter((l) => l.id !== toDelete.id));
      toast.success("Listing deleted");
      setToDelete(null);
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't delete the listing."));
    } finally {
      setDeleting(false);
    }
  };

  const toggleSold = async (listing) => {
    setBusyId(listing.id);
    try {
      const res = await api.patch(`listings/${listing.id}`, { is_sold: !listing.is_sold });
      setListings((list) => list.map((l) => (l.id === listing.id ? res.data : l)));
      toast.success(res.data.is_sold ? "Marked as sold" : "Marked as available");
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't update the listing."));
    } finally {
      setBusyId(null);
    }
  };

  const stats = useMemo(() => {
    const prices = listings.map((l) => Number(l.price)).filter(Number.isFinite);
    return {
      total: listings.length,
      available: listings.filter((l) => !l.is_sold).length,
      sold: listings.filter((l) => l.is_sold).length,
      highest: prices.length ? Math.max(...prices) : null,
      lowest: prices.length ? Math.min(...prices) : null,
    };
  }, [listings]);

  return (
    <main id="main" className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold text-green-800">My listings</h1>
        <p className="text-lg text-green-700">Manage your agricultural products</p>
      </div>

      <div className="mb-6 rounded-lg bg-white p-6 shadow-lg">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h2 className="text-xl font-semibold text-green-800">Welcome back, {user?.name}!</h2>
            <p className="text-green-800/80">
              {stats.available} available · {stats.sold} sold
            </p>
          </div>
          <Link
            href="/listing-form"
            className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
          >
            <Plus size={20} aria-hidden="true" />
            Add new listing
          </Link>
        </div>
      </div>

      {loading ? (
        <LoadingState label="Loading your listings…" />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : listings.length === 0 ? (
        <div className="rounded-lg bg-white py-12 text-center shadow-lg">
          <div className="mx-auto max-w-md">
            <h2 className="mb-2 text-xl font-semibold text-green-800">No listings yet</h2>
            <p className="mb-6 text-green-800/80">Start by creating your first product listing!</p>
            <Link
              href="/listing-form"
              className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
            >
              Create your first listing
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <article
              key={listing.id}
              className="overflow-hidden rounded-lg border border-green-100 bg-white shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="relative h-48">
                <ListingImage src={listing.image_url} alt={listing.title} grayscale={listing.is_sold} />
                <span
                  className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                    listing.is_sold ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {listing.is_sold ? "SOLD" : "AVAILABLE"}
                </span>
              </div>

              <div className="p-6">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="min-w-0 flex-1 truncate text-lg font-semibold text-green-800">{listing.title}</h3>
                  <span className="whitespace-nowrap text-xl font-bold text-green-700">
                    {formatPrice(listing.price)}
                  </span>
                </div>
                {listing.description && (
                  <p className="mb-4 line-clamp-2 text-sm text-gray-700">{listing.description}</p>
                )}
                <p className="mb-1 flex items-center gap-1 text-sm text-gray-600">
                  <Calendar size={16} aria-hidden="true" /> Posted {formatDate(listing.created_at)}
                </p>
                <p className="mb-4 flex items-center gap-1 text-sm text-gray-600">
                  <MapPin size={16} aria-hidden="true" /> {listing.location}
                </p>

                <div className="flex flex-wrap justify-between gap-2 border-t border-green-100 pt-4 text-sm">
                  <Link
                    href={`/listings/${listing.id}`}
                    className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
                  >
                    <Eye size={16} aria-hidden="true" /> View
                  </Link>
                  <Link
                    href={`/listing-form?edit=${listing.id}`}
                    className="flex items-center gap-1 text-blue-700 hover:text-blue-900"
                  >
                    <Edit size={16} aria-hidden="true" /> Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleSold(listing)}
                    disabled={busyId === listing.id}
                    className="flex items-center gap-1 text-green-700 hover:text-green-900 disabled:opacity-50"
                  >
                    {listing.is_sold ? (
                      <>
                        <RotateCcw size={16} aria-hidden="true" /> Mark available
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} aria-hidden="true" /> Mark sold
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setToDelete(listing)}
                    className="flex items-center gap-1 text-red-700 hover:text-red-900"
                  >
                    <Trash2 size={16} aria-hidden="true" /> Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {listings.length > 0 && (
        <section className="mt-8 rounded-lg bg-white p-6 shadow-lg" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="mb-4 text-lg font-semibold text-green-800">
            Listing statistics
          </h2>
          <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Total listings", value: stats.total, cls: "bg-green-50 text-green-800" },
              { label: "Sold", value: stats.sold, cls: "bg-purple-50 text-purple-800" },
              { label: "Highest price", value: formatPrice(stats.highest), cls: "bg-blue-50 text-blue-800" },
              { label: "Lowest price", value: formatPrice(stats.lowest), cls: "bg-yellow-50 text-yellow-900" },
            ].map((s) => (
              <div key={s.label} className={`rounded-lg p-4 text-center ${s.cls}`}>
                <dd className="text-2xl font-bold">{s.value}</dd>
                <dt className="text-sm">{s.label}</dt>
              </div>
            ))}
          </dl>
        </section>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this listing?"
        description={toDelete ? `"${toDelete.title}" will be permanently removed.` : ""}
        confirmLabel="Delete"
        destructive
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </main>
  );
}

export default function MyListingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <RequireAuth>
        <MyListingsInner />
      </RequireAuth>
      <Footer />
    </div>
  );
}
