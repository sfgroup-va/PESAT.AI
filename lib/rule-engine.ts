import { AVAILABLE_SOLUTIONS, DETAIL_LABELS, DETAIL_SOLUTION_MAP, TRANSITION_FACTS } from "@/lib/solutions";
import type { AdoptionId, ChallengeId, DiagnosisPack, GeneratedResult, ImpactRanges, PesatSolution, PlanPhase, WizardAnswers } from "@/lib/types";

const CLUSTER_PRIORITY: Record<ChallengeId, string[]> = {
  revenue: ["ai_sales_assistant", "ai_repeat_order", "ai_crm_pintar", "ai_dynamic_pricing"],
  cost: ["ai_pembukuan_otomatis", "ai_invoice_ap_otomatis", "ai_document_processor", "ai_process_intelligence"],
  fraud: ["ai_fraud_detection", "ai_data_quality_auto_heal", "ai_roi_impact_tracker", "ai_quality_control_visual"],
  cash_stock: ["ai_prediksi_cashflow", "ai_demand_planner", "ai_inventory_optimizer", "ai_executive_dashboard"],
  reporting: ["ai_report_generator", "ai_executive_dashboard", "ai_meeting_notetaker", "ai_ticket_router"],
  brand_trust: ["ai_organic_traffic_builder", "ai_local_ai_search_trust_builder", "ai_social_media_manager", "ai_sentiment_pelanggan"]
};

// Reframe each cluster from the generic symptom the client typed into the real
// root cause Pesat.AI starts from. This is the "insight" the client did not articulate.
const CLUSTER_REFRAME: Record<ChallengeId, string> = {
  revenue: "kecepatan follow-up, timing, dan repeat order yang belum ditangani secara sistematis",
  cost: "pekerjaan manual berulang yang diam-diam berubah menjadi biaya tetap",
  fraud: "anomali kecil yang tidak terpantau sampai akhirnya membesar",
  cash_stock: "keputusan kas dan stok yang diambil dari laporan masa lalu, bukan dari prediksi",
  reporting: "keputusan yang telat karena data tidak siap saat paling dibutuhkan",
  brand_trust: "brand yang sulit ditemukan dan dijelaskan konsisten di Google dan AI search"
};

// Concrete, client-checkable metrics per cluster — turns a vague promise into a measurable one.
const MEASURED_BY: Record<ChallengeId, string[]> = {
  revenue: ["kecepatan follow-up lead", "konversi chat ke closing", "repeat order rate"],
  cost: ["jam kerja manual per bulan", "biaya proses per transaksi", "tingkat error input"],
  fraud: ["anomali terdeteksi lebih dini", "waktu deteksi risiko", "nilai risiko yang tertahan"],
  cash_stock: ["akurasi prediksi kas", "frekuensi stockout", "modal tertahan di stok"],
  reporting: ["waktu menyiapkan laporan", "kecepatan keputusan", "action item yang dieksekusi"],
  brand_trust: ["visibilitas di Google dan AI search", "volume review positif", "trust signal yang terindeks"]
};

// Timeframe is honest and adoption-aware: a client just starting needs a different horizon than a done-for-you rollout.
const TIMEFRAME_BY_ADOPTION: Record<AdoptionId, string> = {
  dfy: "6-10 minggu",
  hybrid: "8-12 minggu",
  diy: "8-14 minggu",
  starting: "sinyal awal 2-4 minggu, dampak terukur 10-14 minggu"
};

const PROMISE_DISCLAIMER =
  "Angka ini estimasi berbasis benchmark industri dan jawaban mini session Anda, bukan garansi. Angka final ditentukan setelah discovery dan melihat data riil bisnis Anda.";

// Honest, qualitative framing of what staying as-is costs — drives urgency without inventing numbers.
const COST_OF_INACTION: Record<ChallengeId, string> = {
  revenue: "Selama follow-up dan repeat order belum sistematis, peluang yang sudah ada terus bocor diam-diam setiap minggu, dan kompetitor yang lebih responsif yang menutupnya.",
  cost: "Pekerjaan manual yang dibiarkan terus menumpuk sebagai biaya tetap dan jam kerja tim yang seharusnya bisa dialihkan ke pekerjaan yang lebih bernilai.",
  fraud: "Anomali yang tidak dipantau cenderung membesar; biaya menanganinya setelah terlanjur jauh lebih mahal daripada mendeteksinya sejak awal.",
  cash_stock: "Tanpa prediksi, keputusan kas dan stok tetap reaktif: modal tertahan di stok yang salah atau barang habis tepat saat permintaan datang.",
  reporting: "Keputusan yang menunggu laporan manual terus tertinggal momentum, dan tim sibuk menyusun data alih-alih bertindak atasnya.",
  brand_trust: "Saat brand belum konsisten muncul di Google dan AI search, pelanggan menemukan dan mempercayai kompetitor lebih dulu."
};

