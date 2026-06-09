"use client";

import { useCallback, useEffect, useMemo, useState, type ComponentType, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, BarChart3, Check, Download, ExternalLink, Loader2, Sparkles, Target, X } from "lucide-react";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { CtaBand } from "@/components/home/CtaBand";
import { Hero } from "@/components/home/sections/Hero";
import { Fomo } from "@/components/home/sections/Fomo";
import { Pillars } from "@/components/home/sections/Pillars";
import { HowItWorks } from "@/components/home/sections/HowItWorks";
import { WhyPesat } from "@/components/home/sections/WhyPesat";
import { Pricing } from "@/components/home/sections/Pricing";
import { CaseStudies } from "@/components/home/sections/CaseStudies";
import { Testimonial } from "@/components/home/sections/Testimonial";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { CHALLENGE_LABELS, TRANSITION_FACTS } from "@/lib/solutions";
import { hasUsableWhatsAppNumber } from "@/lib/validation";
import { DEFAULT_LANDING_CONFIG, type LandingConfig } from "@/lib/landing";
import type { AdoptionId, ChallengeId, ContactData, DetailId, GeneratedResult, ImpactId, WizardAnswers } from "@/lib/types";

const detailOptions: Record<ChallengeId, Array<{ id: DetailId; label: string }>> = {
  revenue: [
    { id: "follow_up", label: "Follow-up lead lambat" },
    { id: "repeat_order", label: "Repeat order belum rapi" },
    { id: "pricing", label: "Harga sulit dioptimalkan" },
    { id: "lead_quality", label: "Lead banyak tapi kualitas campur" }
  ],
  cost: [
    { id: "admin_cost", label: "Admin terlalu banyak manual" },
    { id: "manual_docs", label: "Dokumen perlu input ulang" },
    { id: "invoice_ap", label: "Invoice/AP makan waktu" },
    { id: "process_waste", label: "Bottleneck proses tidak terlihat" }
  ],
  fraud: [
    { id: "transaction_anomaly", label: "Transaksi aneh terlambat terlihat" },
    { id: "data_leak", label: "Akses/data sulit diawasi" },
    { id: "approval_gap", label: "Approval rawan dilewati" }
  ],
  cash_stock: [
    { id: "cashflow_blind", label: "Cashflow sulit diprediksi" },
    { id: "stockout", label: "Stok habis mendadak" },
    { id: "overstock", label: "Modal tertahan di stok" }
  ],
  reporting: [
    { id: "slow_reports", label: "Laporan telat selesai" },
    { id: "no_bi", label: "Belum ada BI dashboard" },
    { id: "manual_meetings", label: "Meeting banyak tanpa action jelas" }
  ],
  brand_trust: [
    { id: "google_visibility", label: "Sulit unggul di Google" },
    { id: "ai_search", label: "Belum siap muncul di AI search" },
    { id: "review_sentiment", label: "Review dan sentimen tidak terbaca" }
  ]
};

const impactOptions: Array<{ id: ImpactId; label: string; note: string }> = [
  { id: "revenue", label: "Revenue", note: "Naikkan omzet atau repeat order" },
  { id: "hours", label: "Waktu", note: "Hemat jam kerja tim" },
  { id: "risk", label: "Risiko", note: "Kurangi fraud dan blind spot" },
  { id: "cash", label: "Kas/Stok", note: "Prediksi lebih cepat" },
  { id: "trust", label: "Trust", note: "Lebih dipercaya di Google dan AI" }
];

const adoptionOptions: Array<{ id: AdoptionId; label: string; note: string }> = [
  { id: "dfy", label: "DFY", note: "Pesat.AI yang setup dan jalankan" },
  { id: "diy", label: "DIY", note: "Tim internal butuh blueprint" },
  { id: "hybrid", label: "Kombinasi", note: "Pesat.AI bantu setup, tim ikut jalan" },
  { id: "starting", label: "Baru mulai AI", note: "Butuh use case pertama yang jelas" }
];

const initialAnswers: WizardAnswers = {
  mainChallenges: [],
  detailChallenges: [],
  impactLevel: "",
  adoptionStyle: ""
};

const DETAIL_NOTE_WORD_LIMIT = 1000;
const DISCOVERY_SHORT_ANSWER_WORD_LIMIT = 120;

type DiscoveryContextKey = "priorityFocus" | "discoveryGoal";
type DiscoveryContextAnswers = Record<DiscoveryContextKey, string>;

const initialDiscoveryContext: DiscoveryContextAnswers = {
  priorityFocus: "",
  discoveryGoal: ""
};

const OPTIONAL_DISCOVERY_QUESTIONS: Array<{
  id: DiscoveryContextKey;
  label: string;
  helper: string;
  placeholder: string;
  rows: number;
}> = [
  {
    id: "priorityFocus",
    label: "2. Bagian mana yang paling ingin Anda benahi lebih dulu?",
    helper: "Opsional, cukup jawaban singkat agar tim tahu prioritas Anda.",
    placeholder: "Contoh: Saya ingin stok dan pencatatan penjualan rapi dulu karena sering selisih.",
    rows: 3
  },
  {
    id: "discoveryGoal",
    label: "3. Kalau lanjut discovery call, apa yang paling ingin Anda pahami atau putuskan?",
    helper: "Opsional, misalnya tools yang cocok, estimasi biaya, atau urutan implementasi.",
    placeholder: "Contoh: Saya ingin tahu tools yang cocok, kisaran biaya, dan langkah implementasi paling realistis.",
    rows: 3
  }
];

const DISCOVERY_PREP_BY_CHALLENGE: Record<ChallengeId, { title: string; items: string[] }> = {
  revenue: {
    title: "Data yang sebaiknya Anda siapkan",
    items: [
      "Jumlah lead atau chat masuk per hari/minggu, terutama dari WhatsApp dan channel utama Anda.",
      "Catatan follow-up: berapa yang cepat ditangani, berapa yang sering telat atau hilang.",
      "Data repeat order, closing rate, atau produk yang paling sering ditanyakan pelanggan."
    ]
  },
  cost: {
    title: "Data yang sebaiknya Anda siapkan",
    items: [
      "Daftar pekerjaan manual yang paling sering berulang dan memakan waktu tim.",
      "Contoh dokumen, invoice, atau proses admin yang paling sering diinput ulang.",
      "Estimasi jam kerja, error, atau bottleneck yang paling sering membuat biaya membengkak."
    ]
  },
  fraud: {
    title: "Data yang sebaiknya Anda siapkan",
    items: [
      "Contoh transaksi atau aktivitas yang pernah terasa janggal, meski belum terbukti fraud.",
      "Alur approval, akses user, atau titik proses yang paling rawan lolos tanpa kontrol.",
      "Riwayat insiden, komplain, atau kerugian yang pernah muncul karena blind spot pengawasan."
    ]
  },
  cash_stock: {
    title: "Data yang sebaiknya Anda siapkan",
    items: [
      "Data stok masuk-keluar dan produk yang paling sering stockout atau overstock.",
      "Catatan penjualan harian/mingguan dan pola permintaan yang terasa naik-turun.",
      "Arus kas masuk-keluar, piutang, serta momen ketika kas sering terasa ketat."
    ]
  },
  reporting: {
    title: "Data yang sebaiknya Anda siapkan",
    items: [
      "Laporan apa saja yang rutin dibuat dan bagian mana yang paling lama disusun.",
      "Sumber data utama yang dipakai tim, termasuk file, spreadsheet, atau sistem yang terpisah.",
      "Keputusan apa yang sering tertunda karena data belum siap atau belum rapi."
    ]
  },
  brand_trust: {
    title: "Data yang sebaiknya Anda siapkan",
    items: [
      "Keyword, layanan, atau brand term yang paling penting untuk ditemukan calon pelanggan.",
      "Review pelanggan, testimoni, dan pertanyaan yang paling sering muncul tentang bisnis Anda.",
      "Profil bisnis, listing, atau kanal digital yang saat ini paling memengaruhi trust calon pembeli."
    ]
  }
};

const ADOPTION_MODE_SUMMARY: Record<AdoptionId, { label: string; note: string }> = {
  dfy: {
    label: "Mode DFY",
    note: "Fokuskan discovery call pada data, target, dan prioritas bisnis. Tim Pesat.AI yang akan menyiapkan implementasi awalnya."
  },
  diy: {
    label: "Mode DIY",
    note: "Selain data bisnis, siapkan juga siapa dari tim internal yang akan jadi PIC agar blueprint dan eksekusinya langsung nyambung."
  },
  hybrid: {
    label: "Mode Hybrid",
    note: "Yang paling berguna adalah kombinasi data operasional dan kesiapan tim, karena setup awal dibantu tetapi transisi tetap perlu rapi."
  },
  starting: {
    label: "Baru Mulai AI",
    note: "Tidak perlu menyiapkan semuanya sekaligus. Cukup fokus pada satu proses yang paling sering bocor atau paling mudah diukur dulu."
  }
};

