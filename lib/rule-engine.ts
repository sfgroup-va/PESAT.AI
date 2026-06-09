import { AVAILABLE_SOLUTIONS, DETAIL_LABELS, DETAIL_SOLUTION_MAP, TRANSITION_FACTS } from "@/lib/solutions";
import type {
  AdoptionId,
  ChallengeId,
  DetailId,
  DiagnosisPack,
  FocusRow,
  GeneratedResult,
  ImpactId,
  ImpactRanges,
  InsightStat,
  PesatSolution,
  PlanPhase,
  WizardAnswers
} from "@/lib/types";

const CLUSTER_PRIORITY: Record<ChallengeId, string[]> = {
  revenue: ["ai_sales_assistant", "ai_repeat_order", "ai_crm_pintar", "ai_dynamic_pricing"],
  cost: ["ai_pembukuan_otomatis", "ai_invoice_ap_otomatis", "ai_document_processor", "ai_process_intelligence"],
  fraud: ["ai_fraud_detection", "ai_data_quality_auto_heal", "ai_roi_impact_tracker", "ai_quality_control_visual"],
  cash_stock: ["ai_prediksi_cashflow", "ai_demand_planner", "ai_inventory_optimizer", "ai_executive_dashboard"],
  reporting: ["ai_report_generator", "ai_executive_dashboard", "ai_meeting_notetaker", "ai_ticket_router"],
  brand_trust: ["ai_organic_traffic_builder", "ai_local_ai_search_trust_builder", "ai_social_media_manager", "ai_sentiment_pelanggan"]
};

