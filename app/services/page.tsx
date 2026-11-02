import type { Metadata } from "next";
import { ServicesContent } from "@/components/services/ServicesContent";
import { services, serviceCategories } from "@/components/home/services-data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pesat.ai";

export const metadata: Metadata = {
  title: "Katalog Layanan AI B2B Indonesia | 33 Solusi Siap Pakai Pesat.AI",
  description:
    "Jelajahi 33 solusi AI praktis untuk bisnis Indonesia: naikkan revenue, efisiensi biaya operasional, demand forecasting, pengambilan keputusan cepat, keamanan data, dan Generative Engine Optimization (GEO).",
  alternates: { canonical: "/services" },
  keywords: [
    "layanan AI bisnis",
    "katalog solusi AI B2B",
    "AI sales assistant Indonesia",
    "otomasi alur kerja bisnis",
    "AI forecasting",
    "Generative Engine Optimization",
    "DRA",
    "konsultasi AI operasional"
  ],
  openGraph: {
    title: "Katalog Layanan AI B2B Indonesia | 33 Solusi Siap Pakai | Pesat.AI",
    description:
      "Temukan 33 solusi AI siap pakai untuk bisnis Indonesia: dari AI Sales Assistant hingga Generative Engine Optimization (GEO).",
    url: "/services",
    siteName: "Pesat.AI",
    type: "website",
    images: [
      {
        url: "/images/revenue-command-center.png",
        width: 1200,
        height: 630,
        alt: "Katalog Layanan AI Pesat.AI"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Katalog Layanan AI B2B Indonesia | Pesat.AI",
    description:
      "33 solusi AI praktis untuk efisiensi dan akselerasi bisnis Anda.",
    images: ["/images/revenue-command-center.png"]
  }
};

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${siteUrl}/services#collection`,
      url: `${siteUrl}/services`,
      name: "Katalog 33 Layanan AI B2B & Otomasi Operasional Pesat.AI",
      description:
        "Daftar lengkap 33 solusi AI siap pakai untuk bisnis di Indonesia, dikelompokkan ke dalam 6 pilar dampak bisnis.",
      isPartOf: {
        "@id": `${siteUrl}/#website`
      },
      breadcrumb: {
        "@id": `${siteUrl}/services#breadcrumb`
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/services#breadcrumb`,
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
          name: "Layanan AI",
          item: `${siteUrl}/services`
        }
      ]
    },
    {
      "@type": "ItemList",
      "@id": `${siteUrl}/services#itemlist`,
      name: "33 Solusi AI B2B Pesat.AI",
      numberOfItems: services.length,
      itemListElement: services.map((s, index) => {
        const cat = serviceCategories.find((c) => c.id === s.category);
        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Service",
            name: s.name,
            description: s.desc,
            category: cat ? cat.label : s.category,
            provider: {
              "@type": "Organization",
              name: "Pesat.AI",
              url: siteUrl
            },
            url: `${siteUrl}/services#service-${s.id}`
          }
        };
      })
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/services#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Apa saja kategori layanan AI yang tersedia di Pesat.AI?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Pesat.AI mengelompokkan 33 layanan ke dalam 6 kategori: 1) Naik Revenue (AI Sales Assistant, CS 24/7, Reaktivasi Pelanggan), 2) Hemat Biaya (Otomasi Dokumen, Ekstraksi Invoice, Routing Kerja), 3) Prediksi Akurat (Demand Forecasting, Prediksi Cashflow), 4) Keputusan Cepat (Executive Summary Otomatis, Sintesis Rapat), 5) Bisnis Aman (Deteksi Fraud, Proteksi Privasi), dan 6) Brand Dipercaya (GEO - Generative Engine Optimization, Digital Reputation Asset - DRA™)."
          }
        },
        {
          "@type": "Question",
          name: "Berapa lama estimasi implementasi solusi AI dari Pesat.AI?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Bergantung pada kompleksitas: Quick Win membutuhkan ±3–7 hari, Standar membutuhkan ±1–3 minggu, dan Advanced Custom membutuhkan ±3–8 minggu."
          }
        },
        {
          "@type": "Question",
          name: "Bagaimana cara memilih solusi AI yang paling tepat untuk bisnis saya?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Anda dapat menjalankan diagnostic Mini Session interaktif gratis selama 5 menit di beranda Pesat.AI untuk memetakan titik hambatan dan mendapatkan rekomendasi solusi prioritas."
          }
        }
      ]
    }
  ]
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <ServicesContent />
    </>
  );
}
