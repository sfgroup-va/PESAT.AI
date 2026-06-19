import {
  Activity,
  BadgeDollarSign,
  BarChart3,
  Bot,
  BookOpen,
  Calculator,
  CalendarClock,
  ClipboardList,
  DatabaseZap,
  FileBarChart,
  FileCheck2,
  Gauge,
  Globe,
  Headset,
  Mail,
  MailWarning,
  Megaphone,
  MessageCircle,
  PackageSearch,
  Radar,
  ReceiptText,
  Repeat,
  Route,
  ScanEye,
  ScanText,
  Search,
  Share2,
  ShieldAlert,
  ShieldCheck,
  ShoppingCart,
  SmilePlus,
  Tags,
  Target,
  Ticket,
  Users,
  Wallet,
  Workflow,
  type LucideIcon
} from "lucide-react";

export type ServiceCategoryId = "revenue" | "cost" | "forecast" | "decision" | "security" | "brandtrust";

export type Complexity = "quick" | "standard" | "advanced";

export type ServiceCategory = {
  id: ServiceCategoryId;
  label: string; // benefit, max 2 kata
  blurb: string;
  icon: LucideIcon;
  tint: "emerald" | "sky" | "violet" | "amber" | "rose" | "fuchsia";
};

export type ServiceDetail = {
  analogy: string;
  example: string;
  before: string;
  after: string;
  complexity: Complexity;
};

export type ServiceItem = {
  id: number;
  category: ServiceCategoryId;
  name: string;
  desc: string;
  impact: string;
  icon: LucideIcon;
  detail: ServiceDetail;
};

export const serviceCategories: ServiceCategory[] = [
  { id: "revenue", label: "Naik Revenue", blurb: "Lebih banyak closing, repeat order, dan nilai per transaksi.", icon: BadgeDollarSign, tint: "emerald" },
  { id: "cost", label: "Hemat Biaya", blurb: "Pangkas jam kerja manual dan biaya operasional rutin.", icon: Workflow, tint: "sky" },
  { id: "forecast", label: "Prediksi Akurat", blurb: "Lihat cashflow, stok, dan demand sebelum terjadi.", icon: BarChart3, tint: "violet" },
  { id: "decision", label: "Keputusan Cepat", blurb: "Data berserakan jadi keputusan yang tajam.", icon: Gauge, tint: "amber" },
  { id: "security", label: "Bisnis Aman", blurb: "Cegah fraud, kebocoran data, dan risiko kepatuhan.", icon: ShieldCheck, tint: "rose" },
  { id: "brandtrust", label: "Brand Dipercaya", blurb: "Dipilih AI search dan dipercaya pelanggan.", icon: Globe, tint: "fuchsia" }
];