const CLUSTER_LABELS: Record<ChallengeId, string> = {
  revenue: "pertumbuhan revenue",
  cost: "efisiensi biaya",
  fraud: "pengendalian risiko",
  cash_stock: "kas dan stok",
  reporting: "kecepatan reporting",
  brand_trust: "trust dan visibilitas brand"
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

// Concrete, client-checkable metrics per cluster - turns a vague promise into a measurable one.
const MEASURED_BY: Record<ChallengeId, string[]> = {
  revenue: ["kecepatan follow-up lead", "konversi chat ke closing", "repeat order rate"],
  cost: ["jam kerja manual per bulan", "biaya proses per transaksi", "tingkat error input"],
  fraud: ["anomali terdeteksi lebih dini", "waktu deteksi risiko", "nilai risiko yang tertahan"],
  cash_stock: ["akurasi prediksi kas", "frekuensi stockout", "modal tertahan di stok"],
  reporting: ["waktu menyiapkan laporan", "kecepatan keputusan", "action item yang dieksekusi"],
  brand_trust: ["visibilitas di Google dan AI search", "volume review positif", "trust signal yang terindeks"]
};

const IMPACT_LABELS: Record<ImpactId, string> = {
  revenue: "revenue",
  hours: "efisiensi waktu",
  risk: "kontrol risiko",
  cash: "presisi kas dan stok",
  trust: "trust digital"
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

// Honest, qualitative framing of what staying as-is costs - drives urgency without inventing numbers.
const COST_OF_INACTION: Record<ChallengeId, string> = {
  revenue: "Selama follow-up dan repeat order belum sistematis, peluang yang sudah ada terus bocor diam-diam setiap minggu, dan kompetitor yang lebih responsif yang menutupnya.",
  cost: "Pekerjaan manual yang dibiarkan terus menumpuk sebagai biaya tetap dan jam kerja tim yang seharusnya bisa dialihkan ke pekerjaan yang lebih bernilai.",
  fraud: "Anomali yang tidak dipantau cenderung membesar; biaya menanganinya setelah terlanjur jauh lebih mahal daripada mendeteksinya sejak awal.",
  cash_stock: "Tanpa prediksi, keputusan kas dan stok tetap reaktif: modal tertahan di stok yang salah atau barang habis tepat saat permintaan datang.",
  reporting: "Keputusan yang menunggu laporan manual terus tertinggal momentum, dan tim sibuk menyusun data alih-alih bertindak atasnya.",
  brand_trust: "Saat brand belum konsisten muncul di Google dan AI search, pelanggan menemukan dan mempercayai kompetitor lebih dulu."
};

// Matches numeric signals the user typed (currency, percentages, counts, cadences) so the result can
// reflect their own figures. Deterministic and grounded - we only echo numbers the user actually gave.
const USER_SIGNAL_REGEX =
  /rp\s?\d[\d.,]*\s?(?:ribu|rb|juta|jt|miliar|milyar)?|\d[\d.,]*\s?(?:%|persen|jam|menit|hari|minggu|bulan|tahun|kg|ton|orang|karyawan|staf|staff|tim|chat|pesan|lead|prospek|transaksi|order|pesanan|pelanggan|customer|klien|produk|sku|item|cabang|toko|outlet|kali|x)\b(?:\s?\/\s?(?:hari|minggu|bulan|tahun|orang))?/gi;

const DEFAULT_FOCUS_BY_CHALLENGE: Record<ChallengeId, DetailId[]> = {
  revenue: ["follow_up", "lead_quality", "repeat_order"],
  cost: ["admin_cost", "manual_docs", "process_waste"],
  fraud: ["transaction_anomaly", "approval_gap", "data_leak"],
  cash_stock: ["cashflow_blind", "stockout", "overstock"],
  reporting: ["slow_reports", "no_bi", "manual_meetings"],
  brand_trust: ["google_visibility", "ai_search", "review_sentiment"]
};

const FOCUS_TEMPLATES: Record<DetailId, { area: string; symptom: string; metric: string; actionGoal: string; chartMetricIndex: number }> = {
  follow_up: {
    area: "Respons lead",
    symptom: "Lead masuk, tetapi kecepatan follow-up belum konsisten sehingga peluang hangat cepat dingin.",
    metric: "SLA follow-up dan conversion to meeting",
    actionGoal: "mengurutkan prioritas chat dan reminder follow-up otomatis",
    chartMetricIndex: 0
  },
  repeat_order: {
    area: "Repeat order",
    symptom: "Pelanggan lama belum diaktivasi terjadwal sehingga pembelian ulang masih bergantung pada ingatan tim.",
    metric: "Repeat order rate dan reaktivasi pelanggan",
    actionGoal: "menjalankan trigger pembelian ulang dan segmentasi pelanggan",
    chartMetricIndex: 2
  },
  pricing: {
    area: "Pricing discipline",
    symptom: "Penawaran harga dan margin sulit dibaca cepat sehingga diskon atau upsell sering tidak presisi.",
    metric: "Konversi penawaran dan margin per transaksi",
    actionGoal: "membaca pola harga lalu memberi rekomendasi penawaran yang lebih presisi",
    chartMetricIndex: 1
  },
  lead_quality: {
    area: "Kualitas lead",
    symptom: "Lead datang, tetapi pemisahan prioritas belum rapi sehingga tim menghabiskan tenaga pada prospek yang salah.",
    metric: "Lead qualification rate dan closing quality",
    actionGoal: "menyaring lead dan memberi skor prioritas otomatis",
    chartMetricIndex: 1
  },
  admin_cost: {
    area: "Beban admin",
    symptom: "Jam kerja tim habis di input dan rekap berulang yang seharusnya bisa dipangkas.",
    metric: "Jam kerja manual per bulan",
    actionGoal: "menghapus input berulang dan sinkronisasi data otomatis",
    chartMetricIndex: 0
  },
  manual_docs: {
    area: "Alur dokumen",
    symptom: "Dokumen berpindah tangan terlalu banyak sehingga proses lambat dan rawan salah input.",
    metric: "Biaya proses per dokumen",
    actionGoal: "menangkap data dokumen lalu memasukkannya otomatis ke sistem",
    chartMetricIndex: 1
  },
  invoice_ap: {
    area: "Invoice dan AP",
    symptom: "Proses invoice dan approval masih menguras waktu sehingga cash conversion ikut tersendat.",
    metric: "Waktu siklus invoice dan tingkat error approval",
    actionGoal: "membuat invoice matching dan approval lebih cepat",
    chartMetricIndex: 1
  },
  process_waste: {
    area: "Bottleneck proses",
    symptom: "Kemacetan kerja muncul di banyak titik, tetapi tim belum punya peta bottleneck yang terlihat jelas.",
    metric: "Lead time proses dan error handoff",
    actionGoal: "menyalakan process intelligence untuk menemukan bottleneck utama",
    chartMetricIndex: 2
  },
  transaction_anomaly: {
    area: "Anomali transaksi",
    symptom: "Pola transaksi janggal baru terlihat setelah terlambat ditindak, bukan saat sinyal awal muncul.",
    metric: "Anomali terdeteksi lebih dini",
    actionGoal: "memasang alert anomali real-time dan prioritas investigasi",
    chartMetricIndex: 0
  },
  data_leak: {
    area: "Kontrol akses data",
    symptom: "Akses dan perpindahan data belum terawasi rapat sehingga blind spot keamanan tetap terbuka.",
    metric: "Waktu deteksi risiko dan jejak akses",
    actionGoal: "memonitor akses sensitif dan menyusun audit trail otomatis",
    chartMetricIndex: 1
  },
  approval_gap: {
    area: "Disiplin approval",
    symptom: "Langkah approval masih mudah terlewati sehingga risiko muncul dari proses yang tampak normal.",
    metric: "Tingkat kepatuhan approval",
    actionGoal: "mengunci approval path dan notifikasi eskalasi otomatis",
    chartMetricIndex: 2
  },
  cashflow_blind: {
    area: "Prediksi kas",
    symptom: "Keputusan kas masih melihat kaca spion karena proyeksi belum cukup cepat untuk membantu eksekusi.",
    metric: "Akurasi prediksi kas",
    actionGoal: "membangun proyeksi arus kas harian atau mingguan",
    chartMetricIndex: 0
  },
  stockout: {
    area: "Risiko stockout",
    symptom: "Permintaan datang lebih cepat dari visibilitas stok sehingga peluang penjualan hilang di momen penting.",
    metric: "Frekuensi stockout dan service level",
    actionGoal: "menyalakan alert stok kritis dan replenishment yang lebih prediktif",
    chartMetricIndex: 1
  },
  overstock: {
    area: "Modal tertahan",
    symptom: "Sebagian modal tertahan di stok yang bergerak lambat karena prioritas pembelian belum berbasis sinyal permintaan.",
    metric: "Days inventory outstanding",
    actionGoal: "mengurutkan SKU prioritas dan rekomendasi pembelian yang lebih presisi",
    chartMetricIndex: 2
  },
  slow_reports: {
    area: "Kecepatan laporan",
    symptom: "Laporan selesai ketika momentum keputusan sudah lewat sehingga data hadir terlambat untuk bertindak.",
    metric: "Waktu menyiapkan laporan",
    actionGoal: "menghasilkan ringkasan otomatis dari data operasional",
    chartMetricIndex: 0
  },
  no_bi: {
    area: "BI dashboard",
    symptom: "Manajemen belum melihat satu sumber kebenaran yang cepat dibaca sehingga diskusi sering berhenti di data dasar.",
    metric: "Kecepatan keputusan dan data visibility",
    actionGoal: "membangun dashboard eksekutif yang langsung mengarah ke tindakan",
    chartMetricIndex: 1
  },
  manual_meetings: {
    area: "Ritme meeting",
    symptom: "Meeting memakan waktu tetapi tindak lanjutnya tidak terkunci, sehingga eksekusi kehilangan tempo.",
    metric: "Action item yang benar-benar dieksekusi",
    actionGoal: "meringkas meeting dan mengubahnya menjadi action item otomatis",
    chartMetricIndex: 2
  },
  google_visibility: {
    area: "Visibilitas Google",
    symptom: "Pencarian calon pelanggan belum banyak bertemu brand Anda di momen niat beli paling tinggi.",
    metric: "Visibilitas di Google untuk keyword inti",
    actionGoal: "memperkuat halaman, konten, dan entity signal yang paling dekat ke intent beli",
    chartMetricIndex: 0
  },
  ai_search: {
    area: "Kesiapan AI search",
    symptom: "Brand belum punya jejak digital yang mudah diringkas oleh mesin AI sehingga kalah disebut lebih dulu.",
    metric: "Kemunculan di AI search dan citation quality",
    actionGoal: "membangun answerable content dan trust signal lintas kanal",
    chartMetricIndex: 1
  },
  review_sentiment: {
    area: "Review dan sentimen",
    symptom: "Sinyal trust pelanggan ada, tetapi belum dibaca dan diolah menjadi keunggulan reputasi yang konsisten.",
    metric: "Volume review positif dan sentiment trend",
    actionGoal: "memonitor sentimen lalu memicu respons dan pengumpulan review yang lebih sehat",
    chartMetricIndex: 2
  }
};

const CHART_BASELINES: Record<ChallengeId, [number, number, number]> = {
  revenue: [34, 42, 38],
  cost: [36, 40, 44],
  fraud: [32, 37, 35],
  cash_stock: [33, 36, 39],
  reporting: [38, 41, 43],
  brand_trust: [35, 37, 34]
};

const ADOPTION_CHART_LIFT: Record<AdoptionId, number> = {
  dfy: 6,
  hybrid: 4,
  diy: 2,
  starting: 1
};

const IMPACT_PRIMARY_RANGE_KEY: Partial<Record<ImpactId, keyof ImpactRanges>> = {
  revenue: "revenueIncrease",
  hours: "hoursSaved",
  risk: "riskReduction",
  cash: "cashAccuracy",
  trust: "trustLift"
};

const IMPACT_CARD_COPY: Record<keyof ImpactRanges, { title: string; description: string }> = {
  revenueIncrease: {
    title: "Potensi revenue",
    description: "Fokus pada perbaikan proses yang paling dekat ke closing dan repeat order."
  },
  costReduction: {
    title: "Efisiensi biaya",
    description: "Efek paling terasa datang dari pekerjaan manual yang tidak perlu diulang."
  },
  hoursSaved: {
    title: "Jam kerja kembali",
    description: "Waktu tim yang bisa dialihkan dari admin ke follow-up dan eksekusi."
  },
  riskReduction: {
    title: "Blind spot risiko",
    description: "Nilai ini menunjukkan ruang perbaikan ketika anomali terlihat lebih awal."
  },
  cashAccuracy: {
    title: "Presisi kas dan stok",
    description: "Berguna untuk keputusan operasional yang lebih prediktif dan tidak reaktif."
  },
  trustLift: {
    title: "Trust signal digital",
    description: "Efek utamanya ada di visibilitas dan kepercayaan pelanggan sebelum mereka menghubungi Anda."
  }
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function capitalize(value: string): string {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

function listAreas(rows: FocusRow[]): string {
  if (!rows.length) return "proses prioritas";
  if (rows.length === 1) return rows[0].area.toLowerCase();
  if (rows.length === 2) return `${rows[0].area.toLowerCase()} dan ${rows[1].area.toLowerCase()}`;
  return `${rows[0].area.toLowerCase()}, ${rows[1].area.toLowerCase()}, dan ${rows[2].area.toLowerCase()}`;
}

function selectFocusDetails(answers: WizardAnswers): DetailId[] {
  const primary = answers.mainChallenges[0] || "revenue";
  return (answers.detailChallenges.length ? answers.detailChallenges : DEFAULT_FOCUS_BY_CHALLENGE[primary]).slice(0, 4);
}

function getImpactLabel(impactLevel: ImpactId | "", primary: ChallengeId): string {
  if (impactLevel) return IMPACT_LABELS[impactLevel];
  switch (primary) {
    case "cost":
    case "reporting":
      return "efisiensi waktu";
    case "fraud":
      return "kontrol risiko";
    case "cash_stock":
      return "presisi kas dan stok";
    case "brand_trust":
      return "trust digital";
    case "revenue":
    default:
      return "revenue";
  }
}

function getPriorityImpactValue(answers: WizardAnswers, impactRanges: ImpactRanges): string {
  const byImpact = answers.impactLevel ? IMPACT_PRIMARY_RANGE_KEY[answers.impactLevel] : undefined;
  if (byImpact && impactRanges[byImpact]) return impactRanges[byImpact] as string;

  const primary = answers.mainChallenges[0] || "revenue";
  if (primary === "revenue" && impactRanges.revenueIncrease) return impactRanges.revenueIncrease;
  if (primary === "cost" && impactRanges.costReduction) return impactRanges.costReduction;
  if (primary === "fraud" && impactRanges.riskReduction) return impactRanges.riskReduction;
  if (primary === "cash_stock" && impactRanges.cashAccuracy) return impactRanges.cashAccuracy;
  if (primary === "reporting" && impactRanges.hoursSaved) return impactRanges.hoursSaved;
  if (primary === "brand_trust" && impactRanges.trustLift) return impactRanges.trustLift;
  return Object.values(impactRanges).find(Boolean) || "Perlu discovery";
}

function buildImpactCards(answers: WizardAnswers, impactRanges: ImpactRanges): GeneratedResult["impactCards"] {
  const primaryKey = answers.impactLevel ? IMPACT_PRIMARY_RANGE_KEY[answers.impactLevel] : undefined;
  const orderedKeys = [
    primaryKey,
    ...Object.keys(impactRanges)
  ].filter((key, index, array): key is keyof ImpactRanges => Boolean(key) && array.indexOf(key) === index);

  return orderedKeys
    .map((key) => {
      const value = impactRanges[key];
      if (!value) return null;
      const copy = IMPACT_CARD_COPY[key];
      return {
        title: copy.title,
        value,
        description: copy.description
      };
    })
    .filter(Boolean)
    .slice(0, 3) as GeneratedResult["impactCards"];
}

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

export function buildFocusRows(answers: WizardAnswers, solutions: PesatSolution[]): FocusRow[] {
  const details = selectFocusDetails(answers);
  const rows: FocusRow[] = [];
  const usedAreas = new Set<string>();

  for (const detail of details) {
    const template = FOCUS_TEMPLATES[detail];
    if (!template || usedAreas.has(template.area)) continue;

    const mappedIds = DETAIL_SOLUTION_MAP[detail] || [];
    const linkedSolution = solutions.find((solution) => mappedIds.includes(solution.id)) || solutions[0];
    const chosenLabel = DETAIL_LABELS[detail];

    rows.push({
      area: template.area,
      symptom: chosenLabel ? `${chosenLabel}: ${template.symptom}` : template.symptom,
      metric: template.metric,
      action: linkedSolution ? `${linkedSolution.name} untuk ${template.actionGoal}.` : `Prioritaskan inisiatif untuk ${template.actionGoal}.`
    });

    usedAreas.add(template.area);
    if (rows.length === 3) break;
  }

  return rows;
}

export function buildInsightStats(answers: WizardAnswers, impactRanges: ImpactRanges, userSignals: string[], focusRows: FocusRow[], plan: PlanPhase[]): InsightStat[] {
  const primary = answers.mainChallenges[0] || "revenue";
  const focusImpact = getImpactLabel(answers.impactLevel, primary);
  const urgencyBase: Record<string, number> = {
    revenue: 74,
    hours: 68,
    risk: 82,
    cash: 77,
    trust: 66
  };
  const urgencyScore = clamp((urgencyBase[answers.impactLevel || "revenue"] || 72) + answers.mainChallenges.length * 4 + answers.detailChallenges.length * 3 + (userSignals.length ? 4 : 0), 58, 95);
  const frictionCount = Math.max(focusRows.length, answers.detailChallenges.length || 1);

  return [
    {
      label: "Indeks urgensi",
      value: `${urgencyScore}/100`,
      description: `Skor awal mini session ini tinggi karena fokus utamanya ada di ${CLUSTER_LABELS[primary]} dengan target ${focusImpact}.`
    },
    {
      label: "Friction tertangkap",
      value: `${frictionCount} area`,
      description: userSignals[0]
        ? `Ada sinyal konkret seperti ${userSignals[0]} yang membuat bottleneck lebih mudah diprioritaskan.`
        : "Belum ada angka eksplisit dari user, jadi prioritas dibaca dari tantangan yang dipilih."
    },
    {
      label: "Jendela quick win",
      value: plan[0]?.timeframe || "Minggu 1-2",
      description: `Pilot pertama diarahkan ke ${focusRows[0]?.area.toLowerCase() || "area prioritas"} agar dampaknya cepat terlihat.`
    },
    {
      label: "Dampak prioritas",
      value: getPriorityImpactValue(answers, impactRanges),
      description: `Ini potensi awal yang paling dekat dengan sasaran ${focusImpact} dari mini session ini.`
    }
  ];
}

export function buildChart(answers: WizardAnswers) {
  const primary = answers.mainChallenges[0] || "revenue";
  const metrics = MEASURED_BY[primary].slice(0, 3);
  const details = selectFocusDetails(answers);
  const hits = [0, 0, 0];

  for (const detail of details) {
    const metricIndex = FOCUS_TEMPLATES[detail]?.chartMetricIndex ?? 0;
    hits[metricIndex] += 1;
  }

  const highlightedMetricIndex = answers.impactLevel === "hours" ? 0 : answers.impactLevel === "cash" ? 0 : answers.impactLevel === "revenue" ? 1 : answers.impactLevel === "risk" ? 0 : answers.impactLevel === "trust" ? 0 : 1;
  const adoptionLift = ADOPTION_CHART_LIFT[answers.adoptionStyle || "hybrid"];
  const secondaryPenalty = answers.mainChallenges.length > 1 ? 3 : 0;

  return metrics.map((metric, index) => {
    const base = CHART_BASELINES[primary][index];
    const before = clamp(base - hits[index] * 6 - secondaryPenalty - (index === highlightedMetricIndex ? 4 : 0), 24, 72);
    const after = clamp(before + 16 + hits[index] * 7 + adoptionLift + (index === highlightedMetricIndex ? 5 : 0), before + 12, 94);
    return { name: metric, before, after };
  });
}

function buildHeadline(primary: ChallengeId, focusRows: FocusRow[], userSignals: string[]): string {
  const areaText = listAreas(focusRows);
  const signalText = userSignals[0] ? `Dengan sinyal seperti ${userSignals[0]}, ` : "";

  switch (primary) {
    case "cash_stock":
      return `${signalText}kebocoran terbesarnya ada di visibilitas kas dan stok, bukan di volume gerak bisnis Anda.`;
    case "cost":
      return `${signalText}biaya diam-diam bocor dari pekerjaan manual yang tidak lagi sebanding dengan ritme bisnis.`;
    case "fraud":
      return `${signalText}risiko utamanya bukan insiden besar, tetapi sinyal kecil yang terlambat terlihat di proses inti.`;
    case "reporting":
      return `${signalText}masalah terbesarnya ada di kecepatan baca situasi, bukan sekadar kurang dashboard.`;
    case "brand_trust":
      return `${signalText}tantangan utamanya ada di trust digital yang belum terbentuk konsisten di kanal pencarian.`;
    case "revenue":
    default:
      return `${signalText}kebocoran terbesarnya ada di ${areaText}, bukan semata-mata kurang lead.`;
  }
}

function buildSubheadline(answers: WizardAnswers, focusRows: FocusRow[], userSignals: string[], plan: PlanPhase[]): string {
  const primary = answers.mainChallenges[0] || "revenue";
  const focusArea = listAreas(focusRows);
  const impactLabel = getImpactLabel(answers.impactLevel, primary);
  const signalText = userSignals[0] ? `Mini session ini menangkap ritme seperti ${userSignals[0]}, ` : "Mini session ini menunjukkan bahwa ";
  const quickWin = plan[0]?.timeframe.toLowerCase() || "beberapa minggu pertama";

  return `${signalText}tetapi proses di ${focusArea} belum ditopang sistem yang bisa bergerak secepat operasional Anda. Karena itu, prioritas awalnya adalah memperbaiki ${CLUSTER_REFRAME[primary]} agar dampak ${impactLabel} mulai terlihat sejak ${quickWin}.`;
}

function buildBeforeAfterText(focusRows: FocusRow[], promise: DiagnosisPack["promise"]): [string, string] {
  const primaryMetric = promise.measuredBy[0] || "metrik prioritas";
  const secondaryMetric = promise.measuredBy[1] || primaryMetric;
  const areas = listAreas(focusRows);

  return [
    `Saat ini, ${areas} masih tersebar di banyak langkah manual sehingga ${primaryMetric} sulit dijaga konsisten dari hari ke hari.`,
    `Setelah pilot, ${primaryMetric} dan ${secondaryMetric} dipantau dalam satu ritme kerja, sehingga tim tahu prioritas tindak lanjut setiap minggu.`
  ];
}

function buildUniqueMechanism(focusRows: FocusRow[], solutions: PesatSolution[], promise: DiagnosisPack["promise"]): string {
  const firstArea = focusRows[0]?.area.toLowerCase() || "proses utama";
  const firstSolution = solutions[0]?.name || "pilot prioritas";
  const metrics = promise.measuredBy.slice(0, 2).join(" dan ");

  return `Pendekatan Pesat.AI dimulai dari ${firstArea} terlebih dulu, memakai ${firstSolution} untuk membaca sinyal operasional dan langsung mengaitkannya ke ${metrics || "metrik bisnis yang bisa diukur"}, lalu baru diperluas setelah pilot terbukti.`;
}

export function buildFallbackResult(sessionId: string, answers: WizardAnswers, solutions: PesatSolution[], impactRanges: ImpactRanges): GeneratedResult {
  const primary = answers.mainChallenges[0] || "revenue";
  const userSignals = extractUserSignals(answers.detailNote || "");
  const focusRows = buildFocusRows(answers, solutions);
  const diagnosisPack = buildDiagnosisPack(answers, solutions, impactRanges);
  const plan = buildActionPlan(answers, solutions, impactRanges);
  const impactCards = buildImpactCards(answers, impactRanges);

  return {
    sessionId,
    headline: buildHeadline(primary, focusRows, userSignals),
    subheadline: buildSubheadline(answers, focusRows, userSignals, plan),
    diagnosis: diagnosisPack.diagnosis,
    rootCause: diagnosisPack.rootCause,
    promise: diagnosisPack.promise,
    firstStep: diagnosisPack.firstStep,
    costOfInaction: buildCostOfInaction(answers),
    userSignals,
    plan,
    impactCards,
    beforeAfterText: buildBeforeAfterText(focusRows, diagnosisPack.promise),
    uniqueMechanism: buildUniqueMechanism(focusRows, solutions, diagnosisPack.promise),
    solutionsText: solutions.map((solution) => `${solution.name}: ${solution.description}`),
    solutions,
    impactRanges,
    chart: buildChart(answers),
    insightStats: buildInsightStats(answers, impactRanges, userSignals, focusRows, plan),
    focusRows,
    llmFallback: true
  };
}
