"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import api, { errorMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

/**
 * Favorites stored on the server per user (works across devices, and is
 * never shared between people using the same browser).
 */
export default function useFavorites() {
  const { user, ready } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [ids, setIds] = useState(() => new Set());

  useEffect(() => {
    try {
      localStorage.removeItem("favorites"); // legacy browser-only favorites
    } catch {
      // ignore
    }
    if (!ready || !user) {
      setIds(new Set());
      return undefined;
    }
    let active = true;
    api
      .get("favorites/")
      .then((res) => {
        if (active) setIds(new Set(res.data.map((f) => f.listing?.id).filter(Boolean)));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [ready, user]);

  const toggle = useCallback(
    async (listing) => {
      if (!user) {
        toast.info("Log in to save favorites.");
        router.push(`/login?next=${encodeURIComponent(pathname || "/")}`);
        return;
      }
      const id = listing.id;
      const wasFavorite = ids.has(id);
      // Optimistic update
      setIds((prev) => {
        const next = new Set(prev);
        if (wasFavorite) next.delete(id);
        else next.add(id);
        return next;
      });
      try {
        if (wasFavorite) {
          await api.delete(`favorites/${id}`);
          toast.success("Removed from favorites");
        } else {
          await api.post("favorites/", { listing_id: id });
          toast.success("Saved to favorites");
        }
      } catch (error) {
        const status = error.response?.status;
        // Already in the desired state on the server: keep the optimistic state.
        if ((wasFavorite && status === 404) || (!wasFavorite && status === 400)) return;
        setIds((prev) => {
          const next = new Set(prev);
          if (wasFavorite) next.add(id);
          else next.delete(id);
          return next;
        });
        toast.error(errorMessage(error, "Couldn't update favorites."));
      }
    },
    [user, ids, toast, router, pathname]
  );

  return { favoriteIds: ids, toggleFavorite: toggle };
}
