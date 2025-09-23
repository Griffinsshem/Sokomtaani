"use client";

import React from "react";

export default function ListingCard({
  listing,
  showRemoveFavorite = false,
  onRemoveFavorite = null,
  removing = false,
}) {
  if (!listing) {
    return (
      <div className="border rounded-lg p-4 shadow bg-white">
        <div className="h-40 bg-gray-100 rounded animate-pulse" />
        <div className="mt-3 h-4 bg-gray-200 rounded w-3/4" />
      </div>
    );
  }

  return (
    <article className="border rounded-lg p-4 shadow bg-white flex flex-col">
      {listing.image_url ? (
        <img
          src={listing.image_url}
          alt={listing.title || "Listing image"}
          className="w-full h-40 object-cover rounded"
        />
      ) : (
        <div className="w-full h-40 bg-gray-100 rounded flex items-center justify-center text-gray-500">
          No image
        </div>
      )}

      <div className="mt-3 flex-1">
        <h2 className="font-semibold">{listing.title}</h2>
        <p className="text-sm text-gray-600 mt-1 line-clamp-3">{listing.description}</p>
        {listing.price != null && (
          <p className="mt-2 font-bold text-green-600">Ksh {listing.price}</p>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="text-xs text-gray-500">
          {listing.is_sold ? "Sold" : "Available"}
        </div>

        <div className="text-sm text-gray-700">
          {listing.seller ? (
            <>
              <div className="font-medium">{listing.seller.name}</div>
              {listing.seller.email && (
                <a href={`mailto:${listing.seller.email}`} className="block text-xs underline">
                  {listing.seller.email}
                </a>
              )}
              {listing.seller.phone_number && (
                <a href={`tel:${listing.seller.phone_number}`} className="block text-xs underline">
                  {listing.seller.phone_number}
                </a>
              )}
            </>
          ) : (
            <div className="text-xs text-gray-500">Seller info unavailable</div>
          )}
        </div>
      </div>

      {showRemoveFavorite && onRemoveFavorite && (
        <div className="mt-3">
          <button
            onClick={onRemoveFavorite}
            disabled={removing}
            aria-label={`Remove ${listing.title} from favorites`}
            className="w-full px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            {removing ? "Removing..." : "Remove"}
          </button>
        </div>
      )}
    </article>
  );
}
