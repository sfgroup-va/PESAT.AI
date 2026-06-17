import { AVAILABLE_SOLUTIONS, DETAIL_LABELS, DETAIL_SOLUTION_MAP, FRICTION_SOLUTION_MAP, FRICTION_SOURCES, TRANSITION_FACTS } from "@/lib/solutions";
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

const IMPACT_RANGE_BY_LEVEL: Record<ChallengeId, Record<Exclude<WizardAnswers["impactLevel"], "">, string>> = {
  revenue: {
    mild: "5-12%",
    weekly: "8-18%",
    often: "12-26%",
    critical: "18-35%"
  },
  cost: {
    mild: "5-10%",
    weekly: "8-15%",
    often: "12-20%",
    critical: "15-28%"
  },
  fraud: {
    mild: "10-20%",
    weekly: "15-30%",
    often: "22-40%",
    critical: "30-55%"
  },
  cash_stock: {
    mild: "10-18% lebih presisi",
    weekly: "15-25% lebih presisi",
    often: "20-35% lebih presisi",
    critical: "25-45% lebih presisi"
  },
  reporting: {
    mild: "10-20 jam/bulan",
    weekly: "15-35 jam/bulan",
    often: "25-50 jam/bulan",
    critical: "35-70 jam/bulan"
  },
  brand_trust: {
    mild: "8-15% peningkatan trust signal",
    weekly: "12-22% peningkatan trust signal",
    often: "18-30% peningkatan trust signal",
    critical: "25-40% peningkatan trust signal"
  }
};

