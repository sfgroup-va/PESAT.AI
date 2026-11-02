import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/home/ThemeProvider";
import { CoachProvider } from "@/components/coach/CoachProvider";
import { FloatingCoachWidget } from "@/components/coach/FloatingCoachWidget";

// Body / UI — premium humanist geometric (SF-Pro-adjacent, not the over-used Inter)
const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"]
});

// Display / headings — geometric "tech" grotesk for a high-end, modern feel
const display = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["500", "600", "700", "800"]
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pesat.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pesat.AI | Solusi AI B2B, Otomasi & Konsultasi AI Bisnis Indonesia",
    template: "%s | Pesat.AI"
  },
  description:
    "Buktikan peluang AI untuk bisnis Anda dalam 5 menit. Konsultasi dan implementasi AI B2B siap pakai: naikkan revenue, efisiensi biaya, otomasi workflow, dan GEO AI search visibility.",
  keywords: [
    "solusi AI B2B",
    "otomasi bisnis Indonesia",
    "konsultasi AI perusahaan",
    "generative engine optimization",
    "GEO Indonesia",
    "digital reputation asset",
    "DRA",
    "AI sales assistant",
    "AI workflow automation",
    "Pesat AI"
  ],
  authors: [{ name: "Nell VH", url: "https://pesat.ai" }],
  creator: "Pesat.AI",
  publisher: "Pesat.AI",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Pesat.AI | Solusi AI B2B & Otomasi Operasional Bisnis",
    description:
      "Buktikan peluang AI untuk bisnis Anda dalam 5 menit tanpa signup dan tanpa kartu kredit.",
    url: siteUrl,
    siteName: "Pesat.AI",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/images/hero-dashboard.png",
        width: 1200,
        height: 630,
        alt: "Pesat.AI - Platform Solusi AI B2B & Diagnostic Mini Session"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Pesat.AI | Solusi AI B2B & Otomasi Operasional Bisnis",
    description:
      "Diagnosis peluang AI bisnis Anda dalam 5 menit. Solusi terukur untuk revenue, biaya, dan otomasi.",
    images: ["/images/hero-dashboard.png"],
    creator: "@pesatai"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff"
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('pesat-theme-4');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

const globalSchemaJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Pesat.AI",
      alternateName: ["Pesat AI", "Pesat.AI Indonesia"],
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        "@id": `${siteUrl}/#logo`,
        url: `${siteUrl}/images/Pesat.AI%20logo.png`,
        caption: "Pesat.AI Logo"
      },
      image: `${siteUrl}/images/hero-dashboard.png`,
      description:
        "Penyedia solusi AI B2B, otomatisasi alur kerja operasional, dan Generative Engine Optimization (GEO) terkemuka di Indonesia.",
      founder: {
        "@type": "Person",
        name: "Nell VH",
        jobTitle: "Founder & AI Strategist",
        sameAs: "https://www.linkedin.com/in/nellvh"
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+62-812-9040-1240",
        contactType: "customer support",
        areaServed: "ID",
        availableLanguage: ["Indonesian", "English"]
      },
      sameAs: [
        "https://wa.me/6281290401240",
        "https://www.linkedin.com/company/pesatai"
      ]
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Pesat.AI",
      description: "Solusi AI B2B & Otomasi Operasional Bisnis Indonesia",
      publisher: {
        "@id": `${siteUrl}/#organization`
      },
      inLanguage: "id-ID",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/services?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#minisession`,
      name: "Pesat.AI Diagnostic Mini Session",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web Browser",
      url: siteUrl,
      description:
        "Diagnostic tool interaktif 5 menit untuk mengidentifikasi kebocoran operasional dan memetakan solusi AI paling berdampak bagi bisnis.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "IDR"
      }
    }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning className={`${sans.variable} ${display.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchemaJsonLd) }}
        />
      </head>
      <body>
        <div className="grain-overlay" aria-hidden />
        <ThemeProvider>
          <CoachProvider>
            {children}
            <FloatingCoachWidget />
          </CoachProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
