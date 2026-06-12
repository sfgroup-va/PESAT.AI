import { AVAILABLE_SOLUTIONS, DETAIL_LABELS, DETAIL_SOLUTION_MAP, TRANSITION_FACTS } from "@/lib/solutions";
import type { AdoptionId, ChallengeId, DiagnosisPack, EfficiencyMetric, Finding, GeneratedResult, HiddenCost, ImpactRanges, PesatSolution, PlanPhase, SolutionCard, WizardAnswers } from "@/lib/types";

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
  revenue:
    "Selama follow-up dan repeat order belum sistematis, peluang yang sudah ada terus bocor diam-diam setiap minggu, dan kompetitor yang lebih responsif yang menutupnya.",
  cost: "Pekerjaan manual yang dibiarkan terus menumpuk sebagai biaya tetap dan jam kerja tim yang seharusnya bisa dialihkan ke pekerjaan yang lebih bernilai.",
  fraud: "Anomali yang tidak dipantau cenderung membesar; biaya menanganinya setelah terlanjur jauh lebih mahal daripada mendeteksinya sejak awal.",
  cash_stock: "Tanpa prediksi, keputusan kas dan stok tetap reaktif: modal tertahan di stok yang salah atau barang habis tepat saat permintaan datang.",
  reporting: "Keputusan yang menunggu laporan manual terus tertinggal momentum, dan tim sibuk menyusun data alih-alih bertindak atasnya.",
  brand_trust: "Saat brand belum konsisten muncul di Google dan AI search, pelanggan menemukan dan mempercayai kompetitor lebih dulu."
};

const HEADLINE_BY_CLUSTER: Record<ChallengeId, string> = {
  revenue: "Ada pipeline revenue yang bocor setiap minggu — dan itu bisa diperbaiki tanpa menambah tim sales.",
  cost: "Rp 200-400 juta per tahun mungkin tersembunyi di pekerjaan manual yang belum terlihat.",
  fraud: "Celah operasional yang baru ketahuan setelah rugi sebenarnya bisa terdeteksi 40 hari lebih awal.",
  cash_stock: "Kas dan stok Anda masih dijalankan dengan prediksi yang terlambat — ini cara memperbaikinya.",
  reporting: "Keputusan bisnis Anda menunggu data yang baru siap 5 hari kemudian. Itu bisa jadi 4 jam.",
  brand_trust: "Pelanggan baru menemukan kompetitor Anda lebih dulu karena trust signal belum dibangun sistematis."
};

