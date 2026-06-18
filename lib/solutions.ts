import type { ChallengeId, ContextAnswerKey, DetailId, FrictionSourceId, PesatSolution } from "@/lib/types";

export const CHALLENGE_LABELS: Record<ChallengeId, string> = {
  revenue: "Omzet tidak naik padahal lead ada",
  cost: "Biaya operasional membengkak tanpa sadar",
  risk_trust: "Ada risiko finansial atau brand sulit dipercaya",
  cash_stock: "Kas, stok & laporan sering meleset dari prediksi",
  reporting: "Keputusan penting selalu telat karena data belum siap"
};

export const AVAILABLE_SOLUTIONS: PesatSolution[] = [
  { id: "ai_sales_assistant", name: "AI Sales Assistant", cluster: ["revenue"], description: "Membantu follow-up prospek, menjawab pertanyaan penjualan, dan menjaga momentum transaksi.", setupTime: "2 minggu", impactBadge: "high-impact", capabilities: ["Follow-up terjadwal", "Nurture sequence", "Lead scoring otomatis"], prerequisites: ["Daftar lead/prospek", "Channel komunikasi utama"], integrations: ["WhatsApp", "Email", "CRM"], idealFor: ["Tim sales kecil", "High-ticket sales", "B2B services"], effortLevel: "medium", caseStudy: { clientType: "Agensi properti", outcome: "Lead follow-up coverage naik dari 35% ke 85% dalam 6 minggu", timeframe: "6 minggu" } },
  { id: "ai_repeat_order", name: "AI Repeat Order", cluster: ["revenue"], description: "Mendeteksi pelanggan yang siap repeat order dan memicu penawaran tepat waktu.", setupTime: "1 minggu", impactBadge: "quick-win", capabilities: ["Prediksi waktu beli ulang", "Trigger penawaran otomatis", "Segmentasi pelanggan"], prerequisites: ["Data transaksi historis", "Daftar pelanggan aktif"], integrations: ["WhatsApp", "Email", "Order system"], idealFor: ["E-commerce", "F&B", "Retail berulang"], effortLevel: "low", caseStudy: { clientType: "Kopi retail", outcome: "Repeat purchase rate naik 22% tanpa tambah ads budget", timeframe: "4 minggu" } },
  { id: "ai_dynamic_pricing", name: "AI Dynamic Pricing", cluster: ["revenue"], description: "Membantu membaca permintaan, margin, dan kompetisi untuk rekomendasi harga.", setupTime: "3 minggu", impactBadge: "strategic", capabilities: ["Analisis margin real-time", "Rekomendasi harga", "Simulasi dampak"], prerequisites: ["Data harga & cost historis", "Transaksi rutin"], integrations: ["ERP", "Spreadsheet", "E-commerce"], idealFor: ["Retail", "Distribution", "Services dengan pricing kompleks"], effortLevel: "high", caseStudy: { clientType: "Distributor elektronik", outcome: "Margin naik 4-7% dengan harga yang tetap kompetitif", timeframe: "10 minggu" } },
  { id: "ai_whatsapp_sales_bot", name: "AI WhatsApp Sales Bot", cluster: ["revenue"], description: "Mengubah WhatsApp menjadi kanal penjualan responsif dengan pencatatan lead otomatis.", setupTime: "1 minggu", impactBadge: "quick-win", capabilities: ["Auto-reply 24/7", "Katalog produk interaktif", "Pencatatan lead"], prerequisites: ["WhatsApp Business API", "Katalog produk/jasa"], integrations: ["WhatsApp", "Sheets", "CRM"], idealFor: ["Bisnis berbasis WhatsApp", "UMKM", "Sales high-volume"], effortLevel: "low", caseStudy: { clientType: "Clothing brand", outcome: "Response time turun dari jam ke menit, conversion chat naik 30%", timeframe: "2 minggu" } },
  { id: "ai_chatbot_24_7", name: "AI Chatbot 24/7", cluster: ["revenue", "risk_trust"], description: "Menjawab pertanyaan umum pelanggan secara konsisten di luar jam operasional.", setupTime: "2 minggu", impactBadge: "high-impact", capabilities: ["Jawaban instan", "Integrasi knowledge base", "Handover ke agent"], prerequisites: ["FAQ & knowledge base", "Channel chat/web"], integrations: ["Website", "WhatsApp", "Helpdesk"], idealFor: ["Bisnis dengan inquiry tinggi", "Support 24 jam"], effortLevel: "medium", caseStudy: { clientType: "SaaS lokal", outcome: "70% pertanyaan terselesaikan tanpa agent", timeframe: "5 minggu" } },
  { id: "ai_pembukuan_otomatis", name: "AI Pembukuan Otomatis", cluster: ["cost", "reporting"], description: "Mengurangi input manual dan merapikan transaksi untuk laporan yang lebih cepat.", setupTime: "2 minggu", impactBadge: "quick-win", capabilities: ["OCR struk/invoice", "Klasifikasi transaksi", "Rekonsiliasi otomatis"], prerequisites: ["Data transaksi/bank", "Chart of accounts"], integrations: ["Bank", "WhatsApp", "Accounting"], idealFor: ["UMKM", "Agency", "Retail"], effortLevel: "low", caseStudy: { clientType: "Agensi digital", outcome: "Waktu closing bulanan turun dari 5 hari ke 1 hari", timeframe: "4 minggu" } },
  { id: "ai_invoice_ap_otomatis", name: "AI Invoice & AP Otomatis", cluster: ["cost", "cash_stock"], description: "Membantu ekstraksi invoice, pencocokan pembayaran, dan prioritas account payable.", setupTime: "2 minggu", impactBadge: "high-impact", capabilities: ["OCR invoice", "Matching PO-invoice-bayar", "Reminder AP"], prerequisites: ["Invoice masuk/keluar digital", "Data supplier"], integrations: ["Email", "ERP", "Bank"], idealFor: ["Distributor", "Manufaktur kecil", "Jasa proyek"], effortLevel: "medium", caseStudy: { clientType: "Supplier bahan baku", outcome: "Invoice processing turun dari 3 hari ke 4 jam", timeframe: "5 minggu" } },
  { id: "ai_prediksi_cashflow", name: "AI Prediksi Cashflow", cluster: ["cash_stock"], description: "Memproyeksikan arus kas dari pola transaksi, piutang, dan kewajiban berjalan.", setupTime: "3 minggu", impactBadge: "strategic", capabilities: ["Proyeksi 30-90 hari", "What-if scenario", "Alert kas rendis"], prerequisites: ["Histori cash in/out 6+ bulan", "Data piutang & payable"], integrations: ["Bank", "Accounting", "Excel"], idealFor: ["Bisnis dengan cashflow fluktuatif", "Retail", "Distributor"], effortLevel: "high", caseStudy: { clientType: "Retail multi-cabang", outcome: "Prediksi kas 30 hari mencapai 85% akurasi", timeframe: "10 minggu" } },
  { id: "ai_document_processor", name: "AI Document Processor", cluster: ["cost", "reporting"], description: "Membaca dokumen bisnis dan mengubahnya menjadi data siap proses.", setupTime: "2 minggu", impactBadge: "high-impact", capabilities: ["OCR multi-bahasa", "Ekstraksi field", "Validasi data"], prerequisites: ["Jenis dokumen berulang", "Sampel 50+ dokumen"], integrations: ["Email", "Cloud storage", "ERP"], idealFor: ["Finance", "Logistik", "Legal/HR"], effortLevel: "medium", caseStudy: { clientType: "Perusahaan logistik", outcome: "Dokumen masuk diproses 90% lebih cepat", timeframe: "5 minggu" } },
  { id: "ai_meeting_notetaker", name: "AI Meeting Notetaker", cluster: ["reporting", "cost"], description: "Merangkum meeting, keputusan, dan action item tanpa pencatatan manual.", setupTime: "1 minggu", impactBadge: "quick-win", capabilities: ["Transkrip meeting", "Ringkasan action item", "Tracking eksekusi"], prerequisites: ["Meeting daring/tercatat", "Izin rekaman"], integrations: ["Meet", "Zoom", "Notion/Docs"], idealFor: ["Tim remote", "Project-based work", "Management"], effortLevel: "low", caseStudy: { clientType: "Konsultan IT", outcome: "Waktu rapat turun 30% dan action item tereksekusi 2x lebih cepat", timeframe: "3 minggu" } },
  { id: "ai_ticket_router", name: "AI Ticket Router", cluster: ["reporting", "risk_trust"], description: "Mengelompokkan dan mengarahkan tiket pelanggan ke tim yang tepat.", setupTime: "1 minggu", impactBadge: "high-impact", capabilities: ["Klasifikasi tiket", "Routing otomatis", "Prioritasi urgency"], prerequisites: ["Channel komplain masuk", "Tim support terdefinisi"], integrations: ["Email", "WhatsApp", "Helpdesk"], idealFor: ["Customer service", "E-commerce", "SaaS"], effortLevel: "low", caseStudy: { clientType: "E-commerce fashion", outcome: "First response time turun 50%", timeframe: "2 minggu" } },
  { id: "ai_social_media_manager", name: "AI Social Media Manager", cluster: ["risk_trust"], description: "Membantu ide, kalender, dan produksi konten sosial yang lebih konsisten.", setupTime: "2 minggu", impactBadge: "high-impact", capabilities: ["Ide konten", "Scheduling", "Analisa engagement"], prerequisites: ["Brand voice guide", "Akses akun sosial media"], integrations: ["Instagram", "TikTok", "LinkedIn"], idealFor: ["Brand B2C", "Personal brand", "UMKM"], effortLevel: "medium", caseStudy: { clientType: "Brand skincare lokal", outcome: "Konten mingguan naik 3x tanpa tambah tim", timeframe: "6 minggu" } },
  { id: "ai_email_jadwal_otomatis", name: "AI Email & Jadwal Otomatis", cluster: ["cost", "revenue"], description: "Mengotomasi email operasional, reminder, dan koordinasi jadwal.", setupTime: "1 minggu", impactBadge: "quick-win", capabilities: ["Email sequence", "Reminder otomatis", "Koordinasi jadwal"], prerequisites: ["Email perusahaan", "Template komunikasi"], integrations: ["Gmail/Outlook", "Calendar", "CRM"], idealFor: ["Jasa profesional", "Sales", "Operations"], effortLevel: "low", caseStudy: { clientType: "Konsultan hukum", outcome: "No-show meeting turun 40%", timeframe: "2 minggu" } },
  { id: "ai_report_generator", name: "AI Report Generator", cluster: ["reporting"], description: "Mengubah data mentah menjadi ringkasan dan laporan manajemen berkala.", setupTime: "2 minggu", impactBadge: "high-impact", capabilities: ["Narrative insight", "Auto-chart", "Distribusi laporan"], prerequisites: ["Data terstruktur", "Pertanyaan bisnis rutin"], integrations: ["Sheets", "Database", "BI tools"], idealFor: ["Management", "Finance", "Operations"], effortLevel: "medium", caseStudy: { clientType: "Ritel multi-brand", outcome: "Laporan mingguan siap dalam 30 menit", timeframe: "5 minggu" } },
  { id: "ai_rute_logistik_pintar", name: "AI Rute Logistik Pintar", cluster: ["cost", "cash_stock"], description: "Membantu optimasi rute, kapasitas, dan prioritas pengiriman.", setupTime: "3 minggu", impactBadge: "strategic", capabilities: ["Optimasi rute", "Prediksi waktu tempuh", "Penghematan bbm"], prerequisites: ["Data pengiriman historis", "Armada & alamat"], integrations: ["GPS", "Order system", "Maps API"], idealFor: ["Logistik", "F&B delivery", "Distributor"], effortLevel: "high", caseStudy: { clientType: "Jasa pengiriman lokal", outcome: "Jarak tempuh turun 18%, bahan bakar hemat 15%", timeframe: "10 minggu" } },
  { id: "ai_organic_traffic_builder", name: "AI Organic Traffic Builder", cluster: ["risk_trust"], description: "Membantu membangun traffic organik dari konten yang sesuai niat pencarian.", setupTime: "4 minggu", impactBadge: "strategic", capabilities: ["Keyword research", "Content brief", "SEO outline"], prerequisites: ["Website/blog aktif", "Topik bisnis jelas"], integrations: ["Website", "Search Console", "CMS"], idealFor: ["SaaS", "Services", "Publisher"], effortLevel: "high", caseStudy: { clientType: "SaaS HR", outcome: "Organic traffic naik 120% dalam 4 bulan", timeframe: "16 minggu" } },
  { id: "ai_demand_planner", name: "AI Demand Planner", cluster: ["cash_stock"], description: "Membaca pola permintaan untuk perencanaan pembelian dan produksi.", setupTime: "3 minggu", impactBadge: "strategic", capabilities: ["Forecast permintaan", "Safety stock", "Purchase rekomendasi"], prerequisites: ["Histori penjualan 6+ bulan", "Data produk & supplier"], integrations: ["ERP", "Spreadsheet", "Inventory"], idealFor: ["Retail", "Manufaktur", "F&B"], effortLevel: "high", caseStudy: { clientType: "Manufaktur furnitur", outcome: "Stockout turun 60%, overstock turun 25%", timeframe: "12 minggu" } },
  { id: "ai_sop_knowledge_writer", name: "AI SOP & Knowledge Writer", cluster: ["cost", "reporting"], description: "Merapikan SOP dan knowledge base agar operasional mudah direplikasi.", setupTime: "2 minggu", impactBadge: "high-impact", capabilities: ["SOP generator", "Knowledge base", "Onboarding assistant"], prerequisites: ["Proses bisnis yang sudah berjalan", "Input dari operator"], integrations: ["Notion", "Docs", "LMS"], idealFor: ["Tim yang tumbuh cepat", "Franchise", "Agency"], effortLevel: "medium", caseStudy: { clientType: "Agensi kreatif", outcome: "Waktu onboarding baru turun dari 2 minggu ke 3 hari", timeframe: "6 minggu" } },
  { id: "ai_quality_control_visual", name: "AI Quality Control Visual", cluster: ["risk_trust", "cost"], description: "Membantu inspeksi visual untuk menemukan cacat, anomali, atau deviasi proses.", setupTime: "3 minggu", impactBadge: "high-impact", capabilities: ["Defect detection", "Visual audit", "Batch tracking"], prerequisites: ["Produk dengan visual standar", "Sampel foto defect"], integrations: ["Kamera/IoT", "QC system", "ERP"], idealFor: ["Manufaktur", "F&B", "Retail"], effortLevel: "high", caseStudy: { clientType: "Pabrik komponen elektronik", outcome: "Defect escape rate turun 45%", timeframe: "10 minggu" } },
  { id: "ai_market_intelligence", name: "AI Market Intelligence", cluster: ["revenue", "risk_trust"], description: "Memantau kompetitor, tren pasar, dan sinyal permintaan yang relevan.", setupTime: "2 minggu", impactBadge: "strategic", capabilities: ["Competitor tracking", "Trend detection", "Pricing signal"], prerequisites: ["Produk/jasa yang jelas", "Data pasar online"], integrations: ["Web", "Marketplaces", "News"], idealFor: ["Brand", "E-commerce", "Strategy"], effortLevel: "medium", caseStudy: { clientType: "Brand consumer goods", outcome: "Reaksi harga kompetitor 3x lebih cepat", timeframe: "6 minggu" } },
  { id: "ai_survey_feedback_analyzer", name: "AI Survey & Feedback Analyzer", cluster: ["risk_trust", "revenue"], description: "Meringkas feedback pelanggan menjadi tema, prioritas, dan peluang perbaikan.", setupTime: "1 minggu", impactBadge: "quick-win", capabilities: ["Tema otomatis", "Sentimen", "Actionable report"], prerequisites: ["Data feedback pelanggan", "Channel survey/review"], integrations: ["Google Forms", "WhatsApp", "Review sites"], idealFor: ["Service", "E-commerce", "SaaS"], effortLevel: "low", caseStudy: { clientType: "Klinik kecantikan", outcome: "NPS insight mingguan siap dalam 1 jam", timeframe: "2 minggu" } },
  { id: "ai_sentiment_pelanggan", name: "AI Sentiment Pelanggan", cluster: ["risk_trust"], description: "Mendeteksi perubahan sentimen pelanggan dari review, chat, dan komentar.", setupTime: "1 minggu", impactBadge: "quick-win", capabilities: ["Monitoring review/chat", "Alert sentimen negatif", "Dashboard trend"], prerequisites: ["Review/chat tersedia", "Akses platform"], integrations: ["Google Reviews", "Play Store", "Sosial media"], idealFor: ["B2C", "F&B", "Retail"], effortLevel: "low", caseStudy: { clientType: "Restoran chain", outcome: "Review negatif ditangani dalam <3 jam", timeframe: "2 minggu" } },
  { id: "ai_data_quality_auto_heal", name: "AI Data Quality Auto-Heal", cluster: ["risk_trust", "reporting"], description: "Mendeteksi data ganda, janggal, atau tidak lengkap sebelum merusak keputusan.", setupTime: "2 minggu", impactBadge: "high-impact", capabilities: ["Duplicate detection", "Anomaly flag", "Auto-suggest fix"], prerequisites: ["Dataset dengan ID unik", "Akses database/sumber data"], integrations: ["Database", "Sheets", "CRM/ERP"], idealFor: ["Bisnis data terfragmentasi", "Finance", "Ops"], effortLevel: "medium", caseStudy: { clientType: "Fintech lending", outcome: "Data duplikat turun 92%", timeframe: "5 minggu" } },
  { id: "ai_process_intelligence", name: "AI Process Intelligence", cluster: ["cost", "reporting"], description: "Menganalisis bottleneck proses dan aktivitas yang paling banyak membuang waktu.", setupTime: "3 minggu", impactBadge: "strategic", capabilities: ["Process mining", "Bottleneck detection", "Time analysis"], prerequisites: ["Log aktivitas proses", "Event timestamps"], integrations: ["ERP", "Task tools", "Database"], idealFor: ["Operasi kompleks", "Manufaktur", "Logistik"], effortLevel: "high", caseStudy: { clientType: "Manufaktur makanan", outcome: "Waktu proses produksi turun 22%", timeframe: "10 minggu" } },
  { id: "ai_roi_impact_tracker", name: "AI ROI & Impact Tracker", cluster: ["risk_trust", "revenue", "cost"], description: "Mengukur dampak inisiatif AI terhadap revenue, biaya, waktu, dan risiko.", setupTime: "2 minggu", impactBadge: "high-impact", capabilities: ["ROI dashboard", "Before/after tracking", "Alert deviation"], prerequisites: ["Metrik bisnis jelas", "Baseline data"], integrations: ["Sheets", "Database", "BI"], idealFor: ["Management", "PMO", "Transformation team"], effortLevel: "medium", caseStudy: { clientType: "Startup ops-heavy", outcome: "Impact AI terukur per use case dalam satu dashboard", timeframe: "5 minggu" } },
  { id: "ai_customer_journey_signals", name: "AI Customer Journey Signals", cluster: ["revenue", "risk_trust"], description: "Membaca sinyal perilaku pelanggan untuk prioritas follow-up dan retensi.", setupTime: "2 minggu", impactBadge: "high-impact", capabilities: ["Behavioral signals", "Next-best-action", "Churn risk flag"], prerequisites: ["Data interaksi pelanggan", "Channel touchpoint"], integrations: ["CRM", "WhatsApp", "Website"], idealFor: ["SaaS", "E-commerce", "Membership"], effortLevel: "medium", caseStudy: { clientType: "Membership platform", outcome: "Churn rate turun 12%", timeframe: "7 minggu" } },
  { id: "ai_crm_pintar", name: "AI CRM Pintar", cluster: ["revenue"], description: "Merapikan lead, pipeline, dan next action agar peluang tidak hilang.", setupTime: "2 minggu", impactBadge: "high-impact", capabilities: ["Pipeline visibility", "Next action reminder", "Lead scoring"], prerequisites: ["Data lead & deal", "Sales workflow"], integrations: ["CRM", "WhatsApp", "Email"], idealFor: ["B2B sales", "Agency", "Real estate"], effortLevel: "medium", caseStudy: { clientType: "Developer properti", outcome: "Deal slip rate turun 35%", timeframe: "6 minggu" } },
  { id: "ai_fraud_detection", name: "AI Fraud Detection", cluster: ["risk_trust"], description: "Mendeteksi pola transaksi, klaim, atau akses yang menyimpang dari kebiasaan.", setupTime: "3 minggu", impactBadge: "strategic", capabilities: ["Anomaly detection", "Risk scoring", "Real-time alert"], prerequisites: ["Histori transaksi", "Definisi normal/abnormal"], integrations: ["Database", "Payment gateway", "ERP"], idealFor: ["Fintech", "E-commerce", "Insurance"], effortLevel: "high", caseStudy: { clientType: "Lending startup", outcome: "Fraud loss turun 60%", timeframe: "10 minggu" } },
  { id: "ai_inventory_optimizer", name: "AI Inventory Optimizer", cluster: ["cash_stock"], description: "Membantu menjaga stok ideal agar modal tidak tertahan dan stockout turun.", setupTime: "2 minggu", impactBadge: "high-impact", capabilities: ["Safety stock", "Reorder point", "Dead stock alert"], prerequisites: ["Data stok & penjualan", "SKU master"], integrations: ["Inventory system", "Sheets", "ERP"], idealFor: ["Retail", "Distributor", "E-commerce"], effortLevel: "medium", caseStudy: { clientType: "Distributor kosmetik", outcome: "Modal tertahan turun 30% tanpa stockout", timeframe: "7 minggu" } },
  { id: "ai_executive_dashboard", name: "AI Executive Dashboard", cluster: ["reporting", "cash_stock"], description: "Menyajikan KPI utama untuk keputusan cepat lintas revenue, biaya, kas, dan stok.", setupTime: "2 minggu", impactBadge: "strategic", capabilities: ["KPI aggregation", "Alert threshold", "Mobile-friendly"], prerequisites: ["Data sumber terdefinisi", "KPI yang dipantau"], integrations: ["Sheets", "Database", "BI tools"], idealFor: ["CEO/COO", "Multi-department", "Growing teams"], effortLevel: "medium", caseStudy: { clientType: "Ritel 10 cabang", outcome: "Keputusan mingguan data-driven dalam 15 menit", timeframe: "6 minggu" } },
  { id: "ai_local_ai_search_trust_builder", name: "AI Local & AI Search Trust Builder", cluster: ["risk_trust"], description: "Meningkatkan trust signal di Google, profil lokal, dan jawaban AI search.", setupTime: "3 minggu", impactBadge: "strategic", capabilities: ["Local SEO", "Schema markup", "AI citation optimization"], prerequisites: ["Website aktif", "Google Business Profile"], integrations: ["Website", "Google", "Bing"], idealFor: ["Local business", "Services", "B2B"], effortLevel: "high", caseStudy: { clientType: "Klinik gigi", outcome: "Muncul di AI search & local pack untuk 8 keyword utama", timeframe: "10 minggu" } }
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
  risk_trust: {
    first: "Risiko finansial dan trust brand sering terlihat terlambat: anomali kecil tidak dipantau, review tidak terbaca, dan brand tidak muncul di tempat pelanggan mencari.",
    second: "Sistem deteksi pola, monitoring trust signal, dan optimasi AI search membantu tim melihat risiko lebih cepat serta membangun kepercayaan secara sistematis.",
    source: "ACFE fraud detection practices & Google Search Central"
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
    eyebrow: "01 / Fokus utama bisnis",
    title: "Kalau bisnis Anda punya satu masalah yang paling ingin diperbaiki dalam 90 hari ke depan, area mana itu?",
    note: "Pilih satu yang paling sering membuat keputusan lambat atau biaya membengkak.",
    options: [
      { id: "revenue", label: "Omzet sulit naik", note: "Lead ada tapi follow-up buyar dan repeat order rendah", emoji: "📉" },
      { id: "cost", label: "Biaya operasional membengkak", note: "Banyak pekerjaan manual berulang yang tersembunyi", emoji: "💸" },
      { id: "risk_trust", label: "Ada risiko finansial atau brand", note: "Anomali/approval terlewat, review tidak terbaca, brand sulit ditemukan", emoji: "🚨" },
      { id: "cash_stock", label: "Kas, stok & laporan sering meleset", note: "Prediksi salah, modal tertahan, stockout, atau laporan telat", emoji: "📊" },
      { id: "other", label: "Lainnya", note: "Ceritakan di bawah", emoji: "✏️" }
    ]
  },
  {
    id: "q2",
    eyebrow: "02 / Titik bocor terbesar",
    title: "Kalau bisnis Anda punya satu angka yang paling sering berwarna merah, mana itu?",
    note: "Pilih satu metrik yang kalau diperbaiki, bisnis terasa jauh lebih tenang.",
    options: [
      { id: "follow_up", label: "Lead banyak tapi tidak di-follow-up", note: "Chat masuk tapi sedikit yang dikejar sampai closing" },
      { id: "repeat_order", label: "Pelanggan lama jarang beli lagi", note: "Tidak ada sistem trigger untuk repeat order" },
      { id: "pricing", label: "Harga sulit diatur / margin tipis", note: "Kompetitor lebih gesit, harga tidak terukur" },
      { id: "lead_quality", label: "Lead banyak tapi kualitas campur", note: "Sales buang waktu pada lead yang tidak cocok" },
      { id: "admin_cost", label: "Banyak input manual per transaksi", note: "Admin terlalu banyak kerja manual, error sering" },
      { id: "manual_docs", label: "Dokumen perlu input ulang", note: "Verifikasi lama, approval macet" },
      { id: "invoice_ap", label: "Invoice & pembayaran makan waktu", note: "Cashflow tersendat karena proses invoice/AP lambat" },
      { id: "process_waste", label: "Bottleneck proses tidak terlihat", note: "Waste tersembunyi di tiap departemen" },
      { id: "transaction_anomaly", label: "Transaksi mencurigakan terlambat ketahuan", note: "Pola aneh baru ketahuan setelah kerugian membesar" },
      { id: "approval_gap", label: "Approval sering terlewat atau macet", note: "Tidak ada audit trail yang kuat" },
      { id: "google_visibility", label: "Brand sulit ditemukan di Google", note: "Traffic organik tidak bertumbuh" },
      { id: "review_sentiment", label: "Review & komplain tidak terbaca", note: "Trust tidak terjaga karena monitoring manual" },
      { id: "cashflow_blind", label: "Sulit prediksi kas", note: "Keputusan selalu reaktif" },
      { id: "stockout", label: "Stok habis mendadak", note: "Kehilangan sales berulang" },
      { id: "overstock", label: "Modal tertahan di stok", note: "ROI turun, barang expired" },
      { id: "slow_reports", label: "Laporan sering telat", note: "Keputusan penting terhambat" },
      { id: "no_bi", label: "Tiap tim punya versi data sendiri", note: "Belum ada dashboard yang semua tim percaya" },
      { id: "manual_meetings", label: "Meeting banyak tanpa action", note: "Waktu rapat terbuang sia-sia" },
      { id: "other", label: "Lainnya", note: "Ceritakan di bawah", emoji: "✏️" }
    ]
  },
  {
    id: "q3",
    eyebrow: "03 / Seberapa sering",
    title: "Seberapa sering masalah ini membuat tim Anda bekerja lebih keras untuk hasil yang sama?",
    note: "Kejujuran di sini menentukan urgency dan bentuk solusi yang paling cocok.",
    options: [
      { id: "mild", label: "Jarang — maksimal 1-2 kali sebulan", note: "Masih bisa ditangani manual, tapi mulai mengganggu skalabilitas", emoji: "🟢" },
      { id: "weekly", label: "1-2 kali seminggu", note: "Ada proses yang seharusnya otomatis, tapi masih dikerjakan manual", emoji: "🟡" },
      { id: "often", label: "Hampir setiap hari", note: "Tim sudah sibuk mengejar operasional, bukan fokus pada pertumbuhan", emoji: "🟠" },
      { id: "critical", label: "Setiap hari, dan sudah menghambat pertumbuhan", note: "Keputusan penting tertunda, peluang hilang, biaya membengkak", emoji: "🔴" },
      { id: "other", label: "Lainnya", note: "Ceritakan di bawah", emoji: "✏️" }
    ]
  },
  {
    id: "q4",
    eyebrow: "04 / Akar masalah",
    title: "Apa yang PALING banyak menghabiskan waktu tim Anda saat ini?",
    note: "Pilih satu sumber gesekan yang paling dominan. Ini membantu kami menemukan perbaikan tercepat.",
    options: [
      { id: "duplicate_data", label: "Input data berulang", note: "Satu data dimasukkan ke banyak tempat", emoji: "🔄" },
      { id: "manual_reports", label: "Laporan manual", note: "Copy-paste dan gabungkan data tiap periode", emoji: "📑" },
      { id: "delayed_response", label: "Respons & follow-up lambat", note: "Chat/email/prospek tidak cepat dibalas", emoji: "⏳" },
      { id: "error_control", label: "Kesalahan & kendali proses", note: "Salah input, approval macet, atau langkah terlewat", emoji: "⚠️" },
      { id: "other", label: "Lainnya", note: "Ceritakan di bawah", emoji: "✏️" }
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
      { id: "starting", label: "Mulai dari pilot kecil dulu", note: "Kami baru mulai dengan AI, ingin bukti dampak dulu sebelum perluas", emoji: "🧪" },
      { id: "other", label: "Lainnya", note: "Ceritakan di bawah", emoji: "✏️" }
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
  duplicate_data: { label: "Input data berulang", note: "Satu data dimasukkan ke banyak tempat, contoh: WhatsApp → spreadsheet → invoice" },
  manual_reports: { label: "Laporan manual", note: "Setiap periode copy-paste dan gabungkan data dari banyak sumber" },
  delayed_response: { label: "Respons & follow-up lambat", note: "Chat/email/prospek tidak sempat dibalas cepat, peluang hilang" },
  error_control: { label: "Kesalahan & kendali proses", note: "Salah input, approval macet, atau langkah penting sering terlewat" },
  knowledge_silo: { label: "Pengetahuan hanya di kepala orang", note: "SOP tidak tertulis, onboarding lama, risiko jika karyawan keluar" }
};

export type FollowUpQuestion = {
  id: ContextAnswerKey;
  eyebrow: string;
  title: string;
  note?: string;
  options: Array<{ id: string; label: string; note?: string }>;
};

// One adaptive follow-up per detail challenge. The answer gives us volume/severity context
// so the result engine can choose the right solution tier and wording.
export const DETAIL_FOLLOW_UPS: Partial<Record<DetailId, FollowUpQuestion>> = {
  follow_up: {
    id: "detailNumeric",
    eyebrow: "02a / Volume lead",
    title: "Berapa chat atau lead masuk yang perlu di-follow-up setiap minggu?",
    options: [
      { id: "low", label: "Kurang dari 50", note: "Personal follow-up masih feasible" },
      { id: "medium", label: "50 - 200", note: "Mulai butuh sistem agar tidak ada yang terlewat" },
      { id: "high", label: "200 - 500", note: "Sistematisasi penting untuk response time" },
      { id: "very_high", label: "Lebih dari 500", note: "Hampir pasti perlu otomasi besar" },
      { id: "other", label: "Lainnya", note: "Ceritakan skala/detail Anda" }
    ]
  },
  repeat_order: {
    id: "detailNumeric",
    eyebrow: "02a / Basis pelanggan",
    title: "Berapa pelanggan aktif yang berpotensi repeat order dalam 3 bulan terakhir?",
    options: [
      { id: "low", label: "Kurang dari 100", note: "Masih bisa dipantau manual" },
      { id: "medium", label: "100 - 1.000", note: "Segmentasi mulai bernilai" },
      { id: "high", label: "1.000 - 5.000", note: "Trigger otomatis akan sangat terasa impact-nya" },
      { id: "very_high", label: "Lebih dari 5.000", note: "Personalized repeat order menjadi must-have" },
      { id: "other", label: "Lainnya", note: "Ceritakan skala/detail Anda" }
    ]
  },
  pricing: {
    id: "detailNumeric",
    eyebrow: "02a / Kompleksitas harga",
    title: "Berapa SKU atau paket harga yang aktif dihitung/setiap bulan?",
    options: [
      { id: "low", label: "Kurang dari 10", note: "Harga relatif sederhana" },
      { id: "medium", label: "10 - 50", note: "Mulai perlu monitoring kompetitor" },
      { id: "high", label: "50 - 200", note: "Dynamic pricing mulai relevan" },
      { id: "very_high", label: "Lebih dari 200", note: "Sangat cocok untuk model pricing otomatis" },
      { id: "other", label: "Lainnya", note: "Ceritakan skala/detail Anda" }
    ]
  },
  lead_quality: {
    id: "detailNumeric",
    eyebrow: "02a / Volume lead",
    title: "Berapa lead masuk per minggu yang harus disaring kualitasnya?",
    options: [
      { id: "low", label: "Kurang dari 30", note: "Screener sederhana sudah cukup" },
      { id: "medium", label: "30 - 150", note: "Scoring otomatis mulai diperlukan" },
      { id: "high", label: "150 - 500", note: "Prioritas lead sangat penting" },
      { id: "very_high", label: "Lebih dari 500", note: "Butuh lead scoring + routing otomatis" },
      { id: "other", label: "Lainnya", note: "Ceritakan skala/detail Anda" }
    ]
  },
  admin_cost: {
    id: "detailNumeric",
    eyebrow: "02a / Beban admin",
    title: "Berapa jam per minggu tim Anda habis untuk pekerjaan manual seperti input data, copy-paste, atau rekonsiliasi?",
    options: [
      { id: "low", label: "Kurang dari 10 jam", note: "Impact otomasi masih terbatas" },
      { id: "medium", label: "10 - 30 jam", note: "Ada ruang penghematan signifikan" },
      { id: "high", label: "30 - 80 jam", note: "Otomasi akan sangat terasa" },
      { id: "very_high", label: "Lebih dari 80 jam", note: "Ini posisi biaya tersembunyi terbesar" },
      { id: "other", label: "Lainnya", note: "Ceritakan skala/detail Anda" }
    ]
  },
  manual_docs: {
    id: "detailNumeric",
    eyebrow: "02a / Volume dokumen",
    title: "Berapa dokumen masuk/keluar yang perlu diproses setiap minggu?",
    options: [
      { id: "low", label: "Kurang dari 20", note: "Manual masih manageable" },
      { id: "medium", label: "20 - 100", note: "Document processor mulai bernilai" },
      { id: "high", label: "100 - 500", note: "OCR + ekstraksi field sangat diperlukan" },
      { id: "very_high", label: "Lebih dari 500", note: "Must-have untuk skalabilitas" },
      { id: "other", label: "Lainnya", note: "Ceritakan skala/detail Anda" }
    ]
  },
  invoice_ap: {
    id: "detailNumeric",
    eyebrow: "02a / Volume invoice",
    title: "Berapa invoice yang diproses per bulan?",
    options: [
      { id: "low", label: "Kurang dari 50", note: "Template otomatis sudah cukup" },
      { id: "medium", label: "50 - 200", note: "Matching otomatis mulai relevan" },
      { id: "high", label: "200 - 1.000", note: "AP automation sangat diperlukan" },
      { id: "very_high", label: "Lebih dari 1.000", note: "Critical untuk cashflow dan vendor relation" },
      { id: "other", label: "Lainnya", note: "Ceritakan skala/detail Anda" }
    ]
  },
  process_waste: {
    id: "detailNumeric",
    eyebrow: "02a / Kompleksitas proses",
    title: "Berapa langkah/departemen yang dilalui sebelum satu transaksi selesai?",
    options: [
      { id: "low", label: "1 - 3 langkah", note: "Bottleneck masih sederhana" },
      { id: "medium", label: "4 - 7 langkah", note: "Ada celah efisiensi jelas" },
      { id: "high", label: "8 - 12 langkah", note: "Process intelligence sangat relevan" },
      { id: "very_high", label: "Lebih dari 12 langkah", note: "Besar kemungkinan waste tersembunyi" },
      { id: "other", label: "Lainnya", note: "Ceritakan skala/detail Anda" }
    ]
  },
  transaction_anomaly: {
    id: "detailNumeric",
    eyebrow: "02a / Volume transaksi",
    title: "Berapa transaksi per bulan yang perlu dipantau anomalinya?",
    options: [
      { id: "low", label: "Kurang dari 100", note: "Review manual masih cukup" },
      { id: "medium", label: "100 - 1.000", note: "Rule-based alert mulai diperlukan" },
      { id: "high", label: "1.000 - 10.000", note: "Anomaly detection otomatis sangat bernilai" },
      { id: "very_high", label: "Lebih dari 10.000", note: "Real-time scoring menjadi must" },
      { id: "other", label: "Lainnya", note: "Ceritakan skala/detail Anda" }
    ]
  },
  data_leak: {
    id: "detailNumeric",
    eyebrow: "02a / Akses data",
    title: "Berapa sistem/tempat data kritis disimpan saat ini?",
    options: [
      { id: "low", label: "1 - 2 sistem", note: "Risiko fragmentasi rendah" },
      { id: "medium", label: "3 - 5 sistem", note: "Mulai perlu governance" },
      { id: "high", label: "6 - 10 sistem", note: "Data quality auto-heal relevan" },
      { id: "very_high", label: "Lebih dari 10 sistem", note: "Kritis untuk compliance dan audit" },
      { id: "other", label: "Lainnya", note: "Ceritakan skala/detail Anda" }
    ]
  },
  approval_gap: {
    id: "detailNumeric",
    eyebrow: "02a / Approval flow",
    title: "Berapa level approval untuk transaksi/komitmen penting?",
    options: [
      { id: "low", label: "1 level", note: "Risiko approval gap lebih rendah" },
      { id: "medium", label: "2 - 3 level", note: "Delay dan gap mulai muncul" },
      { id: "high", label: "4 - 6 level", note: "Butuh routing & audit trail otomatis" },
      { id: "very_high", label: "Lebih dari 6 level", note: "Bottleneck signifikan, otomasi urgent" },
      { id: "other", label: "Lainnya", note: "Ceritakan skala/detail Anda" }
    ]
  },
  cashflow_blind: {
    id: "detailNumeric",
    eyebrow: "02a / Prediksi kas",
    title: "Seberapa jauh Anda bisa memprediksi kebutuhan kas saat ini?",
    options: [
      { id: "low", label: "1 minggu ke depan", note: "Prediksi sangat terbatas" },
      { id: "medium", label: "2 - 4 minggu", note: "Cashflow forecasting akan membantu" },
      { id: "high", label: "1 - 2 bulan", note: "Sudah baik, tapi bisa lebih presisi" },
      { id: "very_high", label: "Lebih dari 2 bulan", note: "Optimasi modal menjadi fokus utama" },
      { id: "other", label: "Lainnya", note: "Ceritakan skala/detail Anda" }
    ]
  },
  stockout: {
    id: "detailNumeric",
    eyebrow: "02a / Frekuensi stockout",
    title: "Berapa kali stockout terjadi dalam sebulan terakhir?",
    options: [
      { id: "low", label: "Jarang / 0-1 kali", note: "Risiko stockout masih rendah" },
      { id: "medium", label: "2 - 5 kali", note: "Demand planner mulai relevan" },
      { id: "high", label: "6 - 15 kali", note: "Kehilangan sales berulang perlu ditangani" },
      { id: "very_high", label: "Lebih dari 15 kali", note: "Inventory & demand planning menjadi kritis" },
      { id: "other", label: "Lainnya", note: "Ceritakan skala/detail Anda" }
    ]
  },
  overstock: {
    id: "detailNumeric",
    eyebrow: "02a / Modal tertahan",
    title: "Berapa persen modal Anda yang menurut perkiraan tertahan di stok berlebihan?",
    options: [
      { id: "low", label: "Kurang dari 10%", note: "Overstock masih terkendali" },
      { id: "medium", label: "10 - 25%", note: "Ada ruang perbaikan cashflow" },
      { id: "high", label: "25 - 50%", note: "Inventory optimizer sangat diperlukan" },
      { id: "very_high", label: "Lebih dari 50%", note: "Kritis untuk kesehatan kas" },
      { id: "other", label: "Lainnya", note: "Ceritakan skala/detail Anda" }
    ]
  },
  slow_reports: {
    id: "detailNumeric",
    eyebrow: "02a / Laporan",
    title: "Berapa lama waktu yang dibutuhkan untuk menyusun laporan utama setiap periode?",
    options: [
      { id: "low", label: "Kurang dari 4 jam", note: "Masih cepat, tapi bisa lebih otomatis" },
      { id: "medium", label: "4 jam - 2 hari", note: "Report generator akan sangat terasa" },
      { id: "high", label: "3 - 7 hari", note: "Decision delay signifikan" },
      { id: "very_high", label: "Lebih dari 1 minggu", note: "Sangat urgent untuk real-time reporting" },
      { id: "other", label: "Lainnya", note: "Ceritakan skala/detail Anda" }
    ]
  },
  no_bi: {
    id: "detailNumeric",
    eyebrow: "02a / Data",
    title: "Berapa sumber data berbeda yang harus digabung untuk membuat keputusan bisnis?",
    options: [
      { id: "low", label: "1 - 2 sumber", note: "Integrasi sederhana" },
      { id: "medium", label: "3 - 5 sumber", note: "Executive dashboard mulai relevan" },
      { id: "high", label: "6 - 10 sumber", note: "Single source of truth sangat diperlukan" },
      { id: "very_high", label: "Lebih dari 10 sumber", note: "Must-have untuk decision speed" },
      { id: "other", label: "Lainnya", note: "Ceritakan skala/detail Anda" }
    ]
  },
  manual_meetings: {
    id: "detailNumeric",
    eyebrow: "02a / Meeting",
    title: "Berapa jam per minggu tim Anda habis untuk meeting operasional?",
    options: [
      { id: "low", label: "Kurang dari 5 jam", note: "Masih efisien" },
      { id: "medium", label: "5 - 15 jam", note: "Notetaker & action tracker mulai berguna" },
      { id: "high", label: "15 - 30 jam", note: "Meeting productivity tools sangat diperlukan" },
      { id: "very_high", label: "Lebih dari 30 jam", note: "Besar kemungkinan meeting overload" },
      { id: "other", label: "Lainnya", note: "Ceritakan skala/detail Anda" }
    ]
  },
  google_visibility: {
    id: "detailNumeric",
    eyebrow: "02a / Visibilitas",
    title: "Seberapa sulit brand Anda bersaing di Google untuk keyword utama?",
    options: [
      { id: "low", label: "Sudah page 1 untuk mayoritas", note: "Optimasi lanjutan untuk AI search" },
      { id: "medium", label: "Page 2-3 untuk beberapa", note: "Organic traffic builder relevan" },
      { id: "high", label: "Jarang muncul di page 1-3", note: "Butuh strategi konten sistematis" },
      { id: "very_high", label: "Hampir tidak muncul", note: "Fundamental SEO + AI search perlu dibangun" },
      { id: "other", label: "Lainnya", note: "Ceritakan skala/detail Anda" }
    ]
  },
  ai_search: {
    id: "detailNumeric",
    eyebrow: "02a / AI search",
    title: "Apakah brand Anda sudah pernah muncul di jawaban ChatGPT, Perplexity, atau Gemini?",
    options: [
      { id: "low", label: "Sering muncul", note: "Pertahankan dan perkuat citasi" },
      { id: "medium", label: "Kadang muncul", note: "Perlu optimasi trust signal" },
      { id: "high", label: "Jarang / tidak yakin", note: "AI search trust builder sangat relevan" },
      { id: "very_high", label: "Tidak pernah", note: "Fundamental presence perlu dibangun" },
      { id: "other", label: "Lainnya", note: "Ceritakan skala/detail Anda" }
    ]
  },
  review_sentiment: {
    id: "detailNumeric",
    eyebrow: "02a / Review",
    title: "Berapa platform review/channel feedback yang harus dipantau saat ini?",
    options: [
      { id: "low", label: "1 platform", note: "Monitoring sederhana" },
      { id: "medium", label: "2 - 3 platform", note: "Sentiment analyzer mulai berguna" },
      { id: "high", label: "4 - 6 platform", note: "Unified monitoring diperlukan" },
      { id: "very_high", label: "Lebih dari 6 platform", note: "Must-have untuk reputation management" },
      { id: "other", label: "Lainnya", note: "Ceritakan skala/detail Anda" }
    ]
  }
};

// Follow-up based on the friction source selected in Q4.
export const FRICTION_FOLLOW_UPS: Record<FrictionSourceId, FollowUpQuestion> = {
  duplicate_data: {
    id: "frictionChannel",
    eyebrow: "04a / Sumber duplikasi",
    title: "Di mana duplikasi data paling sering terjadi?",
    options: [
      { id: "whatsapp_sheets", label: "WhatsApp → Spreadsheet", note: "Chat/order diinput ulang ke Sheets/Excel" },
      { id: "erp_manual", label: "ERP vs input manual", note: "Sistem ERP ada, tapi banyak input berjalan manual" },
      { id: "multi_apps", label: "Banyak aplikasi terpisah", note: "Sales, operasional, finance pakai tools masing-masing" },
      { id: "other", label: "Lainnya", note: "Isi sendiri di bawah" }
    ]
  },
  manual_reports: {
    id: "frictionChannel",
    eyebrow: "04a / Frekuensi laporan",
    title: "Seberapa sering laporan manual ini harus dibuat?",
    options: [
      { id: "daily", label: "Setiap hari", note: "Waktu terbuang setiap hari" },
      { id: "weekly", label: "Mingguan", note: "Ritme mingguan yang memakan waktu" },
      { id: "monthly", label: "Bulanan", note: "Closing bulanan menjadi beban" },
      { id: "other", label: "Lainnya", note: "Contoh: ad-hoc, per triwulan" }
    ]
  },
  delayed_response: {
    id: "frictionChannel",
    eyebrow: "04a / Channel utama",
    title: "Pelanggan biasanya menghubungi Anda lewat channel mana?",
    options: [
      { id: "whatsapp", label: "WhatsApp", note: "Paling umum untuk bisnis Indonesia" },
      { id: "email", label: "Email", note: "Banyak inquiry masuk lewat email" },
      { id: "phone", label: "Telepon / DM", note: "Langsung ke sales/support" },
      { id: "other", label: "Lainnya", note: "Contoh: marketplace, sosial media" }
    ]
  },
  error_control: {
    id: "frictionChannel",
    eyebrow: "04a / Kesalahan & kendali",
    title: "Kesalahan atau kendali proses mana yang paling sering terjadi?",
    options: [
      { id: "input", label: "Salah input / hitung", note: "Typo, salah angka, formula, diskon" },
      { id: "approval_stuck", label: "Approval macet", note: "Keputusan tertahan karena menunggu orang" },
      { id: "step_missed", label: "Langkah proses terlewat", note: "QC, verifikasi, atau approval dilewati" },
      { id: "other", label: "Lainnya", note: "Isi sendiri di bawah" }
    ]
  },
  knowledge_silo: {
    id: "frictionChannel",
    eyebrow: "04a / Lokasi pengetahuan",
    title: "Pengetahuan operasional bisnis Anda sebagian besar ada di mana?",
    options: [
      { id: "founder", label: "Di kepala founder/pemilik", note: "Risiko tinggi jika founder sibuk" },
      { id: "team_leads", label: "Di kepala tim masing-masing", note: "Silo antar departemen" },
      { id: "scattered_docs", label: "Dokumen tersebar", note: "SOP ada tapi tidak terpusat" },
      { id: "other", label: "Lainnya", note: "Contoh: training lisan, belum ada SOP" }
    ]
  }
};

// Asked alongside the detail follow-up to personalise integration and feasibility advice.
export const STACK_FOLLOW_UP: FollowUpQuestion = {
  id: "currentStack",
  eyebrow: "02b / Stack operasional",
  title: "Sistem operasional utama tim Anda saat ini?",
  options: [
    { id: "whatsapp_sheets", label: "WhatsApp + Spreadsheet", note: "Paling umum, cocok untuk quick wins" },
    { id: "erp", label: "ERP (Odoo/SAP/dll)", note: "Integrasi API menjadi pertimbangan" },
    { id: "ecommerce", label: "E-commerce / Marketplace", note: "Shopify, Tokopedia, Shopee, dll" },
    { id: "crm", label: "CRM / Helpdesk", note: "HubSpot, Salesforce, Zoho, dll" },
    { id: "other", label: "Lainnya", note: "Custom, campuran, atau tools lain" }
  ]
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
  transaction_anomaly: "risk_trust",
  data_leak: "risk_trust",
  approval_gap: "risk_trust",
  cashflow_blind: "cash_stock",
  stockout: "cash_stock",
  overstock: "cash_stock",
  slow_reports: "cash_stock",
  no_bi: "reporting",
  manual_meetings: "reporting",
  google_visibility: "risk_trust",
  ai_search: "risk_trust",
  review_sentiment: "risk_trust"
};