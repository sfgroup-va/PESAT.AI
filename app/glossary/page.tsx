import type { Metadata } from "next";
import { GlossaryHubView } from "@/components/glossary/GlossaryHubView";
import { GLOSSARY_TERMS } from "@/lib/glossary-data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pesat.ai";

export const metadata: Metadata = {
  title: "Glosarium AI B2B & Otomasi Operasional (2026) | Pesat.AI",
  description:
    "Kamus istilah lengkap B2B AI, automasi alur kerja, RAG, AI agent, Generative Engine Optimization (GEO), dan kalkulasi ROI operasional untuk bisnis Indonesia.",
  alternates: {
    canonical: "/glossary"
  },
  keywords: [
    "glosarium AI B2B",
    "kamus istilah AI bisnis",
    "definisi RAG",
    "apa itu Generative Engine Optimization",
    "GEO AI",
    "Digital Reputation Asset",
    "DRA",
    "AI agent bisnis"
  ],
  openGraph: {
    title: "Glosarium AI B2B & Otomasi Operasional (2026) | Pesat.AI",
    description:
      "Kamus istilah lengkap B2B AI, automasi alur kerja, RAG, AI agent, dan kalkulasi ROI operasional untuk bisnis Indonesia.",
    url: "/glossary",
    siteName: "Pesat.AI",
    type: "website",
    images: [
      {
        url: "/images/ai-search-visibility.png",
        width: 1200,
        height: 630,
        alt: "Glosarium AI B2B & Otomasi Operasional - Pesat.AI"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Glosarium AI B2B & Otomasi Operasional (2026) | Pesat.AI",
    description:
      "Panduan istilah praktis AI B2B dan otomasi proses bisnis.",
    images: ["/images/ai-search-visibility.png"]
  }
};

export default function GlossaryIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${siteUrl}/glossary#collection`,
        url: `${siteUrl}/glossary`,
        name: "Glosarium AI B2B & Otomasi Operasional Pesat.AI",
        description:
          "Pusat referensi istilah kecerdasan buatan, otomasi operasional bisnis, dan Generative Engine Optimization (GEO) di Indonesia.",
        inLanguage: "id-ID",
        isPartOf: {
          "@id": `${siteUrl}/#website`
        },
        about: [
          { "@type": "Thing", name: "Artificial Intelligence in Business" },
          { "@type": "Thing", name: "Generative Engine Optimization (GEO)" },
          { "@type": "Thing", name: "Business Process Automation" }
        ]
      },
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
