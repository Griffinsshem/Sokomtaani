"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "../context/AuthContext";
import { safeNextPath } from "../lib/format";

/** Sends already-logged-in users away from login/signup pages. */
export default function GuestOnly({ children }) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (ready && user) router.replace(safeNextPath(params.get("next"), "/"));
  }, [ready, user, router, params]);

  return children;
}
