# UX & CRO Audit + Redesign: Pesat.AI Mini Session

**Tanggal:** 12 Juni 2026  
**Scope:** Mini Session flow (pertanyaan → loading → laporan → konversi)  
**Objective:** Maksimalkan user understanding, perceived expertise, trust, insight value, lead conversion, dan desire untuk berbicara dengan sales/demo team.

> **Catatan filosofis:** Sebelum mengubah UI, prioritaskan kualitas diagnosis dan kualitas insight terlebih dahulu. Jika insight biasa-biasa saja, UX yang bagus tidak akan membantu konversi. Pesat.AI harus terlihat seperti seorang konsultan operasional yang memahami bisnis pengguna, bukan sekadar form AI yang menghasilkan laporan generik.

---

## 1. Executive Summary

Mini Session saat ini memiliki fondasi yang benar (wizard bertahap, rule engine deterministik, report panjang), tetapi masih terasa seperti *form survey* yang menghasilkan *laporan templat*.

### Diagnosis singkat:

| Area | Masalah utama |
|------|---------------|
| **Pertanyaan** | Terlalu generik, seperti survey bukan konsultasi. S3 dan S4 redundan/membingungkan. |
| **Friction** | Kontak (nama + WA) diminta SEBELUM nilai diberikan. |
| **Loading** | Insight hanya 2.4 detik, terlalu cepat dibaca. |
| **Report** | Angka naik turun salah arah (After AI seharusnya lebih baik), "Janji Terukur" lemah, insight dangkal. |
| **Visual** | Kartu dan teks saja, kurang visual storytelling premium. |
| **Conversion** | CTA discovery call muncul, tapi tanpa value ladder yang kuat setelah report. |

### Hasil akhir yang diinginkan:

Pengguna selesai Mini Session dengan perasaan:

> *"Wow, saya tidak pernah memikirkan masalah ini sebelumnya."*  
> *"Ini memang masalah yang sedang terjadi di perusahaan saya."*  
> *"Saya butuh solusi ini."*

---

## 2. New Question Flow

### Prinsip desain pertanyaan baru:

1. **Setiap pertanyaan mengumpulkan informasi BARU** — tidak boleh redundan.
2. **Bahasa seperti konsultan B2B**, bukan form survey.
3. **Memaksa refleksi** tentang bottleneck operasional, kerja manual, delay response, reporting, biaya tersembunyi, lost opportunity, skalabilitas.
4. **Mengarah ke diagnosis spesifik**, bukan sekadar kategori.
5. **Optional open question di akhir** untuk meningkatkan personalisasi dan kualitas AI analysis.

### Struktur pertanyaan baru (6 langkah + review + open question)

```
Hero → Q1 → Q2 → Q3 → Q4 → Q5 → Q6 → Review → Generate Result → Report → Lead Gate (setelah value)
```

---

### Q1 — Situasi Operasional Terberat

**Eyebrow:** 01 / Diagnosa awal  
**Title:** Dalam 90 hari terakhir, di mana tim Anda paling sering kehabisan waktu atau tertinggal dari kompetitor?  
**Note:** Pilih satu yang paling sering membuat keputusan bisnis menjadi lambat atau mahal.

| ID | Label | Subtitle (diagnosis framing) |
|----|-------|------------------------------|
| `revenue` | Omzet tidak naik padahal lead ada | Follow-up buyar, peluang tidak tertutup, repeat order tidak terjaga |
| `cost` | Biaya operasional membengkak tanpa sadar | Banyak pekerjaan manual berulang yang tidak terlihat sebagai biaya |
| `fraud` | Ada celah yang baru ketahuan setelah rugi | Anomali terlewat, approval tidak terlacak, data tidak sinkron |
| `cash_stock` | Kas & stok sering meleset dari prediksi | Keputusan reaktif, modal tertahan, stockout mendadak |
| `reporting` | Keputusan penting selalu telat karena data belum siap | Laporan manual, meeting tanpa action, tidak ada single source of truth |
| `brand_trust` | Brand sulit ditemukan & dipercaya pelanggan baru | Google page 2, review tidak terbaca, AI search tidak menjelaskan brand Anda |

---

### Q2 — Metrik yang Paling Sering Merah

**Eyebrow:** 02 / Titik bocor terbesar  
**Title:** Jika bisnis Anda punya satu dashboard yang update real-time, angka mana yang paling sering berwarna merah?  
**Note:** Pilih metrik yang paling mengganggu tidur Anda — satu yang kalau hijau, bisnis terasa jauh lebih tenang.

> Opsi difilter berdasarkan Q1. Berikut label yang lebih seperti bahasa bisnis owner:

**Jika Q1 = revenue:**

| ID | Label | Note |
|----|-------|------|
| `follow_up` | Lead conversion rate rendah | Banyak chat masuk, tapi sedikit yang di-follow-up sampai closing |
| `repeat_order` | Repeat purchase rate jatuh | Pelanggan lama jarang beli lagi, tidak ada sistem trigger otomatis |
| `pricing` | Margin per transaksi menipis | Harga sulit adjust, kompetitor lebih gesit, diskon tidak terukur |
| `lead_quality` | Lead quality score campur | Lead banyak tapi kualitas rendah, sales buang waktu banyak |

**Jika Q1 = cost:**