type Step = "hero" | "s1" | "fact1" | "s2" | "fact2" | "s3" | "s4" | "s5" | "s6" | "s7" | "s8";

type WizardStep = Exclude<Step, "hero">;
type WizardToneName = "amber" | "sky" | "emerald" | "ink";
type WizardToneToken = {
  canvasBackground: string;
  surfaceBackground: string;
  asideBackground: string;
  badgeClass: string;
  iconClass: string;
  progressClass: string;
  glowClass: string;
  secondaryGlowClass: string;
};

type WizardFlowItem = {
  step: WizardStep;
  number: string;
  railLabel: string;
  railTitle: string;
  railDescription: string;
  tone: WizardToneName;
  icon: ComponentType<{ className?: string }>;
  bullets: string[];
};

const FIELD_CLASS =
  "w-full rounded-[1.35rem] border border-neutral-200 bg-white/85 px-5 py-4 text-neutral-950 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.35)] outline-none transition duration-200 placeholder:text-neutral-400 focus:-translate-y-0.5 focus:border-neutral-900";

const WIZARD_TONES = {
  amber: {
    canvasBackground:
      "radial-gradient(circle at top left, rgba(251,191,36,0.16), transparent 28%), radial-gradient(circle at 82% 18%, rgba(34,211,238,0.14), transparent 26%), linear-gradient(180deg, #fffdf8 0%, #f8fafc 52%, #ffffff 100%)",
    surfaceBackground:
      "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(255,249,240,0.96) 48%, rgba(240,249,255,0.94))",
    asideBackground:
      "linear-gradient(150deg, rgba(255,251,235,0.88), rgba(255,255,255,0.78) 42%, rgba(236,254,255,0.85))",
    badgeClass: "border-amber-200 bg-amber-100/80 text-amber-950",
    iconClass: "border-amber-200 bg-white/80 text-amber-900",
    progressClass: "bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500",
    glowClass: "bg-amber-300/40",
    secondaryGlowClass: "bg-cyan-300/30"
  },
  sky: {
    canvasBackground:
      "radial-gradient(circle at 16% 12%, rgba(125,211,252,0.18), transparent 26%), radial-gradient(circle at 82% 22%, rgba(244,114,182,0.12), transparent 24%), linear-gradient(180deg, #f8fcff 0%, #f8fafc 56%, #ffffff 100%)",
    surfaceBackground:
      "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(240,249,255,0.94) 46%, rgba(253,242,248,0.94))",
    asideBackground:
      "linear-gradient(145deg, rgba(240,249,255,0.9), rgba(255,255,255,0.78) 44%, rgba(253,242,248,0.84))",
    badgeClass: "border-sky-200 bg-sky-100/80 text-sky-950",
    iconClass: "border-sky-200 bg-white/80 text-sky-900",
    progressClass: "bg-gradient-to-r from-sky-500 via-cyan-500 to-fuchsia-500",
    glowClass: "bg-sky-300/35",
    secondaryGlowClass: "bg-fuchsia-200/30"
  },
  emerald: {
    canvasBackground:
      "radial-gradient(circle at 14% 10%, rgba(16,185,129,0.16), transparent 28%), radial-gradient(circle at 84% 18%, rgba(251,191,36,0.14), transparent 24%), linear-gradient(180deg, #f7fdf9 0%, #f8fafc 52%, #ffffff 100%)",
    surfaceBackground:
      "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(236,253,245,0.95) 46%, rgba(255,251,235,0.92))",
    asideBackground:
      "linear-gradient(145deg, rgba(236,253,245,0.9), rgba(255,255,255,0.78) 44%, rgba(255,251,235,0.84))",
    badgeClass: "border-emerald-200 bg-emerald-100/80 text-emerald-950",
    iconClass: "border-emerald-200 bg-white/80 text-emerald-900",
    progressClass: "bg-gradient-to-r from-emerald-500 via-lime-500 to-amber-400",
    glowClass: "bg-emerald-300/35",
    secondaryGlowClass: "bg-amber-200/35"
  },
  ink: {
    canvasBackground:
      "radial-gradient(circle at 15% 14%, rgba(148,163,184,0.16), transparent 26%), radial-gradient(circle at 82% 20%, rgba(251,191,36,0.12), transparent 22%), linear-gradient(180deg, #f8fafc 0%, #f5f5f5 56%, #ffffff 100%)",
    surfaceBackground:
      "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(250,250,250,0.95) 48%, rgba(241,245,249,0.94))",
    asideBackground:
      "linear-gradient(145deg, rgba(248,250,252,0.9), rgba(255,255,255,0.8) 44%, rgba(245,245,245,0.84))",
    badgeClass: "border-slate-200 bg-slate-100/80 text-slate-950",
    iconClass: "border-slate-200 bg-white/80 text-slate-900",
    progressClass: "bg-gradient-to-r from-slate-900 via-slate-700 to-amber-500",
    glowClass: "bg-slate-300/35",
    secondaryGlowClass: "bg-amber-200/30"
  }
} as const satisfies Record<WizardToneName, WizardToneToken>;

const CHALLENGE_NOTES: Record<ChallengeId, string> = {
  revenue: "Cari titik bocor yang paling dekat ke closing, repeat order, atau kualitas lead.",
  cost: "Cocok kalau tim masih tenggelam di pekerjaan manual yang berulang setiap hari.",
  fraud: "Tepat saat blind spot approval, transaksi aneh, atau akses data mulai terasa riskan.",
  cash_stock: "Pilih ini jika stok, kas, dan perencanaan pembelian sering terasa tidak sinkron.",
  reporting: "Dipakai saat laporan lama jadi keputusan ikut lambat dan data sulit dibaca cepat.",
  brand_trust: "Fokus untuk bisnis yang butuh lebih dipercaya di Google, review, dan AI search."
};

