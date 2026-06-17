import type { ChallengeId, DetailId, FrictionSourceId, ImpactId, PesatSolution, WizardAnswers } from "@/lib/types";

export const CHALLENGE_LABELS: Record<ChallengeId, string> = {
  revenue: "Omzet tidak naik padahal lead ada",
  cost: "Biaya operasional membengkak tanpa sadar",
  fraud: "Ada celah yang baru ketahuan setelah rugi",
  cash_stock: "Kas & stok sering meleset dari prediksi",
  reporting: "Keputusan penting selalu telat karena data belum siap",
  brand_trust: "Brand sulit ditemukan & dipercaya pelanggan baru"
};

export const AVAILABLE_SOLUTIONS: PesatSolution[] = [
  { id: "ai_sales_assistant", name: "AI Sales Assistant", cluster: ["revenue"], description: "Membantu follow-up prospek, menjawab pertanyaan penjualan, dan menjaga momentum transaksi.", setupTime: "2 minggu", impactBadge: "high-impact" },
  { id: "ai_repeat_order", name: "AI Repeat Order", cluster: ["revenue"], description: "Mendeteksi pelanggan yang siap repeat order dan memicu penawaran tepat waktu.", setupTime: "1 minggu", impactBadge: "quick-win" },
  { id: "ai_dynamic_pricing", name: "AI Dynamic Pricing", cluster: ["revenue"], description: "Membantu membaca permintaan, margin, dan kompetisi untuk rekomendasi harga.", setupTime: "3 minggu", impactBadge: "strategic" },
  { id: "ai_whatsapp_sales_bot", name: "AI WhatsApp Sales Bot", cluster: ["revenue"], description: "Mengubah WhatsApp menjadi kanal penjualan responsif dengan pencatatan lead otomatis.", setupTime: "1 minggu", impactBadge: "quick-win" },
  { id: "ai_chatbot_24_7", name: "AI Chatbot 24/7", cluster: ["revenue", "brand_trust"], description: "Menjawab pertanyaan umum pelanggan secara konsisten di luar jam operasional.", setupTime: "2 minggu", impactBadge: "high-impact" },
  { id: "ai_pembukuan_otomatis", name: "AI Pembukuan Otomatis", cluster: ["cost", "reporting"], description: "Mengurangi input manual dan merapikan transaksi untuk laporan yang lebih cepat.", setupTime: "2 minggu", impactBadge: "quick-win" },
  { id: "ai_invoice_ap_otomatis", name: "AI Invoice & AP Otomatis", cluster: ["cost", "cash_stock"], description: "Membantu ekstraksi invoice, pencocokan pembayaran, dan prioritas account payable.", setupTime: "2 minggu", impactBadge: "high-impact" },
  { id: "ai_prediksi_cashflow", name: "AI Prediksi Cashflow", cluster: ["cash_stock"], description: "Memproyeksikan arus kas dari pola transaksi, piutang, dan kewajiban berjalan.", setupTime: "3 minggu", impactBadge: "strategic" },
  { id: "ai_document_processor", name: "AI Document Processor", cluster: ["cost", "reporting"], description: "Membaca dokumen bisnis dan mengubahnya menjadi data siap proses.", setupTime: "2 minggu", impactBadge: "high-impact" },
  { id: "ai_meeting_notetaker", name: "AI Meeting Notetaker", cluster: ["reporting", "cost"], description: "Merangkum meeting, keputusan, dan action item tanpa pencatatan manual.", setupTime: "1 minggu", impactBadge: "quick-win" },
  { id: "ai_ticket_router", name: "AI Ticket Router", cluster: ["reporting", "brand_trust"], description: "Mengelompokkan dan mengarahkan tiket pelanggan ke tim yang tepat.", setupTime: "1 minggu", impactBadge: "high-impact" },
  { id: "ai_social_media_manager", name: "AI Social Media Manager", cluster: ["brand_trust"], description: "Membantu ide, kalender, dan produksi konten sosial yang lebih konsisten.", setupTime: "2 minggu", impactBadge: "high-impact" },
  { id: "ai_email_jadwal_otomatis", name: "AI Email & Jadwal Otomatis", cluster: ["cost", "revenue"], description: "Mengotomasi email operasional, reminder, dan koordinasi jadwal.", setupTime: "1 minggu", impactBadge: "quick-win" },
  { id: "ai_report_generator", name: "AI Report Generator", cluster: ["reporting"], description: "Mengubah data mentah menjadi ringkasan dan laporan manajemen berkala.", setupTime: "2 minggu", impactBadge: "high-impact" },
  { id: "ai_rute_logistik_pintar", name: "AI Rute Logistik Pintar", cluster: ["cost", "cash_stock"], description: "Membantu optimasi rute, kapasitas, dan prioritas pengiriman.", setupTime: "3 minggu", impactBadge: "strategic" },
  { id: "ai_organic_traffic_builder", name: "AI Organic Traffic Builder", cluster: ["brand_trust"], description: "Membantu membangun traffic organik dari konten yang sesuai niat pencarian.", setupTime: "4 minggu", impactBadge: "strategic" },
  { id: "ai_demand_planner", name: "AI Demand Planner", cluster: ["cash_stock"], description: "Membaca pola permintaan untuk perencanaan pembelian dan produksi.", setupTime: "3 minggu", impactBadge: "strategic" },
  { id: "ai_sop_knowledge_writer", name: "AI SOP & Knowledge Writer", cluster: ["cost", "reporting"], description: "Merapikan SOP dan knowledge base agar operasional mudah direplikasi.", setupTime: "2 minggu", impactBadge: "high-impact" },
  { id: "ai_quality_control_visual", name: "AI Quality Control Visual", cluster: ["fraud", "cost"], description: "Membantu inspeksi visual untuk menemukan cacat, anomali, atau deviasi proses.", setupTime: "3 minggu", impactBadge: "high-impact" },
  { id: "ai_market_intelligence", name: "AI Market Intelligence", cluster: ["revenue", "brand_trust"], description: "Memantau kompetitor, tren pasar, dan sinyal permintaan yang relevan.", setupTime: "2 minggu", impactBadge: "strategic" },
  { id: "ai_survey_feedback_analyzer", name: "AI Survey & Feedback Analyzer", cluster: ["brand_trust", "revenue"], description: "Meringkas feedback pelanggan menjadi tema, prioritas, dan peluang perbaikan.", setupTime: "1 minggu", impactBadge: "quick-win" },
  { id: "ai_sentiment_pelanggan", name: "AI Sentiment Pelanggan", cluster: ["brand_trust"], description: "Mendeteksi perubahan sentimen pelanggan dari review, chat, dan komentar.", setupTime: "1 minggu", impactBadge: "quick-win" },
  { id: "ai_data_quality_auto_heal", name: "AI Data Quality Auto-Heal", cluster: ["fraud", "reporting"], description: "Mendeteksi data ganda, janggal, atau tidak lengkap sebelum merusak keputusan.", setupTime: "2 minggu", impactBadge: "high-impact" },
  { id: "ai_process_intelligence", name: "AI Process Intelligence", cluster: ["cost", "reporting"], description: "Menganalisis bottleneck proses dan aktivitas yang paling banyak membuang waktu.", setupTime: "3 minggu", impactBadge: "strategic" },
  { id: "ai_roi_impact_tracker", name: "AI ROI & Impact Tracker", cluster: ["fraud", "revenue", "cost"], description: "Mengukur dampak inisiatif AI terhadap revenue, biaya, waktu, dan risiko.", setupTime: "2 minggu", impactBadge: "high-impact" },
  { id: "ai_customer_journey_signals", name: "AI Customer Journey Signals", cluster: ["revenue", "brand_trust"], description: "Membaca sinyal perilaku pelanggan untuk prioritas follow-up dan retensi.", setupTime: "2 minggu", impactBadge: "high-impact" },
  { id: "ai_crm_pintar", name: "AI CRM Pintar", cluster: ["revenue"], description: "Merapikan lead, pipeline, dan next action agar peluang tidak hilang.", setupTime: "2 minggu", impactBadge: "high-impact" },
  { id: "ai_fraud_detection", name: "AI Fraud Detection", cluster: ["fraud"], description: "Mendeteksi pola transaksi, klaim, atau akses yang menyimpang dari kebiasaan.", setupTime: "3 minggu", impactBadge: "strategic" },
  { id: "ai_inventory_optimizer", name: "AI Inventory Optimizer", cluster: ["cash_stock"], description: "Membantu menjaga stok ideal agar modal tidak tertahan dan stockout turun.", setupTime: "2 minggu", impactBadge: "high-impact" },
  { id: "ai_executive_dashboard", name: "AI Executive Dashboard", cluster: ["reporting", "cash_stock"], description: "Menyajikan KPI utama untuk keputusan cepat lintas revenue, biaya, kas, dan stok.", setupTime: "2 minggu", impactBadge: "strategic" },
  { id: "ai_local_ai_search_trust_builder", name: "AI Local & AI Search Trust Builder", cluster: ["brand_trust"], description: "Meningkatkan trust signal di Google, profil lokal, dan jawaban AI search.", setupTime: "3 minggu", impactBadge: "strategic" }
];