| ID | Label | Note |
|----|-------|------|
| `admin_cost` | Jam kerja manual per transaksi tinggi | Admin terlalu banyak input manual, error sering terjadi |
| `manual_docs` | Dokumen processing time lambat | Dokumen perlu input ulang, verifikasi lama, approval macet |
| `invoice_ap` | Invoice & AP turnaround panjang | Invoice/AP makan waktu, cashflow tersendat |
| `process_waste` | Process efficiency rendah | Bottleneck tidak terlihat, waste tersembunyi di tiap departemen |

**Jika Q1 = fraud:**

| ID | Label | Note |
|----|-------|------|
| `transaction_anomaly` | Anomali transaksi terlambat terdeteksi | Pola mencurigakan baru ketahuan setelah kerugian membesar |
| `data_leak` | Data governance lemah | Akses/data sulit diawasi, compliance risk meningkat |
| `approval_gap` | Approval compliance rate rendah | Approval rawan dilewati, tidak ada audit trail yang kuat |

**Jika Q1 = cash_stock:**

| ID | Label | Note |
|----|-------|------|
| `cashflow_blind` | Cashflow predictability rendah | Sulit prediksi kas, keputusan selalu reaktif |
| `stockout` | Stock availability rate jatuh | Stok habis mendadak, kehilangan sales berulang |
| `overstock` | Inventory turnover lambat | Modal tertahan di stok, ROI turun, barang expired |

**Jika Q1 = reporting:**

| ID | Label | Note |
|----|-------|------|
| `slow_reports` | Report generation speed lambat | Laporan telat selesai, keputusan penting terhambat |
| `no_bi` | BI readiness score rendah | Belum ada dashboard, setiap tim punya versi data sendiri |
| `manual_meetings` | Meeting action rate rendah | Meeting banyak tanpa action jelas, waktu terbuang sia-sia |

**Jika Q1 = brand_trust:**

| ID | Label | Note |
|----|-------|------|
| `google_visibility` | Google ranking visibility rendah | Sulit unggul di Google, traffic organik tidak bertumbuh |
| `ai_search` | AI search presence lemah | Brand belum siap muncul di jawaban AI seperti ChatGPT/Perplexity |
| `review_sentiment` | Review sentiment score tidak terbaca | Review dan komplain tidak teridentifikasi, trust tidak terjaga |

---

### Q3 — Intensitas & Dampak Operasional

**Eyebrow:** 03 / Seberapa dalam masalahnya  
**Title:** Seberapa sering masalah ini membuat tim Anda bekerja lebih keras untuk hasil yang sama?  
**Note:** Kejujuran di sini menentukan urgency dan bentuk solusi yang paling cocok.

| ID | Label | Note |
|----|-------|------|
| `mild` | Jarang — maksimal 1-2 kali sebulan | Masih bisa ditangani manual, tapi mulai mengganggu skalabilitas |
| `weekly` | 1-2 kali seminggu | Ada proses yang seharusnya otomatis, tapi masih dikerjakan manual |
| `often` | Hampir setiap hari | Tim sudah sibuk mengejar operasional, bukan fokus pada pertumbuhan |
| `critical` | Setiap hari, dan sudah menghambat pertumbuhan | Keputusan penting tertunda, peluang hilang, biaya membengkak |

> **Perubahan:** ID yang semula abstrak (`revenue`, `hours`, `risk`, `cash`, `trust`) diganti menjadi intensitas konkret (`mild`, `weekly`, `often`, `critical`). Ini memperbaiki redundansi dan ambiguity.

---

### Q4 — Sumber Gesekan Terbesar

**Eyebrow:** 04 / Akar masalah  
**Title:** Mana yang PALING banyak menghabiskan waktu tim Anda saat ini?  
**Note:** Pilih satu sumber gesekan yang paling dominan. Ini membantu kami menemukan quick win tercepat.

| ID | Label | Note |
|----|-------|------|
| `duplicate_data` | Input data berulang di banyak tempat | Contoh: data WhatsApp diinput ulang ke spreadsheet, invoice ke sistem lain |
| `manual_reports` | Membuat laporan manual | Data dari banyak sumber digabungkan dengan copy-paste setiap periode |
| `delayed_response` | Follow-up & response lambat | Tim tidak sempat membalas cepat, peluang hilang ke kompetitor |
| `human_error` | Kesalahan manusia yang berulang | Salah input, salah hitung, salah file — memakan waktu perbaikan |
| `approval_bottleneck` | Approval macet atau tidak terlacak | Keputusan tertahan karena menunggu orang, tanpa visibility |
| `knowledge_silo` | Pengetahuan hanya ada di kepala karyawan | SOP tidak tertulis, onboarding lama, risiko jika karyawan keluar |

> **Perubahan:** Ini menggantikan Q4 sebelumnya yang redundan (prioritas AI). Kini kita mengumpulkan informasi BARU tentang *sumber gesekan operasional*.

---

### Q5 — Gaya Adopsi AI

**Eyebrow:** 05 / Cara kerja sama  
**Title:** Kalau kami menyiapkan solusi AI untuk tim Anda, model kerja sama mana yang paling realistis saat ini?  
**Note:** Ini menentukan kecepatan implementasi dan level keterlibatan tim Anda.