const WIZARD_FLOW: WizardFlowItem[] = [
  {
    step: "s1",
    number: "01",
    railLabel: "Tantangan inti",
    railTitle: "Cari kebocoran yang paling mahal",
    railDescription: "Kita mulai dari bottleneck yang paling terasa supaya diagnosis tidak melebar ke mana-mana.",
    tone: "amber",
    icon: Target,
    bullets: ["Pilih maksimal dua area agar rekomendasi tetap fokus.", "Semua step setelah ini akan menyesuaikan arah problem yang Anda pilih."]
  },
  {
    step: "fact1",
    number: "02",
    railLabel: "Reality check",
    railTitle: "Lihat pattern yang sering muncul di lapangan",
    railDescription: "Sisipan insight ini bikin mini session terasa seperti diagnosis, bukan form yang datar.",
    tone: "sky",
    icon: Sparkles,
    bullets: ["Gunakan insight ini sebagai pembanding saat membaca hasil akhir.", "Masalah yang Anda pilih biasanya memang punya pola yang berulang lintas bisnis."]
  },
  {
    step: "s2",
    number: "03",
    railLabel: "Detail operasional",
    railTitle: "Persempit area yang paling sering bocor",
    railDescription: "Semakin spesifik detail yang dipilih, semakin tajam blueprint yang bisa disusun.",
    tone: "sky",
    icon: Target,
    bullets: ["Ini membantu membedakan gejala permukaan vs akar masalah.", "Detail yang tepat membuat rekomendasi tidak generik."]
  },
  {
    step: "fact2",
    number: "04",
    railLabel: "Opportunity signal",
    railTitle: "Lihat kenapa area ini layak diprioritaskan",
    railDescription: "Insight kedua dipakai untuk menggeser mindset dari masalah ke peluang yang terukur.",
    tone: "emerald",
    icon: Sparkles,
    bullets: ["Mini session jadi terasa progresif karena ada konteks di antara decision points.", "Nanti sinyal ini akan nyambung ke estimasi impact di hasil akhir."]
  },
  {
    step: "s3",
    number: "05",
    railLabel: "Target impact",
    railTitle: "Tentukan efek bisnis yang paling ingin terasa duluan",
    railDescription: "Kita perlu tahu hasil apa yang paling bernilai buat Anda sebelum bicara tools.",
    tone: "emerald",
    icon: BarChart3,
    bullets: ["Dampak yang dipilih akan mengubah framing hasil dan prioritas implementasi.", "Fokus awal yang jelas membuat keputusan lebih cepat."]
  },
  {
    step: "s4",
    number: "06",
    railLabel: "Mode adopsi",
    railTitle: "Sesuaikan ritme eksekusi dengan kesiapan tim",
    railDescription: "Solusi yang bagus tetap perlu cara adopsi yang pas agar tidak berhenti di presentasi.",
    tone: "ink",
    icon: Check,
    bullets: ["DFY, DIY, dan Hybrid butuh ritme pendampingan yang berbeda.", "Pilihan ini membantu Pesat.AI menyesuaikan level intervensi."]
  },
  {
    step: "s5",
    number: "07",
    railLabel: "Review hipotesis",
    railTitle: "Pastikan arah diagnosis sudah terasa pas",
    railDescription: "Sebelum hasil disusun, kita cek dulu apakah hipotesis kerjanya sudah cukup akurat.",
    tone: "ink",
    icon: BarChart3,
    bullets: ["Review singkat ini menjaga kualitas output tetap relevan.", "Anda masih bisa mengubah arah sebelum hasil dibuat."]
  },
  {
    step: "s6",
    number: "08",
    railLabel: "Context capture",
    railTitle: "Kirim konteks supaya hasil terasa lebih personal",
    railDescription: "Di step ini kita mengubah jawaban pilihan menjadi bahan diagnosis yang jauh lebih tajam.",
    tone: "amber",
    icon: Check,
    bullets: ["Nama dan WhatsApp dipakai untuk mengirim hasil serta tindak lanjut yang relevan.", "Catatan operasional membuat output tidak terdengar seperti template umum."]
  },
  {
    step: "s7",
    number: "09",
    railLabel: "Result board",
    railTitle: "Baca hasil seperti board mini yang siap dibawa diskusi",
    railDescription: "Output dirancang agar langsung bisa dipakai untuk menyamakan persepsi internal.",
    tone: "emerald",
    icon: Sparkles,
    bullets: ["Anda dapat headline, diagnosis, impact, dan rencana aksi dalam satu alur.", "Hasil ini sengaja dibuat shareable supaya momentum tidak hilang."]
  },
  {
    step: "s8",
    number: "10",
    railLabel: "Discovery handoff",
    railTitle: "Ubah hasil mini session jadi keputusan eksekusi",
    railDescription: "Discovery call dipakai untuk memvalidasi prioritas, data, dan budget yang paling realistis.",
    tone: "sky",
    icon: Target,
    bullets: ["Tim masuk ke call dengan konteks yang lebih matang.", "Tujuannya bukan mengulang pertanyaan dasar, tapi mempercepat keputusan."]
  }
];

