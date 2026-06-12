import type { ChallengeId, DetailId, FrictionSourceId, PesatSolution } from "@/lib/types";

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

export const QUALITY_QUESTIONS: QualityQuestion[] = [
  {
    id: "q1",
    eyebrow: "01 / Diagnosa awal",
    title: "Dalam 90 hari terakhir, di mana tim Anda paling sering kehabisan waktu atau tertinggal dari kompetitor?",
    note: "Pilih satu yang paling sering membuat keputusan bisnis menjadi lambat atau mahal.",
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
    title: "Seberapa sering masalah ini membuat tim Anda bekerja lebih keras untuk hasil yang sama?",
    note: "Kejujuran di sini menentukan urgency dan bentuk solusi yang paling cocok.",
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
    title: "Kalau kami menyiapkan solusi AI untuk tim Anda, model kerja sama mana yang paling realistis saat ini?",
    note: "Ini menentukan kecepatan implementasi dan level keterlibatan tim Anda.",
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
    text: "Tim dengan proses manual tinggi rata-rata kehilangan puluhan jam kerja setiap bulan — bukan karena tim malas, melainkan karena sistemnya belum terotomatisasi.",
    source: "McKinsey Global Institute",
    durationMs: 5500
  },
  {
    id: "hidden_cost",
    text: "Sebagian besar perusahaan tidak menyadari biaya tersembunyi dari pekerjaan berulang: duplikasi input, koreksi error, dan waktu menunggu approval.",
    source: "Deloitte Digital Transformation",
    durationMs: 6000
  },
  {
    id: "decision_speed",
    text: "Automasi bukan hanya menghemat biaya. Perusahaan yang bisa mengambil keputusan berbasis data real-time bergerak 5-10x lebih cepat dari kompetitor yang masih menunggu laporan manual.",
    source: "MIT Sloan Management Review",
    durationMs: 6000
  },
  {
    id: "follow_up_leak",
    text: "Rata-rata 50-70% lead tidak di-follow-up lebih dari dua kali. Padahal penjualan sering terjadi bukan di lead pertama, melainkan di follow-up ketiga atau keempat.",
    source: "HubSpot Sales Research",
    durationMs: 6000
  },
  {
    id: "knowledge_risk",
    text: "Pengetahuan yang hanya tinggal di kepala karyawan adalah aset tak terlihat yang paling berisiko. Saat mereka keluar, proses bisnis bisa terhenti berbulan-bulan.",
    source: "IBM Knowledge Retention Study",
    durationMs: 5500
  },
  {
    id: "ai_decision",
    text: "AI terbaik bukan pengganti manusia, melainkan co-pilot operasional: menangkap sinyal yang terlewat, mengingatkan prioritas, dan memberi tim lebih banyak waktu untuk berpikir strategis.",
    source: "Pesat.AI Operational Framework",
    durationMs: 5500
  },
  {
    id: "fraud_pattern",
    text: "Fraud jarang terlihat sebagai satu kejadian besar. Polanya biasanya muncul dari anomali kecil yang tidak dipantau — hingga akhirnya kerugiannya terlalu besar untuk diabaikan.",
    source: "ACFE Global Fraud Study",
    durationMs: 6000
  },
  {
    id: "cashflow_prediction",
    text: "Perusahaan yang memprediksi cashflow lebih awal bisa mengurangi modal tertahan hingga 20-30%, karena mereka membeli stok pada waktu yang tepat, bukan karena panik.",
    source: "McKinsey Supply Chain Analytics",
    durationMs: 6000
  },
  {
    id: "reporting_momentum",
    text: "Laporan yang lambat membuat keputusan penting diambil saat momentum sudah lewat. Bisnis yang cepat bukan yang punya data paling banyak, melainkan yang bisa bertindak paling cepat.",
    source: "Gartner Analytics & BI Guidance",
    durationMs: 6000
  },
  {
    id: "brand_trust",
    text: "Trust sekarang dibentuk di Google, review, konten, dan jawaban AI search — sebelum pelanggan pernah bicara dengan sales Anda.",
    source: "Google Search Central & AI Search Behavior",
    durationMs: 5500
  }
];

export type LoadingInsight = (typeof LOADING_INSIGHTS)[number];

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