// Human-readable label for each detail challenge, mirrored from the wizard.
// Used to reflect the client's specific problems back to them in the diagnosis.
export const DETAIL_LABELS: Record<DetailId, string> = {
  follow_up: "follow-up lead lambat",
  repeat_order: "repeat order belum rapi",
  pricing: "harga sulit dioptimalkan",
  lead_quality: "lead banyak tapi kualitas campur",
  admin_cost: "admin terlalu banyak manual",
  manual_docs: "dokumen perlu input ulang",
  invoice_ap: "invoice/AP makan waktu",
  process_waste: "bottleneck proses tidak terlihat",
  transaction_anomaly: "transaksi aneh terlambat terlihat",
  data_leak: "akses/data sulit diawasi",
  approval_gap: "approval rawan dilewati",
  cashflow_blind: "cashflow sulit diprediksi",
  stockout: "stok habis mendadak",
  overstock: "modal tertahan di stok",
  slow_reports: "laporan telat selesai",
  no_bi: "belum ada BI dashboard",
  manual_meetings: "meeting banyak tanpa action jelas",
  google_visibility: "sulit unggul di Google",
  ai_search: "belum siap muncul di AI search",
  review_sentiment: "review dan sentimen tidak terbaca"
};

// Maps each specific detail challenge to the solutions that address it directly,
// ordered by relevance. Drives personalized recommendations so two clients with
// the same main challenge but different details get different, fitting solutions.
export const DETAIL_SOLUTION_MAP: Record<DetailId, string[]> = {
  follow_up: ["ai_whatsapp_sales_bot", "ai_sales_assistant", "ai_crm_pintar", "ai_customer_journey_signals"],
  repeat_order: ["ai_repeat_order", "ai_customer_journey_signals", "ai_crm_pintar"],
  pricing: ["ai_dynamic_pricing", "ai_market_intelligence"],
  lead_quality: ["ai_crm_pintar", "ai_customer_journey_signals", "ai_sales_assistant"],
  admin_cost: ["ai_pembukuan_otomatis", "ai_email_jadwal_otomatis", "ai_document_processor", "ai_process_intelligence"],
  manual_docs: ["ai_document_processor", "ai_sop_knowledge_writer", "ai_pembukuan_otomatis"],
  invoice_ap: ["ai_invoice_ap_otomatis", "ai_pembukuan_otomatis"],
  process_waste: ["ai_process_intelligence", "ai_sop_knowledge_writer", "ai_meeting_notetaker"],
  transaction_anomaly: ["ai_fraud_detection", "ai_data_quality_auto_heal", "ai_roi_impact_tracker"],
  data_leak: ["ai_data_quality_auto_heal", "ai_fraud_detection"],
  approval_gap: ["ai_fraud_detection", "ai_process_intelligence", "ai_invoice_ap_otomatis"],
  cashflow_blind: ["ai_prediksi_cashflow", "ai_executive_dashboard", "ai_invoice_ap_otomatis"],
  stockout: ["ai_demand_planner", "ai_inventory_optimizer"],
  overstock: ["ai_inventory_optimizer", "ai_demand_planner", "ai_prediksi_cashflow"],
  slow_reports: ["ai_report_generator", "ai_executive_dashboard", "ai_pembukuan_otomatis"],
  no_bi: ["ai_executive_dashboard", "ai_report_generator"],
  manual_meetings: ["ai_meeting_notetaker", "ai_ticket_router"],
  google_visibility: ["ai_organic_traffic_builder", "ai_local_ai_search_trust_builder"],
  ai_search: ["ai_local_ai_search_trust_builder", "ai_organic_traffic_builder", "ai_market_intelligence"],
  review_sentiment: ["ai_sentiment_pelanggan", "ai_survey_feedback_analyzer"]
};

