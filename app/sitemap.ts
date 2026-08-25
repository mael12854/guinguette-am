import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/data/posts";
import { SITE_URL } from "@/lib/qr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/carte`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/reservation`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/avis`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/a-propos`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updated_at,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...staticRoutes, ...postRoutes];
}
