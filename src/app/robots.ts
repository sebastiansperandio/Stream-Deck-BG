import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://sdbg.speran.dev/sitemap.xml",
    host: "https://sdbg.speran.dev",
  };
}