export const FRICTION_SOLUTION_MAP: Record<FrictionSourceId, string[]> = {
  duplicate_data: ["ai_data_quality_auto_heal", "ai_document_processor", "ai_pembukuan_otomatis", "ai_invoice_ap_otomatis"],
  manual_reports: ["ai_report_generator", "ai_executive_dashboard", "ai_pembukuan_otomatis", "ai_process_intelligence"],
  delayed_response: ["ai_whatsapp_sales_bot", "ai_sales_assistant", "ai_customer_journey_signals", "ai_chatbot_24_7"],
  human_error: ["ai_document_processor", "ai_data_quality_auto_heal", "ai_pembukuan_otomatis", "ai_process_intelligence"],
  approval_bottleneck: ["ai_invoice_ap_otomatis", "ai_process_intelligence", "ai_fraud_detection", "ai_executive_dashboard"],
  knowledge_silo: ["ai_sop_knowledge_writer", "ai_meeting_notetaker", "ai_ticket_router", "ai_executive_dashboard"]
};

export const IMPACT_LEVEL_LABELS: Record<ImpactId, string> = {
  mild: "masih sporadis",
  weekly: "sudah berulang mingguan",
  often: "sudah hampir harian",
  critical: "sudah harian dan menahan pertumbuhan"
};

export const TRANSITION_FACTS: Record<ChallengeId, { first: string; second: string; source: string }> = {
  revenue: {
    first: "Banyak bisnis tidak kekurangan lead. Mereka kehilangan uang karena follow-up, timing, dan repeat order tidak ditangani secara sistematis.",
    second: "HBR sering menyoroti bahwa retensi dan pelanggan lama bisa memberi dampak profit yang besar ketika prosesnya disiplin.",
    source: "HBR, customer retention research"
  },
  cost: {
    first: "Biaya sering bocor bukan dari satu pos besar, melainkan dari pekerjaan manual yang diulang setiap hari.",
    second: "Orange Business menempatkan otomasi dan data workflow sebagai pendorong efisiensi operasional modern.",
    source: "Orange Business, digital transformation insights"
  },
  fraud: {
    first: "Fraud jarang terlihat sebagai satu kejadian besar di awal. Polanya biasanya muncul dari anomali kecil yang tidak dipantau.",
    second: "Sistem deteksi berbasis pola membantu tim melihat risiko lebih cepat daripada audit manual berkala.",
    source: "ACFE, fraud detection practices"
  },
  cash_stock: {
    first: "Kas dan stok bermasalah biasanya terlambat terlihat ketika laporan hanya melihat masa lalu, bukan memprediksi minggu depan.",
    second: "Demand planning berbasis data membantu bisnis mengurangi modal tertahan dan risiko kehabisan stok.",
    source: "McKinsey, supply chain analytics"
  },
  reporting: {
    first: "Laporan yang lambat membuat keputusan penting diambil saat momentum sudah lewat.",
    second: "Business intelligence yang baik bukan sekadar dashboard, melainkan ritme keputusan yang lebih cepat.",
    source: "Gartner, analytics and BI guidance"
  },
  brand_trust: {
    first: "Trust sekarang dibentuk di Google, review, konten, dan jawaban AI search sebelum pelanggan bicara dengan sales.",
    second: "Brand yang mudah ditemukan dan konsisten dijelaskan akan lebih siap masuk ke evaluasi pelanggan modern.",
    source: "Google Search Central and AI search behavior"
  }
};

