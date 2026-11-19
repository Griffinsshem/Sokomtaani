import HomeClient from "../../components/HomeClient";
import { fetchCategories, fetchListingsPage } from "../../lib/server-api";

const SORTS = new Set(["newest", "price_asc", "price_desc"]);

function pick(params) {
  const q = typeof params.q === "string" ? params.q.slice(0, 100) : "";
  const category = /^\d+$/.test(params.category || "") ? params.category : "";
  const sort = SORTS.has(params.sort) ? params.sort : "newest";
  return { q, category, sort };
}

export default async function Home({ searchParams }) {
  const filters = pick((await searchParams) || {});
  const apiParams = { sort: filters.sort };
  if (filters.q) apiParams.q = filters.q;
  if (filters.category) apiParams.category_id = filters.category;

  // Server-render the first page when the API answers quickly; otherwise
  // (e.g. the free API host is waking up) the browser loads it instead.
  const [initialPage, categories] = await Promise.all([
    fetchListingsPage(apiParams),
    fetchCategories(),
  ]);

  return <HomeClient initialPage={initialPage} initialCategories={categories} initialFilters={filters} />;
}