export function PesatExperience({ landing }: { landing?: LandingConfig } = {}) {
  const cfg = landing ?? DEFAULT_LANDING_CONFIG;
  const [step, setStep] = useState<Step>("hero");
  const [sessionId, setSessionId] = useState<string>("");
  const [answers, setAnswers] = useState<WizardAnswers>(initialAnswers);
  const [contact, setContact] = useState<ContactData>({});
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailNote, setDetailNote] = useState("");
  const [discoveryContext, setDiscoveryContext] = useState<DiscoveryContextAnswers>(initialDiscoveryContext);
  const [resultError, setResultError] = useState("");
  const [discoveryError, setDiscoveryError] = useState("");
  const [discoveryNotice, setDiscoveryNotice] = useState("");

  const primaryChallenge = answers.mainChallenges[0] || "revenue";
  const fact = TRANSITION_FACTS[primaryChallenge];
  const detailNoteWordCount = useMemo(() => countWords(detailNote), [detailNote]);

  const track = useCallback(
    async (type: "screen_view" | "click", screen: Step, metadata?: Record<string, unknown>, sessionIdOverride?: string) => {
      await fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionIdOverride || sessionId, type, screen, metadata })
      }).catch(() => undefined);
    },
    [sessionId]
  );

  useEffect(() => {
    if (step !== "hero") {
      void track("screen_view", step);
    }
  }, [step, track]);

  const selectedDetails = useMemo(() => {
    const clusters = answers.mainChallenges.length ? answers.mainChallenges : ["revenue" as ChallengeId];
    return clusters.flatMap((cluster) => detailOptions[cluster]);
  }, [answers.mainChallenges]);

  const selectedDetailLabels = useMemo(
    () => selectedDetails.filter((item) => answers.detailChallenges.includes(item.id)).map((item) => item.label),
    [answers.detailChallenges, selectedDetails]
  );

  const activeStage = WIZARD_FLOW.find((item) => item.step === (step === "hero" ? "s1" : step)) ?? WIZARD_FLOW[0];
  const activeStageIndex = WIZARD_FLOW.findIndex((item) => item.step === activeStage.step);
  const activeTone = WIZARD_TONES[activeStage.tone];
  const progressPercent = ((activeStageIndex + 1) / WIZARD_FLOW.length) * 100;
  const selectedChallengeLabels = answers.mainChallenges.map((id) => CHALLENGE_LABELS[id]);
  const impactSummary = impactOptions.find((item) => item.id === answers.impactLevel)?.label || "Belum dipilih";
  const adoptionSummaryValue = adoptionOptions.find((item) => item.id === answers.adoptionStyle)?.label || "Belum dipilih";
  const sessionSnapshot = [
    {
      label: "Fokus masalah",
      value: selectedChallengeLabels.length ? summarizeLabels(selectedChallengeLabels, 2) : "Pilih 1-2 area agar diagnosis tetap tajam."
    },
    {
      label: "Detail operasional",
      value: selectedDetailLabels.length ? summarizeLabels(selectedDetailLabels, 2) : "Belum dipersempit. Step ini akan menajamkan gejala yang paling sering bocor."
    },
    {
      label: "Target impact",
      value: impactSummary === "Belum dipilih" ? "Belum dipilih. Nanti Anda tentukan outcome bisnis yang ingin terasa duluan." : impactSummary
    },
    {
      label: "Mode eksekusi",
      value: adoptionSummaryValue === "Belum dipilih" ? "Belum dipilih. Kita akan sesuaikan ritme implementasi dengan kesiapan tim." : adoptionSummaryValue
    },
    {
      label: "Konteks tambahan",
      value: detailNoteWordCount ? `${detailNoteWordCount} kata konteks sudah masuk untuk memperkaya diagnosis.` : "Masih kosong. Tambahkan cerita operasional agar hasil terasa lebih spesifik."
    }
  ];

  // Name + a usable WhatsApp number are required before generating the result.
  const canGenerate = Boolean(contact.name && contact.name.trim()) && hasUsableWhatsAppNumber(contact.wa || "");

  function handleDetailNoteChange(value: string) {
    setDetailNote(trimToWordLimit(value, DETAIL_NOTE_WORD_LIMIT));
  }

  function handleDiscoveryContextChange(key: DiscoveryContextKey, value: string) {
    setDiscoveryContext((current) => ({
      ...current,
      [key]: trimToWordLimit(value, DISCOVERY_SHORT_ANSWER_WORD_LIMIT)
    }));
  }

  async function saveSession(nextAnswers = answers, nextContact = contact, completed = false) {
    const activeSessionId = sessionId || crypto.randomUUID();
    if (!sessionId) setSessionId(activeSessionId);

    const response = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: activeSessionId, answers: nextAnswers, contact: nextContact, completed })
    }).catch(() => null);
    const data = response ? ((await response.json().catch(() => ({}))) as { sessionId?: string }) : {};
    return data.sessionId || activeSessionId;
  }

  async function startWizard() {
    const activeSessionId = await saveSession();
    await track("click", "hero", { cta: "Buktikan Sendiri dalam 5 Menit" }, activeSessionId);
    setStep("s1");
  }

  function toggleChallenge(id: ChallengeId) {
    setAnswers((current) => {
      const exists = current.mainChallenges.includes(id);
      const mainChallenges = exists ? current.mainChallenges.filter((item) => item !== id) : [...current.mainChallenges, id].slice(0, 2);
      return { ...current, mainChallenges, detailChallenges: [] };
    });
  }

  function toggleDetail(id: DetailId) {
    setAnswers((current) => ({
      ...current,
      detailChallenges: current.detailChallenges.includes(id) ? current.detailChallenges.filter((item) => item !== id) : [...current.detailChallenges, id]
    }));
  }

  async function generateResult() {
    if (!canGenerate) {
      setResultError("Mohon isi Nama Anda dan Nomor WhatsApp yang valid agar hasil bisa disusun.");
      return;
    }
    setLoading(true);
    setResultError("");
    const nextAnswers = { ...answers, detailNote };
    try {
      const activeSessionId = await saveSession(nextAnswers, contact, true);
      const response = await fetch("/api/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: activeSessionId, answers: nextAnswers, contact })
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Hasil belum bisa dibuat.");
      }
      const data = (await response.json()) as GeneratedResult;
      if (!data.headline || !Array.isArray(data.impactCards) || !Array.isArray(data.solutionsText)) {
        throw new Error("Format hasil belum valid.");
      }
      setResult(data);
      setStep("s7");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Hasil belum bisa dibuat.";
      setResultError(`${message} Silakan coba lagi.`);
      void track("click", "s6", { error: "result_generation_failed", message });
    } finally {
      setLoading(false);
    }
  }

  async function saveResultDetailNote(note: string) {
    if (!result && !sessionId) return;
    await saveSession({ ...answers, detailNote: note }, contact, Boolean(result));
  }

  async function downloadPdf() {
    const node = document.getElementById("result-panel");
    if (!node) return;
    const canvas = await html2canvas(node, { backgroundColor: "#ffffff", scale: 2 });
    const image = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(image, "PNG", 0, 0, width, Math.min(height, pdf.internal.pageSize.getHeight()));
    pdf.save(`pesat-ai-result-${result?.sessionId || "session"}.pdf`);
  }

  async function copyResultLink(activeResult: GeneratedResult) {
    const shareUrl = `${window.location.origin}/result/${activeResult.sessionId}`;
    if (activeResult.persisted) {
      await navigator.clipboard.writeText(shareUrl);
      await track("click", "s7", { cta: "Copy Link" }, activeResult.sessionId);
    }
  }

  async function submitDiscovery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setDiscoveryError("");
    setDiscoveryNotice("");
    const form = new FormData(event.currentTarget);
    const payload = {
      sessionId: result?.sessionId || sessionId,
      companyName: String(form.get("companyName") || contact.companyName || ""),
      name: String(form.get("name") || contact.name || ""),
      wa: String(form.get("wa") || contact.wa || ""),
      budgetContext: String(form.get("budgetContext") || ""),
      message: buildDiscoveryContextMessage(detailNote, discoveryContext),
      summary: result?.headline
    };
    try {
      const response = await fetch("/api/discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await response.json().catch(() => ({}))) as { whatsappUrl?: string; error?: string; persisted?: boolean };
      if (!response.ok || !data.whatsappUrl) {
        throw new Error(data.error || "Discovery call belum bisa diproses.");
      }
      if (!data.persisted) {
        setDiscoveryNotice("Discovery request belum tersimpan ke DB karena Supabase belum tersambung. WhatsApp tetap dibuka.");
      }
      await track("click", "s8", { cta: "Submit Discovery Call", persisted: Boolean(data.persisted) }, result?.sessionId || sessionId);
      window.location.href = data.whatsappUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Discovery call belum bisa diproses.";
      setDiscoveryError(`${message} Periksa data dan coba lagi.`);
      void track("click", "s8", { error: "discovery_request_failed", message }, result?.sessionId || sessionId);
    } finally {
      setLoading(false);
    }
  }

  const scheduleDiscovery = () => {
    void track("click", "hero", { cta: "schedule_discovery" });
    void startWizard();
  };

  return (
    <main className="min-h-screen bg-surface text-foreground">
      {step === "hero" ? (
        <>
          <Header onStartWizard={startWizard} />
          <Hero onStartWizard={startWizard} onScheduleDiscovery={scheduleDiscovery} overrides={cfg.overrides} />
          {cfg.sections.fomo ? <Fomo onStartWizard={startWizard} /> : null}
          {cfg.sections.pillars ? <Pillars onStartWizard={startWizard} /> : null}
          {cfg.sections.howItWorks ? <HowItWorks onStartWizard={startWizard} /> : null}
          {cfg.sections.ctaLight ? <CtaBand variant="light" onStartWizard={startWizard} /> : null}
          {cfg.sections.whyPesat ? <WhyPesat /> : null}
          {cfg.sections.caseStudies ? <CaseStudies /> : null}
          {cfg.sections.testimonial ? <Testimonial /> : null}
          {cfg.sections.pricing ? <Pricing onStartWizard={startWizard} /> : null}
          {cfg.sections.ctaDark ? <CtaBand variant="dark" showSecondary onStartWizard={startWizard} onScheduleDiscovery={scheduleDiscovery} /> : null}
          <Footer onStartWizard={startWizard} />
        </>
      ) : (
        <section className="fixed inset-0 z-20 overflow-y-auto">
          <div className="absolute inset-0" style={{ backgroundImage: activeTone.canvasBackground }} />
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className={`absolute left-[-8%] top-16 h-64 w-64 rounded-full blur-3xl ${activeTone.glowClass} animate-soft-drift`} />
            <div
              className={`absolute right-[-6%] top-1/3 h-72 w-72 rounded-full blur-3xl ${activeTone.secondaryGlowClass} animate-soft-drift`}
              style={{ animationDelay: "1200ms" }}
            />
          </div>

          <div className={`relative mx-auto min-h-screen w-full px-4 py-4 sm:px-6 lg:px-8 ${step === "s7" ? "max-w-7xl" : "max-w-6xl"}`}>
            <div className="mb-5 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => (step === "s1" ? setStep("hero") : setStep(previousStep(step)))}
                className="grid h-12 w-12 place-items-center rounded-full border border-white/70 bg-white/70 text-neutral-900 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.7)] backdrop-blur-xl transition hover:-translate-y-0.5"
                aria-label="Kembali"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex flex-col items-center text-center">
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${activeTone.badgeClass}`}>
                  Beat {activeStage.number}
                </span>
                <div className="mt-2 text-sm font-semibold text-neutral-500">Pesat.AI Mini Session</div>
              </div>
              <button
                type="button"
                onClick={() => setStep("hero")}
                className="grid h-12 w-12 place-items-center rounded-full border border-white/70 bg-white/70 text-neutral-900 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.7)] backdrop-blur-xl transition hover:-translate-y-0.5"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]">
              <WizardContextRail
                activeStage={activeStage}
                activeStageIndex={activeStageIndex}
                progressPercent={progressPercent}
                tone={activeTone}
                primaryChallengeLabel={CHALLENGE_LABELS[primaryChallenge]}
                sessionSnapshot={sessionSnapshot}
              />

              <div className="lg:pt-1">
                {step === "s7" && result ? (
                  <div className="animate-fade-in-up pb-10">
                    <div
                      className="mb-4 overflow-hidden rounded-[1.75rem] border border-white/70 p-5 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-6"
                      style={{ backgroundImage: activeTone.surfaceBackground }}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">Result board siap</p>
                          <h2 className="mt-2 max-w-3xl text-3xl font-semibold leading-tight text-neutral-950 sm:text-4xl">
                            Hasil mini session kini terasa seperti board singkat yang siap dibawa ke diskusi internal.
                          </h2>
                        </div>
                        <span className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm font-semibold ${activeTone.badgeClass}`}>Blueprint + Impact + Action Plan</span>
                      </div>
                    </div>
                    <ResultPanel
                      answers={answers}
                      result={result}
                      detailNote={detailNote}
                      detailNoteWordCount={detailNoteWordCount}
                      discoveryContext={discoveryContext}
                      setDetailNote={setDetailNote}
                      onDiscoveryContextChange={handleDiscoveryContextChange}
                      onDetailNoteBlur={saveResultDetailNote}
                      onShare={() => copyResultLink(result)}
                      onPdf={async () => {
                        await track("click", "s7", { cta: "Export PDF" }, result.sessionId);
                        await downloadPdf();
                      }}
                      onDiscovery={async () => {
                        await saveResultDetailNote(detailNote);
                        void track("click", "s7", { cta: "Discovery Call" }, result.sessionId);
                        setStep("s8");
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className="relative overflow-hidden rounded-[2rem] border border-white/70 p-5 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-8 lg:p-10 animate-fade-in-up"
                    style={{ backgroundImage: activeTone.surfaceBackground }}
                  >
                    <div className={`pointer-events-none absolute -right-16 top-[-10%] h-56 w-56 rounded-full blur-3xl ${activeTone.secondaryGlowClass}`} />
                    <div className={`pointer-events-none absolute -left-12 bottom-0 h-40 w-40 rounded-full blur-3xl ${activeTone.glowClass}`} />

                    <div className="relative">
                      {step === "s1" && (
                        <QuestionShell
                          eyebrow="01 / Tantangan terbesar"
                          title="Apa tantangan terbesar bisnis Anda sekarang?"
                          note="Pilih 1-2 area yang paling mahal jika dibiarkan. Dari sini arah diagnosis akan dibentuk."
                        >
                          <div className="grid gap-3">
                            {(Object.entries(CHALLENGE_LABELS) as Array<[ChallengeId, string]>).map(([id, label], index) => (
                              <ChoiceButton
                                key={id}
                                active={answers.mainChallenges.includes(id)}
                                onClick={() => toggleChallenge(id)}
                                label={label}
                                note={CHALLENGE_NOTES[id]}
                                index={index + 1}
                              />
                            ))}
                          </div>
                          <PrimaryAction disabled={answers.mainChallenges.length === 0} onClick={() => saveSession().then(() => setStep("fact1"))} label="Lanjut ke Sinyal Industri" />
                        </QuestionShell>
                      )}

                      {step === "fact1" && (
                        <FactScreen fact={fact.first} source={fact.source} onNext={() => setStep("s2")} stage={activeStage} tone={activeTone} />
                      )}

                      {step === "s2" && (
                        <QuestionShell
                          eyebrow="02 / Detail tantangan"
                          title="Bagian mana yang paling terasa sekarang?"
                          note="Pilih semua yang relevan. Semakin tajam bagian yang dipilih, semakin terasa diagnosisnya."
                        >
                          <div className="grid gap-3">
                            {selectedDetails.map((item, index) => (
                              <ChoiceButton
                                key={item.id}
                                active={answers.detailChallenges.includes(item.id)}
                                onClick={() => toggleDetail(item.id)}
                                label={item.label}
                                index={index + 1}
                              />
                            ))}
                          </div>
                          <PrimaryAction disabled={answers.detailChallenges.length === 0} onClick={() => saveSession().then(() => setStep("fact2"))} label="Lanjut ke Opportunity Signal" />
                        </QuestionShell>
                      )}

                      {step === "fact2" && (
                        <FactScreen fact={fact.second} source={fact.source} onNext={() => setStep("s3")} stage={activeStage} tone={activeTone} />
                      )}

                      {step === "s3" && (
                        <QuestionShell
                          eyebrow="03 / Skala dampak"
                          title="Dampak apa yang paling ingin Anda lihat dulu?"
                          note="Kita prioritaskan efek bisnis pertama yang paling berarti buat Anda, baru bicara detail implementasi."
                        >
                          <div className="grid gap-3">
                            {impactOptions.map((item, index) => (
                              <ChoiceButton
                                key={item.id}
                                active={answers.impactLevel === item.id}
                                onClick={() => setAnswers({ ...answers, impactLevel: item.id })}
                                label={item.label}
                                note={item.note}
                                index={index + 1}
                              />
                            ))}
                          </div>
                          <PrimaryAction disabled={!answers.impactLevel} onClick={() => saveSession().then(() => setStep("s4"))} label="Lanjut ke Mode Adopsi" />
                        </QuestionShell>
                      )}

                      {step === "s4" && (
                        <QuestionShell
                          eyebrow="04 / Preferensi adopsi"
                          title="Cara adopsi AI seperti apa yang paling cocok?"
                          note="Pilihan ini membantu kami menyesuaikan ritme implementasi dengan kapasitas tim dan ekspektasi Anda."
                        >
                          <div className="grid gap-3">
                            {adoptionOptions.map((item, index) => (
                              <ChoiceButton
                                key={item.id}
                                active={answers.adoptionStyle === item.id}
                                onClick={() => setAnswers({ ...answers, adoptionStyle: item.id })}
                                label={item.label}
                                note={item.note}
                                index={index + 1}
                              />
                            ))}
                          </div>
                          <PrimaryAction disabled={!answers.adoptionStyle} onClick={() => saveSession().then(() => setStep("s5"))} label="Review Arah Diagnosis" />
                        </QuestionShell>
                      )}

                      {step === "s5" && (
                        <QuestionShell
                          eyebrow="05 / Review"
                          title="Cek sebentar. Apakah arah diagnosis ini sudah pas?"
                          note="Anggap ini sebagai hipotesis kerja. Kalau sudah terasa pas, kita lanjut susun hasilnya."
                        >
                          <ReviewRow label="Tantangan" value={selectedChallengeLabels.length ? summarizeLabels(selectedChallengeLabels, 2) : "-"} onEdit={() => setStep("s1")} />
                          <ReviewRow label="Detail" value={selectedDetailLabels.length ? summarizeLabels(selectedDetailLabels, 2) : "-"} onEdit={() => setStep("s2")} />
                          <ReviewRow label="Dampak" value={impactSummary} onEdit={() => setStep("s3")} />
                          <ReviewRow label="Adopsi" value={adoptionSummaryValue} onEdit={() => setStep("s4")} />
                          <PrimaryAction onClick={() => setStep("s6")} label="Lanjut Susun Hasil" />
                        </QuestionShell>
                      )}

                      {step === "s6" && (
                        <QuestionShell
                          eyebrow="06 / Data Anda"
                          title="Ke mana hasil & rencana ini kami kirim?"
                          note="Nama dan WhatsApp wajib agar kami bisa menyusun hasil dan mengirim rincian rencananya ke Anda."
                        >
                          <div className="mb-6 grid gap-3 sm:grid-cols-3">
                            {[
                              { title: "Diagnosis tajam", body: "Jawaban pilihan Anda kami olah jadi hipotesis masalah yang lebih fokus." },
                              { title: "Impact yang kebayang", body: "Hasil akan menampilkan estimasi impact dan perubahan before-after." },
                              { title: "Rencana bertahap", body: "Output akhir bukan cuma insight, tapi juga langkah pertama yang realistis." }
                            ].map((card) => (
                              <div key={card.title} className="rounded-[1.35rem] border border-neutral-200 bg-white/70 p-4 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.35)]">
                                <p className="text-sm font-semibold text-neutral-950">{card.title}</p>
                                <p className="mt-2 text-sm leading-6 text-neutral-600">{card.body}</p>
                              </div>
                            ))}
                          </div>
                          <ContactFields contact={contact} setContact={setContact} />
                          <label className="mt-5 block">
                            <span className="mb-2 block text-sm font-semibold text-neutral-500">Ceritakan tantangan Anda lebih detail</span>
                            <textarea
                              value={detailNote}
                              onChange={(event) => handleDetailNoteChange(event.target.value)}
                              rows={5}
                              className={FIELD_CLASS}
                              placeholder="Contoh: penjualan banyak lewat WhatsApp, tapi follow-up sering telat dan pelanggan lama jarang beli lagi. Saya ingin tahu proses mana yang paling cepat dibenahi lebih dulu."
                            />
                            <div className="mt-2 flex items-center justify-between gap-4 text-xs text-neutral-400">
                              <span>Semakin detail konteks Anda, semakin spesifik hasil dan rencana yang kami susun.</span>
                              <span>{detailNoteWordCount}/{DETAIL_NOTE_WORD_LIMIT} kata</span>
                            </div>
                          </label>
                          <PrimaryAction
                            onClick={generateResult}
                            label={loading ? "Menyusun hasil & rencana..." : "Susun Hasil & Rencana Saya"}
                            disabled={loading || !canGenerate}
                            loading={loading}
                          />
                          {!canGenerate ? <p className="mt-3 text-xs text-neutral-400">Isi Nama Anda dan Nomor WhatsApp yang valid untuk melanjutkan.</p> : null}
                          {resultError ? <p className="mt-4 rounded-[1.35rem] border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold leading-6 text-red-700">{resultError}</p> : null}
                        </QuestionShell>
                      )}

                      {step === "s8" && result && (
                        <QuestionShell
                          eyebrow="08 / Discovery call"
                          title="Diskusikan solusi khusus untuk bisnis dan budget Anda."
                          note="Kami gunakan hasil mini session ini sebagai titik start, lalu sesuaikan dengan realitas operasional dan prioritas budget Anda."
                        >
                          <div className="mb-6 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-[1.35rem] border border-neutral-200 bg-white/70 p-4 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.35)]">
                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Headline hasil</p>
                              <p className="mt-2 text-sm font-semibold leading-6 text-neutral-950">{result.headline}</p>
                            </div>
                            <div className="rounded-[1.35rem] border border-neutral-200 bg-white/70 p-4 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.35)]">
                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Langkah pertama</p>
                              <p className="mt-2 text-sm font-semibold leading-6 text-neutral-950">{result.firstStep}</p>
                            </div>
                            <div className="rounded-[1.35rem] border border-neutral-200 bg-white/70 p-4 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.35)]">
                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Output discovery</p>
                              <p className="mt-2 text-sm font-semibold leading-6 text-neutral-950">Prioritas implementasi, budget context, dan keputusan next step yang lebih konkret.</p>
                            </div>
                          </div>
                          <form onSubmit={submitDiscovery} className="grid gap-4">
                            <ContactFields contact={contact} setContact={setContact} />
                            <label className="block">
                              <span className="mb-2 block text-sm font-semibold text-neutral-500">Konteks budget atau target bisnis</span>
                              <input name="budgetContext" className={FIELD_CLASS} placeholder="Contoh: target 3 bulan ke depan, range budget, atau area yang harus diprioritaskan dulu." />
                            </label>
                            <PrimaryAction type="submit" label={loading ? "Menyimpan..." : "Ya, Saya Mau Discovery Call"} loading={loading} disabled={loading} />
                            {discoveryError ? <p className="rounded-[1.35rem] border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold leading-6 text-red-700">{discoveryError}</p> : null}
                            {discoveryNotice ? <p className="rounded-[1.35rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-700">{discoveryNotice}</p> : null}
                          </form>
                        </QuestionShell>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function countWords(value: string): number {
  const words = value.trim().match(/\S+/g);
  return words ? words.length : 0;
}

function trimToWordLimit(value: string, maxWords: number): string {
  const normalized = value.replace(/\r\n/g, "\n");
  const matches = normalized.match(/\S+/g);
  if (!matches || matches.length <= maxWords) return normalized;

  let wordCount = 0;
  let lastAllowedIndex = 0;
  const matcher = /\S+/g;
  let match: RegExpExecArray | null;

  while ((match = matcher.exec(normalized)) !== null) {
    wordCount += 1;
    if (wordCount > maxWords) break;
    lastAllowedIndex = match.index + match[0].length;
  }

  return normalized.slice(0, lastAllowedIndex).trimEnd();
}

function buildDiscoveryContextMessage(detailNote: string, discoveryContext: DiscoveryContextAnswers): string {
  const blocks = [
    detailNote.trim() ? `1. Tantangan detail\n${detailNote.trim()}` : "",
    discoveryContext.priorityFocus.trim() ? `2. Prioritas yang ingin dibenahi lebih dulu\n${discoveryContext.priorityFocus.trim()}` : "",
    discoveryContext.discoveryGoal.trim() ? `3. Yang ingin dipahami atau diputuskan saat discovery call\n${discoveryContext.discoveryGoal.trim()}` : ""
  ].filter(Boolean);

  return blocks.join("\n\n");
}

function previousStep(step: Step): Step {
  const order: Step[] = ["hero", "s1", "fact1", "s2", "fact2", "s3", "s4", "s5", "s6", "s7", "s8"];
  return order[Math.max(0, order.indexOf(step) - 1)];
}

function summarizeLabels(labels: string[], maxItems = 2): string {
  if (!labels.length) return "-";
  const visible = labels.slice(0, maxItems);
  return labels.length > maxItems ? `${visible.join(", ")} +${labels.length - maxItems}` : visible.join(", ");
}

function WizardContextRail({
  activeStage,
  activeStageIndex,
  progressPercent,
  tone,
  primaryChallengeLabel,
  sessionSnapshot
}: {
  activeStage: WizardFlowItem;
  activeStageIndex: number;
  progressPercent: number;
  tone: WizardToneToken;
  primaryChallengeLabel: string;
  sessionSnapshot: Array<{ label: string; value: string }>;
}) {
  const Icon = activeStage.icon;

  return (
    <aside className="lg:sticky lg:top-6">
      <div
        className="relative overflow-hidden rounded-[2rem] border border-white/70 p-5 shadow-[0_36px_100px_-58px_rgba(15,23,42,0.55)] backdrop-blur-xl sm:p-6"
        style={{ backgroundImage: tone.asideBackground }}
      >
        <div className={`pointer-events-none absolute -left-10 top-14 h-36 w-36 rounded-full blur-3xl ${tone.glowClass} animate-soft-drift`} />
        <div className={`pointer-events-none absolute -right-10 bottom-0 h-32 w-32 rounded-full blur-3xl ${tone.secondaryGlowClass} animate-soft-drift`} style={{ animationDelay: "900ms" }} />

        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${tone.badgeClass}`}>
              Pesat.AI Session
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Beat {activeStageIndex + 1}/10</span>
          </div>

          <div className="mt-5 flex items-start gap-4">
            <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-[1.35rem] border ${tone.iconClass} shadow-[0_18px_50px_-32px_rgba(15,23,42,0.55)] backdrop-blur`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">{activeStage.railLabel}</p>
              <h3 className="mt-2 text-2xl font-semibold leading-tight text-neutral-950">{activeStage.railTitle}</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">{activeStage.railDescription}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              <span>Progress</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/80">
              <div className={`h-full rounded-full ${tone.progressClass}`} style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {WIZARD_FLOW.map((item, index) => {
                const isDone = index < activeStageIndex;
                const isCurrent = index === activeStageIndex;

                return (
                  <span
                    key={item.step}
                    className={`inline-flex min-h-10 min-w-10 items-center justify-center rounded-2xl border px-3 text-xs font-semibold shadow-[0_16px_40px_-34px_rgba(15,23,42,0.45)] ${
                      isDone ? "border-neutral-950 bg-neutral-950 text-white" : isCurrent ? `${tone.badgeClass}` : "border-white/80 bg-white/55 text-neutral-400"
                    }`}
                  >
                    {isDone ? <Check className="h-4 w-4" /> : item.number}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-white/70 bg-white/72 p-5 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.35)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Kenapa step ini penting</p>
            <div className="mt-4 space-y-3">
              {activeStage.bullets.map((bullet) => (
                <div key={bullet} className="flex gap-3">
                  <span className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${tone.progressClass}`} />
                  <p className="text-sm leading-6 text-neutral-700">{bullet}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-neutral-900/90 bg-neutral-950 p-5 text-white shadow-[0_28px_80px_-40px_rgba(15,23,42,0.7)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Hipotesis aktif</p>
            <p className="mt-3 text-lg font-semibold leading-7">{primaryChallengeLabel}</p>
            <p className="mt-3 text-sm leading-6 text-white/70">Pilihan dan konteks Anda akan terus mempertajam diagnosis sampai hasil akhir siap dibaca dan dibawa meeting.</p>
          </div>

          <div className="mt-6 space-y-3">
            {sessionSnapshot.map((item) => (
              <div key={item.label} className="rounded-[1.35rem] border border-white/70 bg-white/65 p-4 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">{item.label}</p>
                <p className="mt-2 text-sm font-medium leading-6 text-neutral-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

function QuestionShell({ eyebrow, title, note, children }: { eyebrow: string; title: string; note?: string; children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col justify-center pb-4">
      <div className="mb-6 w-fit rounded-full border border-white/80 bg-white/80 px-4 py-2 shadow-[0_14px_36px_-24px_rgba(15,23,42,0.35)] backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">{eyebrow}</p>
      </div>
      <h2 className="mb-4 max-w-4xl text-balance text-4xl font-semibold leading-tight tracking-normal text-neutral-950 sm:text-6xl">{title}</h2>
      {note ? <p className="mb-8 max-w-3xl text-base font-medium leading-7 text-neutral-600">{note}</p> : <div className="mb-6" />}
      {children}
    </div>
  );
}

function ChoiceButton({ active, onClick, label, note, index }: { active: boolean; onClick: () => void; label: string; note?: string; index?: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[1.55rem] border px-5 py-5 text-left transition duration-300 ${
        active
          ? "border-neutral-950 bg-neutral-950 text-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)]"
          : "border-neutral-200 bg-white/82 text-neutral-950 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.35)] hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[0_30px_70px_-44px_rgba(15,23,42,0.45)]"
      }`}
    >
      <div
        className={`absolute inset-0 ${
          active
            ? "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_42%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent)]"
            : "bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.12),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.1),transparent_38%)] opacity-0 transition group-hover:opacity-100"
        }`}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <span className={`mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-2xl border text-sm font-semibold ${active ? "border-white/15 bg-white/10 text-white" : "border-neutral-200 bg-neutral-50 text-neutral-500"}`}>
            {active ? <Check className="h-5 w-5" /> : String(index || 0).padStart(2, "0")}
          </span>
          <span>
            <span className="block text-base font-semibold leading-6">{label}</span>
            {note ? <span className={`mt-2 block text-sm leading-6 ${active ? "text-neutral-300" : "text-neutral-500"}`}>{note}</span> : null}
          </span>
        </div>
        <ArrowRight className={`mt-1 h-5 w-5 shrink-0 transition ${active ? "text-white" : "text-neutral-300 group-hover:translate-x-1 group-hover:text-neutral-600"}`} />
      </div>
    </button>
  );
}

function PrimaryAction({ label, onClick, disabled, loading, type = "button" }: { label: string; onClick?: () => void; disabled?: boolean; loading?: boolean; type?: "button" | "submit" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="group relative mt-8 flex min-h-14 w-full items-center justify-center overflow-hidden rounded-full bg-neutral-950 px-6 text-base font-semibold text-white shadow-[0_24px_80px_-34px_rgba(15,23,42,0.75)] transition duration-300 hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:shadow-none"
    >
      <span className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_30%,rgba(255,255,255,0.14),transparent_65%)] opacity-0 transition group-hover:opacity-100" />
      <span className="absolute left-[-30%] top-0 h-full w-24 bg-gradient-to-r from-white/0 via-white/25 to-white/0 opacity-0 blur-lg transition group-hover:animate-cta-shimmer group-hover:opacity-100" />
      <span className="relative flex items-center gap-2">
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        {label}
        {!loading ? <ArrowRight className="h-5 w-5" /> : null}
      </span>
    </button>
  );
}

function FactScreen({ fact, source, onNext, stage, tone }: { fact: string; source: string; onNext: () => void; stage: WizardFlowItem; tone: WizardToneToken }) {
  const Icon = stage.icon;

  return (
    <div className="flex flex-1 flex-col justify-center pb-4">
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr] xl:items-end">
        <div>
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${tone.badgeClass}`}>Insight beat</span>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Insight singkat</p>
          <h2 className="mt-4 max-w-4xl text-balance text-4xl font-semibold leading-tight tracking-normal text-neutral-950 sm:text-6xl">{fact}</h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600">
            Kami sisipkan momentum seperti ini agar mini session terasa seperti membaca pola bisnis Anda secara bertahap, bukan mengisi form yang monoton.
          </p>
          <p className="mt-5 text-sm font-medium text-neutral-500">Sumber: {source}</p>
        </div>

        <div className="relative overflow-hidden rounded-[1.7rem] border border-white/80 bg-white/76 p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.4)] backdrop-blur-xl">
          <div className={`pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full blur-3xl ${tone.secondaryGlowClass}`} />
          <div className="relative">
            <div className={`grid h-12 w-12 place-items-center rounded-[1rem] border ${tone.iconClass}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">{stage.railLabel}</p>
            <h3 className="mt-2 text-xl font-semibold leading-tight text-neutral-950">{stage.railTitle}</h3>
            <div className="mt-4 space-y-3">
              {stage.bullets.map((bullet) => (
                <div key={bullet} className="flex gap-3">
                  <span className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${tone.progressClass}`} />
                  <p className="text-sm leading-6 text-neutral-700">{bullet}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <PrimaryAction onClick={onNext} label="Lanjut" />
    </div>
  );
}

function ReviewRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-4 rounded-[1.5rem] border border-neutral-200 bg-white/78 px-5 py-4 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.35)]">
      <div>
        <p className="text-sm font-semibold text-neutral-500">{label}</p>
        <p className="mt-1 text-base font-semibold leading-7 text-neutral-950">{value}</p>
      </div>
      <button type="button" onClick={onEdit} className="rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 hover:bg-white">
        Ubah
      </button>
    </div>
  );
}

function ContactFields({ contact, setContact, optional = false }: { contact: ContactData; setContact: (contact: ContactData) => void; optional?: boolean }) {
  return (
    <div className="grid gap-4">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-neutral-500">Nama perusahaan</span>
        <input
          name="companyName"
          value={contact.companyName || ""}
          onChange={(event) => setContact({ ...contact, companyName: event.target.value })}
          className={FIELD_CLASS}
          placeholder="Nama perusahaan (opsional)"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-neutral-500">Nama Anda</span>
        <input
          name="name"
          value={contact.name || ""}
          required={!optional}
          onChange={(event) => setContact({ ...contact, name: event.target.value })}
          className={FIELD_CLASS}
          placeholder={`Nama Anda${optional ? " (opsional)" : ""}`}
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-neutral-500">Nomor WhatsApp</span>
        <input
          name="wa"
          value={contact.wa || ""}
          required={!optional}
          onChange={(event) => setContact({ ...contact, wa: event.target.value })}
          className={FIELD_CLASS}
          placeholder={`Nomor WhatsApp${optional ? " (opsional)" : ""}`}
        />
      </label>
      {optional ? (
        <label className="flex items-center gap-3 rounded-[1.35rem] border border-neutral-200 bg-white/75 px-5 py-4 text-sm font-semibold text-neutral-700 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.35)]">
          <input type="checkbox" checked={Boolean(contact.followUpAllowed)} onChange={(event) => setContact({ ...contact, followUpAllowed: event.target.checked })} />
          boleh follow up
        </label>
      ) : null}
    </div>
  );
}

function ResultPanel({
  answers,
  result,
  detailNote,
  detailNoteWordCount,
  discoveryContext,
  setDetailNote,
  onDiscoveryContextChange,
  onDetailNoteBlur,
  onShare,
  onPdf,
  onDiscovery
}: {
  answers: WizardAnswers;
  result: GeneratedResult;
  detailNote: string;
  detailNoteWordCount: number;
  discoveryContext: DiscoveryContextAnswers;
  setDetailNote: (value: string) => void;
  onDiscoveryContextChange: (key: DiscoveryContextKey, value: string) => void;
  onDetailNoteBlur: (value: string) => void | Promise<void>;
  onShare: () => void | Promise<void>;
  onPdf: () => void | Promise<void>;
  onDiscovery: () => void | Promise<void>;
}) {
  const primaryChallenge = answers.mainChallenges[0] || "revenue";
  const prepGuide = DISCOVERY_PREP_BY_CHALLENGE[primaryChallenge];
  const adoptionSummary = ADOPTION_MODE_SUMMARY[answers.adoptionStyle || "starting"];
  const notePreview =
    detailNote.trim().length > 280 ? `${detailNote.trim().slice(0, 280).trimEnd()}...` : detailNote.trim();

  return (
    <div>
      <div id="result-panel" className="rounded-[1.75rem] border border-neutral-200 bg-white p-5 shadow-soft sm:p-8">
        <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-neutral-500">
          <BarChart3 className="h-4 w-4" />
          Hasil Mini Session Pesat.AI
        </div>
        <h2 className="text-4xl font-semibold leading-tight tracking-normal text-neutral-950 sm:text-6xl">{result.headline}</h2>
        <p className="mt-5 text-lg leading-8 text-neutral-600">{result.subheadline}</p>
        {result.diagnosis ? (
          <div className="mt-8 rounded-[1.35rem] border border-neutral-200 bg-neutral-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Diagnosa</p>
            <p className="mt-3 text-lg font-medium leading-8 text-neutral-900">{result.diagnosis}</p>
            {result.rootCause?.text ? (
              <div className="mt-4 border-l-2 border-neutral-900 pl-4">
                <p className="text-base leading-7 text-neutral-700">{result.rootCause.text}</p>
                <p className="mt-2 text-xs font-semibold text-neutral-400">Sumber: {result.rootCause.source}</p>
              </div>
            ) : null}
          </div>
        ) : null}
        {result.userSignals?.length ? (
          <div className="mt-8 rounded-[1.35rem] border border-neutral-200 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Sinyal dari bisnis Anda</p>
            <p className="mt-2 text-sm leading-6 text-neutral-500">Angka yang Anda sebutkan, kami jadikan dasar agar analisis lebih konkret.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.userSignals.map((signal) => (
                <span key={signal} className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-800">
                  {signal}
                </span>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {result.impactCards.map((card) => (
            <div key={card.title} className="rounded-[1.35rem] border border-neutral-200 p-5">
              <p className="text-sm font-semibold text-neutral-500">{card.title}</p>
              <p className="mt-2 text-3xl font-semibold text-neutral-950">{card.value}</p>
              <p className="mt-3 text-sm leading-6 text-neutral-500">{card.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 h-64 rounded-[1.35rem] border border-neutral-200 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result.chart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="before" fill="#d4d4d4" radius={[8, 8, 0, 0]} />
              <Bar dataKey="after" fill="#111111" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {result.beforeAfterText.map((text, index) => (
            <div key={text} className="rounded-[1.35rem] bg-neutral-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">{index === 0 ? "Before" : "After"}</p>
              <p className="mt-3 text-base font-medium leading-7 text-neutral-800">{text}</p>
            </div>
          ))}
        </div>
        {result.promise?.statement ? (
          <div className="mt-8 rounded-[1.35rem] bg-neutral-950 p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Janji terukur</p>
            <p className="mt-3 text-xl font-semibold leading-8">{result.promise.statement}</p>
            {result.promise.measuredBy?.length ? (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Diukur lewat</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.promise.measuredBy.map((metric) => (
                    <span key={metric} className="rounded-full border border-neutral-700 px-3 py-1 text-sm text-neutral-200">
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {result.promise.disclaimer ? <p className="mt-5 text-xs leading-6 text-neutral-400">{result.promise.disclaimer}</p> : null}
          </div>
        ) : null}
        {result.firstStep ? (
          <div className="mt-8 rounded-[1.35rem] border border-neutral-200 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Langkah pertama</p>
            <p className="mt-3 text-lg font-medium leading-8 text-neutral-900">{result.firstStep}</p>
          </div>
        ) : null}
        {result.costOfInaction ? (
          <div className="mt-8 rounded-[1.35rem] border border-neutral-200 border-l-4 border-l-neutral-900 bg-neutral-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Jika dibiarkan</p>
            <p className="mt-3 text-base font-medium leading-7 text-neutral-800">{result.costOfInaction}</p>
          </div>
        ) : null}
        <div className="mt-8 rounded-[1.35rem] bg-neutral-950 p-6 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Unique mechanism</p>
          <p className="mt-3 text-xl font-semibold leading-8">{result.uniqueMechanism}</p>
        </div>
        <div className="mt-8">
          <h3 className="text-2xl font-semibold">Solusi yang paling relevan</h3>
          <div className="mt-4 grid gap-3">
            {result.solutionsText.map((solution) => (
              <div key={solution} className="rounded-[1.35rem] border border-neutral-200 p-5 text-base leading-7 text-neutral-700">
                {solution}
              </div>
            ))}
          </div>
        </div>
        {result.plan?.length ? (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold">Rencana aksi</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-500">Tiga fase agar perbaikan terjadi bertahap dan terukur, bukan sekaligus.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {result.plan.map((phase) => (
                <div key={phase.title} className="flex flex-col rounded-[1.35rem] border border-neutral-200 p-5">
                  <p className="text-base font-semibold text-neutral-950">{phase.title}</p>
                  <span className="mt-2 inline-flex w-fit rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">{phase.timeframe}</span>
                  <p className="mt-3 text-sm leading-6 text-neutral-700">{phase.focus}</p>
                  {phase.solutions.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {phase.solutions.map((name) => (
                        <span key={name} className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600">
                          {name}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <p className="mt-3 text-sm font-medium leading-6 text-neutral-900">Hasil: {phase.outcome}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-8 overflow-hidden rounded-[1.35rem] border border-neutral-200 bg-gradient-to-br from-white to-neutral-100 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Supaya langkah berikutnya tidak ngawang</p>
              <h3 className="mt-2 text-2xl font-semibold text-neutral-950">Siapkan 3 hal ini agar rekomendasi cepat jadi keputusan nyata</h3>
            </div>
            <span className="inline-flex w-fit rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700">{adoptionSummary.label}</span>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">{adoptionSummary.note}</p>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            <div className="rounded-[1.35rem] border border-neutral-200 bg-white p-5 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Prioritas pertama</p>
              <p className="mt-3 text-base font-semibold leading-7 text-neutral-950">{result.firstStep}</p>
              <p className="mt-3 text-sm leading-6 text-neutral-600">Mulai dari satu area yang paling dekat ke dampak bisnis agar tim tidak kewalahan dan hasil bisa cepat terlihat.</p>
            </div>
            <div className="rounded-[1.35rem] border border-neutral-200 bg-white p-5 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">{prepGuide.title}</p>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-neutral-700">
                {prepGuide.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-neutral-900" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[1.35rem] border border-neutral-200 bg-white p-5 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Angka yang nanti dicek</p>
              <p className="mt-3 text-sm leading-6 text-neutral-600">Ini yang dipakai untuk mengukur hasil agar keputusan Anda berbasis angka, bukan asumsi.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {result.promise.measuredBy.map((metric) => (
                  <span key={metric} className="rounded-full bg-neutral-100 px-3 py-2 text-sm font-semibold text-neutral-800">
                    {metric}
                  </span>
                ))}
              </div>
              <div className="mt-4 space-y-3">
                {result.impactCards.slice(0, 2).map((card) => (
                  <div key={card.title} className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">{card.title}</p>
                    <p className="mt-1 text-lg font-semibold text-neutral-950">{card.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {notePreview ? (
            <div className="mt-5 rounded-[1.35rem] border border-dashed border-neutral-300 bg-white/80 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Catatan Anda yang sudah tertangkap</p>
              <p className="mt-3 text-sm leading-7 text-neutral-700">{notePreview}</p>
            </div>
          ) : null}
        </div>
      </div>
      <section className="mt-6 rounded-[1.35rem] border border-border-base bg-surface-elevated p-5 text-foreground shadow-[0_24px_60px_-40px_rgba(15,23,42,0.55)] sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground-muted">Opsional sebelum discovery call</p>
            <h3 className="mt-1 text-2xl font-semibold leading-tight text-foreground">Bantu kami memahami konteks Anda lewat 3 pertanyaan singkat</h3>
          </div>
          <span className="inline-flex w-fit rounded-full border border-border-base bg-surface px-4 py-2 text-sm font-semibold text-foreground-muted">Semua jawaban bersifat opsional</span>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-foreground-muted">
          Jawaban di bawah ini akan ikut dikirim saat Anda lanjut ke discovery call, supaya tim Pesat.AI masuk dengan konteks yang lebih jelas dan tidak mengulang pertanyaan dasar.
        </p>

        <div className="mt-5 grid gap-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-foreground">1. Ceritakan tantangan Anda lebih detail</span>
            <textarea
              value={detailNote}
              onChange={(event) => setDetailNote(trimToWordLimit(event.target.value, DETAIL_NOTE_WORD_LIMIT))}
              onBlur={(event) => void onDetailNoteBlur(event.target.value)}
              rows={5}
              className="w-full rounded-[1.35rem] border border-border-base bg-surface px-5 py-4 text-foreground outline-none placeholder:text-foreground-subtle focus:border-border-strong"
              placeholder="Contoh: Saya menjual lele biasa sehari kurang lebih 500 kg - 1 ton. Saya masih butuh tools/software untuk pencatatan stok dan penjualan."
            />
            <div className="mt-2 flex items-center justify-between gap-4 text-xs text-foreground-subtle">
              <span>Anda bisa cerita bebas soal proses, volume, bottleneck, atau kebiasaan operasional yang sekarang paling terasa.</span>
              <span>{detailNoteWordCount}/{DETAIL_NOTE_WORD_LIMIT} kata</span>
            </div>
          </label>

          {OPTIONAL_DISCOVERY_QUESTIONS.map((question) => (
            <label key={question.id} className="block">
              <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <span className="text-sm font-semibold text-foreground">{question.label}</span>
                <span className="text-xs text-foreground-subtle">{question.helper}</span>
              </div>
              <textarea
                value={discoveryContext[question.id]}
                onChange={(event) => onDiscoveryContextChange(question.id, event.target.value)}
                rows={question.rows}
                className="w-full rounded-[1.35rem] border border-border-base bg-surface px-5 py-4 text-foreground outline-none placeholder:text-foreground-subtle focus:border-border-strong"
                placeholder={question.placeholder}
              />
            </label>
          ))}
        </div>
      </section>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <button
          onClick={() => void onShare()}
          disabled={!result.persisted}
          className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-neutral-200 px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:border-neutral-100 disabled:text-neutral-300"
        >
          <ExternalLink className="h-4 w-4" />
          {result.persisted ? "Copy Link" : "Link aktif setelah DB tersambung"}
        </button>
        <button onClick={() => void onPdf()} className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-neutral-200 px-5 text-sm font-semibold">
          <Download className="h-4 w-4" />
          Export PDF
        </button>
        <button onClick={onDiscovery} className="min-h-12 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white">
          Ya, Saya Mau Discovery Call
        </button>
      </div>
      {!result.persisted ? <p className="mt-3 text-xs text-neutral-400">Share link membutuhkan Supabase agar hasil bisa dibuka ulang.</p> : null}
      {result.llmFallback ? <p className="mt-3 text-xs text-neutral-400">Mode fallback aktif karena OpenAI belum tersedia atau gagal merespons.</p> : null}
    </div>
  );
}
