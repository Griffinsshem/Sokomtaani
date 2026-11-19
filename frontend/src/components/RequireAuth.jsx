"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "../context/AuthContext";
import { LoadingState } from "./StatusMessage";

/**
 * Client-side companion to the middleware guard: if the session turns out
 * to be invalid (expired/revoked), send the user to log in.
 */
export default function RequireAuth({ children }) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/")}`);
    }
  }, [ready, user, router, pathname]);

  if (!ready || !user) return <LoadingState label="Checking your session…" />;
  return children;
}
