import {
  AVAILABLE_SOLUTIONS,
  DETAIL_LABELS,
  DETAIL_SOLUTION_MAP,
  FRICTION_SOURCES,
  TRANSITION_FACTS
} from "@/lib/solutions";
import type { AdoptionId, ChallengeId, DiagnosisPack, EfficiencyMetric, Finding, FrictionSourceId, GeneratedResult, HiddenCost, ImpactId, ImpactRanges, PesatSolution, PlanPhase, SolutionCard, WizardAnswers } from "@/lib/types";

const CLUSTER_PRIORITY: Record<ChallengeId, string[]> = {
  revenue: ["ai_sales_assistant", "ai_repeat_order", "ai_crm_pintar", "ai_dynamic_pricing"],
  cost: ["ai_pembukuan_otomatis", "ai_invoice_ap_otomatis", "ai_document_processor", "ai_process_intelligence"],
  risk_trust: ["ai_fraud_detection", "ai_data_quality_auto_heal", "ai_local_ai_search_trust_builder", "ai_roi_impact_tracker"],
  cash_stock: ["ai_prediksi_cashflow", "ai_demand_planner", "ai_inventory_optimizer", "ai_executive_dashboard"],
  reporting: ["ai_report_generator", "ai_executive_dashboard", "ai_meeting_notetaker", "ai_ticket_router"]
};

// Maps each friction source to the solutions that directly remove that friction.
const FRICTION_SOLUTION_BOOST: Record<FrictionSourceId, string[]> = {
  duplicate_data: ["ai_data_quality_auto_heal", "ai_document_processor", "ai_pembukuan_otomatis", "ai_invoice_ap_otomatis"],
  manual_reports: ["ai_report_generator", "ai_executive_dashboard", "ai_meeting_notetaker", "ai_pembukuan_otomatis"],
  delayed_response: ["ai_whatsapp_sales_bot", "ai_sales_assistant", "ai_ticket_router", "ai_chatbot_24_7"],
  error_control: ["ai_data_quality_auto_heal", "ai_document_processor", "ai_quality_control_visual", "ai_process_intelligence", "ai_fraud_detection", "ai_invoice_ap_otomatis", "ai_roi_impact_tracker"],
  knowledge_silo: ["ai_sop_knowledge_writer", "ai_process_intelligence", "ai_meeting_notetaker"]
};

// Maps the stack answer from the wizard to integration keywords used in solution metadata.
const STACK_TO_INTEGRATIONS: Record<string, string[]> = {
  whatsapp_sheets: ["WhatsApp", "Sheets"],
  erp: ["ERP", "Odoo", "SAP"],
  ecommerce: ["Shopify", "Tokopedia", "Shopee", "E-commerce"],
  crm: ["CRM", "HubSpot", "Salesforce", "Zoho"],
  custom: [],
  mixed: []
};

const IMPACT_MULTIPLIERS: Record<ImpactId | "", number> = {
  mild: 0.75,
  weekly: 0.9,
  often: 1.05,
  critical: 1.2,
  "": 1
};