// Quality question data — used to drive the wizard UI
export type QualityQuestion = {
  id: string;
  eyebrow: string;
  title: string;
  note?: string;
  options: Array<{ id: string; label: string; note?: string; emoji?: string }>;
};

export type QualityQuestionOption = QualityQuestion["options"][number];

export type SmartQuestionCopy = {
  q2: { title: string; note: string };
  q4: { title: string; note: string };
  q6: { title: string; note: string; helper: string; placeholder: string };
};

const QUESTION_COPY_BY_CHALLENGE: Record<ChallengeId, SmartQuestionCopy["q2"] & { q6Placeholder: string }> = {
  revenue: {
    title: "Di penjualan Anda, titik bocor paling besarnya di mana?",
    note: "Pilih yang paling sering bikin peluang gagal jadi transaksi.",
    q6Placeholder: "Contoh: lead masuk sekitar 40-60 per hari, tapi follow-up masih tersebar di 3 admin WhatsApp dan tidak ada prioritas siapa yang harus dibalas dulu."
  },
  cost: {
    title: "Di operasional ini, bagian mana yang paling banyak makan waktu?",
    note: "Pilih kerja manual yang paling sering bikin tim sibuk tapi hasil tidak banyak berubah.",
    q6Placeholder: "Contoh: invoice masih dicek satu-satu, data dari WhatsApp dipindah ke spreadsheet, lalu finance input ulang ke sistem lain."
  },
  fraud: {
    title: "Di titik mana masalah ini paling sering lolos duluan?",
    note: "Pilih area yang paling rawan bikin anomali membesar sebelum ketahuan.",
    q6Placeholder: "Contoh: approval masih lewat chat pribadi, transaksi janggal baru diperiksa di akhir minggu, dan tidak ada alert kalau polanya menyimpang."
  },
  cash_stock: {
    title: "Di kas atau stok, bagian mana yang paling sering meleset?",
    note: "Pilih yang paling sering bikin tim mengambil keputusan secara reaktif.",
    q6Placeholder: "Contoh: kami baru sadar stok kritis menipis setelah order masuk, sementara beberapa SKU lain malah terlalu banyak dan modal tertahan."
  },
  reporting: {
    title: "Di titik mana data yang telat paling sering menahan keputusan?",
    note: "Pilih area yang paling sering bikin rapat atau action tertunda.",
    q6Placeholder: "Contoh: dashboard belum ada, laporan mingguan baru siap setelah meeting, dan setiap tim punya angka berbeda saat membahas performa."
  },
  brand_trust: {
    title: "Di titik mana trust digital paling sering bocor duluan?",
    note: "Pilih sinyal yang paling sering bikin brand kalah sebelum calon klien bertanya.",
    q6Placeholder: "Contoh: brand masih sulit muncul di Google, review negatif tidak cepat terbaca, dan AI search belum bisa menjelaskan keunggulan bisnis kami."
  }
};

