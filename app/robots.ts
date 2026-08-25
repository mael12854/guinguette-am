import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/qr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/cuisine", "/connexion", "/suivi", "/mes-commandes"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