function scoreSolution(solution: PesatSolution, answers: WizardAnswers): number {
  const primary = answers.mainChallenges[0] || "revenue";
  const secondary = answers.mainChallenges[1];
  const detail = answers.detailChallenges[0];
  const friction = answers.frictionSource;
  const impact = answers.impactLevel;
  const adoption = answers.adoptionStyle;
  const context = answers.contextAnswers || {};

  let score = 0;

  // Detail-driven match is the strongest signal.
  if (detail) {
    const detailMap = DETAIL_SOLUTION_MAP[detail] || [];
    const detailIndex = detailMap.indexOf(solution.id);
    if (detailIndex >= 0) {
      score += 30 - detailIndex * 5;
    }
  }

  // Cluster relevance keeps primary-cluster solutions above secondary cluster.
  if (solution.cluster.includes(primary)) score += 12;
  if (secondary && solution.cluster.includes(secondary)) score += 5;

  // Friction source directly selects solutions that remove that friction.
  if (friction && FRICTION_SOLUTION_BOOST[friction]?.includes(solution.id)) {
    score += 8;
  }

  // Impact level adjusts preference toward quick wins or deeper solutions.
  if (impact === "critical" || impact === "often") {
    if (solution.impactBadge === "high-impact" || solution.impactBadge === "strategic") score += 4;
  }
  if (impact === "mild" || impact === "weekly") {
    if (solution.impactBadge === "quick-win" || solution.effortLevel === "low") score += 4;
  }

  // Adoption style adjusts for realistic implementation effort.
  if (adoption === "starting" && (solution.impactBadge === "quick-win" || solution.effortLevel === "low")) {
    score += 5;
  }
  if (adoption === "diy" && (solution.effortLevel === "low" || solution.effortLevel === "medium")) {
    score += 3;
  }

  // Stack fit: if the user told us their main system, boost solutions that integrate with it.
  const stackKey = context.currentStack;
  if (stackKey && STACK_TO_INTEGRATIONS[stackKey]) {
    const keywords = STACK_TO_INTEGRATIONS[stackKey];
    const integrates = solution.integrations || [];
    if (keywords.some((kw) => integrates.some((i) => i.toLowerCase().includes(kw.toLowerCase())))) {
      score += 6;
    }
  }

  // Friction channel fit: e.g. delayed_response via WhatsApp -> WhatsApp Sales Bot.
  const frictionChannel = context.frictionChannel;
  if (frictionChannel && friction === "delayed_response" && solution.integrations) {
    if (frictionChannel === "whatsapp" && solution.integrations.some((i) => /whatsapp/i.test(i))) score += 4;
    if (frictionChannel === "email" && solution.integrations.some((i) => /email|gmail|outlook/i.test(i))) score += 4;
  }

  // Detail-numeric severity: high volume/severity rewards heavier solutions, low volume rewards quick wins.
  const detailNumeric = context.detailNumeric;
  if (detailNumeric === "very_high" && (solution.impactBadge === "high-impact" || solution.impactBadge === "strategic")) {
    score += 4;
  }
  if (detailNumeric === "low" && (solution.impactBadge === "quick-win" || solution.effortLevel === "low")) {
    score += 4;
  }

  return score;
}

// Reframe each cluster from the generic symptom the client typed into the real
// root cause Pesat.AI starts from. This is the "insight" the client did not articulate.
const CLUSTER_REFRAME: Record<ChallengeId, string> = {
  revenue: "kecepatan follow-up, timing, dan repeat order yang belum ditangani secara sistematis",
  cost: "pekerjaan manual berulang yang diam-diam berubah menjadi biaya tetap",
  risk_trust: "anomali, celah kontrol, dan trust signal yang belum dipantau secara sistematis",
  cash_stock: "keputusan kas dan stok yang diambil dari laporan masa lalu, bukan dari prediksi",
  reporting: "keputusan yang telat karena data tidak siap saat paling dibutuhkan"
};

// Concrete, client-checkable metrics per cluster — turns a vague promise into a measurable one.
const MEASURED_BY: Record<ChallengeId, string[]> = {
  revenue: ["kecepatan follow-up lead", "konversi chat ke closing", "repeat order rate"],
  cost: ["jam kerja manual per bulan", "biaya proses per transaksi", "tingkat error input"],
  risk_trust: ["anomali terdeteksi lebih dini", "trust signal di Google dan AI search", "waktu deteksi risiko"],
  cash_stock: ["akurasi prediksi kas", "frekuensi stockout", "modal tertahan di stok"],
  reporting: ["waktu menyiapkan laporan", "kecepatan keputusan", "action item yang dieksekusi"]
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
  risk_trust: "Anomali dan trust signal yang tidak dipantau membesar tanpa disadari; biaya menanganinya setelah terlanjur jauh lebih mahal daripada mendeteksinya sejak awal.",
  cash_stock: "Tanpa prediksi, keputusan kas dan stok tetap reaktif: modal tertahan di stok yang salah atau barang habis tepat saat permintaan datang.",
  reporting: "Keputusan yang menunggu laporan manual terus tertinggal momentum, dan tim sibuk menyusun data alih-alih bertindak atasnya."
};