const DETAIL_TRANSITION_FACTS: Record<DetailId, { text: string; source: string }> = {
  follow_up: {
    text: "Lead hangat paling sering bocor di menit-menit awal. Saat respons pertama lambat, biaya akuisisi tetap keluar tetapi peluang pindah ke kompetitor.",
    source: "HubSpot sales response benchmarks"
  },
  repeat_order: {
    text: "Pelanggan lama sering tidak hilang karena tidak puas, tetapi karena tidak ada trigger yang mengingatkan tim kapan harus follow-up lagi.",
    source: "Customer retention research"
  },
  pricing: {
    text: "Margin biasanya turun bukan karena produk jelek, tetapi karena tim menyesuaikan harga terlalu lambat saat permintaan dan kompetitor berubah.",
    source: "Pricing strategy benchmarks"
  },
  lead_quality: {
    text: "Lead terlihat ramai, tetapi tanpa scoring yang rapi sales akan menghabiskan energi di prospek yang kecil peluang closing-nya.",
    source: "B2B lead qualification benchmarks"
  },
  admin_cost: {
    text: "Biaya admin membesar saat transaksi yang sama disentuh berkali-kali oleh orang berbeda untuk input, cek, dan koreksi.",
    source: "Workflow automation benchmarks"
  },
  manual_docs: {
    text: "Dokumen yang harus dibaca ulang satu per satu membuat waktu tim habis di ekstraksi data, bukan di keputusan.",
    source: "Document processing automation benchmarks"
  },
  invoice_ap: {
    text: "Invoice dan AP yang lambat bukan cuma soal finance; efeknya merembet ke cashflow, vendor trust, dan keputusan pembayaran.",
    source: "Accounts payable automation benchmarks"
  },
  process_waste: {
    text: "Waste proses paling sulit terlihat karena tiap langkah terasa kecil, padahal total delay dan rework-nya besar.",
    source: "Process mining and workflow benchmarks"
  },
  transaction_anomaly: {
    text: "Anomali transaksi jarang datang dengan alarm besar. Yang muncul dulu biasanya pola kecil yang lolos karena tidak dipantau harian.",
    source: "ACFE monitoring practices"
  },
  data_leak: {
    text: "Risiko data sering membesar justru karena akses, file, dan perpindahan informasi tidak punya jejak yang rapi.",
    source: "Data governance benchmarks"
  },
  approval_gap: {
    text: "Approval yang longgar jarang terasa bermasalah sampai ada keputusan penting yang lolos tanpa cek atau sulit diaudit balik.",
    source: "Internal control benchmarks"
  },
  cashflow_blind: {
    text: "Cashflow bermasalah bukan karena angka akhir saja, tetapi karena tim baru melihat tekanan kas saat ruang geraknya sudah sempit.",
    source: "Cashflow planning benchmarks"
  },
  stockout: {
    text: "Stockout berulang biasanya berawal dari sinyal permintaan yang terlambat terbaca, bukan dari gudang yang benar-benar kosong mendadak.",
    source: "Supply chain analytics benchmarks"
  },
  overstock: {
    text: "Overstock sering terjadi saat pembelian mengejar rasa aman, bukan sinyal permintaan yang benar-benar berubah.",
    source: "Inventory optimization benchmarks"
  },
  slow_reports: {
    text: "Laporan yang telat membuat tim membahas masa lalu lebih lama daripada menutup masalah minggu ini.",
    source: "Analytics and BI guidance"
  },
  no_bi: {
    text: "Tanpa dashboard yang sama-sama dipercaya, tiap meeting mudah habis untuk debat angka, bukan keputusan.",
    source: "Business intelligence maturity benchmarks"
  },
  manual_meetings: {
    text: "Meeting terasa sibuk tapi miskin output ketika keputusan dan action item tidak langsung ditangkap ke sistem.",
    source: "Meeting productivity benchmarks"
  },
  google_visibility: {
    text: "Brand yang sulit muncul di Google sering kalah sebelum sales sempat menjelaskan value sebenarnya.",
    source: "Google Search behavior benchmarks"
  },
  ai_search: {
    text: "Jika AI search tidak bisa memahami dan menjelaskan brand Anda, calon klien akan belajar dari pihak lain yang lebih mudah diringkas.",
    source: "AI search behavior benchmarks"
  },
  review_sentiment: {
    text: "Review dan sentimen yang tidak dibaca cepat membuat sinyal trust memburuk diam-diam sebelum tim sempat merespons.",
    source: "Review and sentiment benchmarks"
  }
};

function lowerFirst(value: string): string {
  return value ? value.charAt(0).toLowerCase() + value.slice(1) : value;
}

export function buildTransitionFact(answers: Pick<WizardAnswers, "mainChallenges" | "detailChallenges">, currentStep: "q1" | "q2"): { text: string; source: string } {
  const primary = answers.mainChallenges[0] || "revenue";

  if (currentStep === "q2") {
    const detailId = answers.detailChallenges[0];
    if (detailId && DETAIL_TRANSITION_FACTS[detailId]) {
      return DETAIL_TRANSITION_FACTS[detailId];
    }
  }

  const fact = TRANSITION_FACTS[primary];
  return {
    text: currentStep === "q1" ? fact.first : fact.second,
    source: fact.source
  };
}

export function buildSmartQuestionCopy(answers: Pick<WizardAnswers, "mainChallenges" | "detailChallenges" | "frictionSource">): SmartQuestionCopy {
  const primary = answers.mainChallenges[0] || "revenue";
  const detailId = answers.detailChallenges[0];
  const detailLabel = detailId ? lowerFirst(DETAIL_LABELS[detailId]) : lowerFirst(CHALLENGE_LABELS[primary]);
  const frictionLabel = answers.frictionSource ? lowerFirst(FRICTION_SOURCES[answers.frictionSource].label) : "";
  const q2 = QUESTION_COPY_BY_CHALLENGE[primary];

  return {
    q2: {
      title: q2.title,
      note: q2.note
    },
    q4: {
      title: `Kalau bottleneck utamanya ${detailLabel}, sumber gesekan mana yang paling sering membuat masalah itu terus berulang?`,
      note: "Pilih penyebab yang paling sering membuat tim kembali ke kerja manual, respons lambat, atau keputusan yang tertunda."
    },
    q6: {
      title: `Kalau kami mau menyusun solusi yang tajam untuk ${detailLabel}, konteks apa yang paling penting kami pahami?`,
      note: frictionLabel
        ? `Ceritakan volume kerja, siapa yang terdampak, tools yang dipakai, dan bagaimana ${frictionLabel} merusak ritme kerja tim Anda.`
        : "Ceritakan volume kerja, siapa yang terdampak, tools yang dipakai, dan akibat bisnis yang paling terasa.",
      helper: "Semakin konkret ceritanya, semakin kecil kemungkinan hasil report terasa generik atau terlalu normatif.",
      placeholder: q2.q6Placeholder
    }
  };
}

