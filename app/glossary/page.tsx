import type { Metadata } from "next";
import { GlossaryHubView } from "@/components/glossary/GlossaryHubView";
import { GLOSSARY_TERMS } from "@/lib/glossary-data";

export const metadata: Metadata = {
  title: "Glosarium AI B2B & Otomasi Operasional (2026) | Pesat.AI",
  description:
    "Kamus istilah lengkap B2B AI, automasi alur kerja, RAG, AI agent, dan kalkulasi ROI operasional. Ditulis dalam bahasa pemilik bisnis, lugas, dan bebas jargon membingungkan.",
  alternates: {
    canonical: "/glossary"
  },
  openGraph: {
    title: "Glosarium AI B2B & Otomasi Operasional (2026) | Pesat.AI",
    description:
      "Kamus istilah lengkap B2B AI, automasi alur kerja, RAG, AI agent, dan kalkulasi ROI operasional untuk bisnis Indonesia.",
    url: "/glossary",
    siteName: "Pesat.AI",
    type: "website"
  }
};

export default function GlossaryIndexPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pesat.ai";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTermSet",
        "@id": `${siteUrl}/glossary#definedtermset`,
        name: "Glosarium AI B2B & Otomasi Operasional Pesat.AI",
        description:
          "Koleksi istilah, definisi, dan panduan praktis implementasi kecerdasan buatan, otomasi alur kerja, dan optimasi operasional B2B di Indonesia.",
        url: `${siteUrl}/glossary`,
        hasDefinedTerm: GLOSSARY_TERMS.map((term) => ({
          "@type": "DefinedTerm",
          "@id": `${siteUrl}/glossary/${term.slug}#definedterm`,
          name: term.shortName,
          description: term.leadDefinition.replace(/\*\*/g, ""),
          url: `${siteUrl}/glossary/${term.slug}`
        }))
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Beranda",
            item: siteUrl
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Glosarium AI",
            item: `${siteUrl}/glossary`
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GlossaryHubView />
    </>
  );
}
