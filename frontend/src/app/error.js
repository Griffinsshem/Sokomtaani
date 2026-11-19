"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Surfaces in the browser console / Vercel logs without exposing details in the UI.
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="mb-4 text-3xl font-bold text-green-800">Something went wrong</h1>
      <p className="mb-8 text-gray-700">Sorry about that. Please try again.</p>
      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
        >
          Try again
        </button>
        <Link href="/" className="rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-800 hover:bg-gray-300">
          Home
        </Link>
      </div>
    </main>
  );
}