export const QUALITY_QUESTIONS: QualityQuestion[] = [
  {
    id: "q1",
    eyebrow: "01 / Diagnosa awal",
    title: "Saat ini, masalah terbesar bisnis Anda ada di mana?",
    note: "Pilih yang paling terasa dulu.",
    options: [
      { id: "revenue", label: "Omzet tidak naik padahal lead ada", note: "Follow-up buyar, peluang tidak tertutup, repeat order tidak terjaga", emoji: "📉" },
      { id: "cost", label: "Biaya operasional membengkak tanpa sadar", note: "Banyak pekerjaan manual berulang yang tidak terlihat sebagai biaya", emoji: "💸" },
      { id: "fraud", label: "Ada celah yang baru ketahuan setelah rugi", note: "Anomali terlewat, approval tidak terlacak, data tidak sinkron", emoji: "🚨" },
      { id: "cash_stock", label: "Kas & stok sering meleset dari prediksi", note: "Keputusan reaktif, modal tertahan, stockout mendadak", emoji: "📊" },
      { id: "reporting", label: "Keputusan penting selalu telat karena data belum siap", note: "Laporan manual, meeting tanpa action, tidak ada single source of truth", emoji: "⏱️" },
      { id: "brand_trust", label: "Brand sulit ditemukan & dipercaya pelanggan baru", note: "Google page 2, review tidak terbaca, AI search tidak menjelaskan brand Anda", emoji: "🔍" }
    ]
  },
  {
    id: "q2",
    eyebrow: "02 / Titik bocor terbesar",
    title: "Jika bisnis Anda punya satu dashboard yang update real-time, angka mana yang paling sering berwarna merah?",
    note: "Pilih metrik yang paling mengganggu tidur Anda — satu yang kalau hijau, bisnis terasa jauh lebih tenang.",
    options: [
      { id: "follow_up", label: "Lead conversion rate rendah", note: "Banyak chat masuk, tapi sedikit yang di-follow-up sampai closing" },
      { id: "repeat_order", label: "Repeat purchase rate jatuh", note: "Pelanggan lama jarang beli lagi, tidak ada sistem trigger otomatis" },
      { id: "pricing", label: "Margin per transaksi menipis", note: "Harga sulit adjust, kompetitor lebih gesit, diskon tidak terukur" },
      { id: "lead_quality", label: "Lead quality score campur", note: "Lead banyak tapi kualitas rendah, sales buang waktu banyak" },
      { id: "admin_cost", label: "Jam kerja manual per transaksi tinggi", note: "Admin terlalu banyak input manual, error sering terjadi" },
      { id: "manual_docs", label: "Dokumen processing time lambat", note: "Dokumen perlu input ulang, verifikasi lama, approval macet" },
      { id: "invoice_ap", label: "Invoice & AP turnaround panjang", note: "Invoice/AP makan waktu, cashflow tersendat" },
      { id: "process_waste", label: "Process efficiency rendah", note: "Bottleneck tidak terlihat, waste tersembunyi di tiap departemen" },
      { id: "transaction_anomaly", label: "Anomali transaksi terlambat terdeteksi", note: "Pola mencurigakan baru ketahuan setelah kerugian membesar" },
      { id: "data_leak", label: "Data governance lemah", note: "Akses/data sulit diawasi, compliance risk meningkat" },
      { id: "approval_gap", label: "Approval compliance rate rendah", note: "Approval rawan dilewati, tidak ada audit trail yang kuat" },
      { id: "cashflow_blind", label: "Cashflow predictability rendah", note: "Sulit prediksi kas, keputusan selalu reaktif" },
      { id: "stockout", label: "Stock availability rate jatuh", note: "Stok habis mendadak, kehilangan sales berulang" },
      { id: "overstock", label: "Inventory turnover lambat", note: "Modal tertahan di stok, ROI turun, barang expired" },
      { id: "slow_reports", label: "Report generation speed lambat", note: "Laporan telat selesai, keputusan penting terhambat" },
      { id: "no_bi", label: "BI readiness score rendah", note: "Belum ada dashboard, setiap tim punya versi data sendiri" },
      { id: "manual_meetings", label: "Meeting action rate rendah", note: "Meeting banyak tanpa action jelas, waktu terbuang sia-sia" },
      { id: "google_visibility", label: "Google ranking visibility rendah", note: "Sulit unggul di Google, traffic organik tidak bertumbuh" },
      { id: "ai_search", label: "AI search presence lemah", note: "Brand belum siap muncul di jawaban AI seperti ChatGPT/Perplexity" },
      { id: "review_sentiment", label: "Review sentiment score tidak terbaca", note: "Review dan komplain tidak teridentifikasi, trust tidak terjaga" }
    ]
  },
  {
    id: "q3",
    eyebrow: "03 / Seberapa dalam masalahnya",
    title: "Seberapa sering masalah ini terjadi?",
    note: "Jawaban ini menentukan seberapa cepat solusi perlu dipasang.",
    options: [
      { id: "mild", label: "Jarang — maksimal 1-2 kali sebulan", note: "Masih bisa ditangani manual, tapi mulai mengganggu skalabilitas", emoji: "🟢" },
      { id: "weekly", label: "1-2 kali seminggu", note: "Ada proses yang seharusnya otomatis, tapi masih dikerjakan manual", emoji: "🟡" },
      { id: "often", label: "Hampir setiap hari", note: "Tim sudah sibuk mengejar operasional, bukan fokus pada pertumbuhan", emoji: "🟠" },
      { id: "critical", label: "Setiap hari, dan sudah menghambat pertumbuhan", note: "Keputusan penting tertunda, peluang hilang, biaya membengkak", emoji: "🔴" }
    ]
  },
  {
    id: "q4",
    eyebrow: "04 / Akar masalah",
    title: "Mana yang PALING banyak menghabiskan waktu tim Anda saat ini?",
    note: "Pilih satu sumber gesekan yang paling dominan. Ini membantu kami menemukan quick win tercepat.",
    options: [
      { id: "duplicate_data", label: "Input data berulang di banyak tempat", note: "Contoh: data WhatsApp diinput ulang ke spreadsheet, invoice ke sistem lain", emoji: "🔄" },
      { id: "manual_reports", label: "Membuat laporan manual", note: "Data dari banyak sumber digabungkan dengan copy-paste setiap periode", emoji: "📑" },
      { id: "delayed_response", label: "Follow-up & response lambat", note: "Tim tidak sempat membalas cepat, peluang hilang ke kompetitor", emoji: "⏳" },
      { id: "human_error", label: "Kesalahan manusia yang berulang", note: "Salah input, salah hitung, salah file — memakan waktu perbaikan", emoji: "⚠️" },
      { id: "approval_bottleneck", label: "Approval macet atau tidak terlacak", note: "Keputusan tertahan karena menunggu orang, tanpa visibility", emoji: "🚧" },
      { id: "knowledge_silo", label: "Pengetahuan hanya ada di kepala karyawan", note: "SOP tidak tertulis, onboarding lama, risiko jika karyawan keluar", emoji: "🧠" }
    ]
  },
  {
    id: "q5",
    eyebrow: "05 / Cara kerja sama",
    title: "Model kerja seperti apa yang paling realistis untuk Anda?",
    note: "Pilih cara jalan yang paling cocok saat ini.",
    options: [
      { id: "dfy", label: "Pesat.AI jalankan penuh", note: "Kami butuh hasil cepat, tim fokus pada bisnis inti", emoji: "🚀" },
      { id: "hybrid", label: "Pesat.AI setup, tim internal lanjutkan", note: "Tim ingin belajar sambil jalan agar bisa mandiri", emoji: "🤝" },
      { id: "diy", label: "Tim internal eksekusi dengan blueprint", note: "Kami punya kapasitas teknis, butuh arsitektur & pendampingan", emoji: "🛠️" },
      { id: "starting", label: "Mulai dari pilot kecil dulu", note: "Kami baru mulai dengan AI, ingin bukti dampak dulu sebelum perluas", emoji: "🧪" }
    ]
  },
  {
    id: "q6",
    eyebrow: "06 / Konteks tambahan (opsional)",
    title: "Apakah ada tantangan operasional atau pekerjaan berulang yang ingin Anda ceritakan lebih detail?",
    note: "Semakin spesifik, semakin tajam diagnosis dan rekomendasi yang kami susun.",
    options: []
  }
];

