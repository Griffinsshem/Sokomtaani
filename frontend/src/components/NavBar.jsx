"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const isActive = (path) => {
    if (!pathname) return false;
    return pathname === path || pathname.startsWith(path + "/");
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-30 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link href="/homepage" className="flex items-center gap-3">
              <div className="rounded-lg bg-green-600 px-3 py-2 font-extrabold text-white shadow-md hover:scale-105 transition-transform">
                SM
              </div>
              <span className="font-semibold tracking-wide text-green-800 text-xl drop-shadow-sm">
                SokoMtaani
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden sm:flex items-center gap-8 text-base font-medium text-green-900">
              <Link
                href="/homepage"
                className={`transition-colors duration-200 ${isActive("/homepage")
                  ? "text-green-700 font-semibold border-b-2 border-green-600 pb-1"
                  : "hover:text-green-600"
                  }`}
              >
                Home
              </Link>
              <Link
                href="/listing-form"
                className={`transition-colors duration-200 ${isActive("/listing-form")
                  ? "text-green-700 font-semibold border-b-2 border-green-600 pb-1"
                  : "hover:text-green-600"
                  }`}
              >
                Post Ad
              </Link>
              <Link
                href="/my-listings"
                className={`transition-colors duration-200 ${isActive("/my-listings")
                  ? "text-green-700 font-semibold border-b-2 border-green-600 pb-1"
                  : "hover:text-green-600"
                  }`}
              >
                My Listings
              </Link>
              <Link
                href="/favorites"
                className={`transition-colors duration-200 ${isActive("/favorites")
                  ? "text-green-700 font-semibold border-b-2 border-green-600 pb-1"
                  : "hover:text-green-600"
                  }`}
              >
                Favorites
              </Link>
              {user && (
                <button
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 hover:scale-105 transition-all"
                >
                  Logout
                </button>
              )}
            </nav>

            {/* Mobile menu button */}
            <button
              className="sm:hidden p-2 rounded-md text-green-700 hover:bg-green-100 transition-colors"
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
            >
              ☰
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="sm:hidden mt-3 pb-4 space-y-2 text-green-900 font-medium bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-green-100">
              <Link
                href="/homepage"
                className="block px-4 py-2 rounded hover:bg-green-50 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/listing-form"
                className="block px-4 py-2 rounded hover:bg-green-50 transition-colors"
              >
                Post Ad
              </Link>
              <Link
                href="/my-listings"
                className="block px-4 py-2 rounded hover:bg-green-50 transition-colors"
              >
                My Listings
              </Link>
              <Link
                href="/favorites"
                className="block px-4 py-2 rounded hover:bg-green-50 transition-colors"
              >
                Favorites
              </Link>
              {user && (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Spacer to push content below navbar */}
      <div className="h-16" />
    </>
  );
}
