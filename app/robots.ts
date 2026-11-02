import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pesat.ai";

  const aiBots = [
    "GPTBot",
    "ChatGPT-User",
    "ClaudeBot",
    "anthropic-ai",
    "PerplexityBot",
    "Google-Extended",
    "GoogleOther",
    "Applebot-Extended",
    "cohere-ai",
    "Bytespider",
    "CCBot"
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/cms",
          "/cms/",
          "/api/",
          "/result/",
          "/deposit/thank-you"
        ]
      },
      ...aiBots.map((bot) => ({
        userAgent: bot,
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/cms",
          "/cms/",
          "/api/",
          "/result/",
          "/deposit/thank-you"
        ]
      }))
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl
  };
}