export const FRICTION_SOURCES: Record<FrictionSourceId, { label: string; note: string }> = {
  duplicate_data: { label: "Input data berulang di banyak tempat", note: "Data WhatsApp diinput ulang ke spreadsheet, invoice ke sistem lain" },
  manual_reports: { label: "Membuat laporan manual", note: "Data dari banyak sumber digabungkan dengan copy-paste setiap periode" },
  delayed_response: { label: "Follow-up & response lambat", note: "Tim tidak sempat membalas cepat, peluang hilang ke kompetitor" },
  human_error: { label: "Kesalahan manusia yang berulang", note: "Salah input, salah hitung, salah file — memakan waktu perbaikan" },
  approval_bottleneck: { label: "Approval macet atau tidak terlacak", note: "Keputusan tertahan karena menunggu orang, tanpa visibility" },
  knowledge_silo: { label: "Pengetahuan hanya ada di kepala karyawan", note: "SOP tidak tertulis, onboarding lama, risiko jika karyawan keluar" }
};

export const LOADING_INSIGHTS = [
  {
    id: "manual_cost",
    text: "Proses manual biasanya tidak terasa mahal per kejadian, tetapi akumulasinya bisa memakan puluhan jam kerja setiap bulan.",
    source: "McKinsey Global Institute",
    durationMs: 7800
  },
  {
    id: "hidden_cost",
    text: "Biaya tersembunyi biasanya lahir dari copy-paste, koreksi error, dan waktu tunggu approval, bukan dari satu pos besar.",
    source: "Deloitte Digital Transformation",
    durationMs: 8200
  },
  {
    id: "decision_speed",
    text: "Tim yang bergerak dari data real-time biasanya menang bukan karena lebih sibuk, tetapi karena lebih cepat memutuskan.",
    source: "MIT Sloan Management Review",
    durationMs: 8200
  },
  {
    id: "follow_up_leak",
    text: "Lead hangat paling sering bocor di jeda respons pertama. Saat follow-up lambat, biaya akuisisi tetap keluar tetapi peluang pindah ke kompetitor.",
    source: "HubSpot Sales Research",
    durationMs: 8200
  },
  {
    id: "knowledge_risk",
    text: "Pengetahuan yang hanya tinggal di kepala karyawan terlihat murah hari ini, tetapi mahal saat orang kuncinya pindah atau cuti.",
    source: "IBM Knowledge Retention Study",
    durationMs: 7800
  },
  {
    id: "ai_decision",
    text: "AI yang berguna bukan sekadar menjawab, tetapi membantu tim menangkap sinyal, menjaga prioritas, dan merespons lebih konsisten.",
    source: "Pesat.AI Operational Framework",
    durationMs: 7800
  },
  {
    id: "fraud_pattern",
    text: "Fraud jarang terlihat sebagai satu kejadian besar. Biasanya ia muncul lebih dulu sebagai pola kecil yang tidak dipantau.",
    source: "ACFE Global Fraud Study",
    durationMs: 8200
  },
  {
    id: "cashflow_prediction",
    text: "Cashflow lebih sehat biasanya lahir dari prediksi lebih awal, bukan dari keputusan belanja yang dibuat saat sudah panik.",
    source: "McKinsey Supply Chain Analytics",
    durationMs: 8200
  },
  {
    id: "reporting_momentum",
    text: "Laporan yang lambat membuat keputusan datang terlambat. Bisnis yang cepat bukan yang punya data paling banyak, tetapi yang paling cepat bertindak.",
    source: "Gartner Analytics & BI Guidance",
    durationMs: 8200
  },
  {
    id: "brand_trust",
    text: "Trust sekarang dibentuk di Google, review, konten, dan jawaban AI search sebelum calon klien pernah bicara dengan sales Anda.",
    source: "Google Search Central & AI Search Behavior",
    durationMs: 7800
  }
];

