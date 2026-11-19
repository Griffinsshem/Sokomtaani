import { SITE_URL } from "../lib/config";
import { fetchAllListingsForSitemap } from "../lib/server-api";

// Regenerate at most once an hour.
export const revalidate = 3600;

export default async function sitemap() {
  const now = new Date();
  const staticPages = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1.0, lastModified: now },
    { url: `${SITE_URL}/signup`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/login`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const listings = await fetchAllListingsForSitemap();
  const listingPages = listings
    .filter((l) => !l.is_sold)
    .map((l) => ({
      url: `${SITE_URL}/listings/${l.id}`,
      lastModified: l.created_at ? new Date(l.created_at) : undefined,
      changeFrequency: "weekly",
      priority: 0.7,
      ...(l.image_url && { images: [l.image_url] }),
    }));

  return [...staticPages, ...listingPages];
}
