"use client";

export default function ListingCard({ listing, showControls, onMarkSold, onDelete }) {
  return (
    <div className="border rounded-lg p-4 mb-4 flex justify-between items-center shadow">
      <div>
        <h2 className="font-bold text-lg">{listing.title}</h2>
        <p>Price: ${listing.price}</p>
        <p>Status: {listing.is_sold ? "Sold" : "Available"}</p>
      </div>
      {showControls && (
        <div className="flex gap-2">
          {!listing.is_sold && (
            <button
              onClick={onMarkSold}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Mark as Sold
            </button>
          )}
          <button
            onClick={onDelete}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