// Matches numeric signals the user typed (currency, percentages, counts, cadences) so the result can
// reflect their own figures. Deterministic and grounded — we only echo numbers the user actually gave.
const USER_SIGNAL_REGEX =
  /rp\s?\d[\d.,]*\s?(?:ribu|rb|juta|jt|miliar|milyar)?|\d[\d.,]*\s?(?:%|persen|jam|menit|hari|minggu|bulan|tahun|orang|karyawan|staf|staff|tim|chat|pesan|lead|prospek|transaksi|order|pesanan|pelanggan|customer|klien|produk|sku|item|cabang|toko|outlet|kali|x)\b(?:\s?\/\s?(?:hari|minggu|bulan|tahun|orang))?/gi;

export function extractUserSignals(note: string): string[] {
  if (!note) return [];
  const matches = note.match(USER_SIGNAL_REGEX) || [];
  const cleaned = matches.map((match) => match.replace(/\s+/g, " ").trim()).filter((match) => /\d/.test(match));
  return Array.from(new Set(cleaned)).slice(0, 6);
}

export function buildCostOfInaction(answers: WizardAnswers): string {
  return COST_OF_INACTION[answers.mainChallenges[0] || "revenue"];
}

export function selectSolutions(answers: WizardAnswers): PesatSolution[] {
  const primary = answers.mainChallenges[0] || "revenue";
  const secondary = answers.mainChallenges[1];

  // Detail challenges (the most specific signal) drive recommendations first,
  // then the cluster priority backfills so we always have 3-4 fitting solutions.
  const detailDriven = answers.detailChallenges.flatMap((detail) => DETAIL_SOLUTION_MAP[detail] || []);
  const clusterBackfill = [...CLUSTER_PRIORITY[primary], ...(secondary ? CLUSTER_PRIORITY[secondary] : [])];

  const orderedIds = [...detailDriven, ...clusterBackfill];
  const uniqueIds = Array.from(new Set(orderedIds)).slice(0, 4);
  return uniqueIds.map((id) => AVAILABLE_SOLUTIONS.find((solution) => solution.id === id)).filter(Boolean) as PesatSolution[];
}

function buildFirstStep(adoptionStyle: AdoptionId | "", topSolutionName: string): string {
  switch (adoptionStyle) {
    case "dfy":
      return `Pesat.AI yang setup dan jalankan penuh. Langkah pertama: kami jalankan ${topSolutionName} sebagai pilot terukur, Anda cukup memantau hasilnya.`;
    case "diy":
      return `Tim internal Anda yang menjalankan. Langkah pertama: kami berikan blueprint ${topSolutionName} lengkap dengan metrik suksesnya, lalu tim Anda eksekusi dengan pendampingan.`;
    case "hybrid":
      return `Kombinasi. Langkah pertama: Pesat.AI setup ${topSolutionName}, tim Anda ikut belajar prosesnya agar bisa lanjut mandiri.`;
    case "starting":
    default:
      return `Karena baru mulai dengan AI, jangan pasang semuanya sekaligus. Langkah pertama: satu pilot ${topSolutionName}, ukur selama 2 minggu, baru perluas setelah terbukti.`;
  }
}

// Phase timeframes adapt to how the client wants to adopt AI.
const PLAN_TIMEFRAMES: Record<AdoptionId, [string, string, string]> = {
  dfy: ["Minggu 1-2", "Minggu 3-6", "Minggu 7-10"],
  hybrid: ["Minggu 1-3", "Minggu 4-8", "Minggu 9-12"],
  diy: ["Minggu 1-3", "Minggu 4-9", "Minggu 10-14"],
  starting: ["Minggu 1-2 (pilot)", "Minggu 3-6", "Minggu 7-12"]
};