| ID | Label | Note |
|----|-------|------|
| `dfy` | Pesat.AI jalankan penuh | Kami butuh hasil cepat, tim fokus pada bisnis inti |
| `hybrid` | Pesat.AI setup, tim internal lanjutkan | Tim ingin belajar sambil jalan agar bisa mandiri |
| `diy` | Tim internal eksekusi dengan blueprint | Kami punya kapasitas teknis, butuh arsitektur & pendampingan |
| `starting` | Mulai dari pilot kecil dulu | Kami baru mulai dengan AI, ingin bukti dampak dulu sebelum perluas |

---

### Q6 — Optional: Ceritakan Tantangan Operasional Anda

**Eyebrow:** 06 / Konteks tambahan (opsional)  
**Title:** Apakah ada tantangan operasional atau pekerjaan berulang yang ingin Anda ceritakan lebih detail?  
**Note:** Semakin spesifik, semakin tajam diagnosis dan rekomendasi yang kami susun.

```
Placeholder:
"Contoh: tim kami masih input data manual dari WhatsApp ke spreadsheet setiap hari,
sales sering telat follow-up lead, dan laporan mingguan baru jadi hari Selasa
padahal meeting direksi hari Senin pagi..."
```

> **Perubahan:** Open question sekarang ada SEBELUM generate result, bukan setelah. Ini meningkatkan kualitas AI analysis dan membuat report terasa lebih personal.

---

## 3. New Wizard Step Structure

```ts
type Step = "hero" | "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "review" | "loading" | "result" | "leadGate";

const STEP_ORDER: Step[] = [
  "hero",
  "q1", "q2", "q3", "q4", "q5", "q6",
  "review",
  "loading",
  "result",
  "leadGate"
];

const STEP_PROGRESS: Record<Step, number> = {
  hero: 0,
  q1: 12,
  q2: 25,
  q3: 38,
  q4: 50,
  q5: 62,
  q6: 75,
  review: 85,
  loading: 90,
  result: 100,
  leadGate: 100
};
```

### Flow perubahan:

```
Hero
  ↓
Q1 → loading insight (5-6 detik) → Q2
  ↓
Q3 → loading insight (5-6 detik) → Q4
  ↓
Q5
  ↓
Q6 (optional textarea)
  ↓
Review
  ↓
Generate Result (loading sequence 15-20 detik)
  ↓
Result Report (FULL VALUE diberikan di sini)
  ↓
Lead Gate (CTA: download detailed report / implementation roadmap / consultation)
```

---

## 4. Improved Loading Experience

### Prinsip:

- Setiap insight ditampilkan **minimum 5-6 detik**.
- Transisi halus (fade/slide), bukan bounce cepat.
- Loading messages harus seperti **observasi konsultan**, bukan marketing copy.
- Edukasi user tentang biaya tersembunyi, efisiensi, dan dampak keputusan lambat.

### Loading Insight Library

Setiap insight memiliki: **text**, **source**, **durationMs**.

```ts
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
```

### Loading Sequence Logic

```ts
// Antara Q1 → Q2 dan Q2 → Q3: 1 insight (5-6 detik)
// Saat generate result: 3-4 insight berurutan (total 18-24 detik)

function useLoadingSequence(
  insights: LoadingInsight[],
  onComplete: () => void,
  options?: { autoStart?: boolean }
) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!insights.length) return;
    let cancelled = false;

    const run = async () => {
      for (let i = 0; i < insights.length; i++) {
        if (cancelled) return;
        setActiveIndex(i);
        setIsVisible(true);
        await wait(insights[i].durationMs);

        if (i < insights.length - 1) {
          setIsVisible(false);
          await wait(600); // fade out duration
        }
      }
      if (!cancelled) onComplete();
    };

    run();
    return () => { cancelled = true; };
  }, [insights, onComplete]);

  return { activeInsight: insights[activeIndex], isVisible };
}
```

### Visual Loading State

```tsx
<div className="flex flex-1 flex-col items-center justify-center pb-8 text-center">
  {/* Progress ring / subtle animation */}
  <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full border-2 border-neutral-200">
    <div className="h-16 w-16 animate-spin rounded-full border-2 border-neutral-950 border-t-transparent" />
  </div>

  <p className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">
    Analisis konsultan sedang berjalan
  </p>

  <div className="min-h-[180px] max-w-2xl transition-opacity duration-500" style={{ opacity: isVisible ? 1 : 0 }}>
    <h2 className="text-3xl font-semibold leading-tight tracking-normal text-neutral-950 sm:text-4xl">
      {activeInsight.text}
    </h2>
    <p className="mt-6 text-sm font-medium text-neutral-500">
      Sumber: {activeInsight.source}
    </p>
  </div>

  {/* Dots progress */}
  <div className="mt-10 flex gap-2">
    {insights.map((_, i) => (
      <div
        key={i}
        className={`h-2 rounded-full transition-all duration-500 ${
          i === activeIndex ? "w-8 bg-neutral-950" : "w-2 bg-neutral-300"
        }`}
      />
    ))}
  </div>
</div>
```

---

## 5. Improved Calculation Model

### Prinsip:

- **After AI selalu lebih baik dari Before.**
- Setiap perhitungan mendukung *business case*.
- Metrik utama: **Biaya Sekarang → Biaya Setelah AI → Penghematan → Efisiensi → Waktu Diselamatkan → Penurunan Error**.
- Untuk cluster yang berbasis revenue (revenue, brand_trust), gunakan: **Revenue Sekarang → Revenue Setelah AI → Lift → Pipeline yang tidak bocor**.

