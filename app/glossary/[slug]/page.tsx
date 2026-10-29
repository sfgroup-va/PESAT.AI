import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GlossaryTermView } from "@/components/glossary/GlossaryTermView";
import {
  getGlossaryTermBySlug,
  getAllGlossarySlugs,
  GLOSSARY_CATEGORIES
} from "@/lib/glossary-data";

export async function generateStaticParams() {
  const slugs = getAllGlossarySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const term = getGlossaryTermBySlug(slug);

  if (!term) {
    return {
      title: "Istilah Tidak Ditemukan | Pesat.AI",
      description: "Halaman glosarium yang Anda cari tidak ditemukan."
    };
  }

  const plainDef = term.leadDefinition.replace(/\*\*/g, "");
  const title = `Apa Itu ${term.shortName}? Definisi, Cara Kerja & Contoh B2B | Pesat.AI`;
  const description = `${plainDef.slice(0, 155)}...`;

  return {
    title,
    description,
    alternates: {
      canonical: `/glossary/${term.slug}`
    },
    openGraph: {
      title,
      description,
      url: `/glossary/${term.slug}`,
      siteName: "Pesat.AI",
      type: "article",
      publishedTime: term.datePublished,
      modifiedTime: term.dateModified
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}

export default async function GlossarySlugPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const term = getGlossaryTermBySlug(slug);

  if (!term) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pesat.ai";
  const category = GLOSSARY_CATEGORIES.find((c) => c.id === term.categoryId);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${siteUrl}/glossary/${term.slug}#article`,
        headline: `Apa Itu ${term.shortName}?`,
        description: term.leadDefinition.replace(/\*\*/g, ""),
        datePublished: term.datePublished,
        dateModified: term.dateModified,
        author: {
          "@type": "Organization",
          name: "Tim Solusi Pesat.AI",
          url: siteUrl
        },
        publisher: {
          "@type": "Organization",
          name: "Pesat.AI",
          url: siteUrl,
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/images/Pesat.AI%20logo.png`
          }
        },
        mainEntityOfPage: `${siteUrl}/glossary/${term.slug}`,
        isPartOf: {
          "@id": `${siteUrl}/glossary#definedtermset`
        },
        citation: term.sources.map((s) => ({
          "@type": "CreativeWork",
          name: s.title,
          url: s.url
        }))
      },
      {
        "@type": "DefinedTerm",
        "@id": `${siteUrl}/glossary/${term.slug}#definedterm`,
        name: term.shortName,
        description: term.leadDefinition.replace(/\*\*/g, ""),
        inDefinedTermSet: {
          "@id": `${siteUrl}/glossary#definedtermset`
        },
        url: `${siteUrl}/glossary/${term.slug}`
      },
      {
        "@type": "DefinedTermSet",
        "@id": `${siteUrl}/glossary#definedtermset`,
        name: "Glosarium AI B2B & Otomasi Operasional Pesat.AI",
        url: `${siteUrl}/glossary`
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/glossary/${term.slug}#faq`,
        mainEntity: term.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer
          }
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
            name: "Glosarium",
            item: `${siteUrl}/glossary`
          },
          ...(category
            ? [
                {
                  "@type": "ListItem",
                  position: 3,
                  name: category.name,
                  item: `${siteUrl}/glossary`
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: term.shortName
                }
              ]
            : [
                {
                  "@type": "ListItem",
                  position: 3,
                  name: term.shortName
                }
              ])
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
      <GlossaryTermView term={term} />
    </>
  );
}
