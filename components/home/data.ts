import type { StaticImageData } from "next/image";

export type VisualAsset = {
  src: string | StaticImageData;
  alt: string;
  width: number;
  height: number;
};

export type ProofMetric = {
  value: string;
  label: string;
  detail: string;
  source: string;
  sourceUrl: string;
};

export type HomepageTestimonial = {
  name: string;
  role: string;
  headline: string;
  excerpt: string;
  avatar?: string;
};

export const visuals = {
  heroDashboard: {
    src: "/images/hero-dashboard.png",
    alt: "Premium AI business dashboard for revenue, automation, and operations",
    width: 1536,
    height: 1024
  },
  automationWorkflow: {
    src: "/images/automation-workflow.png",
    alt: "Professional team reviewing an AI automation workflow",
    width: 1536,
    height: 1024
  },
  mobileAssistant: {
    src: "/images/mobile-ai-assistant.png",
    alt: "Mobile AI assistant interface for business growth",
    width: 1024,
    height: 1536
  },
  discoverySession: {
    src: "/images/discovery-session.png",
    alt: "Discovery session with AI dashboard and business owner",
    width: 1536,
    height: 1024
  },
  revenueCommand: {
    src: "/images/revenue-command-center.png",
    alt: "AI revenue operations command center interface",
    width: 1536,
    height: 1024
  },
  aiSearch: {
    src: "/images/ai-search-visibility.png",
    alt: "AI search visibility and content authority graph",
    width: 1536,
    height: 1024
  },
  nell: {
    src: "/images/nell-vh.png",
    alt: "Nell VH, founder profile from JetDigitalPro",
    width: 1000,
    height: 1000
  }
} satisfies Record<string, VisualAsset>;

export const jetDigitalProof = [
  {
    value: "4.2/5",
    label: "TrustScore",
    detail: "JetDigitalPro is publicly listed as rated Great on Trustpilot.",
    source: "JetDigitalPro",
    sourceUrl: "https://jetdigitalpro.com/"
  },
  {
    value: "86.95%",
    label: "Keywords ranked",
    detail: "PR agency case study: ranked keywords in 7.5 weeks.",
    source: "JetDigitalPro proven results",
    sourceUrl: "https://jetdigitalpro.com/"
  },
  {
    value: "10K+",
    label: "Visitors",
    detail: "Blog traffic result cited from topical authority strategy.",
    source: "JetDigitalPro",
    sourceUrl: "https://jetdigitalpro.com/"
  }
] satisfies ProofMetric[];

export const industryProof = [
  {
    value: "159%",
    label: "Median ROI",
    detail: "AI programs with focused use cases can show payback in months, not years.",
    source: "Orange Business",
    sourceUrl: "https://www.orange.com/en/whats-up/artificial-intelligence-business-productivity-and-governance-2026"
  },
  {
    value: "5-20%",
    label: "Revenue lift",
    detail: "AI automation benchmarks report growth and efficiency gains when rollout is tied to revenue.",
    source: "AI automation ROI benchmark",
    sourceUrl: "https://alicelabs.ai/reports/ai-automation-roi-benchmark-2026"
  },
  {
    value: "31",
    label: "Solution map",
    detail: "Pesat.AI uses a fixed rule-based solution catalog before LLM copywriting.",
    source: "Pesat.AI internal rule engine",
    sourceUrl: "#how-it-works"
  }
] satisfies ProofMetric[];

export const testimonials = [
  {
    name: "Michael Hodgdon",
    role: "Business Owner, EliteSEOConsulting.com",
    headline: "Full turnkey process",
    excerpt: "Outstanding content, sharp graphics, excellent communication.",
    avatar: "/images/testi-michael.jpg"
  },
  {
    name: "Peter Baranik",
    role: "Founder, Colorwee.com",
    headline: "Lower acquisition cost",
    excerpt: "Professional results without the agency markup.",
    avatar: "/images/testi-peter.jpg"
  },
  {
    name: "Jake L",
    role: "Founder, ScaleRankings.com",
    headline: "Hands-off content engine",
    excerpt: "Good work and great customer service.",
    avatar: "/images/testi-jake.jpg"
  },
  {
    name: "Aurelien",
    role: "Founder & CEO, ShieldedResidence.com",
    headline: "Flexible and proactive",
    excerpt: "They were flexible and proactive.",
    avatar: "/images/testi-aurelien.png"
  },
  {
    name: "Roger Yin",
    role: "Growth Hacker, DaluoSeo.com",
    headline: "Consistently exceeds expectations",
    excerpt: "Their dedication to deliver exceptional results is unmatched.",
    avatar: "/images/testi-roger.webp"
  }
] satisfies HomepageTestimonial[];

export const nellProfile = {
  name: "Nell VH",
  role: "Founder, JetDigitalPro",
  bio: "Indonesian entrepreneur focused on SEO, content creation, AI-assisted workflows, and digital growth systems.",
  method: "Human + AI Assisted method with human editorial oversight."
};

export type RollingLine = { text: string };

export const rollingValueProps: string[] = [
  "Menghemat jutaan rupiah per bulan",
  "Melipatgandakan revenue dari pelanggan yang sama",
  "Mencegah fraud senilai ratusan juta",
  "Memprediksi kas & stok sebelum habis",
  "Membangun dashboard Business Intelligence dalam hitungan hari",
  "Meningkatkan brand trust di Google & AI search"
];

