"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export function LoadingState({ label = "Loading…" }) {
  return (
    <div className="py-12 text-center" role="status" aria-live="polite">
      <div
        className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-green-600 motion-reduce:animate-none"
        aria-hidden="true"
      />
      <p className="mt-4 text-green-700">{label}</p>
      <p className="mt-1 text-sm text-gray-600">
        If this is the first visit in a while, the server may take up to a minute to wake up.
      </p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="mx-auto max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center" role="alert">
      <AlertTriangle className="mx-auto mb-3 text-red-700" size={32} aria-hidden="true" />
      <p className="font-medium text-red-800">{message || "We couldn't load this right now."}</p>
      <p className="mt-1 text-sm text-red-800/80">
        The server may still be waking up. Please try again in a few seconds.
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-800"
        >
          <RefreshCw size={16} aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  );
}