// Timeframe / biaya / risiko diturunkan dari complexity (lihat COMPLEXITY di UI).
export const services: ServiceItem[] = [
  // ===== Naik Revenue =====
  {
    id: 1, category: "revenue", name: "AI Sales Assistant", impact: "Konversi naik", icon: Headset,
    desc: "Otomatis jaga lead, kirim penawaran, dan temani calon pelanggan sampai closing, sehingga konversi naik tanpa tambah tim sales.",
    detail: {
      analogy: "Seperti punya sales terbaik yang tidak pernah tidur dan tidak pernah lupa follow-up.",
      example: "Toko furniture online: 200 lead masuk/bulan tapi cuma 30 yang di-follow-up. AI follow-up semua, ingatkan yang ragu, dan jadwalkan call.",
      before: "Lead menumpuk, di-follow-up seadanya, banyak yang dingin lalu hilang.",
      after: "Setiap lead dijaga otomatis sampai closing — closing rate naik tanpa nambah orang.",
      complexity: "standard"
    }
  },
  {
    id: 2, category: "revenue", name: "AI Repeat Order", impact: "+20–30% repeat", icon: Repeat,
    desc: "Scan & filter database customer, lalu otomatis follow-up dengan penawaran tepat, sehingga repeat order dan omzet bisa naik sekitar 20–30%.",
    detail: {
      analogy: "Seperti tambang emas yang sudah ada di laci Anda — pelanggan lama yang lupa di-follow-up.",
      example: "Klinik kecantikan: AI deteksi pelanggan yang biasanya treatment tiap 6 minggu, lalu kirim reminder + promo tepat waktu.",
      before: "Database pelanggan lama nganggur, repeat order mengandalkan ingatan staf.",
      after: "Penawaran tepat ke orang tepat di waktu tepat — repeat order naik 20–30%.",
      complexity: "standard"
    }
  },
  {
    id: 3, category: "revenue", name: "AI Dynamic Pricing", impact: "Margin naik", icon: Tags,
    desc: "Menyesuaikan harga otomatis berdasarkan demand, stok, dan harga kompetitor, sehingga margin dan revenue naik tanpa perang harga buta.",
    detail: {
      analogy: "Seperti harga tiket pesawat — naik saat ramai, turun saat sepi, selalu pas dengan pasar.",
      example: "Hotel: kamar otomatis naik harga saat weekend ramai, turun sedikit saat sepi agar tetap penuh.",
      before: "Harga statis: kemahalan saat sepi, kemurahan saat ramai — margin bocor.",
      after: "Harga selalu optimal mengikuti demand & kompetitor — margin terjaga.",
      complexity: "advanced"
    }
  },
  {
    id: 4, category: "revenue", name: "AI WhatsApp Sales Bot", impact: "Chat → order", icon: MessageCircle,
    desc: "Menjawab, menawarkan, dan menutup penjualan lewat WhatsApp secara otomatis, sehingga konversi chat ke order naik signifikan tanpa tambah tim.",
    detail: {
      analogy: "Seperti kasir + sales yang standby 24 jam di WhatsApp Anda.",
      example: "Toko sparepart: chat 'ada filter oli Avanza?' langsung dijawab, ditawari paket, dan dikirim link bayar.",
      before: "Chat masuk malam/ramai tidak terbalas, calon pembeli kabur ke kompetitor.",
      after: "Setiap chat dilayani instan & diarahkan ke order — konversi chat naik.",
      complexity: "standard"
    }
  },
  {
    id: 9, category: "revenue", name: "AI Next Best Offer", impact: "Nilai transaksi naik", icon: Target,
    desc: "Menentukan penawaran terbaik berikutnya (produk/promo/channel) untuk tiap pelanggan, sehingga nilai per transaksi dan kepuasan naik bersamaan.",
    detail: {
      analogy: "Seperti pelayan berpengalaman yang tahu persis menu apa yang cocok untuk Anda berikutnya.",
      example: "Aplikasi kopi: pelanggan yang sering beli latte ditawari pastry pasangannya, bukan promo acak.",
      before: "Promo dikirim seragam ke semua orang — banyak diabaikan.",
      after: "Setiap pelanggan dapat tawaran paling relevan — nilai transaksi & kepuasan naik.",
      complexity: "standard"
    }
  },
  {
    id: 10, category: "revenue", name: "AI Produk Rekomendasi", impact: "+15–40% AOV", icon: ShoppingCart,
    desc: "Menyarankan produk atau paket paling relevan saat checkout/chat, sehingga nilai per transaksi bisa naik 15–40%.",
    detail: {
      analogy: "Seperti 'sering dibeli bersama' ala marketplace besar, tapi untuk toko Anda.",
      example: "Toko HP: beli HP otomatis disarankan case + anti-gores + paket asuransi.",
      before: "Pelanggan beli 1 item lalu checkout — peluang upsell hilang.",
      after: "Rekomendasi pintar saat checkout — keranjang lebih besar, AOV naik 15–40%.",
      complexity: "standard"
    }
  },
  {
    id: 11, category: "revenue", name: "AI CRM Pintar", impact: "Churn turun", icon: Users,
    desc: "Menganalisis semua interaksi pelanggan dan memberi rekomendasi langkah terbaik untuk sales/CS, sehingga lebih banyak deal close dan churn turun.",
    detail: {
      analogy: "Seperti asisten yang membisikkan 'pelanggan ini hampir kabur, telepon sekarang'.",
      example: "Agensi: AI tandai klien yang makin jarang balas email sebagai berisiko churn, lalu sarankan aksi.",
      before: "Sales reaktif, baru sadar klien hilang setelah berhenti bayar.",
      after: "Sinyal dini + langkah jelas per pelanggan — deal naik, churn turun.",
      complexity: "advanced"
    }
  },
  {
    id: 12, category: "revenue", name: "AI Personalized Email", impact: "+20–40% konversi", icon: Mail,
    desc: "Membuat dan mengirim email marketing yang dipersonalisasi, sehingga open rate dan konversi bisa naik 20–40%.",
    detail: {
      analogy: "Seperti menulis surat personal ke tiap pelanggan — tapi otomatis untuk ribuan orang.",
      example: "E-commerce: email beda untuk pembeli baru, pelanggan setia, dan yang lama tidak belanja.",
      before: "Blast email sama ke semua orang — open rate rendah, banyak unsubscribe.",
      after: "Pesan relevan per segmen — open rate & konversi naik 20–40%.",
      complexity: "quick"
    }
  },
  {
    id: 13, category: "revenue", name: "AI Ad Creative Generator", impact: "ROAS naik", icon: Megaphone,
    desc: "Membuat variasi iklan (gambar + copy) untuk A/B test otomatis, sehingga CTR dan ROAS bisa naik tanpa menambah tim kreatif.",
    detail: {
      analogy: "Seperti tim kreatif yang bisa bikin 50 versi iklan dalam semalam untuk dites.",
      example: "Brand skincare: AI bikin 20 variasi headline + visual, yang menang di-scale-up.",
      before: "Cuma 1–2 versi iklan, lama bikinnya, susah tahu mana yang menang.",
      after: "Banyak variasi diuji cepat — temukan pemenang, ROAS naik.",
      complexity: "quick"
    }
  },
  {
    id: 21, category: "revenue", name: "AI Organic Traffic Builder", impact: "+30–100% traffic", icon: Search,
    desc: "Menghasilkan konten SEO-friendly secara rutin sehingga ranking Google naik dan traffic organik bisa naik 30–100%.",
    detail: {
      analogy: "Seperti menanam pohon traffic — sekali tumbuh, mendatangkan pengunjung gratis terus.",
      example: "Jasa service AC: artikel 'kenapa AC tidak dingin' menarik calon pelanggan dari Google tiap hari.",
      before: "Bergantung iklan berbayar; berhenti bayar, traffic mati.",
      after: "Konten SEO rutin menarik traffic organik — biaya akuisisi turun jangka panjang.",
      complexity: "standard"
    }
  },

  // ===== Hemat Biaya =====
  {
    id: 5, category: "cost", name: "AI Chatbot 24/7", impact: "−30–50% biaya CS", icon: Bot,
    desc: "Menjawab 70–80% pertanyaan standar 24 jam, sehingga biaya customer service bisa turun 30–50% dan response time jauh lebih cepat.",
    detail: {
      analogy: "Seperti CS yang menjawab pertanyaan-pertanyaan yang sama, tanpa lelah, tanpa lembur.",
      example: "Toko online: 'jam buka?', 'cara retur?', 'kapan dikirim?' dijawab instan; yang rumit diteruskan ke manusia.",
      before: "CS kewalahan menjawab pertanyaan berulang, respons lambat, biaya tinggi.",
      after: "70–80% pertanyaan terjawab otomatis 24 jam — biaya CS turun 30–50%.",
      complexity: "standard"
    }
  },
  {
    id: 6, category: "cost", name: "AI Pembukuan Otomatis", impact: "−70% waktu", icon: Calculator,
    desc: "Mengotomasi pencatatan transaksi dan laporan keuangan harian, sehingga waktu pembukuan bisa turun hingga ±70% dan kesalahan catat berkurang.",
    detail: {
      analogy: "Seperti staf pembukuan yang rapi, teliti, dan tidak pernah salah ketik angka.",
      example: "Restoran: transaksi harian otomatis tercatat & dikategorikan, laporan siap tiap pagi.",
      before: "Catat manual tiap malam, sering salah, laporan telat.",
      after: "Pencatatan otomatis & akurat — waktu pembukuan turun ±70%.",
      complexity: "standard"
    }
  },
  {
    id: 7, category: "cost", name: "AI Invoice & AP Otomatis", impact: "AP lebih cepat", icon: ReceiptText,
    desc: "Membaca, memverifikasi, dan memproses invoice serta pembayaran hutang secara otomatis, sehingga proses AP jauh lebih cepat dan akurat.",
    detail: {
      analogy: "Seperti admin yang membaca semua tagihan, mencocokkan, dan menyiapkan pembayaran otomatis.",
      example: "Distributor: ratusan invoice supplier dibaca AI, dicocokkan dengan PO, siap approve.",
      before: "Input invoice manual, rawan salah & double bayar, lambat.",
      after: "Invoice diproses & diverifikasi otomatis — AP cepat dan akurat.",
      complexity: "standard"
    }
  },
  {
    id: 14, category: "cost", name: "AI Document Processor", impact: "Proses dok turun", icon: ScanText,
    desc: "Mengekstrak dan mengisi data dari invoice, kontrak, formulir, dan dokumen lain secara otomatis, sehingga waktu proses dokumen turun drastis.",
    detail: {
      analogy: "Seperti pegawai yang mengetik ulang isi dokumen ke sistem — tapi instan dan tanpa typo.",
      example: "Leasing: data KTP, slip gaji, & formulir otomatis diekstrak ke sistem aplikasi.",
      before: "Tim mengetik ulang data dokumen berjam-jam, sering salah.",
      after: "Data terbaca & terisi otomatis — proses dokumen turun drastis.",
      complexity: "standard"
    }
  },
  {
    id: 15, category: "cost", name: "AI Meeting Notetaker", impact: "Hemat jam rapat", icon: ClipboardList,
    desc: "Merekam, mentranskrip, dan merangkum rapat otomatis, sehingga tim hemat banyak jam untuk catatan dan follow-up.",
    detail: {
      analogy: "Seperti notulen profesional yang selalu hadir dan langsung kirim ringkasan + action items.",
      example: "Tim proyek: selesai meeting, semua dapat ringkasan + daftar tugas + siapa PIC-nya.",
      before: "Tidak ada yang catat, keputusan rapat terlupa, follow-up berantakan.",
      after: "Ringkasan & action items otomatis tiap rapat — eksekusi lebih rapi.",
      complexity: "quick"
    }
  },
  {
    id: 16, category: "cost", name: "AI Ticket Router", impact: "−40–60% resolusi", icon: Ticket,
    desc: "Membaca isi pesan/complaint dan mengarahkan tiket ke tim yang tepat, sehingga waktu resolusi bisa turun 40–60%.",
    detail: {
      analogy: "Seperti resepsionis pintar yang langsung tahu keluhan harus dibawa ke meja siapa.",
      example: "ISP: 'internet mati' ke tim teknis, 'tagihan salah' ke billing — otomatis, tanpa antre salah meja.",
      before: "Tiket nyasar antar tim, bolak-balik, pelanggan menunggu lama.",
      after: "Tiket langsung ke tim tepat — waktu resolusi turun 40–60%.",
      complexity: "standard"
    }
  },
  {
    id: 17, category: "cost", name: "AI Social Media Manager", impact: "Konsisten 24/7", icon: Share2,
    desc: "Membuat, menjadwalkan, dan memposting konten otomatis, sehingga tim marketing hemat waktu dan brand tetap konsisten di semua kanal.",
    detail: {
      analogy: "Seperti tim sosmed yang tidak pernah kehabisan ide dan selalu posting tepat waktu.",
      example: "F&B: kalender konten sebulan dibuat & dijadwal otomatis ke IG, TikTok, FB.",
      before: "Posting tidak konsisten, kadang lupa, kehabisan ide konten.",
      after: "Konten terjadwal & konsisten di semua kanal — brand selalu hidup.",
      complexity: "quick"
    }
  },
  {
    id: 18, category: "cost", name: "AI Email & Jadwal Otomatis", impact: "5–10 jam/minggu", icon: CalendarClock,
    desc: "Mengatur balasan email rutin dan jadwal meeting otomatis, menghemat 5–10 jam per minggu untuk eksekutif dan tim.",
    detail: {
      analogy: "Seperti asisten pribadi yang mengurus inbox dan kalender Anda.",
      example: "Jasa profesional: email rutin dibalas draft otomatis, jadwal meeting diatur tanpa tarik-ulur.",
      before: "Berjam-jam habis untuk email rutin & atur jadwal manual.",
      after: "Email & jadwal terurus otomatis — hemat 5–10 jam/minggu.",
      complexity: "quick"
    }
  },
  {
    id: 23, category: "cost", name: "AI SOP & Knowledge Writer", impact: "Knowledge rapi", icon: BookOpen,
    desc: "Menulis dan memperbarui SOP dan dokumentasi internal dari rekaman, catatan, dan instruksi, sehingga pengetahuan perusahaan terdokumentasi rapi dan mudah dicari.",
    detail: {
      analogy: "Seperti penulis SOP yang mengubah 'ilmu di kepala senior' jadi panduan rapi.",
      example: "Manufaktur: cara setting mesin direkam sekali, AI ubah jadi SOP bergambar & langkah jelas.",
      before: "Ilmu hanya di kepala beberapa orang; staf baru lama belajarnya.",
      after: "Pengetahuan terdokumentasi & mudah dicari — onboarding cepat.",
      complexity: "standard"
    }
  },
  {
    id: 24, category: "cost", name: "AI Quality Control Visual", impact: "Reject rate turun", icon: ScanEye,
    desc: "Menganalisis foto/video produk untuk mendeteksi cacat atau ketidaksesuaian, sehingga reject rate turun dan biaya inspeksi manual berkurang.",
    detail: {
      analogy: "Seperti inspektur QC dengan mata super yang tidak pernah lelah atau lengah.",
      example: "Pabrik garmen: kamera AI deteksi jahitan cacat sebelum produk dikemas.",
      before: "QC manual capek & tidak konsisten, cacat lolos ke pelanggan.",
      after: "Deteksi cacat otomatis & konsisten — reject rate & komplain turun.",
      complexity: "advanced"
    }
  },

  // ===== Prediksi Akurat =====
  {
    id: 8, category: "forecast", name: "AI Prediksi Cashflow", impact: "Antisipasi dana", icon: Wallet,
    desc: "Menganalisis pemasukan dan pengeluaran untuk memprediksi cashflow minggu/bulan depan, sehingga bisnis bisa antisipasi kekurangan dana lebih awal.",
    detail: {
      analogy: "Seperti ramalan cuaca untuk uang Anda — tahu kapan 'hujan' sebelum kebasahan.",
      example: "Kontraktor: AI peringatkan 3 minggu lagi kas menipis karena termin proyek mundur.",
      before: "Baru sadar kas kritis saat sudah mepet — panik cari pinjaman.",
      after: "Peringatan dini kekurangan dana — bisa atur strategi lebih awal.",
      complexity: "standard"
    }
  },
  {
    id: 20, category: "forecast", name: "AI Rute Logistik Pintar", impact: "−15–30% ongkir", icon: Route,
    desc: "Mengoptimalkan rute pengiriman berdasarkan traffic, jarak, dan kapasitas, sehingga biaya pengiriman turun 15–30% dan pengantaran lebih cepat.",
    detail: {
      analogy: "Seperti Google Maps khusus armada Anda yang juga menghemat BBM & waktu.",
      example: "Distribusi air galon: 1 mobil 30 titik diatur urutan optimal, hemat jarak & waktu.",
      before: "Rute ditentukan feeling sopir — boros BBM, antar lama.",
      after: "Rute optimal otomatis — biaya kirim turun 15–30%, antar lebih cepat.",
      complexity: "advanced"
    }
  },
  {
    id: 22, category: "forecast", name: "AI Demand Planner", impact: "Stockout turun", icon: PackageSearch,
    desc: "Menggabungkan data penjualan, musim, promo, dan tren pasar untuk memprediksi demand, sehingga stockout dan overstock berkurang signifikan.",
    detail: {
      analogy: "Seperti peramal yang tahu produk apa akan laku bulan depan, jadi stok pas.",
      example: "Toko bangunan: AI prediksi cat naik jelang musim renovasi, stok disiapkan lebih awal.",
      before: "Stok kebanyakan (modal mati) atau kehabisan (kehilangan penjualan).",
      after: "Stok pas dengan demand — stockout & overstock turun signifikan.",
      complexity: "advanced"
    }
  },
  {
    id: 31, category: "forecast", name: "AI Customer Journey Signals", impact: "Sinyal beli/churn", icon: Activity,
    desc: "Mendeteksi micro-behaviour (sering lihat pricing, sering batal, sering komplain kecil) yang menunjukkan niat beli atau niat churn, lalu memberi sinyal ke tim.",
    detail: {
      analogy: "Seperti membaca bahasa tubuh pelanggan secara digital — tahu yang siap beli & yang mau kabur.",
      example: "SaaS: user yang bolak-balik buka halaman harga ditandai 'siap beli', tim sales menghubungi.",
      before: "Tim tidak tahu siapa yang panas atau dingin — peluang & risiko terlewat.",
      after: "Sinyal niat beli/churn real-time ke tim — aksi tepat di momen tepat.",
      complexity: "advanced"
    }
  },

  // ===== Keputusan Cepat =====
  {
    id: 19, category: "decision", name: "AI Report Generator", impact: "−80% waktu laporan", icon: FileBarChart,
    desc: "Menarik data dari berbagai sumber dan menghasilkan laporan dalam hitungan detik, sehingga waktu bikin laporan bisa turun hingga sekitar 80%.",
    detail: {
      analogy: "Seperti analis yang merangkum semua data jadi laporan rapi dalam hitungan detik.",
      example: "Retail multi-cabang: laporan penjualan harian semua cabang otomatis tiap pagi.",
      before: "Tim tarik data manual dari banyak sumber, laporan baru jadi besok.",
      after: "Laporan jadi dalam detik — waktu bikin laporan turun ±80%.",
      complexity: "standard"
    }
  },
  {
    id: 25, category: "decision", name: "AI Market Intelligence", impact: "Insight pasar", icon: Radar,
    desc: "Mengumpulkan dan menganalisis data pasar dan kompetitor, lalu memberi insight strategi produk dan pricing yang siap pakai.",
    detail: {
      analogy: "Seperti mata-mata pasar yang memantau kompetitor 24/7 lalu lapor ke Anda.",
      example: "Brand fashion: AI pantau harga & promo kompetitor, sarankan posisi harga Anda.",
      before: "Cek kompetitor manual sesekali — telat tahu pergerakan pasar.",
      after: "Insight pasar & kompetitor siap pakai — strategi lebih cepat & tepat.",
      complexity: "standard"
    }
  },
  {
    id: 26, category: "decision", name: "AI Survey & Feedback Analyzer", impact: "Insight actionable", icon: ClipboardList,
    desc: "Membaca dan merangkum ribuan feedback pelanggan/karyawan menjadi insight yang bisa langsung ditindaklanjuti.",
    detail: {
      analogy: "Seperti membaca ribuan komentar dalam semenit lalu tahu 3 hal utama yang harus dibenahi.",
      example: "Hotel: 2.000 review diringkas jadi 'AC berisik, sarapan enak, check-in lama'.",
      before: "Ribuan feedback menumpuk, tidak terbaca, tidak ada aksi.",
      after: "Tema utama terangkum jelas — tahu persis apa yang harus diperbaiki.",
      complexity: "quick"
    }
  },
  {
    id: 27, category: "decision", name: "AI Sentiment Pelanggan", impact: "Suara pelanggan", icon: SmilePlus,
    desc: "Menganalisis review, komentar, dan chat untuk mengetahui apa yang paling disukai dan dikeluhkan pelanggan.",
    detail: {
      analogy: "Seperti termometer perasaan pelanggan — tahu kapan mereka senang atau kecewa.",
      example: "Marketplace seller: AI tandai lonjakan komplain 'pengiriman lambat' minggu ini.",
      before: "Tidak tahu mood pelanggan sampai rating anjlok.",
      after: "Pantau sentimen real-time — masalah ketahuan & ditangani lebih awal.",
      complexity: "quick"
    }
  },
  {
    id: 28, category: "decision", name: "AI Data Quality Auto-Heal", impact: "Data bersih", icon: DatabaseZap,
    desc: "Mendeteksi data yang salah, dobel, atau janggal di database lalu mengoreksi atau memberi alert, sehingga laporan dan dashboard lebih akurat.",
    detail: {
      analogy: "Seperti editor teliti yang membersihkan database dari salah ketik & data dobel.",
      example: "CRM: 3 entri 'PT Maju Jaya', 'Maju Jaya', 'maju jaya pt' dikenali sebagai 1 pelanggan.",
      before: "Data kotor & dobel bikin laporan menyesatkan, keputusan salah.",
      after: "Data bersih & konsisten — laporan & dashboard bisa dipercaya.",
      complexity: "advanced"
    }
  },
  {
    id: 29, category: "decision", name: "AI Process Intelligence", impact: "Temukan bottleneck", icon: Workflow,
    desc: "Menganalisis log proses di ERP/CRM untuk menemukan bottleneck dan langkah yang paling layak diotomasi, sehingga proyek otomasi lebih tepat sasaran.",
    detail: {
      analogy: "Seperti CT-scan untuk proses bisnis — terlihat di mana 'sumbatan'-nya.",
      example: "Manufaktur: ketahuan order macet rata-rata 3 hari di tahap approval finance.",
      before: "Tahu proses lambat, tapi tidak tahu persis macet di mana.",
      after: "Bottleneck terlihat jelas — otomasi diarahkan ke titik paling berdampak.",
      complexity: "advanced"
    }
  },
  {
    id: 30, category: "decision", name: "AI ROI & Impact Tracker", impact: "Dashboard ROI", icon: Gauge,
    desc: "Menghubungkan setiap inisiatif AI ke jam hemat, biaya turun, dan revenue naik, lalu menyajikan dashboard ROI untuk CFO/owner.",
    detail: {
      analogy: "Seperti dashboard mobil — terlihat jelas tiap inisiatif AI menghasilkan apa.",
      example: "Owner lihat: chatbot hemat Rp 12 jt/bulan, repeat order tambah Rp 40 jt/bulan.",
      before: "Investasi AI terasa 'kabur' — sulit buktikan untungnya.",
      after: "ROI tiap inisiatif terukur jelas — keputusan lanjut/stop berbasis angka.",
      complexity: "standard"
    }
  },

  // ===== Bisnis Aman (Security) =====
  {
    id: 34, category: "security", name: "AI Deteksi Fraud & Anomali", impact: "Cegah kebocoran", icon: ShieldAlert,
    desc: "Memantau transaksi dan aktivitas untuk mendeteksi pola mencurigakan secara real-time, sehingga fraud dan kebocoran tertangkap sebelum membesar.",
    detail: {
      analogy: "Seperti satpam digital yang hafal pola normal dan langsung curiga saat ada yang janggal.",
      example: "Retail: AI tandai kasir dengan void/refund tidak wajar di jam sepi.",
      before: "Fraud kecil menumpuk diam-diam, baru ketahuan saat audit tahunan.",
      after: "Anomali ketahuan real-time — kebocoran dicegah sejak dini.",
      complexity: "advanced"
    }
  },
  {
    id: 35, category: "security", name: "AI Email Threat Guard", impact: "Blokir phishing", icon: MailWarning,
    desc: "Menyaring email masuk untuk mendeteksi phishing, penipuan invoice, dan link berbahaya sebelum sampai ke tim Anda.",
    detail: {
      analogy: "Seperti penjaga gerbang yang mengenali surat palsu sebelum dibuka karyawan.",
      example: "Finance: email 'ganti rekening pembayaran supplier' yang palsu ditandai bahaya.",
      before: "Satu klik phishing karyawan bisa berujung kerugian ratusan juta.",
      after: "Email berbahaya dicegat lebih dulu — risiko penipuan & kebocoran turun.",
      complexity: "standard"
    }
  },
  {
    id: 36, category: "security", name: "AI Kontrak & Compliance Checker", impact: "Risiko kontrak turun", icon: FileCheck2,
    desc: "Membaca kontrak dan dokumen untuk menandai klausul berisiko, kewajiban penting, dan ketidaksesuaian aturan, sehingga risiko hukum berkurang.",
    detail: {
      analogy: "Seperti paralegal teliti yang menandai 'pasal ini berbahaya' sebelum Anda tanda tangan.",
      example: "Perusahaan jasa: AI tandai klausul penalti & tanggal jatuh tempo yang mudah terlewat.",
      before: "Kontrak dibaca cepat, klausul berisiko terlewat, denda menanti.",
      after: "Klausul & kewajiban berisiko ditandai jelas — keputusan lebih aman.",
      complexity: "standard"
    }
  },

  // ===== Brand Dipercaya (GEO & DRA) =====
  {
    id: 32, category: "brandtrust", name: "GEO — AI Search Visibility", impact: "Muncul di AI answer", icon: Globe,
    desc: "Generative Engine Optimization: menyiapkan konten & entitas brand Anda agar dikutip dan direkomendasikan oleh AI search (ChatGPT, Gemini, Perplexity, AI Overviews).",
    detail: {
      analogy: "Seperti SEO generasi baru — bukan cuma ranking Google, tapi direkomendasikan oleh AI.",
      example: "Saat orang tanya ChatGPT 'jasa AI bisnis terbaik di Indonesia', brand Anda yang disebut.",
      before: "Brand tidak pernah muncul saat calon pelanggan bertanya ke AI.",
      after: "Brand dikutip & disarankan AI search — sumber leads baru yang belum disentuh kompetitor.",
      complexity: "standard"
    }
  },
  {
    id: 33, category: "brandtrust", name: "DRA — Digital Reputation Asset™", impact: "Reputasi jadi aset", icon: ShieldCheck,
    desc: "Membangun aset reputasi digital yang konsisten di seluruh web (profil, review, sitasi, knowledge graph), sehingga brand terlihat kredibel di mata manusia maupun mesin AI.",
    detail: {
      analogy: "Seperti membangun 'CV digital' brand yang membuat siapa pun langsung percaya.",
      example: "Calon klien Google nama Anda → muncul profil konsisten, review bagus, & sitasi kredibel.",
      before: "Jejak digital berantakan/kosong — calon pelanggan ragu, pilih kompetitor.",
      after: "Reputasi digital konsisten & kredibel — trust naik, closing lebih mudah.",
      complexity: "advanced"
    }
  }
];
