import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Pool & Billiard Shop`,
    short_name: SITE_NAME,
    description:
      "Browse pool and billiard accessories, checkout with M-Pesa, and chat for preorders.",
    start_url: "/shop",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#041912",
    theme_color: "#062318",
    categories: ["shopping", "sports"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
