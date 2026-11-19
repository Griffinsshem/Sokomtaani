// Public site URL (used for metadata, sitemap, canonical links).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://sokomtaani.vercel.app"
).replace(/\/+$/, "");

export const SITE_NAME = "SokoMtaani";
export const SITE_DESCRIPTION =
  "Buy fresh produce directly from Kenyan farmers. SokoMtaani connects farmers and buyers with no middlemen and fairer prices.";

// Origin of the Flask API. Server-side only: the browser always talks to
// "/api" on this site, which middleware proxies here.
export function apiOrigin() {
  const raw =
    process.env.API_ORIGIN ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://sokomtaani6.onrender.com";
  try {
    return new URL(raw).origin;
  } catch {
    return "https://sokomtaani6.onrender.com";
  }
}

export const CONTACT_EMAIL = "sokomtaani@gmail.com";
