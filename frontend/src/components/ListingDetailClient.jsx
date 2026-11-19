"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Heart, Mail, MapPin, MessageCircle, Phone, Share2, Tag, User } from "lucide-react";

import api, { errorMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import useFavorites from "../hooks/useFavorites";
import { formatDate, formatPrice, mailtoHref, telHref, whatsappHref } from "../lib/format";
import Footer from "./Footer";
import ListingImage from "./ListingImage";
import NavBar from "./NavBar";
import { ErrorState, LoadingState } from "./StatusMessage";
import { useToast } from "./Toast";

export default function ListingDetailClient({ id, initialListing }) {
  const { user } = useAuth();
  const toast = useToast();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const [listing, setListing] = useState(initialListing);
  const [loading, setLoading] = useState(!initialListing);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`listings/${id}`);
      setListing(res.data);
    } catch (err) {
      if (err.response?.status === 404) setNotFound(true);
      else setError(errorMessage(err, "We couldn't load this listing."));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!initialListing) load();
  }, [initialListing, load]);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: listing.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch {
      // user cancelled
    }
  };

  const sold = !!listing?.is_sold;
  const isOwner = user && listing && user.id === listing.user_id;
  const about = listing ? `Hi, I'm interested in "${listing.title}" on SokoMtaani.` : "";

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main id="main" className="mx-auto max-w-5xl px-6 py-8">
        <Link href="/#products" className="mb-6 inline-flex items-center gap-1 text-green-700 hover:underline">
          <ArrowLeft size={16} aria-hidden="true" /> Back to products
        </Link>

        {loading ? (
          <LoadingState label="Loading listing…" />
        ) : notFound ? (
          <div className="rounded-lg bg-white p-10 text-center shadow">
            <h1 className="mb-2 text-2xl font-bold text-green-800">Listing not found</h1>
            <p className="text-gray-700">It may have been removed by the seller.</p>
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : (
          <article className="overflow-hidden rounded-lg bg-white shadow-lg md:grid md:grid-cols-2">
            <div className="relative h-72 md:h-full md:min-h-[24rem]">
              <ListingImage src={listing.image_url} alt={listing.title} grayscale={sold} eager />
              {sold && (
                <span className="absolute left-4 top-4 rounded-full bg-red-700 px-3 py-1 text-sm font-bold text-white">
                  SOLD
                </span>
              )}
            </div>

            <div className="p-6 md:p-8">
              <h1 className="mb-2 text-3xl font-bold text-green-900">{listing.title}</h1>
              <p className={`mb-4 text-3xl font-bold ${sold ? "text-gray-500 line-through" : "text-green-700"}`}>
                {formatPrice(listing.price)}
              </p>

              <ul className="mb-6 space-y-2 text-gray-700">
                {listing.category_name && (
                  <li className="flex items-center gap-2">
                    <Tag size={16} aria-hidden="true" /> {listing.category_name}
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <MapPin size={16} aria-hidden="true" /> {listing.location || "Location not specified"}
                </li>
                {listing.seller_name && (
                  <li className="flex items-center gap-2">
                    <User size={16} aria-hidden="true" /> Sold by {listing.seller_name}
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <Calendar size={16} aria-hidden="true" /> Posted {formatDate(listing.created_at)}
                </li>
              </ul>

              {listing.description && (
                <section className="mb-6">
                  <h2 className="mb-2 text-lg font-semibold text-green-800">Description</h2>
                  <p className="whitespace-pre-line leading-relaxed text-gray-800">{listing.description}</p>
                </section>
              )}

              {isOwner ? (
                <Link
                  href={`/listing-form?edit=${listing.id}`}
                  className="block rounded-lg bg-green-600 px-4 py-3 text-center font-semibold text-white hover:bg-green-700"
                >
                  Edit your listing
                </Link>
              ) : sold ? (
                <p className="rounded-lg bg-gray-100 p-3 text-center font-medium text-gray-800">
                  This item has been sold.
                </p>
              ) : (
                <div className="space-y-3">
                  {listing.contact_phone && (
                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href={telHref(listing.contact_phone)}
                        className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700"
                      >
                        <Phone size={18} aria-hidden="true" /> Call
                      </a>
                      <a
                        href={whatsappHref(listing.contact_phone, about)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-lg bg-[#1f8f4e] px-4 py-3 font-semibold text-white hover:bg-[#187a42]"
                      >
                        <MessageCircle size={18} aria-hidden="true" /> WhatsApp
                      </a>
                    </div>
                  )}
                  {listing.contact_email && (
                    <a
                      href={mailtoHref(listing.contact_email, `SokoMtaani: ${listing.title}`)}
                      className="flex items-center justify-center gap-2 rounded-lg border border-blue-700 px-4 py-3 font-semibold text-blue-800 hover:bg-blue-50"
                    >
                      <Mail size={18} aria-hidden="true" /> Email seller
                    </a>
                  )}
                </div>
              )}

              <div className="mt-4 flex gap-3">
                {!isOwner && (
                  <button
                    type="button"
                    onClick={() => toggleFavorite(listing)}
                    aria-pressed={favoriteIds.has(listing.id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-800 hover:bg-gray-200"
                  >
                    <Heart
                      size={18}
                      aria-hidden="true"
                      className={favoriteIds.has(listing.id) ? "fill-red-500 text-red-500" : ""}
                    />
                    {favoriteIds.has(listing.id) ? "Saved" : "Save"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={share}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-800 hover:bg-gray-200"
                >
                  <Share2 size={18} aria-hidden="true" /> Share
                </button>
              </div>
            </div>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}
