import { SITE_DESCRIPTION, SITE_NAME } from "../lib/config";

export default function manifest() {
  return {
    name: `${SITE_NAME} — Farm marketplace`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#15803d",
    lang: "en-KE",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