export type LoadingInsight = (typeof LOADING_INSIGHTS)[number];

const LOADING_INSIGHT_BY_ID = Object.fromEntries(LOADING_INSIGHTS.map((insight) => [insight.id, insight])) as Record<string, LoadingInsight>;

const CHALLENGE_LOADING_ORDER: Record<ChallengeId, string[]> = {
  revenue: ["follow_up_leak", "decision_speed", "hidden_cost", "ai_decision"],
  cost: ["manual_cost", "hidden_cost", "decision_speed", "ai_decision"],
  fraud: ["fraud_pattern", "hidden_cost", "decision_speed", "ai_decision"],
  cash_stock: ["cashflow_prediction", "decision_speed", "hidden_cost", "ai_decision"],
  reporting: ["reporting_momentum", "decision_speed", "hidden_cost", "ai_decision"],
  brand_trust: ["brand_trust", "decision_speed", "follow_up_leak", "ai_decision"]
};

const FRICTION_LOADING_ORDER: Partial<Record<FrictionSourceId, string>> = {
  duplicate_data: "hidden_cost",
  manual_reports: "reporting_momentum",
  delayed_response: "follow_up_leak",
  human_error: "manual_cost",
  approval_bottleneck: "fraud_pattern",
  knowledge_silo: "knowledge_risk"
};

export function pickLoadingInsights(answers: Pick<WizardAnswers, "mainChallenges" | "frictionSource">, count = 3): LoadingInsight[] {
  const primary = answers.mainChallenges[0] || "revenue";
  const frictionInsight = answers.frictionSource ? FRICTION_LOADING_ORDER[answers.frictionSource] : undefined;
  const orderedIds = [frictionInsight, ...CHALLENGE_LOADING_ORDER[primary], "ai_decision"].filter(Boolean) as string[];
  const uniqueIds = Array.from(new Set(orderedIds)).slice(0, count);
  return uniqueIds.map((id) => LOADING_INSIGHT_BY_ID[id]).filter(Boolean);
}

// Map quality question S2 option IDs to ChallengeId for backwards compatibility
export const DETAIL_TO_CHALLENGE: Record<DetailId, ChallengeId> = {
  follow_up: "revenue",
  repeat_order: "revenue",
  pricing: "revenue",
  lead_quality: "revenue",
  admin_cost: "cost",
  manual_docs: "cost",
  invoice_ap: "cost",
  process_waste: "cost",
  transaction_anomaly: "fraud",
  data_leak: "fraud",
  approval_gap: "fraud",
  cashflow_blind: "cash_stock",
  stockout: "cash_stock",
  overstock: "cash_stock",
  slow_reports: "reporting",
  no_bi: "reporting",
  manual_meetings: "reporting",
  google_visibility: "brand_trust",
  ai_search: "brand_trust",
  review_sentiment: "brand_trust"
};
