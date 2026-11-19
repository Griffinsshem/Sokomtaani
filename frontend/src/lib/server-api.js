import "server-only";

import { cache } from "react";

import { apiOrigin } from "./config";

/**
 * Server-side fetch from the Flask API with a short timeout, so a sleeping
 * free-tier API never blocks page rendering: on timeout/failure we return
 * null and the page falls back to loading data in the browser.
 */
async function getJson(path, { timeoutMs = 6000, revalidate = 0 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${apiOrigin()}/api/${path}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      ...(revalidate ? { next: { revalidate } } : { cache: "no-store" }),
    });
    if (res.status === 404) return { notFound: true };
    if (!res.ok) return null;
    return { data: await res.json() };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export const fetchListingsPage = cache(async (params = {}) => {
  const qs = new URLSearchParams({ page: "1", per_page: "12", ...params });
  const result = await getJson(`listings/?${qs}`);
  return result?.data ?? null;
});

export const fetchCategories = cache(async () => {
  const result = await getJson("categories/", { revalidate: 3600 });
  return result?.data ?? null;
});

/** Returns { data } | { notFound: true } | null (API unavailable). */
export const fetchListing = cache(async (id) => {
  if (!/^\d+$/.test(String(id))) return { notFound: true };
  return getJson(`listings/${id}`);
});

export const fetchAllListingsForSitemap = cache(async () => {
  const result = await getJson("listings/", { timeoutMs: 8000, revalidate: 3600 });
  return Array.isArray(result?.data) ? result.data : [];
});
