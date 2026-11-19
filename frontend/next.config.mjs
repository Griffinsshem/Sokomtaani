/** @type {import('next').NextConfig} */

// The Content-Security-Policy is set per request (with a nonce) in
// src/middleware.js. The remaining security headers are static.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig = {
  poweredByHeader: false,
  // Flask routes end in "/" (e.g. /api/listings/). Don't let Next.js strip the
  // slash with a redirect before middleware proxies /api/* to the backend.
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
