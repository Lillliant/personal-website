import type { MetadataRoute } from "next";
import { posts } from "#site/content";

export const dynamic = "force-static";

const siteUrl = "https://www.christinewong.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/project`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}${post.permalink}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes];
}
