import type { Metadata } from "next";
import { OfferPage } from "@/components/offer/OfferPage";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pesat.ai";

export const metadata: Metadata = {
  title: "Penawaran Solusi AI & Otomasi Operasional Bisnis | Pesat.AI Offer",
  description:
    "Pangkas biaya operasional rutin hingga 40% dan tingkatkan closing rate dengan AI Sales Assistant, AI Ops Automation, dan Predictive Forecasting dari Pesat.AI.",
  alternates: { canonical: "/offer" },
  keywords: [
    "penawaran implementasi AI",
    "AI automation offer",
    "hemat biaya operasional AI",
    "AI sales assistant",
    "otomasi alur kerja",
    "Pesat.AI offer"
  ],
  openGraph: {
    title: "Penawaran Solusi AI & Otomasi Operasional Bisnis | Pesat.AI Offer",
    description:
      "Dari AI sales assistant hingga otomasi workflow operasional — tingkatkan efisiensi bisnis tanpa perlu tambah banyak tim admin.",
    url: "/offer",
    siteName: "Pesat.AI",
    type: "website",
    images: [
      {
        url: "/images/automation-workflow.png",
        width: 1200,
        height: 630,
        alt: "Pesat.AI Offer - Otomasi Operasional dan AI Sales"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Penawaran Solusi AI & Otomasi Operasional | Pesat.AI",
    description:
      "Solusi automasi alur kerja dan asisten penjualan AI untuk pertumbuhan bisnis yang terukur.",
    images: ["/images/automation-workflow.png"]
  }
};

const offerJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/offer#webpage`,
      url: `${siteUrl}/offer`,
      name: "Penawaran Solusi AI & Otomasi Operasional Pesat.AI",
      description:
        "Paket implementasi AI B2B untuk efisiensi biaya operasional dan akselerasi penjualan.",
      isPartOf: {
        "@id": `${siteUrl}/#website`
      },
      breadcrumb: {
        "@id": `${siteUrl}/offer#breadcrumb`
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/offer#breadcrumb`,
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
          name: "Penawaran AI",
          item: `${siteUrl}/offer`
        }
      ]
    },
    {
      "@type": "Service",
      "@id": `${siteUrl}/offer#service`,
      name: "Paket Implementasi AI B2B & Otomasi Operasional",
      serviceType: "Business Automation and Artificial Intelligence Implementation",
      provider: {
        "@type": "Organization",
        name: "Pesat.AI",
        url: siteUrl
      },
      description:
        "Layanan implementasi end-to-end automasi alur kerja operasional, integrasi AI sales assistant, dan setup dashboard intelijen bisnis.",
      offers: {
        "@type": "Offer",
        priceCurrency: "IDR",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/offer`
      }
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/offer#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Apa saja yang didapatkan dari penawaran implementasi Pesat.AI?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Klien mendapatkan audit proses operasional, perancangan arsitektur AI, integrasi sistem ke WhatsApp/CRM/database yang ada, pengujian akurasi, serta pendampingan adopsi tim hingga sistem berjalan stabil."
          }
        },
        {
          "@type": "Question",
          name: "Berapa lama waktu implementasi penawaran ini?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sebagian besar modul quick-win dapat diimplementasikan dan diuji dalam waktu 3 hingga 7 hari kerja."
          }
        },
        {
          "@type": "Question",
          name: "Bagaimana cara memesan atau berkonsultasi mengenai penawaran ini?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Isi form ringkas di halaman penawaran atau hubungi tim strategi Pesat.AI via WhatsApp resmi untuk menjadwalkan sesi demonstrasi langsung."
          }
        }
      ]
    }
  ]
};

export default function OfferRoutePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd) }}
      />
      <OfferPage />
    </>
  );
}