export type FounderHighlight = {
  title: string;
  detail: string;
  source: string;
  sourceUrl: string;
};

export const founderHighlights: FounderHighlight[] = [
  {
    title: "Diliput Kompas TV",
    detail: "Author buku AI yang dijual ke berbagai negara. Diliput dalam “AI Generator Revolution Bersama Nell VH, Raih Pendapatan hingga $50K”.",
    source: "Kompas TV",
    sourceUrl: "https://www.kompas.tv/advertorial/568543/ai-generator-revolution-bersama-nell-vh-raih-pendapatan-hingga-50?page=all"
  },
  {
    title: "Founder 2 Digital Agency",
    detail: "JetDigitalPro.com (market utama Amerika) dan Jasa-SEO.id (spesialis SEO pasar Indonesia).",
    source: "JetDigitalPro",
    sourceUrl: "https://jetdigitalpro.com/"
  },
  {
    title: "Penemu GCRIndex & AHE Method™",
    detail: "GCRIndex.com dan AHE Method™ (AI + Human Editor) dipakai membangun Digital Reputation Asset (DRA™) untuk brand & agency internasional.",
    source: "GCRIndex",
    sourceUrl: "https://gcrindex.com/"
  }
];

export type SolutionPillar = {
  id: string;
  name: string;
  benefit: string;
  focus: string;
  services: string[];
};

export const solutionPillars: SolutionPillar[] = [
  {
    id: "revenue",
    name: "Revenue Engine",
    benefit: "Naikkan revenue hingga 2x",
    focus: "Lebih banyak penjualan, tanpa nambah karyawan.",
    services: ["AI Sales Assistant", "AI Repeat Order", "AI Dynamic Pricing", "AI Email Campaign"]
  },
  {
    id: "cost",
    name: "Cost Killer & Ops Automation",
    benefit: "Hemat ratusan juta biaya ops",
    focus: "Buang kerjaan boros, hemat ratusan jam kerja.",
    services: ["AI Chatbot 24/7", "AI Pembukuan & Invoice", "AI Document Processor", "AI Notetaker & Ticket Router"]
  },
  {
    id: "predictive",
    name: "Predictive & Forecasting",
    benefit: "Stop tebak-tebak cashflow",
    focus: "Lihat masa depan bisnis, bukan laporan tahun lalu.",
    services: ["AI Prediksi Cashflow", "AI Demand Planner", "AI Rute Logistik", "AI Customer Signals"]
  },
  {
    id: "decision",
    name: "Decision & Intelligence",
    benefit: "Putuskan 10x lebih cepat",
    focus: "Data jadi co-pilot setiap keputusan.",
    services: ["AI Report Generator", "AI Market Intelligence", "AI Feedback Analyzer", "AI ROI Tracker"]
  },
  {
    id: "security",
    name: "Security, Compliance & Risk",
    benefit: "Cegah fraud ratusan juta",
    focus: "Lindungi bisnis tanpa nambah birokrasi.",
    services: ["AI Deteksi Fraud & Anomali", "AI Kontrak & Compliance", "AI Email Threat Guard", "AI Process Intelligence"]
  },
  {
    id: "brand-trust",
    name: "Brand Trust: GEO & DRA™",
    benefit: "Dipilih AI search & manusia",
    focus: "Brand Anda muncul & dipercaya di AI search.",
    services: ["GEO Reputation Builder", "Digital Reputation Asset (DRA™)", "AI SOP & Knowledge Writer"]
  }
];

export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: "Layanan", href: "/services" },
  { label: "6 Pilar Solusi", href: "/#pillars" },
  { label: "Cara Kerja", href: "/#how-it-works" },
  { label: "Harga", href: "/#pricing" },
  { label: "Founder", href: "/#founder" }
];

export const authorityBadges: { label: string; sub: string }[] = [
  { label: "Diliput Kompas TV", sub: "Author buku AI" },
  { label: "JetDigitalPro & Jasa-SEO.id", sub: "Market AS + Indonesia" },
  { label: "AHE Method™ + DRA™", sub: "Penemu GCRIndex" },
  { label: "31 Solusi Terverifikasi", sub: "Rule engine + AI custom" }
];

export type FrontierCase = {
  title: string;
  detail: string;
  sourceUrl: string;
};

export const frontierCases: FrontierCase[] = [
  {
    title: "AI pecat 4.000 karyawan, saham melonjak, CEO dipuji",
    detail: "Perusahaan AS memangkas ribuan posisi lewat email, tetap bayar pesangon, dan justru lebih hemat.",
    sourceUrl: "https://www.perplexity.ai/search/ae054002-a134-405a-afd2-88509b16569a"
  },
  {
    title: "$20K jadi $1B tanpa karyawan",
    detail: "Matthew Gallagher bangun Medvi dalam 14 bulan dengan AI — membuktikan prediksi Sam Altman 2024. 30% pengusaha China kini mengikuti.",
    sourceUrl: "https://www.perplexity.ai/search/524d023e-e19f-4bd6-9b40-0c3c5d28b5fb?sm=d"
  },
  {
    title: "Brand dikutip AI, Allianz naik 380%",
    detail: "Supplier bangunan, SaaS, Toffin F&B, dan Allianz tumbuh 4x lipat lewat GEO (AI search).",
    sourceUrl: "https://www.perplexity.ai/search/c06a7610-f1e9-4424-b3cd-0a6984da8a65"
  }
];
