import { MetadataRoute } from "next";

/**
 * Generates a sitemap for all public / static pages.
 * Dynamic pages (tasks, platforms etc.) require auth and are excluded.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://mediahub.app";

  return [
    { url: base,                         lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/login`,              lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/register`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/forgot-password`,    lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];
}
