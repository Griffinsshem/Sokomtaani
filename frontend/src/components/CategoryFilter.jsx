"use client";

import { useEffect, useState } from "react";
import { fetchCategories } from "../lib/api";

export default function CategoryFilter({ value = "", onChange }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadCategories() {
      try {
        const res = await fetchCategories();
        if (!mounted) return;
        setCategories(res.data ?? []);
      } catch (err) {
        if (!mounted) return;
        setError(err);
        setCategories([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadCategories();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <select
      aria-label="Filter listings by category"
      className="border p-2 rounded bg-white text-black"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={loading}
    >
      {loading ? (
        <option>Loading...</option>
      ) : error ? (
        <option disabled>Unable to load categories</option>
      ) : categories.length === 0 ? (
        <>
          <option value="">All Categories</option>
          <option disabled>No categories available</option>
        </>
      ) : (
        <>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </>
      )}
    </select>
  );
}
