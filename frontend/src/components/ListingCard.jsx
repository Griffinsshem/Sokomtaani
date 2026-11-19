"use client";

import React from "react";
import Link from "next/link";
import { Calendar, CheckCircle, Heart, MapPin, MessageCircle, XCircle } from "lucide-react";

import { formatDate, formatPrice } from "../lib/format";
import ListingImage from "./ListingImage";

/** Shared listing card used on the homepage and favorites page. */
export default function ListingCard({ listing, isFavorite = false, onToggleFavorite, onContact, actions }) {
  const sold = !!listing.is_sold;
  const href = `/listings/${listing.id}`;

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-lg transition-shadow hover:shadow-xl ${
        sold ? "border-gray-300" : "border-green-100"
      }`}
    >
      <span
        className={`absolute left-4 top-4 z-10 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
          sold ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
        }`}
      >
        {sold ? <XCircle size={12} aria-hidden="true" /> : <CheckCircle size={12} aria-hidden="true" />}
        {sold ? "SOLD" : "AVAILABLE"}
      </span>

      {onToggleFavorite && (
        <button
          type="button"
          onClick={() => onToggleFavorite(listing)}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Remove ${listing.title} from favorites` : `Save ${listing.title} to favorites`}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-600"
        >
          <Heart
            size={20}
            aria-hidden="true"
            className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"}
          />
        </button>
      )}

      <Link href={href} className="relative block h-48 overflow-hidden" tabIndex={-1} aria-hidden="true">
        <ListingImage
          src={listing.image_url}
          alt=""
          grayscale={sold}
          className={sold ? "" : "transition-transform duration-300 group-hover:scale-105"}
        />
        {sold && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="-rotate-6 rounded-lg bg-red-700 px-4 py-2 text-lg font-bold text-white">
              SOLD OUT
            </span>
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className={`min-w-0 flex-1 text-lg font-semibold ${sold ? "text-gray-600" : "text-green-800"}`}>
            <Link href={href} className="block truncate hover:underline focus-visible:underline">
              {listing.title}
            </Link>
          </h3>
          <span
            className={`whitespace-nowrap text-xl font-bold ${sold ? "text-gray-500 line-through" : "text-green-700"}`}
          >
            {formatPrice(listing.price)}
          </span>
        </div>

        {listing.description && (
          <p className={`mb-4 line-clamp-2 text-sm leading-relaxed ${sold ? "text-gray-500" : "text-gray-700"}`}>
            {listing.description}
          </p>
        )}

        <ul className="mb-4 space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <MapPin size={14} aria-hidden="true" />
            <span>{listing.location || "Location not specified"}</span>
          </li>
          {listing.created_at && (
            <li className="flex items-center gap-2">
              <Calendar size={14} aria-hidden="true" />
              <span>Posted {formatDate(listing.created_at)}</span>
            </li>
          )}
        </ul>

        <div className="mt-auto flex gap-2">
          {onContact && (
            <button
              type="button"
              onClick={() => onContact(listing)}
              disabled={sold}
              className={`flex flex-1 items-center justify-center gap-1 rounded px-3 py-2 text-sm font-semibold transition-colors ${
                sold ? "cursor-not-allowed bg-gray-200 text-gray-800" : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              <MessageCircle size={14} aria-hidden="true" />
              {sold ? "Sold out" : "Contact seller"}
            </button>
          )}
          {actions}
        </div>
      </div>
    </article>
  );
}
