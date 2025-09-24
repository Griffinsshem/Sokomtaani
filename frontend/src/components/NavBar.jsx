"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchFavorites } from "../lib/api";

export default function NavBar({ user }) {
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    async function loadFavorites() {
      if (!user) {
        setFavoritesCount(0);
        return;
      }
      try {
        const res = await fetchFavorites();
        setFavoritesCount(res.data.length);
      } catch (err) {
        console.error("Error fetching favorites", err);
      }
    }
    loadFavorites();
  }, [user]);

  const navLinks = [
    { href: "/homepage", label: "Home" },
    { href: "/listing-form", label: "Post Ad" },
    { href: "/my-listings", label: "My Listings" },
    { href: "/favorites", label: "Favorites" },
  ];

  return (
    <header className="bg-green-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center rounded-b-lg">
        {/* Logo */}
        <Link href="/homepage" className="flex items-center gap-3">
          <div className="rounded-md bg-green-900 px-3 py-2 font-bold text-lg">
            SM
          </div>
          <span className="text-2xl font-extrabold tracking-wide drop-shadow-lg">
            SokoMtaani
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-lg font-semibold transition-transform transition-colors duration-200 transform hover:scale-110 hover:text-yellow-400"
            >
              {link.label}
              {link.label === "Favorites" && favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-red-800 bg-red-100 rounded-full">
                  {favoritesCount}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}