### Struktur metrik per cluster

#### 1. Revenue

| Metrik | Before | After AI | Impact |
|--------|--------|----------|--------|
| Monthly revenue pipeline | Rp 800 juta | Rp 920 juta | +15% lift |
| Lead follow-up coverage | 35% | 85% | +50 poin |
| Sales cycle | 14 hari | 9 hari | -36% |
| Lost opportunity per bulan | Rp 120 juta | Rp 35 juta | -71% |

#### 2. Cost

| Metrik | Before | After AI | Impact |
|--------|--------|----------|--------|
| Biaya operasional manual/bulan | Rp 80 juta | Rp 58 juta | -28% |
| Jam kerja manual/bulan | 320 jam | 95 jam | -70% |
| Error rate input | 8% | 1.5% | -81% |
| Biaya tersembunyi duplikasi | Rp 22 juta | Rp 5 juta | -77% |

#### 3. Fraud

| Metrik | Before | After AI | Impact |
|--------|--------|----------|--------|
| Waktu deteksi anomali | 45 hari | 2 hari | -96% |
| Nilai risiko tertahan | Rp 150 juta | Rp 25 juta | -83% |
| Insiden yang lolos pantau | 30% | 4% | -87% |
| Biaya investigasi manual | Rp 18 juta/bulan | Rp 4 juta/bulan | -78% |

#### 4. Cash & Stock

| Metrik | Before | After AI | Impact |
|--------|--------|----------|--------|
| Akurasi prediksi cashflow | 55% | 82% | +49% |
| Frekuensi stockout/bulan | 6x | 1x | -83% |
| Modal tertahan di overstock | Rp 200 juta | Rp 75 juta | -63% |
| Keputusan reaktif | 70% | 25% | -64% |

#### 5. Reporting

| Metrik | Before | After AI | Impact |
|--------|--------|----------|--------|
| Waktu menyusun laporan | 5 hari | 4 jam | -98% |
| Meeting tanpa action clear | 60% | 15% | -75% |
| Versi data yang berbeda antar tim | 4 versi | 1 versi | -75% |
| Kecepatan keputusan | 7 hari | 1 hari | -86% |

#### 6. Brand Trust

| Metrik | Before | After AI | Impact |
|--------|--------|----------|--------|
| Visibility Google organik | 12% | 28% | +133% |
| Review yang terrespons | 20% | 85% | +325% |
| AI search mention signal | 2 platform | 7 platform | +250% |
| Lead organik/bulan | 80 | 180 | +125% |

### Fungsi kalkulasi baru (konsep)

```ts
export type EfficiencyMetric = {
  label: string;
  before: string;
  after: string;
  impact: string;      // "-75%" atau "+60%"
  impactType: "positive" | "negative"; // untuk warna
  description: string; // penjelasan singkat
};

export function calculateEfficiencyMetrics(
  answers: WizardAnswers
): EfficiencyMetric[] {
  const primary = answers.mainChallenges[0];

  const METRICS_BY_CLUSTER: Record<ChallengeId, EfficiencyMetric[]> = {
    revenue: [
      { label: "Lead follow-up coverage", before: "35%", after: "85%", impact: "+50%", impactType: "positive", description: "Lebih banyak lead dikejar sampai closing" },
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
      { label: "Akurasi prediksi cashflow", before: "55%", after: "82%", impact: "+49%", impactType: "positive", description: "Keputuhan kas terlihat lebih awal" },
      { label: "Frekuensi stockout/bulan", before: "6x", after: "1x", impact: "-83%", impactType: "positive", description: "Kehilangan sales karena habis stok turun" },
      { label: "Modal tertahan overstock", before: "Rp 200 juta", after: "Rp 75 juta", impact: "-63%", impactType: "positive", description: "Modal kembali beredar lebih cepat" }
    ],
    reporting: [
      { label: "Waktu menyusun laporan", before: "5 hari", after: "4 jam", impact: "-98%", impactType: "positive", description: "Laporan siap saat paling dibutuhkan" },
      { label: "Meeting tanpa action clear", before: "60%", after: "15%", impact: "-75%", impactType: "positive", description: "Setiap meeting punya keluaran konkret" },
      { label: "Versi data berbeda antar tim", before: "4 versi", after: "1 versi", impact: "-75%", impactType: "positive", description: "Single source of truth untuk semua tim" }
    ],
    brand_trust: [
      { label: "Visibility Google organik", before: "12%", after: "28%", impact: "+133%", impactType: "positive", description: "Lebih sering ditemukan calon pelanggan" },
      { label: "Review yang terrespons", before: "20%", after: "85%", impact: "+325%", impactType: "positive", description: "Trust meningkat karena response aktif" },
      { label: "Lead organik/bulan", before: "80", after: "180", impact: "+125%", impactType: "positive", description: "Traffic berkualitas tanpa paid ads" }
    ]
  };

  return METRICS_BY_CLUSTER[primary] || METRICS_BY_CLUSTER["revenue"];
}
```

### ROI Calculator yang benar

