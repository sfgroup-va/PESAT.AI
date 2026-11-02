import type { Metadata } from "next";
import { PesatExperience } from "@/components/PesatExperience";

export const metadata: Metadata = {
  title: "Pesat.AI | Solusi AI B2B, Otomasi & Konsultasi AI Bisnis Indonesia",
  description:
    "Buktikan potensi AI untuk bisnis Anda dalam 5 menit tanpa signup. Implementasi AI B2B siap pakai: naikkan revenue, efisiensi operasional, forecasting akurat, dan Generative Engine Optimization (GEO).",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Pesat.AI | Solusi AI B2B & Otomasi Operasional Bisnis",
    description:
      "Diagnosis peluang AI bisnis Anda dalam 5 menit. Solusi terukur untuk efisiensi biaya, percepatan revenue, dan otomatisasi alur kerja.",
    url: "/",
    siteName: "Pesat.AI",
    type: "website",
    images: [
      {
        url: "/images/hero-dashboard.png",
        width: 1200,
        height: 630,
        alt: "Pesat.AI - Diagnostic Tool Solusi AI B2B"
      }
    ]
  }
};

const homeFaqJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://pesat.ai/#webpage",
      url: "https://pesat.ai",
      name: "Pesat.AI | Solusi AI B2B & Otomasi Operasional Bisnis",
      description:
        "Platform diagnostic tool 5 menit dan implementasi solusi AI B2B untuk akselerasi bisnis di Indonesia.",
      isPartOf: {
        "@id": "https://pesat.ai/#website"
      },
      about: [
        { "@type": "Thing", name: "B2B AI Solutions" },
        { "@type": "Thing", name: "Generative Engine Optimization" },
        { "@type": "Thing", name: "Digital Reputation Asset" },
        { "@type": "Thing", name: "Business Process Automation" }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://pesat.ai/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "Apa itu Pesat.AI dan bagaimana cara kerjanya?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Pesat.AI adalah platform solusi AI B2B dan otomasi operasional untuk bisnis Indonesia. Pengunjung dapat menjalankan diagnostic mini session selama 5 menit tanpa perlu signup untuk memetakan titik kebocoran operasional, potensi efisiensi biaya, dan peluang kenaikan revenue dengan 33 solusi AI praktis."
          }
        },
        {
          "@type": "Question",
          name: "Berapa lama waktu implementasi solusi AI di Pesat.AI?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Implementasi dibagi menjadi 3 tingkatan waktu: Quick Win (3–7 hari untuk alur otomasi ringan), Standar (1–3 minggu untuk integrasi sales assistant atau forecasting), dan Advanced (3–8 minggu untuk custom system alur operasional enterprise)."
          }
        },
        {
          "@type": "Question",
          name: "Apakah bisnis saya butuh tim engineer khusus untuk memakai solusi Pesat.AI?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tidak. Solusi Pesat.AI dirancang dengan pendekatan no-code/low-code dan done-for-you (DFY) yang langsung terhubung ke tools bisnis yang sudah digunakan seperti WhatsApp, CRM, Google Sheets, dan database internal tanpa perlu merekrut tim IT tambahan."
          }
        },
        {
          "@type": "Question",
          name: "Apa itu Generative Engine Optimization (GEO) dan DRA™ di Pesat.AI?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "GEO (Generative Engine Optimization) dan Digital Reputation Asset (DRA™) adalah metodologi dari Pesat.AI untuk memastikan merek dan produk bisnis Anda dipahami, dipercaya, dan secara konsisten dikutip atau direkomendasikan oleh mesin pencari AI generasi baru seperti ChatGPT, Perplexity, Claude, dan Gemini."
          }
        }
      ]
    }
  ]
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqJsonLd) }}
      />
      <PesatExperience />
    </>
  );
}
