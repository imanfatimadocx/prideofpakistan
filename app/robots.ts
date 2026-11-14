import type { MetadataRoute } from "next";

// Tells search engines what to crawl, and where the sitemap is.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/dashboard", "/login", "/register"],
      },
    ],
    sitemap: "https://prideofpakistan.com/sitemap.xml",
    host: "https://prideofpakistan.com",
  };
}