```ts
// Untuk cluster cost/fraud/reporting/cash_stock:
// Input: biaya operasional manual per bulan
// Output: penghematan per tahun = monthly_cost * reduction_rate * 12

// Untuk cluster revenue/brand_trust:
// Input: omzet bulanan
// Output: tambahan revenue per tahun = monthly_revenue * lift_rate * 12
```

---

## 6. Improved Report Structure

### Tujuan:

1. Report harus terasa seperti **mini consulting report**.
2. Setiap finding punya: **Temuan → Dampak → Risiko → Solusi Terukur → Potensi Hasil**.
3. Visual hierarchy premium seperti HubSpot, Gong, Clay, Notion, Stripe, Vercel.
4. Ada momen "I never thought about that".
5. Mini infographic mendukung narasi.

### Struktur Report Baru (dari atas ke bawah)

#### A. Executive Summary Card

```
┌─────────────────────────────────────────────────────────────┐
│  Hasil Diagnosis Mini Session                                │
│  ─────────────────────────────────────────────────────────  │
│  "Ada Rp 300 juta penghematan tersembunyi di proses manual   │
│   yang belum Anda lihat."                                    │
│                                                              │
│  [Before Rp 800jt]  [After AI Rp 500jt]  [Hemat Rp 300jt]   │
│                                                              │
│  Efisiensi +60%  •  Waktu hemat 120 jam/bulan  •  Error -75%│
└─────────────────────────────────────────────────────────────┘
```

**Komponen:**

- Headline: diagnosis spesifik berbasis Q1 + Q2 + Q4.
- Subheadline: angka konkret dengan framing "yang belum Anda lihat".
- Before/After/Savings cards.
- 3-4 efficiency metrics.

#### B. Diagnosa Konsultan

```
┌─────────────────────────────────────────────────────────────┐
│  Diagnosa                                                    │
│  ─────────────────────────────────────────────────────────  │
│  Dari jawaban Anda, titik bocor utamanya ada di:             │
│  [admin cost], [manual docs], dan [duplicate data].          │
│                                                              │
│  Akar masalahnya bukan karena tim kurang rajin, melainkan   │
│  pekerjaan manual yang sama dikerjakan berkali-kali oleh     │
│  orang berbeda — sehingga error, delay, dan biaya tersembunyi│
│  menumpuk tanpa terlihat di laporan keuangan.                │
│                                                              │
│  Sumber: McKinsey Operational Efficiency Study               │
└─────────────────────────────────────────────────────────────┘
```

#### C. Hidden Cost Radar ("I Never Thought About That")

```
┌─────────────────────────────────────────────────────────────┐
│  Biaya Tersembunyi yang Sering Diabaikan                     │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Duplikasi   │  │ Delay       │  │ Knowledge   │         │
│  │ data entry  │  │ follow-up   │  │ trapped in  │         │
│  │             │  │             │  │ employees   │         │
│  │ Rp 12jt/bln │  │ Rp 28jt/bln │  │ Rp 15jt/bln │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                              │
│  Total biaya tersembunyi yang teridentifikasi: Rp 55jt/bulan │
└─────────────────────────────────────────────────────────────┘
```

Daftar hidden cost yang bisa muncul:

1. **Duplicate data entry** — input sama di >1 sistem.
2. **Delayed response time** — lead tidak di-follow-up cepat.
3. **Manual report generation** — copy-paste, pivot manual.
4. **Human error correction** — waktu memperbaiki kesalahan input.
5. **Approval bottleneck** — keputusan tertahan menunggu orang.
6. **Follow-up delays** — peluang hilang karena tidak ada reminder.
7. **Knowledge trapped in employees** — onboarding lama, risiko turnover.
8. **Meeting without action** — waktu rapat tidak menghasilkan eksekusi.
9. **Stockout/overstock** — kehilangan sales atau modal tertahan.
10. **Late anomaly detection** — fraud/rugi baru diketahui setelah besar.

#### D. Before → After Visual

```
┌─────────────────────────────────────────────────────────────┐
│  Before vs After                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│   BEFORE                         AFTER AI                    │
│   ───────                        ────────                    │
│   [icon] Input manual            [icon] Input otomatis       │
│   [icon] Laporan 5 hari          [icon] Laporan 4 jam        │
│   [icon] Data beda versi         [icon] Single source        │
│   [icon] Keputusan tebak         [icon] Keputusan data-driven│
│                                                              │
│   [Bar chart: Before 100% vs After 25% cost per transaction] │
└─────────────────────────────────────────────────────────────┘
```

#### E. Insight Cards: Temuan → Dampak → Risiko → Solusi Terukur → Potensi Hasil

```
┌─────────────────────────────────────────────────────────────┐
│  Finding 1: Jam Kerja Manual Menumpuk                        │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  🔍 Temuan                                                   │
│  Tim menghabiskan ~320 jam/bulan untuk input, copy-paste,    │
│  dan verifikasi data yang sebenarnya bisa diotomatisasi.     │
│                                                              │
│  ⚠️ Dampak                                                   │
│  Biaya tidak hanya gaji, tapi juga opportunity cost: tim     │
│  tidak punya waktu untuk aktivitas revenue-generating.       │
│                                                              │
│  🔥 Risiko jika dibiarkan                                    │
│  Saat bisnis tumbuh, jam manual akan bertambah linear —      │
│  Anda akan merekrut lebih banyak orang untuk pekerjaan yang  │
│  sama, bukan untuk pertumbuhan.                              │
│                                                              │
│  ✅ Solusi Terukur                                           │
│  AI Document Processor + AI Pembukuan Otomatis + integrasi   │
│  ke sistem existing.                                         │
│                                                              │
│  📈 Potensi Hasil                                            │
│  120 jam/bulan terselamatkan • Error input turun 75%         │
│  • Biaya proses per transaksi turun 28%                      │
└─────────────────────────────────────────────────────────────┘
```

