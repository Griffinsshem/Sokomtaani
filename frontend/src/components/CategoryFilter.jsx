"use client";

import React from "react";

export default function CategoryFilter({ categories = [], selectedCategory, onCategoryChange }) {
  return (
    <div className="flex flex-wrap gap-2 my-4">
      {/* "All" option */}
      <button
        className={`px-4 py-2 rounded-lg border ${selectedCategory === null
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700"
          }`}
        onClick={() => onCategoryChange(null)}
      >
        All
      </button>

      {/* Map through categories (only if array is not empty) */}
      {categories.length > 0 ? (
        categories.map((cat) => (
          <button
            key={cat.id}
            className={`px-4 py-2 rounded-lg border ${selectedCategory === cat.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
              }`}
            onClick={() => onCategoryChange(cat.id)}
          >
            {cat.name}
          </button>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No categories available</p>
      )}
    </div>
  );
}
