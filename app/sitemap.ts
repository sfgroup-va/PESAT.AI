import type { MetadataRoute } from "next";
import { GLOSSARY_TERMS } from "@/lib/glossary-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pesat.ai";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteUrl}/services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${siteUrl}/glossary`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9
    }
  ];

  const glossaryRoutes: MetadataRoute.Sitemap = GLOSSARY_TERMS.map((term) => ({
    url: `${siteUrl}/glossary/${term.slug}`,
    lastModified: new Date(term.dateModified),
    changeFrequency: "monthly",
    priority: 0.8
  }));

  return [...staticRoutes, ...glossaryRoutes];
}