const IMPACT_CONTEXT: Record<Exclude<WizardAnswers["impactLevel"], "">, { diagnosis: string; action: string; cost: string }> = {
  mild: {
    diagnosis: "Masalah ini masih sporadis, jadi momen terbaiknya adalah menutup pola sebelum tim menganggapnya normal.",
    action: "mulai dari pilot kecil yang paling gampang diukur agar baseline Anda rapi lebih dulu",
    cost: "Kalau dibiarkan, kebocoran kecil ini pelan-pelan menjadi cara kerja baru yang makin sulit dibenahi saat volume naik."
  },
  weekly: {
    diagnosis: "Masalah ini sudah berulang mingguan, artinya tim mulai kehilangan ritme meski dampaknya belum meledak setiap hari.",
    action: "mulai dari quick win yang menghilangkan bottleneck mingguan paling mahal",
    cost: "Karena sudah berulang mingguan, biaya dan frustrasi tim tidak lagi insidental; ia mulai menggerus margin dan fokus kerja."
  },
  often: {
    diagnosis: "Masalah ini sudah hampir harian, jadi tim bukan hanya menanganinya, tetapi juga mulai membangun kebiasaan kerja di sekeliling masalah itu.",
    action: "langsung rapikan alur yang paling sering memaksa tim kerja manual atau menunggu terlalu lama",
    cost: "Semakin lama dibiarkan, tim akan terus bekerja lebih keras untuk hasil yang sama dan pertumbuhan terasa berat meski demand ada."
  },
  critical: {
    diagnosis: "Masalah ini sudah harian dan langsung menahan pertumbuhan, jadi solusi awal harus terasa cepat dan terlihat di angka yang dipantau mingguan.",
    action: "langsung menutup titik bocor yang paling cepat menghentikan delay, error, atau peluang hilang",
    cost: "Karena sudah harian, setiap minggu yang lewat biasanya berarti peluang hilang, biaya tambahan, atau keputusan yang terus tertunda."
  }
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

function lowerFirst(value: string): string {
  return value ? value.charAt(0).toLowerCase() + value.slice(1) : value;
}

function getPrimaryChallenge(answers: WizardAnswers): ChallengeId {
  return answers.mainChallenges[0] || "revenue";
}

function getPrimaryDetailLabel(answers: WizardAnswers): string {
  const detail = answers.detailChallenges[0];
  return detail ? DETAIL_LABELS[detail] : CLUSTER_REFRAME[getPrimaryChallenge(answers)];
}

function getFrictionLabel(answers: WizardAnswers): string {
  return answers.frictionSource ? FRICTION_SOURCES[answers.frictionSource].label : "";
}

function getImpactLevel(answers: WizardAnswers): Exclude<WizardAnswers["impactLevel"], ""> {
  return answers.impactLevel || "weekly";
}

function getImpactContext(answers: WizardAnswers) {
  return IMPACT_CONTEXT[getImpactLevel(answers)];
}

function buildSignalSnippet(signals: string[]): string {
  if (!signals.length) return "";
  if (signals.length === 1) return `Anda bahkan menyebut angka seperti ${signals[0]}.`;
  return `Anda bahkan menyebut sinyal seperti ${signals.slice(0, 2).join(" dan ")}.`;
}

function getImpactRangeText(primary: ChallengeId, impactRanges: ImpactRanges): string {
  return (
    {
      revenue: impactRanges.revenueIncrease,
      cost: impactRanges.costReduction,
      fraud: impactRanges.riskReduction,
      cash_stock: impactRanges.cashAccuracy,
      reporting: impactRanges.hoursSaved,
      brand_trust: impactRanges.trustLift
    }[primary] || ""
  );
}

function buildHeadline(answers: WizardAnswers): string {
  const primary = getPrimaryChallenge(answers);
  const detailLabel = lowerFirst(getPrimaryDetailLabel(answers));

  switch (primary) {
    case "revenue":
      return `Lead ada, tapi revenue tetap bocor karena ${detailLabel}.`;
    case "cost":
      return `Biaya manual Anda naik diam-diam karena ${detailLabel}.`;
    case "fraud":
      return `Risiko operasional Anda membesar saat ${detailLabel} dibiarkan lewat.`;
    case "cash_stock":
      return `Kas dan stok meleset bukan karena kebetulan, tapi karena ${detailLabel}.`;
    case "reporting":
      return `Data Anda ada, tapi keputusan tetap telat karena ${detailLabel}.`;
    case "brand_trust":
      return `Brand Anda kalah lebih dulu saat ${detailLabel}.`;
    default:
      return HEADLINE_BY_CLUSTER[primary];
  }
}

function buildSubheadline(answers: WizardAnswers, impactRanges: ImpactRanges, topSolutionName: string, userSignals: string[]): string {
  const primary = getPrimaryChallenge(answers);
  const detailLabel = lowerFirst(getPrimaryDetailLabel(answers));
  const frictionLabel = lowerFirst(getFrictionLabel(answers));
  const impactRange = getImpactRangeText(primary, impactRanges);
  const signalSnippet = buildSignalSnippet(userSignals);
  const impactLine = getImpactContext(answers).diagnosis;

  const frictionSnippet = frictionLabel ? `Gesekan terbesar terlihat saat ${frictionLabel}.` : "";
  const rangeSnippet = impactRange ? `Target realistis awalnya ada di kisaran ${impactRange}.` : "";

  return [
    `Diagnosis ini fokus pada ${detailLabel}, bukan sekadar gejala umum.`,
    impactLine,
    frictionSnippet,
    signalSnippet,
    rangeSnippet || `Quick win tercepatnya dimulai dari ${topSolutionName}.`
  ]
    .filter(Boolean)
    .join(" ");
}

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
  const primary = getPrimaryChallenge(answers);
  const detailLabel = lowerFirst(getPrimaryDetailLabel(answers));
  const frictionLabel = lowerFirst(getFrictionLabel(answers));
  const signals = extractUserSignals(answers.detailNote || "");
  const signalSnippet = buildSignalSnippet(signals);

  return FINDINGS_BY_CLUSTER[primary].map((finding, index) => {
    if (index > 0) return finding;

    const contextLine = [
      `Pilihan Anda menunjukkan masalah paling terasa ada di ${detailLabel}.`,
      frictionLabel ? `Kebocoran terbesar muncul saat ${frictionLabel}.` : "",
      signalSnippet
    ]
      .filter(Boolean)
      .join(" ");

    return {
      ...finding,
      finding: `${contextLine} ${finding.finding}`.trim()
    };
  });
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
  return `${COST_OF_INACTION[answers.mainChallenges[0] || "revenue"]} ${getImpactContext(answers).cost}`.trim();
}