function capitalize(value: string): string {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

// A concrete, phased action plan built from the client's own selected solutions and adoption style.
// Deterministic and fast (no LLM), so the result always carries a real plan instead of generic copy.
export function buildActionPlan(answers: WizardAnswers, solutions: PesatSolution[], impactRanges: ImpactRanges): PlanPhase[] {
  const primary = answers.mainChallenges[0] || "revenue";
  const names = solutions.map((solution) => solution.name);
  const timeframes = PLAN_TIMEFRAMES[answers.adoptionStyle || "hybrid"];
  const measuredBy = MEASURED_BY[primary];
  const rangeText = Object.values(impactRanges).filter(Boolean).join(" dan ");

  const phase1Solutions = names.slice(0, 1);
  const phase2Solutions = names.slice(1, Math.max(1, names.length - 1));
  const phase3Solutions = names.slice(Math.max(1, names.length - 1));

  const focus = [
    phase1Solutions.length
      ? `Pasang ${phase1Solutions.join(" + ")} sebagai pilot terukur untuk dampak tercepat, tanpa merombak semuanya sekaligus.`
      : "Mulai dari satu use case prioritas sebagai pilot terukur, tanpa merombak semuanya sekaligus.",
    phase2Solutions.length
      ? `Perluas ke ${phase2Solutions.join(" + ")} agar perbaikan menyebar ke proses harian tim.`
      : "Perkuat adopsi tim dan rapikan proses dari hasil pilot agar konsisten.",
    phase3Solutions.length
      ? `Optimalkan dengan ${phase3Solutions.join(" + ")} dan kunci hasil lewat pengukuran rutin.`
      : "Kunci hasil lewat pengukuran rutin dan dashboard yang dipantau berkala."
  ];

  const outcome = [
    `${capitalize(measuredBy[0])} mulai membaik dan terlihat di data.`,
    `${capitalize(measuredBy[1] || measuredBy[0])} ikut naik seiring adopsi tim.`,
    rangeText
      ? `${capitalize(measuredBy[2] || measuredBy[0])} stabil; dampak terukur di kisaran ${rangeText}.`
      : `${capitalize(measuredBy[2] || measuredBy[0])} stabil dan terukur.`
  ];

  return [
    { title: "Fase 1 - Quick Win", timeframe: timeframes[0], focus: focus[0], solutions: phase1Solutions, outcome: outcome[0] },
    { title: "Fase 2 - Skala", timeframe: timeframes[1], focus: focus[1], solutions: phase2Solutions, outcome: outcome[1] },
    { title: "Fase 3 - Optimasi & Ukur", timeframe: timeframes[2], focus: focus[2], solutions: phase3Solutions, outcome: outcome[2] }
  ];
}

export function buildDiagnosisPack(answers: WizardAnswers, solutions: PesatSolution[], impactRanges: ImpactRanges): DiagnosisPack {
  const primary = answers.mainChallenges[0] || "revenue";
  const detailLabels = answers.detailChallenges.map((detail) => DETAIL_LABELS[detail]).filter(Boolean);
  const labelText = detailLabels.length ? detailLabels.join(", ") : CLUSTER_REFRAME[primary];

  const diagnosis = `Dari jawaban Anda, titik bocor utamanya ada di: ${labelText}. Untuk bisnis seperti ini, akar masalahnya biasanya bukan sekadar masalah permukaan, melainkan ${CLUSTER_REFRAME[primary]}. Itu yang akan kita benahi lebih dulu, bukan menambah tools baru.`;

  const fact = TRANSITION_FACTS[primary];
  const rootCause = { text: fact.first, source: fact.source };

  const timeframe = TIMEFRAME_BY_ADOPTION[answers.adoptionStyle || "hybrid"];
  const measuredBy = MEASURED_BY[primary];
  const rangeText = Object.values(impactRanges).filter(Boolean).join(" dan ");
  const statement = rangeText
    ? `Untuk pola seperti ini, target realistis berada di kisaran ${rangeText}, dalam ${timeframe}. Kami ikat ke metrik yang bisa Anda cek sendiri, bukan klaim yang tidak terukur.`
    : `Target perbaikan kami ikat ke metrik yang bisa Anda cek sendiri dalam ${timeframe}, bukan klaim yang tidak terukur.`;

  const topSolutionName = solutions[0]?.name || "use case prioritas";
  const firstStep = buildFirstStep(answers.adoptionStyle, topSolutionName);

  return {
    diagnosis,
    rootCause,
    promise: { statement, timeframe, measuredBy, disclaimer: PROMISE_DISCLAIMER },
    firstStep
  };
}

export function calculateImpactRanges(answers: WizardAnswers): ImpactRanges {
  const challenges = new Set(answers.mainChallenges);
  const ranges: ImpactRanges = {};

  if (challenges.has("revenue")) ranges.revenueIncrease = "10-30%";
  if (challenges.has("cost")) ranges.costReduction = "8-22%";
  if (challenges.has("fraud")) ranges.riskReduction = "15-45%";
  if (challenges.has("cash_stock")) ranges.cashAccuracy = "20-40% lebih presisi";
  if (challenges.has("reporting") || challenges.has("cost")) ranges.hoursSaved = "20-60 jam/bulan";
  if (challenges.has("brand_trust")) ranges.trustLift = "15-35% peningkatan trust signal";

  if (!ranges.hoursSaved) ranges.hoursSaved = "20-60 jam/bulan";

  return Object.keys(ranges).length ? ranges : { revenueIncrease: "10-30%", hoursSaved: "20-60 jam/bulan" };
}

export function buildChart(answers: WizardAnswers) {
  const base = answers.impactLevel === "risk" ? 35 : answers.impactLevel === "hours" ? 42 : 48;
  return [
    { name: "Sekarang", before: base, after: base },
    { name: "Sesudah AI", before: base, after: Math.min(92, base + 32) }
  ];
}

export function buildFallbackResult(sessionId: string, answers: WizardAnswers, solutions: PesatSolution[], impactRanges: ImpactRanges): GeneratedResult {
  const primary = answers.mainChallenges[0] || "revenue";
  const headlineByCluster: Record<ChallengeId, string> = {
    revenue: "Ada peluang revenue yang bisa dikejar tanpa menambah beban tim.",
    cost: "Ada pekerjaan manual yang bisa dipangkas sebelum menjadi biaya tetap.",
    fraud: "Ada pola risiko yang bisa dideteksi lebih cepat sebelum membesar.",
    cash_stock: "Kas dan stok bisa dibuat lebih prediktif, bukan hanya dilaporkan terlambat.",
    reporting: "Keputusan bisnis bisa dibuat lebih cepat dengan BI yang siap pakai.",
    brand_trust: "Trust di Google dan AI search bisa dibangun lebih sistematis."
  };

  const impactCards = Object.entries(impactRanges).slice(0, 3).map(([key, value]) => ({
    title: key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase()),
    value,
    description: "Estimasi awal berbasis benchmark statis dan jawaban mini session."
  }));

  const diagnosisPack = buildDiagnosisPack(answers, solutions, impactRanges);

  return {
    sessionId,
    headline: headlineByCluster[primary],
    subheadline: "Pesat.AI akan memulai dari use case yang paling dekat dengan dampak bisnis, lalu mengukur hasilnya agar bukan sekadar presentasi.",
    diagnosis: diagnosisPack.diagnosis,
    rootCause: diagnosisPack.rootCause,
    promise: diagnosisPack.promise,
    firstStep: diagnosisPack.firstStep,
    costOfInaction: buildCostOfInaction(answers),
    userSignals: extractUserSignals(answers.detailNote || ""),
    plan: buildActionPlan(answers, solutions, impactRanges),
    impactCards,
    beforeAfterText: [
      "Sebelum: data dan proses tersebar, keputusan bergantung pada follow-up manual, dan risiko baru terlihat setelah terlambat.",
      "Sesudah: sinyal bisnis dipantau otomatis, prioritas tindakan lebih jelas, dan impact bisa dilacak per minggu."
    ],
    uniqueMechanism: "Cara kerjanya seperti memasang co-pilot operasional: Pesat.AI membaca sinyal dari proses berjalan, memilih tindakan prioritas, lalu membantu tim mengeksekusi dan mengukur hasilnya.",
    solutionsText: solutions.map((solution) => `${solution.name}: ${solution.description}`),
    solutions,
    impactRanges,
    chart: buildChart(answers),
    llmFallback: true
  };
}