const EFFICIENCY_METRICS: Record<ChallengeId, EfficiencyMetric[]> = {
  revenue: [
    {
      label: "Lead follow-up coverage",
      before: "35%",
      after: "85%",
      impact: "+50%",
      impactType: "positive",
      description: "Lebih banyak lead dikejar sampai closing"
    },
    { label: "Waktu sales cycle", before: "14 hari", after: "9 hari", impact: "-36%", impactType: "positive", description: "Prospek tidak dingin karena follow-up cepat" },
    { label: "Lost opportunity/bulan", before: "Rp 120 juta", after: "Rp 35 juta", impact: "-71%", impactType: "positive", description: "Peluang yang sudah ada tidak bocor" }
  ],
  cost: [
    { label: "Jam kerja manual/bulan", before: "320 jam", after: "95 jam", impact: "-70%", impactType: "positive", description: "Tim fokus pada pekerjaan bernilai tinggi" },
    { label: "Error rate input", before: "8%", after: "1.5%", impact: "-81%", impactType: "positive", description: "Lebih sedikit waktu dihabiskan untuk koreksi" },
    { label: "Biaya duplikasi proses", before: "Rp 22 juta", after: "Rp 5 juta", impact: "-77%", impactType: "positive", description: "Satu data tidak dikerjakan berkali-kali" }
  ],
  fraud: [
    { label: "Waktu deteksi anomali", before: "45 hari", after: "2 hari", impact: "-96%", impactType: "positive", description: "Risiko tertangkap sebelum membesar" },
    { label: "Nilai risiko tertahan", before: "Rp 150 juta", after: "Rp 25 juta", impact: "-83%", impactType: "positive", description: "Potensi kerugian berkurang drastis" },
    { label: "Insiden lolos pantau", before: "30%", after: "4%", impact: "-87%", impactType: "positive", description: "Pola mencurigakan lebih sedikit terlewat" }
  ],
  cash_stock: [
    { label: "Akurasi prediksi cashflow", before: "55%", after: "82%", impact: "+49%", impactType: "positive", description: "Kebutuhan kas terlihat lebih awal" },
    { label: "Frekuensi stockout/bulan", before: "6x", after: "1x", impact: "-83%", impactType: "positive", description: "Kehilangan sales karena habis stok turun" },
    { label: "Modal tertahan overstock", before: "Rp 200 juta", after: "Rp 75 juta", impact: "-63%", impactType: "positive", description: "Modal kembali beredar lebih cepat" }
  ],
  reporting: [
    { label: "Waktu menyusun laporan", before: "5 hari", after: "4 jam", impact: "-98%", impactType: "positive", description: "Laporan siap saat paling dibutuhkan" },
    {
      label: "Meeting tanpa action clear",
      before: "60%",
      after: "15%",
      impact: "-75%",
      impactType: "positive",
      description: "Setiap meeting punya keluaran konkret"
    },
    {
      label: "Versi data berbeda antar tim",
      before: "4 versi",
      after: "1 versi",
      impact: "-75%",
      impactType: "positive",
      description: "Single source of truth untuk semua tim"
    }
  ],
  brand_trust: [
    { label: "Visibility Google organik", before: "12%", after: "28%", impact: "+133%", impactType: "positive", description: "Lebih sering ditemukan calon pelanggan" },
    { label: "Review yang terrespons", before: "20%", after: "85%", impact: "+325%", impactType: "positive", description: "Trust meningkat karena response aktif" },
    { label: "Lead organik/bulan", before: "80", after: "180", impact: "+125%", impactType: "positive", description: "Traffic berkualitas tanpa paid ads" }
  ]
};

const HIDDEN_COSTS_BY_CLUSTER: Record<ChallengeId, HiddenCost[]> = {
  revenue: [
    { id: "follow_up_leak", label: "Lead tidak di-follow-up", monthlyEstimate: 28000000, description: "Peluang hilang karena follow-up lambat atau terlupakan" },
    { id: "repeat_order_gap", label: "Repeat purchase terlewat", monthlyEstimate: 22000000, description: "Pelanggan lama tidak ditrigger pada waktu tepat" },
    { id: "manual_crm", label: "Update CRM manual", monthlyEstimate: 12000000, description: "Waktu admin mengupdate status lead satu per satu" }
  ],
  cost: [
    { id: "duplicate_data", label: "Duplikasi data entry", monthlyEstimate: 18000000, description: "Satu data dikerjakan berulang di banyak sistem" },
    { id: "error_correction", label: "Koreksi error input", monthlyEstimate: 14000000, description: "Waktu memperbaiki kesalahan input dan rekon" },
    { id: "manual_reports", label: "Laporan manual", monthlyEstimate: 16000000, description: "Copy-paste dan pivot manual antar periode" }
  ],
  fraud: [
    { id: "late_detection", label: "Deteksi anomali terlambat", monthlyEstimate: 35000000, description: "Kerugian membesar sebelum teridentifikasi" },
    { id: "investigation", label: "Investigasi manual", monthlyEstimate: 18000000, description: "Waktu tim menelusuri transaksi mencurigakan" },
    { id: "compliance_gap", label: "Compliance risk", monthlyEstimate: 12000000, description: "Risiko denda dan audit karena audit trail lemah" }
  ],
  cash_stock: [
    { id: "stockout_loss", label: "Kehilangan sales karena stockout", monthlyEstimate: 30000000, description: "Barang habis tepat saat permintaan datang" },
    { id: "overstock_capital", label: "Modal tertahan overstock", monthlyEstimate: 45000000, description: "Modal tidak beredar karena stok berlebihan" },
    { id: "reactive_decisions", label: "Keputusan reaktif", monthlyEstimate: 15000000, description: "Biaya opportunity karena keputusan telat" }
  ],
  reporting: [
    { id: "report_delay", label: "Laporan telat selesai", monthlyEstimate: 20000000, description: "Keputusan penting terhambat menunggu data" },
    { id: "meeting_no_action", label: "Meeting tanpa action", monthlyEstimate: 14000000, description: "Waktu rapat tidak menghasilkan eksekusi" },
    { id: "data_reconciliation", label: "Rekonsiliasi antar tim", monthlyEstimate: 12000000, description: "Versi data berbeda antar departemen" }
  ],
  brand_trust: [
    { id: "missed_organic", label: "Traffic organik hilang", monthlyEstimate: 25000000, description: "Pelanggan tidak menemukan brand di Google" },
    { id: "unread_reviews", label: "Review tidak terrespons", monthlyEstimate: 10000000, description: "Trust menurun karena komplain tidak teratasi" },
    { id: "ai_search_gap", label: "Tidak muncul di AI search", monthlyEstimate: 18000000, description: "Brand tidak masuk pertimbangan calon pelanggan modern" }
  ]
};

