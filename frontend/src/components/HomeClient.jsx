"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Leaf, MapPin, Search, Users } from "lucide-react";

import api, { errorMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import useFavorites from "../hooks/useFavorites";
import ContactDialog from "./ContactDialog";
import Footer from "./Footer";
import ListingCard from "./ListingCard";
import NavBar from "./NavBar";
import { ErrorState, LoadingState } from "./StatusMessage";

const PER_PAGE = 12;

function buildParams(filters, page) {
  const params = { page, per_page: PER_PAGE, sort: filters.sort || "newest" };
  if (filters.q) params.q = filters.q;
  if (filters.category) params.category_id = filters.category;
  return params;
}

function syncUrl(filters) {
  const qs = new URLSearchParams();
  if (filters.q) qs.set("q", filters.q);
  if (filters.category) qs.set("category", filters.category);
  if (filters.sort && filters.sort !== "newest") qs.set("sort", filters.sort);
  const url = `${window.location.pathname}${qs.toString() ? `?${qs}` : ""}#products`;
  window.history.replaceState(null, "", url);
}

export default function HomeClient({ initialPage, initialCategories, initialFilters }) {
  const { isAuthenticated } = useAuth();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const [filters, setFilters] = useState(initialFilters);
  const [searchText, setSearchText] = useState(initialFilters.q || "");
  const [categories, setCategories] = useState(initialCategories || []);
  const [items, setItems] = useState(initialPage?.items || []);
  const [page, setPage] = useState(initialPage?.page || 0);
  const [pages, setPages] = useState(initialPage?.pages || 0);
  const [total, setTotal] = useState(initialPage?.total || 0);
  const [loading, setLoading] = useState(!initialPage);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [contactListing, setContactListing] = useState(null);
  const requestId = useRef(0);

  const load = useCallback(async (nextFilters, nextPage = 1) => {
    const id = ++requestId.current;
    if (nextPage === 1) setLoading(true);
    else setLoadingMore(true);
    setError("");
    try {
      const res = await api.get("listings/", { params: buildParams(nextFilters, nextPage) });
      if (id !== requestId.current) return; // a newer search replaced this one
      const data = res.data;
      setItems((prev) => (nextPage === 1 ? data.items : [...prev, ...data.items]));
      setPage(data.page);
      setPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      if (id === requestId.current) setError(errorMessage(err, "We couldn't load products."));
    } finally {
      if (id === requestId.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, []);

  // Browser fallback when server rendering couldn't reach the API.
  useEffect(() => {
    if (!initialPage) load(initialFilters, 1);
    if (!initialCategories) {
      api
        .get("categories/")
        .then((res) => setCategories(res.data))
        .catch(() => {});
    }
  }, [initialPage, initialCategories, initialFilters, load]);

  const applyFilters = (patch) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    syncUrl(next);
    load(next, 1);
  };

  const onSearch = (e) => {
    e.preventDefault();
    applyFilters({ q: searchText.trim() });
  };

  const hasFilters = !!(filters.q || filters.category);

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <main id="main">
        {/* Hero */}
        <section className="relative bg-gradient-to-r from-green-600 to-green-700 py-20 text-white">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <h1 className="mb-6 text-5xl font-bold md:text-6xl">SokoMtaani</h1>
            <p className="mx-auto mb-8 max-w-3xl text-xl md:text-2xl">
              Connect directly with farmers for the freshest produce. No middlemen, better prices for everyone.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="#products"
                className="flex items-center justify-center gap-2 rounded-lg bg-yellow-400 px-8 py-3 text-lg font-semibold text-green-900 transition-colors hover:bg-yellow-300"
              >
                Browse products <ArrowRight size={20} aria-hidden="true" />
              </a>
              <Link
                href={isAuthenticated ? "/listing-form" : "/signup"}
                className="rounded-lg border-2 border-white px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-white hover:text-green-700"
              >
                {isAuthenticated ? "Sell your products" : "Join as a farmer"}
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-green-50 py-16" aria-labelledby="why-heading">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <h2 id="why-heading" className="mb-4 text-4xl font-bold text-green-800">
                Why choose SokoMtaani?
              </h2>
              <p className="text-lg text-green-700">The platform built for farmers and buyers</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                { icon: Leaf, title: "Fresh from the farm", text: "Buy directly from farmers for maximum freshness." },
                { icon: Users, title: "Fair prices", text: "Better prices for farmers and affordable rates for buyers." },
                { icon: MapPin, title: "Local sellers", text: "Find farmers near you and arrange pickup or delivery with them." },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-lg bg-white p-6 text-center shadow-lg">
                  <Icon className="mx-auto mb-4 h-12 w-12 text-green-600" aria-hidden="true" />
                  <h3 className="mb-2 text-xl font-semibold text-green-800">{title}</h3>
                  <p className="text-green-800/80">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products */}
        <section id="products" className="scroll-mt-20 py-16" aria-labelledby="products-heading">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-8 text-center">
              <h2 id="products-heading" className="mb-4 text-4xl font-bold text-green-800">
                Fresh agricultural products
              </h2>
              <p className="text-lg text-green-700">Latest products from our farmers</p>
            </div>

            {/* Search & filters */}
            <form
              onSubmit={onSearch}
              role="search"
              aria-label="Search products"
              className="mb-8 grid grid-cols-1 gap-3 rounded-lg border border-green-100 bg-green-50/60 p-4 md:grid-cols-[1fr_220px_200px_auto]"
            >
              <div>
                <label htmlFor="search" className="sr-only">
                  Search products
                </label>
                <div className="relative">
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    aria-hidden="true"
                  />
                  <input
                    id="search"
                    type="search"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search tomatoes, honey, Nakuru…"
                    maxLength={100}
                    className="w-full rounded-lg border border-gray-400 bg-white py-2.5 pl-10 pr-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="category" className="sr-only">
                  Category
                </label>
                <select
                  id="category"
                  value={filters.category}
                  onChange={(e) => applyFilters({ category: e.target.value })}
                  className="w-full rounded-lg border border-gray-400 bg-white px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="">All categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="sort" className="sr-only">
                  Sort by
                </label>
                <select
                  id="sort"
                  value={filters.sort}
                  onChange={(e) => applyFilters({ sort: e.target.value })}
                  className="w-full rounded-lg border border-gray-400 bg-white px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="newest">Newest first</option>
                  <option value="price_asc">Price: low to high</option>
                  <option value="price_desc">Price: high to low</option>
                </select>
              </div>
              <button
                type="submit"
                className="rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-700"
              >
                Search
              </button>
            </form>

            {!loading && !error && (
              <p className="mb-4 text-sm text-gray-700" aria-live="polite">
                {total} {total === 1 ? "product" : "products"}
                {hasFilters && (
                  <>
                    {" "}
                    found ·{" "}
                    <button
                      type="button"
                      className="font-medium text-green-700 underline"
                      onClick={() => {
                        setSearchText("");
                        applyFilters({ q: "", category: "" });
                      }}
                    >
                      Clear filters
                    </button>
                  </>
                )}
              </p>
            )}

            {loading ? (
              <LoadingState label="Loading fresh products…" />
            ) : error ? (
              <ErrorState message={error} onRetry={() => load(filters, 1)} />
            ) : items.length === 0 ? (
              <div className="text-center text-green-800">
                <p className="mb-4 text-lg">
                  {hasFilters ? "No products match your search." : "No products available yet."}
                </p>
                {!hasFilters && (
                  <Link
                    href={isAuthenticated ? "/listing-form" : "/signup"}
                    className="rounded-lg bg-green-600 px-6 py-2 text-white transition-colors hover:bg-green-700"
                  >
                    {isAuthenticated ? "Be the first to list your products" : "Join as a farmer to start selling"}
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      isFavorite={favoriteIds.has(listing.id)}
                      onToggleFavorite={toggleFavorite}
                      onContact={setContactListing}
                    />
                  ))}
                </div>
                {page < pages && (
                  <div className="mt-10 text-center">
                    <button
                      type="button"
                      onClick={() => load(filters, page + 1)}
                      disabled={loadingMore}
                      className="rounded-lg border-2 border-green-600 px-6 py-2.5 font-semibold text-green-700 hover:bg-green-50 disabled:opacity-60"
                    >
                      {loadingMore ? "Loading…" : "Load more products"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <ContactDialog listing={contactListing} onClose={() => setContactListing(null)} />
    </div>
  );
}