const HEADLINE_BY_CLUSTER: Record<ChallengeId, string> = {
  revenue: "Ada pipeline revenue yang bocor setiap minggu — dan itu bisa diperbaiki tanpa menambah tim sales.",
  cost: "Rp 200-400 juta per tahun mungkin tersembunyi di pekerjaan manual yang belum terlihat.",
  risk_trust: "Celah operasional dan trust signal yang baru ketahuan setelah rugi sebenarnya bisa terdeteksi jauh lebih awal.",
  cash_stock: "Kas dan stok Anda masih dijalankan dengan prediksi yang terlambat — ini cara memperbaikinya.",
  reporting: "Keputusan bisnis Anda menunggu data yang baru siap 5 hari kemudian. Itu bisa jadi 4 jam."
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
  risk_trust: [
    { label: "Waktu deteksi anomali", before: "45 hari", after: "2 hari", impact: "-96%", impactType: "positive", description: "Risiko tertangkap sebelum membesar" },
    { label: "Trust signal terpantau", before: "20%", after: "85%", impact: "+325%", impactType: "positive", description: "Review, Google, dan AI search terawal" },
    { label: "Insiden lolos pantau", before: "30%", after: "4%", impact: "-87%", impactType: "positive", description: "Anomali atau masalah trust lebih sedikit terlewat" }
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
  risk_trust: [
    { id: "missed_signal", label: "Sinyal risiko/trust terlewat", monthlyEstimate: 30000000, description: "Anomali atau trust signal tidak dipantau sampai membesar" },
    { id: "investigation", label: "Investigasi & tindak lanjut manual", monthlyEstimate: 18000000, description: "Waktu tim menelusuri transaksi atau review mencurigakan" },
    { id: "search_visibility_gap", label: "Brand tidak muncul di Google/AI search", monthlyEstimate: 20000000, description: "Pelanggan menemukan kompetitor lebih dulu" }
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
  risk_trust: [
    {
      title: "Anomali dan trust signal baru terlihat setelah kerugian membesar",
      finding: "Anomali transaksi, review negatif, atau celah kontrol baru diketahui setelah dampaknya signifikan, karena pemantauan masih manual dan berkala.",
      impact: "Semakin lama sinyal terlewat, semakin besar kerugian finansial maupun reputasi, dan semakin sulit menelusuri akar masalahnya.",
      risk: "Karyawan, pihak luar, atau kompetitor yang mengetahui celah ini bisa memanfaatkannya berulang kali.",
      solution: "AI Fraud Detection + AI Sentiment Pelanggan + AI Local & AI Search Trust Builder untuk pemantauan risiko dan trust real-time.",
      potential: "Waktu deteksi anomali turun 96% • Trust signal terpantau naik 325% • Insiden lolos pantau turun 87%"
    },
    {
      title: "Brand tidak muncul di jawaban AI dan review tidak terawal",
      finding: "Calon pelanggan bertanya ke ChatGPT, Perplexity, dan Gemini sebelum Google. Jika brand tidak muncul di jawaban AI atau review tidak direspons, Anda tidak masuk pertimbangan.",
      impact: "Peluang pelanggan baru hilang sebelum mereka mengunjungi website, sementara kompetitor memperkuat posisinya.",
      risk: "Reputasi brand memudar tanpa disadari karena tidak ada monitoring sistematis.",
      solution: "AI Local & AI Search Trust Builder + AI Sentiment Pelanggan untuk trust signal yang konsisten.",
      potential: "Visibility Google/AI search naik • Review respons naik • Trust signal semakin kuat"
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
  ]
};

// Matches numeric signals the user typed (currency, percentages, counts, cadences) so the result can
// reflect their own figures. Deterministic and grounded — we only echo numbers the user actually gave.
const USER_SIGNAL_REGEX =
  /rp\s?\d[\d.,]*\s?(?:ribu|rb|juta|jt|miliar|milyar)?|\d[\d.,]*\s?(?:%|persen|jam|menit|hari|minggu|bulan|tahun|orang|karyawan|staf|staff|tim|chat|pesan|lead|prospek|transaksi|order|pesanan|pelanggan|customer|klien|produk|sku|item|cabang|toko|outlet|kali|x)\b(?:\s?(?:\/|per)\s?(?:hari|minggu|bulan|tahun|orang))?/gi;

// Captures tools and team-size hints the user mentions so recommendations can reference feasible integrations.
const STACK_SIGNAL_REGEX =
  /\b(?:WhatsApp|WA|Email|Telepon|Spreadsheet|Excel|Google Sheets|Odoo|SAP|Oracle|NetSuite|Shopify|WooCommerce|Tokopedia|Shopee|Lazada|TikTok Shop|HubSpot|Salesforce|Zoho|Pipedrive|Freshdesk|Zendesk|Notion|Google Docs|Microsoft 365|Outlook|Gmail|Slack|Discord|Jira|Trello|Asana|ClickUp|Monday|Xero|QuickBooks|MYOB|Firebase|AWS|Azure|GCP)\b/gi;

export function extractUserSignals(note: string): string[] {
  if (!note) return [];
  const numericMatches = note.match(USER_SIGNAL_REGEX) || [];
  const numericCleaned = numericMatches.map((match) => match.replace(/\s+/g, " ").trim()).filter((match) => /\d/.test(match));

  const stackMatches = note.match(STACK_SIGNAL_REGEX) || [];
  const stackCleaned = Array.from(new Set(stackMatches.map((m) => m.trim())));

  const combined = Array.from(new Set([...numericCleaned, ...stackCleaned])).slice(0, 8);
  return combined;
}

export function calculateEfficiencyMetrics(answers: WizardAnswers): EfficiencyMetric[] {
  const primary = answers.mainChallenges[0] || "revenue";
  return EFFICIENCY_METRICS[primary];
}

export function calculateHiddenCosts(answers: WizardAnswers): HiddenCost[] {
  const primary = answers.mainChallenges[0] || "revenue";
  const multiplier = IMPACT_MULTIPLIERS[answers.impactLevel] ?? 1;
  return HIDDEN_COSTS_BY_CLUSTER[primary].map((cost) => ({
    ...cost,
    monthlyEstimate: Math.round(cost.monthlyEstimate * multiplier)
  }));
}

export function calculateFindings(answers: WizardAnswers): Finding[] {
  const primary = answers.mainChallenges[0] || "revenue";
  return FINDINGS_BY_CLUSTER[primary];
}

export function buildBeforeAfterMetrics(answers: WizardAnswers) {
  const primary = answers.mainChallenges[0] || "revenue";
  const isRevenueCluster = primary === "revenue";

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

  // Without a specific detail challenge, the deterministic cluster priority is the
  // most stable ordering and keeps existing contracts/tests intact.
  if (answers.detailChallenges.length === 0) {
    const clusterBackfill = [...CLUSTER_PRIORITY[primary], ...(secondary ? CLUSTER_PRIORITY[secondary] : [])];
    const uniqueIds = Array.from(new Set(clusterBackfill)).slice(0, 4);
    return uniqueIds
      .map((id) => AVAILABLE_SOLUTIONS.find((solution) => solution.id === id))
      .filter(Boolean)
      .map((solution) => ({ ...solution!, fitScore: scoreSolution(solution!, answers) })) as PesatSolution[];
  }

  // With a detail challenge, use the scoring engine to personalise ranking.
  const detailDriven = answers.detailChallenges.flatMap((detail) => DETAIL_SOLUTION_MAP[detail] || []);
  const clusterBackfill = [...CLUSTER_PRIORITY[primary], ...(secondary ? CLUSTER_PRIORITY[secondary] : [])];
  const candidateIds = Array.from(new Set([...detailDriven, ...clusterBackfill, ...AVAILABLE_SOLUTIONS.map((s) => s.id)]));

  const scored = candidateIds
    .map((id) => AVAILABLE_SOLUTIONS.find((solution) => solution.id === id))
    .filter(Boolean)
    .map((solution) => {
      const score = scoreSolution(solution!, answers);
      return { solution: solution!, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return scored.map((item) => ({ ...item.solution, fitScore: item.score }));
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

function adjustRangeString(value: string, multiplier: number): string {
  if (multiplier === 1 || !value) return value;
  return value.replace(/\d+/g, (num) => {
    const parsed = parseInt(num, 10);
    return String(Math.round(parsed * multiplier));
  });
}

export function calculateImpactRanges(answers: WizardAnswers): ImpactRanges {
  const challenges = new Set(answers.mainChallenges);
  const multiplier = IMPACT_MULTIPLIERS[answers.impactLevel] ?? 1;
  const ranges: ImpactRanges = {};

  if (challenges.has("revenue")) ranges.revenueIncrease = adjustRangeString("10-30%", multiplier);
  if (challenges.has("cost")) ranges.costReduction = adjustRangeString("8-22%", multiplier);
  if (challenges.has("risk_trust")) {
    ranges.riskReduction = adjustRangeString("15-45%", multiplier);
    ranges.trustLift = adjustRangeString("15-35% peningkatan trust signal", multiplier);
  }
  if (challenges.has("cash_stock")) ranges.cashAccuracy = adjustRangeString("20-40% lebih presisi", multiplier);
  if (challenges.has("reporting") || challenges.has("cost")) ranges.hoursSaved = adjustRangeString("20-60 jam/bulan", multiplier);

  if (!ranges.hoursSaved) ranges.hoursSaved = adjustRangeString("20-60 jam/bulan", multiplier);

  return Object.keys(ranges).length ? ranges : { revenueIncrease: adjustRangeString("10-30%", multiplier), hoursSaved: adjustRangeString("20-60 jam/bulan", multiplier) };
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

  return solutions.map((solution) => {
    // Confidence is grounded in the deterministic fit score; cap at 99 and keep a realistic floor.
    const fitScore = typeof solution.fitScore === "number" ? solution.fitScore : scoreSolution(solution, answers);
    const confidence = Math.min(99, Math.max(70, Math.round(70 + (fitScore / 40) * 29)));

    const proofParts: string[] = [];
    if (detail && DETAIL_SOLUTION_MAP[detail]?.includes(solution.id)) {
      proofParts.push(`Direct match: ${DETAIL_LABELS[detail]} → ${solution.name}`);
    }
    if (solution.cluster.includes(primary)) {
      proofParts.push(`Cluster match: ${primary}`);
    }
    if (answers.frictionSource && FRICTION_SOLUTION_BOOST[answers.frictionSource]?.includes(solution.id)) {
      proofParts.push(`Friction fit: ${FRICTION_SOURCES[answers.frictionSource]?.label || answers.frictionSource}`);
    }
    const proofBasis = proofParts.length ? proofParts.join(" • ") : `Relevant for ${primary}`;

    return {
      name: solution.name,
      description: solution.description,
      impactBadge: solution.impactBadge || "high-impact",
      setupTime: solution.setupTime || "2-3 minggu",
      confidenceScore: confidence,
      proofBasis,
      capabilities: solution.capabilities,
      prerequisites: solution.prerequisites,
      integrations: solution.integrations,
      effortLevel: solution.effortLevel,
      caseStudy: solution.caseStudy
    };
  });
}

export function buildFallbackResult(sessionId: string, answers: WizardAnswers, solutions: PesatSolution[], impactRanges: ImpactRanges): GeneratedResult {
  const primary = answers.mainChallenges[0] || "revenue";
  const isRevenueCluster = primary === "revenue";

  const impactCards = Object.entries(impactRanges)
    .slice(0, 3)
    .map(([key, value]) => ({
      title: key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase()),
      value,
      description: "Estimasi awal berbasis benchmark industri dan jawaban mini session Anda."
    }));

  const diagnosisPack = buildDiagnosisPack(answers, solutions, impactRanges);
  const efficiencyMetrics = calculateEfficiencyMetrics(answers);
  const hiddenCosts = calculateHiddenCosts(answers);
  const findings = calculateFindings(answers);
  const beforeAfterMetrics = buildBeforeAfterMetrics(answers);

  const monthlyRevenue = isRevenueCluster ? 800_000_000 : 0;
  const monthlyCost = isRevenueCluster ? 0 : 80_000_000;

  const savingsLabel = isRevenueCluster ? `+Rp ${formatMoney(monthlyRevenue * 0.15)}/bulan` : `Rp ${formatMoney(monthlyCost * 0.28)}/bulan`;

  const tldr = isRevenueCluster
    ? `Bisnis Anda kehilangan peluang revenue karena proses follow-up dan repeat order belum sistematis. AI bisa membantu menutup pipeline yang bocor dengan dampak terukur.`
    : `Ada biaya tersembunyi dan pekerjaan manual yang masih memakan waktu tim. AI bisa merapikan proses tersebut dan mengurangi pemborosan operasional.`;

  return {
    sessionId,
    headline: HEADLINE_BY_CLUSTER[primary],
    subheadline: `Dari diagnosis ini, kami mengidentifikasi potensi perbaikan operasional. ${
      isRevenueCluster
        ? `Revenue pipeline bisa lebih tertutup dengan lift yang terukur.`
        : `Ada biaya tersembunyi sekitar ${savingsLabel} yang bisa dikurangi lewat otomasi.`
    }`,
    tldr,
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