function getSetupSpeedBonus(solution: PesatSolution): number {
  const setup = (solution.setupTime || "").toLowerCase();
  if (setup.includes("1 minggu")) return 8;
  if (setup.includes("2 minggu")) return 5;
  if (setup.includes("3 minggu")) return 2;
  return 0;
}

function scoreSolution(
  solution: PesatSolution,
  answers: WizardAnswers,
  detailDriven: string[],
  frictionDriven: string[],
  clusterBackfill: string[],
  primary: ChallengeId,
  secondary?: ChallengeId
): number {
  let score = 0;

  const detailIndex = detailDriven.indexOf(solution.id);
  if (detailIndex >= 0) score += 140 - detailIndex * 12;

  const frictionIndex = frictionDriven.indexOf(solution.id);
  if (frictionIndex >= 0) score += 95 - frictionIndex * 8;

  const clusterIndex = clusterBackfill.indexOf(solution.id);
  if (clusterIndex >= 0) score += 8 - clusterIndex;

  if (solution.cluster.includes(primary)) score += 2;
  if (secondary && solution.cluster.includes(secondary)) score += 1;

  const impactLevel = getImpactLevel(answers);
  if (impactLevel === "critical" || impactLevel === "often") {
    if (solution.impactBadge === "quick-win") score += 16;
    if (solution.impactBadge === "high-impact") score += 10;
  }

  switch (answers.adoptionStyle) {
    case "starting":
      if (solution.impactBadge === "quick-win") score += 18;
      if (solution.impactBadge === "strategic") score -= 4;
      score += getSetupSpeedBonus(solution);
      break;
    case "dfy":
      if (solution.impactBadge === "high-impact") score += 8;
      if (solution.impactBadge === "strategic") score += 4;
      break;
    case "diy":
      if (solution.impactBadge === "strategic") score += 8;
      if (solution.impactBadge === "quick-win") score += 3;
      break;
    case "hybrid":
      if (solution.impactBadge === "high-impact") score += 5;
      if (solution.impactBadge === "strategic") score += 5;
      break;
    default:
      break;
  }

  return score;
}

export function selectSolutions(answers: WizardAnswers): PesatSolution[] {
  const primary = answers.mainChallenges[0] || "revenue";
  const secondary = answers.mainChallenges[1];

  const detailDriven = answers.detailChallenges.flatMap((detail) => DETAIL_SOLUTION_MAP[detail] || []);
  const frictionDriven = answers.frictionSource ? FRICTION_SOLUTION_MAP[answers.frictionSource] || [] : [];
  const clusterBackfill = [...CLUSTER_PRIORITY[primary], ...(secondary ? CLUSTER_PRIORITY[secondary] : [])];
  const orderedIds = [...detailDriven, ...frictionDriven, ...clusterBackfill];
  const uniqueIds = Array.from(new Set(orderedIds));
  const orderIndex = new Map(uniqueIds.map((id, index) => [id, index]));

  return uniqueIds
    .map((id) => AVAILABLE_SOLUTIONS.find((solution) => solution.id === id))
    .filter((solution): solution is PesatSolution => Boolean(solution))
    .sort((left, right) => {
      const leftScore = scoreSolution(left, answers, detailDriven, frictionDriven, clusterBackfill, primary, secondary);
      const rightScore = scoreSolution(right, answers, detailDriven, frictionDriven, clusterBackfill, primary, secondary);
      if (leftScore !== rightScore) return rightScore - leftScore;
      return (orderIndex.get(left.id) || 0) - (orderIndex.get(right.id) || 0);
    })
    .slice(0, 4) as PesatSolution[];
}

