"use client";

/* eslint-disable @next/next/no-img-element -- listing photos are arbitrary
   external URLs; next/image optimisation is disabled for this site. */

import React, { useState } from "react";
import { Leaf } from "lucide-react";

/** Listing photo with a graceful placeholder for missing/broken URLs. */
export default function ListingImage({ src, alt, className = "", grayscale = false, eager = false }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-green-100 to-green-200 text-green-700 ${className}`}
        role="img"
        aria-label={alt ? `${alt} (no photo)` : "No photo"}
      >
        <span className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-green-200">
          <Leaf size={28} aria-hidden="true" />
        </span>
        <span className="text-sm font-medium">No photo</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover ${grayscale ? "grayscale" : ""} ${className}`}
    />
  );
}
