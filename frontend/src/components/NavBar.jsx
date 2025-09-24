"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function NavBar({ user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path) => {
    if (!pathname) return false;
    return pathname === path || pathname.startsWith(path + "/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout?.();
    router.push("/login");
  };

  return (
    <header className="absolute top-0 left-0 w-full z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/homepage" className="flex items-center gap-3">
            <div className="rounded-md bg-green-600 px-2 py-1 font-bold text-white shadow">
              SM
            </div>
            <span className="font-semibold tracking-wide text-green-700 text-lg drop-shadow">
              SokoMtaani
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-green-800">
            <Link
              href="/homepage"
              className={
                isActive("/homepage")
                  ? "text-green-700 font-semibold"
                  : "hover:text-green-600"
              }
            >
              Home
            </Link>
            <Link
              href="/listing-form"
              className={
                isActive("/listing-form")
                  ? "text-green-700 font-semibold"
                  : "hover:text-green-600"
              }
            >
              Post Ad
            </Link>
            <Link
              href="/my-listings"
              className={
                isActive("/my-listings")
                  ? "text-green-700 font-semibold"
                  : "hover:text-green-600"
              }
            >
              My Listings
            </Link>
            <Link
              href="/favorites"
              className={
                isActive("/favorites")
                  ? "text-green-700 font-semibold"
                  : "hover:text-green-600"
              }
            >
              Favorites
            </Link>
            {user && (
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
              >
                Logout
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 rounded-md text-green-700"
            onClick={() => setMobileOpen((s) => !s)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="sm:hidden mt-2 pb-4 space-y-2 text-green-800 font-medium bg-white/40 backdrop-blur-md rounded-lg shadow-lg">
            <Link href="/homepage" className="block px-3 py-2 rounded hover:bg-green-100">
              Home
            </Link>
            <Link href="/listing-form" className="block px-3 py-2 rounded hover:bg-green-100">
              Post Ad
            </Link>
            <Link href="/my-listings" className="block px-3 py-2 rounded hover:bg-green-100">
              My Listings
            </Link>
            <Link href="/favorites" className="block px-3 py-2 rounded hover:bg-green-100">
              Favorites
            </Link>
            {user && (
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