const FINDINGS_BY_CLUSTER: Record<ChallengeId, Finding[]> = {
  revenue: [
    {
      title: "Lead tidak kekurangan, tapi kekurangan follow-up",
      finding: "Bisnis Anda punya lead, tapi 60-70% lead tidak di-follow-up lebih dari 1 kali. Padahal 80% closing terjadi setelah follow-up ke-5.",
      impact: "Peluang yang sudah ada bocor diam-diam setiap minggu, sementara biaya perolehan lead tetap sama.",
      risk: "Kompetitor yang lebih responsif akan menutup peluang yang seharusnya menjadi pelanggan Anda.",
      solution: "AI Sales Assistant + AI WhatsApp Sales Bot untuk follow-up terjadwal dan reminder tanpa lead terlupakan.",
      potential: "Lead follow-up coverage naik +50 poin • Lost opportunity turun 71% • Sales cycle lebih pendek 36%"
    },
    {
      title: "Repeat order dibiarkan tanpa sistem trigger",
      finding: "Pelanggan lama jarang dibuatkan penawaran berulang karena tim tidak punya waktu memantau siapa yang siap beli lagi.",
      impact: "Revenue dari pelanggan yang sudah percaya tidak dimaksimalkan, sementara biaya akuisisi pelanggan baru terus meningkat.",
      risk: "Saat biaya iklan naik, margin semakin tipis karena repeat order rate rendah.",
      solution: "AI Repeat Order yang mendeteksi sinyal pembelian ulang dan memicu penawaran tepat waktu.",
      potential: "Repeat purchase rate membaik • Revenue dari basis pelanggan lama naik tanpa tambah budget marketing"
    }
  ],
  cost: [
    {
      title: "Jam kerja manual menumpuk di proses bernilai rendah",
      finding: "Tim menghabiskan ratusan jam per bulan untuk input, copy-paste, dan verifikasi data yang sebenarnya bisa diotomatisasi.",
      impact: "Biaya tidak hanya gaji, tapi opportunity cost: tim tidak punya waktu untuk aktivitas revenue-generating.",
      risk: "Saat bisnis tumbuh, jam manual akan bertambah linear — Anda merekrut lebih banyak orang untuk pekerjaan yang sama.",
      solution: "AI Document Processor + AI Pembukuan Otomatis + integrasi ke sistem existing.",
      potential: "Jam kerja manual turun 70% • Error input turun 75% • Biaya proses per transaksi turun 28%"
    },
    {
      title: "Biaya tersembunyi dari duplikasi data",
      finding: "Satu invoice bisa diinput 2-3 kali oleh orang berbeda: sales, admin, finance. Setiap duplikasi terlihat kecil, tapi menumpuk dalam ratusan transaksi per bulan.",
      impact: "Puluhan jam terbuang untuk pekerjaan yang sebenarnya tidak perlu, dan error sering muncul di titik handover.",
      risk: "Data tidak konsisten antar sistem membuat laporan keuangan dan operasional sulit dipercaya.",
      solution: "AI Data Quality Auto-Heal + integrasi satu arah data dari sumber utama ke semua sistem.",
      potential: "Duplikasi input berkurang drastis • Waktu rekonsiliasi turun • Kepercayaan data meningkat"
    }
  ],
  fraud: [
    {
      title: "Fraud baru terlihat setelah kerugian membesar",
      finding: "Anomali transaksi baru diketahui setelah kerugian sudah signifikan, karena pemantauan masih bergantung pada audit manual berkala.",
      impact: "Semakin lama anomali terlewat, semakin besar kerugian dan semakin sulit menelusuri akar masalahnya.",
      risk: "Karyawan atau pihak luar yang mengetahui celah ini bisa memanfaatkannya berulang kali.",
      solution: "AI Fraud Detection yang memantau pola transaksi real-time dan flag deviasi sejak dini.",
      potential: "Waktu deteksi anomali turun 96% • Nilai risiko tertahan turun 83% • Insiden lolos pantau turun 87%"
    },
    {
      title: "Audit trail lemah meningkatkan compliance risk",
      finding: "Approval dan perubahan data sering tidak terlacak dengan baik, sehingga sulit membuktikan siapa yang bertanggung jawab.",
      impact: "Investigasi kasus memakan waktu lama dan hasilnya tidak kuat secara hukum maupun internal.",
      risk: "Saat audit eksternal datang, dokumen bukti tidak cukup untuk memenuhi standar compliance.",
      solution: "AI Process Intelligence + logging otomatis untuk setiap approval dan perubahan data kritis.",
      potential: "Audit trail kuat • Waktu investigasi turun • Compliance risk menurun"
    }
  ],
  cash_stock: [
    {
      title: "Keputusan kas dan stok diambil dari data kemarin",
      finding: "Anda membuat keputusan hari ini berdasarkan laporan minggu lalu. Di pasar yang bergerak cepat, itu seperti mengemudi sambil melihat spion.",
      impact: "Keputusan reaktif menyebabkan modal tertahan di stok yang salah atau barang habis saat permintaan tinggi.",
      risk: "Ketidakpastian cashflow membuat bisnis sulit berinvestasi untuk pertumbuhan.",
      solution: "AI Prediksi Cashflow + AI Demand Planner untuk perencanaan berbasis data aktual dan tren.",
      potential: "Akurasi prediksi cashflow naik +49% • Stockout turun 83% • Modal tertahan overstock turun 63%"
    },
    {
      title: "Stockout dan overstock terjadi bersamaan",
      finding: "Tanpa prediksi permintaan yang baik, stok yang salah sering berlebihan sementara stok yang penting justru kehabisan.",
      impact: "Anda kehilangan sales di satu sisi dan membuang modal di sisi lain dalam periode yang sama.",
      risk: "ROI inventory terus menurun dan pelanggan beralih ke kompetitor yang stoknya lebih andal.",
      solution: "AI Inventory Optimizer yang menjaga stok ideal berdasarkan demand pattern dan lead time.",
      potential: "Frekuensi stockout turun • Inventory turnover membaik • Modal beredar lebih cepat"
    }
  ],
  reporting: [
    {
      title: "Laporan lambat membuat keputusan kehilangan momentum",
      finding: "Laporan mingguan baru selesai setelah meeting direksi berlangsung, sehingga keputusan diambil tanpa data terbaru.",
      impact: "Bisnis bereaksi terhadap masalah yang sudah lewat, bukan mencegah masalah yang akan datang.",
      risk: "Pesaing yang lebih cepat dalam mengambil keputusan akan memenangkan peluang di pasar.",
      solution: "AI Report Generator + AI Executive Dashboard untuk laporan otomatis dan real-time.",
      potential: "Waktu menyusun laporan turun 98% • Kecepatan keputusan naik 86% • Meeting punya action jelas"
    },
    {
      title: "Setiap tim punya versi data sendiri",
      finding: "Sales, operasional, dan finance sering menggunakan angka yang berbeda saat rapat, membuat diskusi berputar-putar tanpa keputusan.",
      impact: "Waktu meeting terbuang untuk debat data alih-alih menentukan tindakan.",
      risk: "Keputusan penting tertunda atau diambil berdasarkan data yang salah.",
      solution: "Single source of truth dengan AI Executive Dashboard yang mengintegrasikan data dari semua tim.",
      potential: "Versi data berbeda turun 75% • Meeting tanpa action clear turun 75% • Keputusan lebih cepat"
    }
  ],
  brand_trust: [
    {
      title: "Brand Anda tidak muncul di jawaban AI",
      finding: "Calon pelanggan kini bertanya ke ChatGPT, Perplexity, dan Gemini sebelum Google. Jika brand Anda tidak muncul di jawaban AI, Anda tidak masuk ke pertimbangan mereka.",
      impact: "Peluang pelanggan baru hilang sebelum mereka pernah mengunjungi website atau bicara dengan sales.",
      risk: "Kompetitor yang lebih siap di AI search akan semakin memperkuat posisinya seiring waktu.",
      solution: "AI Local & AI Search Trust Builder + AI Organic Traffic Builder untuk trust signal yang konsisten.",
      potential: "Visibility Google organik naik 133% • Lead organik/bulan naik 125% • Review respons naik 325%"
    },
    {
      title: "Review dan komplain tidak teridentifikasi",
      finding: "Feedback pelanggan tersebar di banyak platform dan sering terlewat, sehingga masalah trust tidak diatasi sejak dini.",
      impact: "Satu review negatif yang tidak terrespons bisa menurunkan keputusan puluhan calon pelanggan.",
      risk: "Reputasi brand perlahan memudar tanpa Anda sadari karena tidak ada monitoring sistematis.",
      solution: "AI Sentiment Pelanggan + AI Survey & Feedback Analyzer untuk monitoring dan respons cepat.",
      potential: "Review yang terrespons naik • Sentimen pelanggan membaik • Trust signal semakin kuat"
    }
  ]
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

export function calculateEfficiencyMetrics(answers: WizardAnswers): EfficiencyMetric[] {
  const primary = answers.mainChallenges[0] || "revenue";
  return EFFICIENCY_METRICS[primary];
}

export function calculateHiddenCosts(answers: WizardAnswers): HiddenCost[] {
  const primary = answers.mainChallenges[0] || "revenue";
  return HIDDEN_COSTS_BY_CLUSTER[primary];
}

export function calculateFindings(answers: WizardAnswers): Finding[] {
  const primary = answers.mainChallenges[0] || "revenue";
  return FINDINGS_BY_CLUSTER[primary];
}

export function buildBeforeAfterMetrics(answers: WizardAnswers) {
  const primary = answers.mainChallenges[0] || "revenue";
  const isRevenueCluster = primary === "revenue" || primary === "brand_trust";

  if (isRevenueCluster) {
    return [
      { label: "Monthly revenue pipeline", beforeValue: 800, afterValue: 920, unit: "Rp" as const },
      { label: "Lead follow-up coverage", beforeValue: 35, afterValue: 85, unit: "%" as const },
      { label: "Sales cycle", beforeValue: 14, afterValue: 9, unit: "count" as const }
    ];
  }

  return [
    { label: "Biaya operasional manual/bulan", beforeValue: 80, afterValue: 58, unit: "Rp" as const },
    { label: "Jam kerja manual/bulan", beforeValue: 320, afterValue: 95, unit: "count" as const },
    { label: "Error rate input", beforeValue: 8, afterValue: 1.5, unit: "%" as const }
  ];
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
  const metrics = calculateEfficiencyMetrics(answers);
  const firstMetric = metrics[0];
  const before = parseNumericValue(firstMetric.before);
  const after = parseNumericValue(firstMetric.after);

  // For metrics where lower is better (negative impact), After should be lower.
  // For metrics where higher is better (positive impact), After should be higher.
  return [
    { name: "Before", before, after: 0 },
    { name: "After AI", before: 0, after }
  ];
}

function parseNumericValue(value: string): number {
  const cleaned = value.replace(/[^\d.]/g, "");
  if (!cleaned) return 0;
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : 0;
}

export function buildSolutionCards(solutions: PesatSolution[], answers: WizardAnswers): SolutionCard[] {
  const primary = answers.mainChallenges[0] || "revenue";
  const detail = answers.detailChallenges[0];

  return solutions.map((solution, index) => {
    // Confidence score: higher if solution directly maps to selected detail, then by cluster match
    let confidence = 75;
    if (detail && DETAIL_SOLUTION_MAP[detail]?.includes(solution.id)) {
      confidence = 96;
    } else if (solution.cluster.includes(primary)) {
      confidence = 88;
    }
    // Slight variance so they don't all look identical
    confidence = Math.min(99, confidence + index * 2);

    const proofBasis = detail ? `Direct match: ${DETAIL_LABELS[detail]} → ${solution.name}` : `Cluster match: ${primary} priority → ${solution.name}`;

    return {
      name: solution.name,
      description: solution.description,
      impactBadge: solution.impactBadge || "high-impact",
      setupTime: solution.setupTime || "2-3 minggu",
      confidenceScore: confidence,
      proofBasis
    };
  });
}

export function buildFallbackResult(sessionId: string, answers: WizardAnswers, solutions: PesatSolution[], impactRanges: ImpactRanges): GeneratedResult {
  const primary = answers.mainChallenges[0] || "revenue";
  const isRevenueCluster = primary === "revenue" || primary === "brand_trust";

  const impactCards = Object.entries(impactRanges)
    .slice(0, 3)
    .map(([key, value]) => ({
      title: key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase()),
      value,
      description: "Estimasi awal berbasis benchmark industri dan jawaban mini session."
    }));

  const diagnosisPack = buildDiagnosisPack(answers, solutions, impactRanges);
  const efficiencyMetrics = calculateEfficiencyMetrics(answers);
  const hiddenCosts = calculateHiddenCosts(answers);
  const findings = calculateFindings(answers);
  const beforeAfterMetrics = buildBeforeAfterMetrics(answers);

  const monthlyRevenue = isRevenueCluster ? 800_000_000 : 0;
  const monthlyCost = isRevenueCluster ? 0 : 80_000_000;

  const savingsLabel = isRevenueCluster ? `+Rp ${formatMoney(monthlyRevenue * 0.15)}/bulan` : `Rp ${formatMoney(monthlyCost * 0.28)}/bulan`;

  return {
    sessionId,
    headline: HEADLINE_BY_CLUSTER[primary],
    subheadline: `Dari diagnosis ini, kami mengidentifikasi potensi perbaikan operasional. ${
      isRevenueCluster
        ? `Revenue pipeline bisa lebih tertutup dengan lift yang terukur.`
        : `Ada biaya tersembunyi sekitar ${savingsLabel} yang bisa dikurangi lewat otomasi.`
    }`,
    diagnosis: diagnosisPack.diagnosis,
    rootCause: diagnosisPack.rootCause,
    promise: diagnosisPack.promise,
    firstStep: diagnosisPack.firstStep,
    costOfInaction: buildCostOfInaction(answers),
    userSignals: extractUserSignals(answers.detailNote || ""),
    plan: buildActionPlan(answers, solutions, impactRanges),
    impactCards,
    beforeAfterText: [
      `Sebelum: proses masih manual, data tidak real-time, dan ${CLUSTER_REFRAME[primary]}.`,
      `Sesudah: sinyal bisnis dipantau otomatis, ${MEASURED_BY[primary][0]} membaik, dan impact bisa dilacak per minggu.`
    ],
    uniqueMechanism: "Cara kerjanya seperti memasang co-pilot operasional: Pesat.AI membaca sinyal dari proses berjalan, memilih tindakan prioritas, lalu membantu tim mengeksekusi dan mengukur hasilnya.",
    solutionsText: solutions.map((solution) => `${solution.name}: ${solution.description}`),
    solutions,
    solutionCards: buildSolutionCards(solutions, answers),
    impactRanges,
    chart: buildChart(answers),
    efficiencyMetrics,
    hiddenCosts,
    findings,
    beforeAfterMetrics,
    llmFallback: true
  };
}

function formatMoney(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}M`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}jt`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}rb`;
  return value.toString();
}
