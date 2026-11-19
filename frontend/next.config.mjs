/** @type {import('next').NextConfig} */

// Origin of the Flask API (same normalisation as src/lib/api.js).
const API_ORIGIN = (() => {
  try {
    return new URL(
      process.env.NEXT_PUBLIC_API_URL || "https://sokomtaani6.onrender.com"
    ).origin;
  } catch {
    return "https://sokomtaani6.onrender.com";
  }
})();

const isDev = process.env.NODE_ENV !== "production";

// Content-Security-Policy: limits where scripts can come from and, most
// importantly, where data (e.g. the auth token) can be sent: only this site
// and the API. 'unsafe-inline' is required by Next.js inline bootstrap
// scripts without a nonce setup; images stay open (listing photos are
// arbitrary https URLs).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https: http:",
  `connect-src 'self' ${API_ORIGIN}${isDev ? " ws: http://localhost:5000 http://127.0.0.1:5000" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig = {
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Disable image optimization
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