function buildFirstStep(adoptionStyle: AdoptionId | "", topSolutionName: string): string {
  const actionBias =
    {
      dfy: "bergerak cepat tanpa membebani tim Anda dengan setup teknis yang panjang",
      diy: "membuat tim internal cepat paham alur eksekusinya, bukan hanya menerima daftar tools",
      hybrid: "mendapat quick win sambil menyiapkan tim internal mengambil alih secara bertahap",
      starting: "membuktikan dulu bahwa use case ini benar-benar relevan sebelum memperluas investasi"
    }[adoptionStyle || "starting"];

  switch (adoptionStyle) {
    case "dfy":
      return `Pesat.AI yang setup dan jalankan penuh. Langkah pertama: kami jalankan ${topSolutionName} sebagai pilot terukur agar Anda bisa ${actionBias}.`;
    case "diy":
      return `Tim internal Anda yang menjalankan. Langkah pertama: kami berikan blueprint ${topSolutionName} lengkap dengan metrik suksesnya, lalu tim Anda eksekusi agar ${actionBias}.`;
    case "hybrid":
      return `Kombinasi. Langkah pertama: Pesat.AI setup ${topSolutionName}, tim Anda ikut belajar prosesnya agar ${actionBias}.`;
    case "starting":
    default:
      return `Karena baru mulai dengan AI, jangan pasang semuanya sekaligus. Langkah pertama: satu pilot ${topSolutionName}, ukur selama 2 minggu, lalu nilai apakah ia cukup kuat untuk ${actionBias}.`;
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
  const primary = getPrimaryChallenge(answers);
  const names = solutions.map((solution) => solution.name);
  const timeframes = PLAN_TIMEFRAMES[answers.adoptionStyle || "hybrid"];
  const measuredBy = MEASURED_BY[primary];
  const rangeText = Object.values(impactRanges).filter(Boolean).join(" dan ");
  const frictionLabel = lowerFirst(getFrictionLabel(answers));
  const impactAction = getImpactContext(answers).action;

  const phase1Solutions = names.slice(0, 1);
  const phase2Solutions = names.slice(1, Math.max(1, names.length - 1));
  const phase3Solutions = names.slice(Math.max(1, names.length - 1));

  const focus = [
    phase1Solutions.length
      ? `Pasang ${phase1Solutions.join(" + ")} sebagai pilot terukur untuk ${impactAction}${frictionLabel ? `, terutama di ${frictionLabel}` : ""}, tanpa merombak semuanya sekaligus.`
      : `Mulai dari satu use case prioritas sebagai pilot terukur untuk ${impactAction}, tanpa merombak semuanya sekaligus.`,
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
  const primary = getPrimaryChallenge(answers);
  const detailLabels = answers.detailChallenges.map((detail) => DETAIL_LABELS[detail]).filter(Boolean);
  const labelText = detailLabels.length ? detailLabels.join(", ") : CLUSTER_REFRAME[primary];
  const frictionLabel = getFrictionLabel(answers);
  const signals = extractUserSignals(answers.detailNote || "");
  const signalSnippet = buildSignalSnippet(signals);
  const impactContext = getImpactContext(answers);

  const diagnosis = [
    `Titik bocor utamanya ada di ${labelText}.`,
    frictionLabel ? `Yang paling menguras waktu tim sekarang terlihat saat ${lowerFirst(frictionLabel)}.` : "",
    impactContext.diagnosis,
    `Akar masalahnya bukan sekadar gejala permukaan, tetapi ${CLUSTER_REFRAME[primary]}.`,
    signalSnippet
  ]
    .filter(Boolean)
    .join(" ");

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
  const impactLevel = getImpactLevel(answers);
  const ranges: ImpactRanges = {};

  if (challenges.has("revenue")) ranges.revenueIncrease = IMPACT_RANGE_BY_LEVEL.revenue[impactLevel];
  if (challenges.has("cost")) ranges.costReduction = IMPACT_RANGE_BY_LEVEL.cost[impactLevel];
  if (challenges.has("fraud")) ranges.riskReduction = IMPACT_RANGE_BY_LEVEL.fraud[impactLevel];
  if (challenges.has("cash_stock")) ranges.cashAccuracy = IMPACT_RANGE_BY_LEVEL.cash_stock[impactLevel];
  if (challenges.has("reporting") || challenges.has("cost")) ranges.hoursSaved = IMPACT_RANGE_BY_LEVEL.reporting[impactLevel];
  if (challenges.has("brand_trust")) ranges.trustLift = IMPACT_RANGE_BY_LEVEL.brand_trust[impactLevel];

  if (!ranges.hoursSaved) ranges.hoursSaved = IMPACT_RANGE_BY_LEVEL.reporting[impactLevel];

  return Object.keys(ranges).length ? ranges : { revenueIncrease: IMPACT_RANGE_BY_LEVEL.revenue[impactLevel], hoursSaved: IMPACT_RANGE_BY_LEVEL.reporting[impactLevel] };
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

function buildSolutionWhyThisFits(solution: PesatSolution, answers: WizardAnswers): string {
  const detail = answers.detailChallenges[0];
  const friction = answers.frictionSource;
  const detailLabel = lowerFirst(getPrimaryDetailLabel(answers));
  const frictionLabel = lowerFirst(getFrictionLabel(answers));

  if (detail && DETAIL_SOLUTION_MAP[detail]?.includes(solution.id) && friction && FRICTION_SOLUTION_MAP[friction]?.includes(solution.id)) {
    return `${solution.name} diprioritaskan karena ia langsung menyentuh ${detailLabel} dan sekaligus merapikan bottleneck di ${frictionLabel}.`;
  }

  if (detail && DETAIL_SOLUTION_MAP[detail]?.includes(solution.id)) {
    return `${solution.name} diprioritaskan karena paling dekat dengan masalah inti yang Anda pilih, yaitu ${detailLabel}.`;
  }

  if (friction && FRICTION_SOLUTION_MAP[friction]?.includes(solution.id)) {
    return `${solution.name} masuk prioritas karena sumber gesekan terbesarnya ada di ${frictionLabel}, bukan hanya di output akhirnya.`;
  }

  return `${solution.name} berfungsi sebagai lapisan kedua agar perbaikan tidak berhenti di satu bottleneck saja, tetapi ikut menstabilkan proses di belakangnya.`;
}

function buildSolutionExpectedOutcome(solution: PesatSolution, answers: WizardAnswers, impactRanges: ImpactRanges): string {
  const primary = getPrimaryChallenge(answers);
  const rangeText = getImpactRangeText(primary, impactRanges);
  const metrics = MEASURED_BY[primary];

  if (solution.impactBadge === "quick-win") {
    return `Perubahan tercepat biasanya terasa di ${metrics[0]}. ${rangeText ? `Benchmark awalnya ada di kisaran ${rangeText}.` : ""}`.trim();
  }

  if (solution.impactBadge === "strategic") {
    return `Solusi ini menjaga hasil supaya tidak balik lagi. Dampaknya biasanya terlihat lewat ${metrics[1] || metrics[0]} dan stabilitas ${metrics[2] || metrics[0]}.`;
  }

  return `Dampak yang paling cepat terlihat biasanya muncul di ${metrics[0]} dan ${metrics[1] || metrics[0]}. ${rangeText ? `Target awalnya ada di kisaran ${rangeText}.` : ""}`.trim();
}

function buildSolutionWatchout(answers: WizardAnswers): string {
  const adoptionNote =
    {
      dfy: "Owner tim tetap perlu memberi akses data dan satu PIC keputusan agar implementasi tidak tertahan.",
      hybrid: "Perlu satu PIC internal yang ikut belajar alur baru supaya hasilnya tidak kembali manual setelah setup awal.",
      diy: "Perlu owner internal yang benar-benar punya waktu menjaga implementasi, bukan hanya menerima blueprint.",
      starting: "Jaga scope tetap sempit dulu supaya pilot cepat terbukti dan tidak berubah jadi proyek transformasi besar."
    }[answers.adoptionStyle || "starting"];

  switch (answers.frictionSource) {
    case "duplicate_data":
      return `Efeknya tertahan jika sumber data utama masih terpencar di banyak spreadsheet atau chat. ${adoptionNote}`;
    case "manual_reports":
      return `Efeknya tertahan jika tim belum sepakat mana angka yang jadi source of truth. ${adoptionNote}`;
    case "delayed_response":
      return `Efeknya tertahan jika lead masih masuk ke banyak nomor atau tidak ada SLA respons yang jelas. ${adoptionNote}`;
    case "human_error":
      return `Efeknya tertahan jika format input dan aturan kerja tiap tim masih berbeda-beda. ${adoptionNote}`;
    case "approval_bottleneck":
      return `Efeknya tertahan jika rule approval dan siapa pengambil keputusan terakhir belum jelas. ${adoptionNote}`;
    case "knowledge_silo":
      return `Efeknya tertahan jika SOP, logika kerja, dan edge case masih hanya ada di kepala beberapa orang. ${adoptionNote}`;
    default:
      return adoptionNote;
  }
}

function buildSmartSolutionCards(solutions: PesatSolution[], answers: WizardAnswers, impactRanges: ImpactRanges): SolutionCard[] {
  const primary = answers.mainChallenges[0] || "revenue";
  const detail = answers.detailChallenges[0];
  const friction = answers.frictionSource;

  return solutions.map((solution, index) => {
    let confidence = 76;
    const detailMatch = Boolean(detail && DETAIL_SOLUTION_MAP[detail]?.includes(solution.id));
    const frictionMatch = Boolean(friction && FRICTION_SOLUTION_MAP[friction]?.includes(solution.id));
    const frictionSource = friction ? FRICTION_SOURCES[friction] : null;

    if (detailMatch && frictionMatch) {
      confidence = 98;
    } else if (detailMatch) {
      confidence = 94;
    } else if (frictionMatch) {
      confidence = 90;
    } else if (solution.cluster.includes(primary)) {
      confidence = 86;
    }

    if ((answers.impactLevel === "critical" || answers.impactLevel === "often") && solution.impactBadge === "quick-win") {
      confidence += 1;
    }

    confidence = Math.min(99, confidence + index * 2);

    const proofBasis = detailMatch
      ? `Direct match: ${DETAIL_LABELS[detail!]} -> ${solution.name}`
      : frictionMatch && frictionSource
        ? `Workflow match: ${frictionSource.label} -> ${solution.name}`
        : `Cluster match: ${primary} priority -> ${solution.name}`;

    return {
      name: solution.name,
      description: solution.description,
      impactBadge: solution.impactBadge || "high-impact",
      setupTime: solution.setupTime || "2-3 minggu",
      confidenceScore: confidence,
      proofBasis,
      whyThisFits: buildSolutionWhyThisFits(solution, answers),
      expectedOutcome: buildSolutionExpectedOutcome(solution, answers, impactRanges),
      watchout: buildSolutionWatchout(answers)
    };
  });
}

export function buildFallbackResult(sessionId: string, answers: WizardAnswers, solutions: PesatSolution[], impactRanges: ImpactRanges): GeneratedResult {
  const primary = getPrimaryChallenge(answers);
  const topSolutionName = solutions[0]?.name || "pilot prioritas";
  const userSignals = extractUserSignals(answers.detailNote || "");

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

  return {
    sessionId,
    primaryChallenge: primary,
    headline: buildHeadline(answers),
    subheadline: buildSubheadline(answers, impactRanges, topSolutionName, userSignals),
    diagnosis: diagnosisPack.diagnosis,
    rootCause: diagnosisPack.rootCause,
    promise: diagnosisPack.promise,
    firstStep: diagnosisPack.firstStep,
    costOfInaction: buildCostOfInaction(answers),
    userSignals,
    plan: buildActionPlan(answers, solutions, impactRanges),
    impactCards,
    beforeAfterText: [
      `Sebelum: tim masih mengandalkan proses manual dan keputusan datang setelah bottleneck terlanjur terasa di ${lowerFirst(getPrimaryDetailLabel(answers))}.`,
      `Sesudah: ${topSolutionName} menutup titik bocor itu lebih cepat, lalu ${MEASURED_BY[primary][0]} bisa dipantau per minggu.`
    ],
    uniqueMechanism: `Pesat.AI tidak mulai dari tool, tetapi dari bottleneck. Kami tangkap sinyal, pilih quick win, lalu pasang sistem yang dampaknya bisa diukur tim Anda sendiri.`,
    solutionsText: solutions.map((solution) => `${solution.name}: diprioritaskan karena paling cepat menutup bottleneck di ${lowerFirst(getPrimaryDetailLabel(answers))}.`),
    solutions,
    solutionCards: buildSmartSolutionCards(solutions, answers, impactRanges),
    impactRanges,
    chart: buildChart(answers),
    efficiencyMetrics,
    hiddenCosts,
    findings,
    beforeAfterMetrics,
    llmFallback: true
  };
}