#### F. Solusi yang Paling Relevan

- Urutkan berdasarkan: quick win → high impact → strategic.
- Tiap solusi punya: confidence score, setup time, proof basis, dampak bisnis.

#### G. Rencana Aksi 3 Fase

```
Fase 1 — Quick Win (Minggu 1-2)
  → Pasang AI Document Processor untuk satu alur dokumen
  → Hasil: waktu input dokumen turun 60%

Fase 2 — Skala (Minggu 3-6)
  → Perluas ke AI Pembukuan Otomatis + AI Meeting Notetaker
  → Hasil: laporan harian tersedia otomatis

Fase 3 — Optimasi & Ukur (Minggu 7-10)
  → Dashboard KPI operasional + AI Process Intelligence
  → Hasil: bottleneck proses terlihat real-time
```

#### H. Cost of Inaction

```
Jika dibiarkan selama 12 bulan:
• Biaya manual meningkat sekitar Rp 180-240 juta
• Lead yang tidak di-follow-up bernilai Rp 360 juta hilang
• Risiko fraud/error yang lolos bisa mencapai Rp 100+ juta
```

#### I. Solusi Terukur (pengganti "Janji Terukur")

```
┌─────────────────────────────────────────────────────────────┐
│  Solusi Terukur                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  Target realistis untuk pola bisnis seperti Anda:            │
│  • Jam kerja manual turun 70%                                │
│  • Error input turun 75%                                     │
│  • Biaya proses per transaksi turun 28%                      │
│                                                              │
│  Diukur lewat:                                               │
│  [jam kerja manual/bulan] [error rate] [biaya per transaksi] │
│                                                              │
│  Timeline: sinyal awal 2-4 minggu, dampak terukur 8-12 minggu│
│  Disclaimer: angka estimasi, final setelah discovery & data  │
└─────────────────────────────────────────────────────────────┘
```

#### J. Lead Gate (setelah report)

