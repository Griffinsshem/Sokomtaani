import { notFound } from "next/navigation";
import { headers } from "next/headers";

import ListingDetailClient from "../../../components/ListingDetailClient";
import { SITE_NAME, SITE_URL } from "../../../lib/config";
import { formatPrice, truncate } from "../../../lib/format";
import { fetchListing } from "../../../lib/server-api";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const result = await fetchListing(id);
  if (!result) return { title: "Listing" };
  // Metadata resolves before the page starts streaming, so this yields a real 404 status.
  if (result.notFound) notFound();

  const l = result.data;
  const title = `${l.title} — ${formatPrice(l.price)}${l.location ? ` in ${l.location}` : ""}`;
  const description = truncate(l.description || `${l.title} for sale on ${SITE_NAME}.`, 160);
  const images = l.image_url ? [{ url: l.image_url, alt: l.title }] : undefined;

  return {
    title,
    description,
    alternates: { canonical: `/listings/${l.id}` },
    openGraph: { type: "website", url: `/listings/${l.id}`, title, description, ...(images && { images }) },
    twitter: { card: images ? "summary_large_image" : "summary", title, description },
  };
}

export default async function ListingPage({ params }) {
  const { id } = await params;
  const result = await fetchListing(id);
  if (result?.notFound) notFound();

  const listing = result?.data ?? null;
  const nonce = (await headers()).get("x-nonce") || undefined;

  const jsonLd = listing && {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: truncate(listing.description || listing.title, 500),
    ...(listing.image_url && { image: [listing.image_url] }),
    category: listing.category_name || undefined,
    offers: {
      "@type": "Offer",
      price: Number(listing.price).toFixed(2),
      priceCurrency: "KES",
      availability: listing.is_sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      url: `${SITE_URL}/listings/${listing.id}`,
    },
  };

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      )}
      <ListingDetailClient id={id} initialListing={listing} />
    </>
  );
}
