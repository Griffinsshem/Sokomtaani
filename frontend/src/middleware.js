import { NextResponse } from "next/server";

import { apiOrigin } from "./lib/config";

const PROTECTED = ["/listing-form", "/my-listings", "/favorites", "/account"];
const SESSION_COOKIE = "access_token_cookie";
const isDev = process.env.NODE_ENV !== "production";

function clientIp(request) {
  // On Vercel these headers are set by the platform edge (not the client).
  const fwd = request.headers.get("x-forwarded-for");
  return (
    request.headers.get("x-real-ip") ||
    (fwd ? fwd.split(",")[0].trim() : "") ||
    ""
  );
}

/** Same-origin proxy: /api/* -> Flask API, adding proof + real client IP. */
function proxyApi(request) {
  const { pathname, search } = request.nextUrl;
  const target = new URL(`${pathname}${search}`, apiOrigin());

  const headers = new Headers(request.headers);
  headers.set("X-Proxy-Secret", process.env.PROXY_SHARED_SECRET || "");
  headers.set("X-Client-IP", clientIp(request));
  headers.delete("x-middleware-subrequest");

  return NextResponse.rewrite(target, { request: { headers } });
}

function buildCsp(nonce) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' data:",
    `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}

export function middleware(request) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return proxyApi(request);
  }

  // Server-side guard for private pages (real authorization happens in the
  // API; this just avoids rendering private pages for logged-out visitors).
  if (
    PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`)) &&
    !request.cookies.has(SESSION_COOKIE)
  ) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(login);
  }

  // Per-request nonce so only our own scripts can run (no 'unsafe-inline').
  const nonce = btoa(crypto.randomUUID());
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    "/api/:path*",
    {
      source:
        "/((?!_next/static|_next/image|icon.svg|apple-icon|opengraph-image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|logo.svg).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
