import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://mediahub.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register"],
        disallow: [
          "/advertiser/",
          "/publisher/",
          "/influencer/",
          "/admin/",
          "/api/",
          "/notifications",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
