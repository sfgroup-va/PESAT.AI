import type { ChallengeId, DetailId, PesatSolution } from "@/lib/types";

export const CHALLENGE_LABELS: Record<ChallengeId, string> = {
  revenue: "omzet stagnan",
  cost: "biaya besar",
  fraud: "fraud",
  cash_stock: "kas/stok",
  reporting: "laporan lambat",
  brand_trust: "brand kurang dipercaya"
};

export const AVAILABLE_SOLUTIONS: PesatSolution[] = [
  { id: "ai_sales_assistant", name: "AI Sales Assistant", cluster: ["revenue"], description: "Membantu follow-up prospek, menjawab pertanyaan penjualan, dan menjaga momentum transaksi." },
  { id: "ai_repeat_order", name: "AI Repeat Order", cluster: ["revenue"], description: "Mendeteksi pelanggan yang siap repeat order dan memicu penawaran tepat waktu." },
  { id: "ai_dynamic_pricing", name: "AI Dynamic Pricing", cluster: ["revenue"], description: "Membantu membaca permintaan, margin, dan kompetisi untuk rekomendasi harga." },
  { id: "ai_whatsapp_sales_bot", name: "AI WhatsApp Sales Bot", cluster: ["revenue"], description: "Mengubah WhatsApp menjadi kanal penjualan responsif dengan pencatatan lead otomatis." },
  { id: "ai_chatbot_24_7", name: "AI Chatbot 24/7", cluster: ["revenue", "brand_trust"], description: "Menjawab pertanyaan umum pelanggan secara konsisten di luar jam operasional." },
  { id: "ai_pembukuan_otomatis", name: "AI Pembukuan Otomatis", cluster: ["cost", "reporting"], description: "Mengurangi input manual dan merapikan transaksi untuk laporan yang lebih cepat." },
  { id: "ai_invoice_ap_otomatis", name: "AI Invoice & AP Otomatis", cluster: ["cost", "cash_stock"], description: "Membantu ekstraksi invoice, pencocokan pembayaran, dan prioritas account payable." },
  { id: "ai_prediksi_cashflow", name: "AI Prediksi Cashflow", cluster: ["cash_stock"], description: "Memproyeksikan arus kas dari pola transaksi, piutang, dan kewajiban berjalan." },
  { id: "ai_document_processor", name: "AI Document Processor", cluster: ["cost", "reporting"], description: "Membaca dokumen bisnis dan mengubahnya menjadi data siap proses." },
  { id: "ai_meeting_notetaker", name: "AI Meeting Notetaker", cluster: ["reporting", "cost"], description: "Merangkum meeting, keputusan, dan action item tanpa pencatatan manual." },
  { id: "ai_ticket_router", name: "AI Ticket Router", cluster: ["reporting", "brand_trust"], description: "Mengelompokkan dan mengarahkan tiket pelanggan ke tim yang tepat." },
  { id: "ai_social_media_manager", name: "AI Social Media Manager", cluster: ["brand_trust"], description: "Membantu ide, kalender, dan produksi konten sosial yang lebih konsisten." },
  { id: "ai_email_jadwal_otomatis", name: "AI Email & Jadwal Otomatis", cluster: ["cost", "revenue"], description: "Mengotomasi email operasional, reminder, dan koordinasi jadwal." },
  { id: "ai_report_generator", name: "AI Report Generator", cluster: ["reporting"], description: "Mengubah data mentah menjadi ringkasan dan laporan manajemen berkala." },
  { id: "ai_rute_logistik_pintar", name: "AI Rute Logistik Pintar", cluster: ["cost", "cash_stock"], description: "Membantu optimasi rute, kapasitas, dan prioritas pengiriman." },
  { id: "ai_organic_traffic_builder", name: "AI Organic Traffic Builder", cluster: ["brand_trust"], description: "Membantu membangun traffic organik dari konten yang sesuai niat pencarian." },
  { id: "ai_demand_planner", name: "AI Demand Planner", cluster: ["cash_stock"], description: "Membaca pola permintaan untuk perencanaan pembelian dan produksi." },
  { id: "ai_sop_knowledge_writer", name: "AI SOP & Knowledge Writer", cluster: ["cost", "reporting"], description: "Merapikan SOP dan knowledge base agar operasional mudah direplikasi." },
  { id: "ai_quality_control_visual", name: "AI Quality Control Visual", cluster: ["fraud", "cost"], description: "Membantu inspeksi visual untuk menemukan cacat, anomali, atau deviasi proses." },
  { id: "ai_market_intelligence", name: "AI Market Intelligence", cluster: ["revenue", "brand_trust"], description: "Memantau kompetitor, tren pasar, dan sinyal permintaan yang relevan." },
  { id: "ai_survey_feedback_analyzer", name: "AI Survey & Feedback Analyzer", cluster: ["brand_trust", "revenue"], description: "Meringkas feedback pelanggan menjadi tema, prioritas, dan peluang perbaikan." },
  { id: "ai_sentiment_pelanggan", name: "AI Sentiment Pelanggan", cluster: ["brand_trust"], description: "Mendeteksi perubahan sentimen pelanggan dari review, chat, dan komentar." },
  { id: "ai_data_quality_auto_heal", name: "AI Data Quality Auto-Heal", cluster: ["fraud", "reporting"], description: "Mendeteksi data ganda, janggal, atau tidak lengkap sebelum merusak keputusan." },
  { id: "ai_process_intelligence", name: "AI Process Intelligence", cluster: ["cost", "reporting"], description: "Menganalisis bottleneck proses dan aktivitas yang paling banyak membuang waktu." },
  { id: "ai_roi_impact_tracker", name: "AI ROI & Impact Tracker", cluster: ["fraud", "revenue", "cost"], description: "Mengukur dampak inisiatif AI terhadap revenue, biaya, waktu, dan risiko." },
  { id: "ai_customer_journey_signals", name: "AI Customer Journey Signals", cluster: ["revenue", "brand_trust"], description: "Membaca sinyal perilaku pelanggan untuk prioritas follow-up dan retensi." },
  { id: "ai_crm_pintar", name: "AI CRM Pintar", cluster: ["revenue"], description: "Merapikan lead, pipeline, dan next action agar peluang tidak hilang." },
  { id: "ai_fraud_detection", name: "AI Fraud Detection", cluster: ["fraud"], description: "Mendeteksi pola transaksi, klaim, atau akses yang menyimpang dari kebiasaan." },
  { id: "ai_inventory_optimizer", name: "AI Inventory Optimizer", cluster: ["cash_stock"], description: "Membantu menjaga stok ideal agar modal tidak tertahan dan stockout turun." },
  { id: "ai_executive_dashboard", name: "AI Executive Dashboard", cluster: ["reporting", "cash_stock"], description: "Menyajikan KPI utama untuk keputusan cepat lintas revenue, biaya, kas, dan stok." },
  { id: "ai_local_ai_search_trust_builder", name: "AI Local & AI Search Trust Builder", cluster: ["brand_trust"], description: "Meningkatkan trust signal di Google, profil lokal, dan jawaban AI search." }
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