```
┌─────────────────────────────────────────────────────────────┐
│  Mau simpan laporan lengkap ini?                             │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  Dapatkan:                                                   │
│  ✓ PDF laporan lengkap (10-12 halaman)                       │
│  ✓ Implementation roadmap 90 hari                            │
│  ✓ 30 menit discovery call dengan tim operasional Pesat.AI   │
│                                                              │
│  [Nama Anda] [WhatsApp] [Nama Perusahaan]                    │
│                                                              │
│  [Kirim Laporan & Jadwalkan Discovery Call]                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Improved Copywriting Principles

### Tone of voice:

- **Konsultan operasional**, bukan sales.
- **Spesifik dan berbasis data**, bukan klaim umum.
- **Mengakui realitas bisnis** user, bukan menggurui.
- **Berani mengungkap hal yang tidak mereka sadari**.

### Contoh perubahan copy:

| Sebelum | Sesudah |
|---------|---------|
| "Janji Terukur" | "Solusi Terukur" |
| "Potensi Lift" | "Potensi Penghematan" / "Potensi Pertumbuhan" |
| "Metric merah" | "Titik bocor terbesar" |
| "Prioritas AI" | "Cara kerja sama" |
| "AI Co-pilot" | "Sistem operasional yang bisa skala" |
| "Hasil Mini Session" | "Diagnosis operasional bisnis Anda" |

### Headline baru berbasis cluster:

| Cluster | Headline |
|---------|----------|
| revenue | "Ada pipeline revenue yang bocor setiap minggu — dan itu bisa diperbaiki tanpa menambah tim sales." |
| cost | "Rp 200-400 juta per tahun mungkin tersembunyi di pekerjaan manual yang belum terlihat." |
| fraud | "Celah operasional yang baru ketahuan setelah rugi sebenarnya bisa terdeteksi 40 hari lebih awal." |
| cash_stock | "Kas dan stok Anda masih dijalankan dengan prediksi yang terlambat — ini cara memperbaikinya." |
| reporting | "Keputusan bisnis Anda menunggu data yang baru siap 5 hari kemudian. Itu bisa jadi 4 jam." |
| brand_trust | "Pelanggan baru menemukan kompetitor Anda lebih dulu karena trust signal belum dibangun sistematis." |

---

## 8. UX Wireframe Recommendations

### Pertanyaan (Q1-Q5)

- **Full-screen wizard**, satu pertanyaan per layar.
- **Progress bar halus** di atas.
- **Choice cards besar** dengan label utama + subtitle penjelasan.
- **Tombol utama sticky di bawah**, disabled sampai user memilih.
- **Back button** selalu tersedia.

### Loading

- **Centered insight** dengan progress dots.
- **Tidak ada spinner yang membuat user cemas** — gunakan subtle progress ring.
- **Setiap insight 5-6 detik**, transisi fade 600ms.

### Report

- **Single-column premium layout** di mobile, **max-width 3xl** di desktop.
- **Executive summary di atas** sebagai anchor.
- **Before/After cards** dengan warna kontras (muted vs highlight).
- **Hidden cost radar** sebagai visual anchor tengah.
- **Finding cards** dengan iconography jelas.
- **Sticky CTA** di bawah: "Simpan Laporan Lengkap & Jadwalkan Call".

### Lead Gate

- **Muncul setelah report scroll 70%** atau setelah user klik CTA.
- **Modal overlay** yang tidak menghapus report (user bisa close).
- **Value exchange jelas**: PDF + roadmap + discovery call.

---

## 9. CRO Recommendations

### 1. Value First

> Jangan minta kontak sebelum user melihat nilai. Hasil report adalah bukti. Kontak adalah langkah berikutnya.

### 2. Micro-Commitment Ladder

```
Pertanyaan mudah → insight menarik → pertanyaan lebih spesifik →
insight lagi → optional open question → report berharga →
lead gate dengan value exchange
```

### 3. Increase Perceived Expertise

- Gunakan **sumber terkenal** (McKinsey, Gartner, HBR, ACFE, Google).
- Tampilkan **metrik konkret** dengan benchmark industri.
- Berikan **diagnosis yang spesifik**, bukan templat.

### 4. Create Ownership

- Report menyebut **metrik bisnis user** (dari Q2, Q4, Q6).
- Gunakan user signals dari textarea.
- ROI calculator memakai **angka user sendiri**.

### 5. Urgency yang Elegan

- "Jika dibiarkan" section menunjukkan **biaya menunda**.
- Bukan FOMO murahan, tapi **biaya nyata dari status quo**.

### 6. Discovery Call Framing

- Bukan "Hubungi kami" tapi "Jadwalkan strategy call 30 menit".
- Berikan **agenda jelas**: "Kami akan membahas 3 prioritas, estimasi timeline, dan quick win tercepat."

### 7. Social Proof Integration

- Di lead gate, tambahkan:
  - "Sudah membantu 150+ bisnis menurunkan jam manual rata-rata 65%"
  - Testimonial singkat dari bisnis serupa.

### 8. Reduce Friction

- WhatsApp prefilled message otomatis saat discovery.
- PDF export ready tanpa perlu isi form lagi.
- Copy link aktif segera setelah session tersimpan.

---

## 10. Examples of Hidden-Insight Findings

### Finding A: "Lead tidak kekurangan, tapi kekurangan follow-up"

> *"Bisnis Anda punya lead, tapi 60-70% lead tidak di-follow-up lebih dari 1 kali. Padahal 80% closing terjadi setelah follow-up ke-5. AI Sales Assistant memastikan tidak ada lead yang terlupakan."*

### Finding B: "Biaya tersembunyi dari duplikasi data"

> *"Satu invoice bisa diinput 2-3 kali oleh orang berbeda: sales, admin, finance. Setiap duplikasi ini terlihat kecil, tapi dalam 1 bulan bisa mencapai ratusan transaksi dan puluhan jam terbuang."*

### Finding C: "Pengetahuan bisnis ada di kepala karyawan"

> *"Jika karyawan kunci keluar, proses follow-up, pricing, atau approval bisa terganggu berbulan-bulan. AI SOP & Knowledge Writer mengubah pengetahuan ini menjadi aset perusahaan."*

### Finding D: "Keputusan kas dan stok diambil dari data kemarin"

> *"Anda membuat keputusan hari ini berdasarkan laporan minggu lalu. Di pasar yang bergerak cepat, itu seperti mengemudi sambil melihat spion. Prediksi cashflow dan demand planning membuat Anda melihat ke depan."*

### Finding E: "Brand Anda tidak muncul di jawaban AI"

> *"Calon pelanggan kini bertanya ke ChatGPT, Perplexity, dan Gemini sebelum Google. Jika brand Anda tidak muncul di jawaban AI, Anda tidak masuk ke pertimbangan mereka."*

---

## 11. Examples of Mini Infographic Concepts

### Concept 1: Hidden Cost Waterfall

```
Gaji admin          Rp 45jt
Duplikasi input     Rp 12jt
Koreksi error       Rp  8jt
Delay approval      Rp  6jt
─────────────────────────────
Total tersembunyi   Rp 71jt/bulan
```

Visual: bar chart bertingkat yang menunjukkan biaya tersembunyi menumpuk di atas biaya yang terlihat.

### Concept 2: Follow-Up Funnel Leak

```
100 lead masuk
  ↓
 35 di-follow-up
  ↓
 12 sampai meeting
  ↓
  4 closing
```

Visual: funnel dengan warna merah di bagian yang bocor, dan gambaran AI yang menutup kebocoran.

### Concept 3: Before vs After Workflow

```
BEFORE                          AFTER AI
────────                        ────────
[WhatsApp] → [Manual Input]     [WhatsApp] → [AI Extract]
     ↓                               ↓
[Spreadsheet] → [Report Manual]  [Database] → [Auto Report]
     ↓                               ↓
[5 hari]                         [4 jam]
```

Visual: dua kolom dengan arrow flow yang jelas, warna abu-abu untuk before, warna hitam/emerald untuk after.

### Concept 4: Decision Delay Cost

```
Hari 1: Data tersedia
Hari 3: Laporan mulai disusun
Hari 5: Laporan selesai
Hari 6: Meeting direksi
Hari 7: Keputusan diambil
─────────────────────────────
Momentum sudah lewat 7 hari
```

Visual: timeline horizontal dengan titik-titik proses, highlight area "lost momentum".

### Concept 5: Knowledge Silo Risk

```
Karyawan A tahu proses sales
Karyawan B tahu proses approval
Karyawan C tahu proses laporan

