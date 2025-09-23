"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { fetchFavorites } from "../lib/api";
import CategoryFilter from "./CategoryFilter";

export default function NavBar({ user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [favoritesCount, setFavoritesCount] = useState(0);

  const pathname = usePathname();
  const router = useRouter();

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

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setSelectedCategoryId("");
    router.push(`/homepage?search=${encodeURIComponent(search)}`);
  };

  // Handle category selection
  const handleCategoryChange = (categoryId) => {
    setSearch("");
    setSelectedCategoryId(categoryId);

    if (categoryId === "") {
      router.push("/homepage");
    } else {
      router.push(`/categories/${categoryId}`);
    }

    setMobileOpen(false);
  };

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
    <header className="bg-gray-900 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link href="/homepage" className="flex items-center gap-3">
              <div className="rounded-md bg-green-600 px-2 py-1 font-bold">SM</div>
              <span className="font-semibold tracking-wide">SokoMtaani</span>
            </Link>

            {/* Desktop Category Filter */}
            <div className="hidden md:block">
              <CategoryFilter value={selectedCategoryId} onChange={handleCategoryChange} />
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 px-4 hidden sm:block">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                id="nav-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-700 placeholder-gray-300 rounded-l px-3 py-2 focus:outline-none"
                placeholder="Search listings by title..."
              />
              <button type="submit" className="bg-green-600 px-3 py-2 rounded-r">
                Search
              </button>
            </form>
          </div>

          {/* Nav links + profile */}
          <div className="flex items-center gap-3">
            <nav className="hidden sm:flex items-center gap-4 text-sm">
              <Link href="/homepage" className={isActive("/homepage") ? "text-green-400" : "hover:text-gray-300"}>
                Home
              </Link>
              <Link href="/listing-form" className={isActive("/listing-form") ? "text-green-400" : "hover:text-gray-300"}>
                Post Ad
              </Link>
              <Link href="/my-listings" className={isActive("/my-listings") ? "text-green-400" : "hover:text-gray-300"}>
                My Listings
              </Link>
              <Link
                href="/favorites"
                className={`relative hover:text-gray-300 ${isActive("/favorites") ? "text-green-400" : ""}`}
              >
                Favorites
                {favoritesCount > 0 && (
                  <span className="absolute -top-2 -right-4 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold leading-none text-red-800 bg-red-100 rounded-full">
                    {favoritesCount}
                  </span>
                )}
              </Link>

              {!user && (
                <>
                  <Link href="/login" className={isActive("/login") ? "text-green-400" : "hover:text-gray-300"}>
                    Login
                  </Link>
                  <Link href="/signup" className={isActive("/signup") ? "text-green-400" : "hover:text-gray-300"}>
                    Signup
                  </Link>
                </>
              )}
            </nav>

            {/* Profile menu */}
            {user && (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setProfileOpen((s) => !s)}
                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                    {user.name[0]}
                  </div>
                  <span className="text-sm">{user.name}</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded shadow z-40">
                    <Link href="/profile" className="block px-3 py-2 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link href="/my-listings" className="block px-3 py-2 hover:bg-gray-100">
                      My Listings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="sm:hidden p-2"
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="sm:hidden mt-2 pb-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex px-2 gap-2 mb-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 rounded px-3 py-2 bg-gray-700"
                placeholder="Search listings..."
              />
              <button type="submit" className="px-3 py-2 bg-green-600 rounded">
                Search
              </button>
            </form>

            {/* Links */}
            <div className="px-2 space-y-1">
              <Link href="/homepage" className="block px-3 py-2 rounded hover:bg-gray-700">Home</Link>
              <Link href="/listing-form" className="block px-3 py-2 rounded hover:bg-gray-700">Post Ad</Link>
              <Link href="/my-listings" className="block px-3 py-2 rounded hover:bg-gray-700">My Listings</Link>
              <Link href="/favorites" className="block px-3 py-2 rounded hover:bg-gray-700 relative">
                Favorites
                {favoritesCount > 0 && (
                  <span className="absolute top-1 right-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold leading-none text-red-800 bg-red-100 rounded-full">
                    {favoritesCount}
                  </span>
                )}
              </Link>

              {!user && (
                <>
                  <Link href="/login" className="block px-3 py-2 rounded hover:bg-gray-700">Login</Link>
                  <Link href="/signup" className="block px-3 py-2 rounded hover:bg-gray-700">Signup</Link>
                </>
              )}

              {/* Mobile category filter */}
              <div className="mt-3">
                <div className="text-sm font-semibold">Categories</div>
                <CategoryFilter value={selectedCategoryId} onChange={handleCategoryChange} />
              </div>

              {/* Mobile profile */}
              {user && (
                <div className="mt-3 border-t border-gray-700 pt-2">
                  <Link href="/profile" className="block px-3 py-2 rounded hover:bg-gray-700">Profile</Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
