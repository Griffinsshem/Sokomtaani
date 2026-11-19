import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./global.css";

import { headers } from "next/headers";

import Providers from "../components/Providers";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "../lib/config";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Fresh produce direct from Kenyan farmers`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "SokoMtaani",
    "farm produce Kenya",
    "buy from farmers",
    "Nairobi market",
    "fresh vegetables",
    "agricultural marketplace",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_KE",
    url: "/",
    title: `${SITE_NAME} — Fresh produce direct from Kenyan farmers`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Fresh produce direct from Kenyan farmers`,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport = {
  themeColor: "#15803d",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  // Reading the request headers makes every page render per request, which
  // is required for the nonce-based Content-Security-Policy (see middleware).
  const nonce = (await headers()).get("x-nonce") || undefined;

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    areaServed: "KE",
  };

  return (
    <html lang="en-KE" suppressHydrationWarning>
      <body id="top" suppressHydrationWarning>
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