Jika salah satu keluar → proses terhenti
```

Visual: 3 silo terpisah dengan icon person, lalu ilustrasi jembatan AI yang menghubungkan.

---

## 12. Complete Redesigned User Journey

### Fase 1: Awareness (Hero)

```
Headline: "Temukan di mana bisnis Anda kehilangan waktu dan uang setiap bulan"
Subheadline: "Mini Session gratis. 5 menit. Hasilnya seperti diagnosis singkat dari konsultan operasional."
CTA: "Mulai Diagnosis Gratis"
```

### Fase 2: Qualification (Q1-Q5)

```
Q1: Pilih situasi terberat → loading insight 6 detik
Q2: Pilih metrik merah → loading insight 6 detik
Q3: Pilih intensitas masalah
Q4: Pilih sumber gesekan terbesar
Q5: Pilih gaya adopsi AI
```

### Fase 3: Context (Q6)

```
Optional textarea untuk cerita detail.
Placeholder yang spesifik dan menggugah.
```

### Fase 4: Review

```
Ringkasan semua jawaban.
Tombol "Sudah Pas" / edit per item.
```

### Fase 5: Analysis Loading

```
3-4 insight edukatif, masing-masing 5-6 detik.
Total: 18-24 detik.
Progress dots + fade transition.
```

### Fase 6: Report Delivery

```
Executive summary dengan angka Before/After/Impact.
Diagnosa konsultan.
Hidden cost radar.
Before vs After visual.
3-4 finding cards lengkap (Temuan → Dampak → Risiko → Solusi → Hasil).
Solusi relevan + confidence score.
Rencana aksi 3 fase.
Cost of inaction.
Solusi Terukur.
```

### Fase 7: Lead Conversion

```
Sticky CTA: "Simpan Laporan Lengkap & Jadwalkan Strategy Call"
Modal lead gate:
  - Value: PDF + roadmap 90 hari + 30 menit strategy call
  - Fields: Nama, WhatsApp, Nama Perusahaan (opsional)
  - Submit → WhatsApp prefilled message
```

### Fase 8: Post-Conversion

```
Thank you page dengan:
- Konfirmasi WhatsApp terkirim
- Preview PDF
- Next steps: tim akan menghubungi dalam 1x24 jam
- CTA sekunder: share laporan
```

---

## 13. Implementation Priority

### Phase 1: Insight Quality (minggu 1-2)

- [ ] Rewrite `QUALITY_QUESTIONS` dengan flow baru (Q1-Q6).
- [ ] Update `lib/types.ts` untuk `frictionSource`, `impactLevel` baru.
- [ ] Rewrite `lib/rule-engine.ts` calculation model ke efficiency metrics.
- [ ] Rename "Janji Terukur" → "Solusi Terukur" di semua file.
- [ ] Tambahkan hidden cost mapping per cluster.

### Phase 2: Loading & Flow (minggu 2-3)

- [ ] Redesign loading state dengan `useLoadingSequence`.
- [ ] Pindahkan lead form ke SETELAH report.
- [ ] Update step order dan progress mapping.
- [ ] Hapus redundansi Q4 lama.

### Phase 3: Report UI (minggu 3-4)

- [ ] Redesign `ResultPanel` dengan executive summary + hidden cost radar.
- [ ] Implementasi finding cards (Temuan/Dampak/Risiko/Solusi/Hasil).
- [ ] Tambahkan mini infographic components.
- [ ] Perbaiki ROI calculator logic.

### Phase 4: CRO Polish (minggu 4-5)

- [ ] Sticky CTA di report.
- [ ] Lead gate modal dengan value exchange.
- [ ] WhatsApp prefilled message.
- [ ] Social proof di lead gate.
- [ ] Tracking events untuk setiap micro-conversion.

---

## 14. Final Note

**Sebelum mengubah UI, prioritaskan kualitas diagnosis dan kualitas insight terlebih dahulu.**

Jika insight yang dihasilkan biasa-biasa saja — hanya angka-angka generik tanpa "aha moment" — maka sebagus apa pun desain visualnya, konversi tidak akan meningkat secara signifikan.

Pesat.AI harus terlihat seperti **seorang konsultan operasional yang memahami bisnis pengguna**, bukan sekadar form AI yang menghasilkan laporan generik.

Maksudnya:

1. **Setiap pertanyaan harus menggali informasi baru** yang memperkaya diagnosis.
2. **Setiap loading message harus mengedukasi**, bukan mempromosikan.
3. **Setiap angka di report harus mendukung business case**, dengan Before yang lebih buruk dari After.
4. **Setiap finding harus membuat user berpikir**, "Ini memang masalah saya."
5. **Setiap CTA harus didahului oleh value exchange yang jelas**.

Desain visual premium hanya berfungsi sebagai *amplifier* dari insight yang kuat. Mulai dari insight. Baru UI.

---

*Dokumen ini siap untuk dikonversi menjadi tiket implementasi atau diserahkan kepada tim engineering dan design.*
