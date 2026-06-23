# Pesat.AI — Cold Start Guide

Panduan cepat untuk menjalankan, mengembangkan, dan deploy project Pesat.AI.

---

## 1. Project Overview

Pesat.AI adalah landing page + Mini Session diagnostic tool untuk **B2B AI solutions**.

- **Framework:** Next.js 16 (App Router)
- **Deployment target:** Cloudflare Workers via OpenNext
- **Database:** Neon Postgres / Supabase (session, events, discovery requests)
- **AI copy generation:** OpenAI Responses API (with deterministic fallback)
- **Styling:** Tailwind CSS

---

## 2. Prerequisites

- Node.js 22+
- npm
- Git
- Cloudflare account dengan worker `pesat-ai-homepage`
- Supabase/Neon project (untuk database)
- OpenAI API key (opsional, fallback aktif jika tidak ada)

---

## 3. Environment Setup

Copy file env template:

```bash
cp .env.example .env.local
```

Isi variabel berikut di `.env.local`:

```env
# Database
DATABASE_URL=postgres://... (Neon connection string)

# Supabase (jika pakai Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://....supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# OpenAI (opsional)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1

# Admin
ADMIN_PASSWORD=password_kuat_anda

# Site
NEXT_PUBLIC_SITE_URL=https://pesat.ai
```

Untuk production, isi juga `.env.production` jika dibutuhkan.

---

## 4. Install Dependencies

```bash
npm install
```

> Pastikan tidak menggunakan `--no-optional` karena `workerd` membutuhkan optional dependency native binary.

---

## 5. Run Locally

```bash
npm run dev
```

Buka http://localhost:3000

---

## 6. Build & Test

### Next.js build (lokal)

```bash
npm run build
```

### OpenNext build (sama seperti CI)

```bash
npx opennextjs-cloudflare build
```

> OpenNext deploy hanya bisa dijalankan di Linux/macOS atau WSL karena butuh native binary `workerd`. Di Windows native, deploy akan gagal dengan error `@cloudflare/workerd-windows-64` not found.

### Quality gate (wajib lolos sebelum deploy)

```bash
npm run check:quality
```

Menjalankan:
- Unit tests (rule engine, validation, solutions, normalizer, dll)
- Audit requirements
- ESLint
- TypeScript typecheck

---

## 7. Deploy

### Via GitHub Actions (recommended)

Push ke branch `main` akan otomatis trigger workflow deploy:

```bash
git push origin main
```

Workflow berada di `.github/workflows/deploy.yml`.

**Required GitHub secrets:**
- `CLOUDFLARE_API_TOKEN` — Edit Cloudflare Workers permission
- `CLOUDFLARE_ACCOUNT_ID`
- `DATABASE_URL`
- `OPENAI_API_KEY`
- `ADMIN_PASSWORD`

### Manual deploy (Linux/WSL only)

```bash
export CLOUDFLARE_API_TOKEN="..."
export CLOUDFLARE_ACCOUNT_ID="..."
npm run deploy
```

---

## 8. Database Migrations

Project menggunakan Supabase migrations. File migration ada di `supabase/migrations/`.

Untuk menerapkan migrasi:

```bash
# Via PowerShell helper (Windows)
./scripts/apply-supabase-migration.ps1

# Atau manual via Supabase CLI
supabase db push
```

**Migrasi penting terbaru:**
- `20260612000000_update_event_screens.sql` — update event screen constraint untuk Mini Session flow baru (q1-q6, review, loading, result, leadGate, coach).
- `20260615000000_discovery_fields.sql` — menambahkan kolom `employee_count` dan `yearly_revenue` di tabel `discovery_requests`.

---

## 9. Mini Session Flow — AI Business Coach (Diagnostic Conversation)

Flow adalah **diagnostic conversation** — bukan chatbot form, bukan pula wizard. Mental model intinya:

> **AI berhipotesis → user mengoreksi/mengonfirmasi → AI makin tajam → insight muncul real-time → report terasa sebagai hasil coaching.**

Perbedaan kunci vs form biasa: user tidak merasa **mengisi**, user merasa **dibaca**. Tiga mekanisme yang menghasilkan rasa itu:

1. **AI selalu bertanya dalam format observasi → dugaan → konfirmasi** (bukan tanya langsung kosong).
2. **AI memberi `reaction` setelah setiap jawaban** — momen *"iya juga ya"* yang muncul SEBELUM pertanyaan berikutnya. Tiap pilihan punya reaksi berbeda.
3. **Insight terakumulasi di panel persistent** (`InsightAccumulator`) — slot terisi satu per satu sepanjang sesi, tidak scroll lewat. User merasa *"sistem sedang memproses saya"*.

```
Hero → CoachContainer (chat)
  → welcome        (AI buka dengan "koreksi kalau saya meleset")
  → pressure-reading  → reaction → insight #1 terisi
  → root-cause        → reaction → insight #2 terisi
  → bottleneck-test   → reaction → insight #3 terisi
  → solution-direction (rangkuman dinamis dari jawaban user) → reaction → insight #4 terisi
  → inline mini report
  → conversational lead gate
  → WhatsApp discovery URL
```

### Prinsip UX

- **Bahasa pemilik bisnis**, tanpa jargon teknikal.
- **Tidak ada kata “konsultan / konsultasi”** di product copy; selalu diarahkan ke **solusi** / **AI Business Coach**.
- **Auto-advance**: setelah user pilih opsi multiple choice, coach langsung lanjut tanpa tombol **Lanjut**.
- Tombol **Lanjut** hanya muncul saat user memilih **“Lainnya”** (membutuhkan isian teks bebas).
- **“Lainnya” + free-text** tersedia di setiap ronde pilihan (`pressure-reading`, `root-cause`, `bottleneck-test`, `solution-direction`).
- **AI reaction per pilihan**: setiap `QuickReply` membawa `reaction` (bot message) yang diputar setelah user memilih — bukan generic, tapi spesifik untuk pilihan itu. Inilah yang membuat coach terasa benar-benar "membaca" user.
- **Insight accumulator persistent**: 4 slot (Titik tekanan / Akar masalah / Bottleneck / Arah solusi) terisi bertahap, tetap terlihat di viewport. Saat semua terisi → label berubah jadi "Pola terbaca 100%". Badge "baru" muncul via CSS animation saat slot pertama kali terisi.
- **Rangkuman dinamis (Round 4)**: `solution-direction` punya `dynamicMessages` yang merakit rangkuman dari state — *"Tekanan utamanya bukan di permintaan, tapi di biaya operasional berulang, akarnya di keputusan menumpuk di owner..."*. Momen "wow" coach membaca.
- **Status label** dibingkai sebagai proses diagnosis: "Memulai sesi diagnostik", "Mengenali tekanan bisnis", "Mempersempit akar masalah", "Menguji titik macet", "Menyusun arah solusi" — bukan "3 dari 6".
- Kontak (nama perusahaan, nama, WA, jumlah karyawan, omzet per tahun) diminta **SETELAH** value diberikan, satu per satu, di conversational lead gate.
- **Widget desktop**: panel melayang di pojok kanan atas dengan tombol minimize/dock. Klik minimize akan menyusut menjadi floating pill di pojok kanan bawah.
- **Focus trap & accessibility**: tombol `Tab` terjebak di dalam widget, `Escape` minimize, input auto-focus saat lead gate / free-text.
- **Tracking**: semua interaksi coach dikirim sebagai event dengan screen `coach`.

### Ronde diagnosis

Setiap ronde memakai format **observasi → dugaan → konfirmasi**. AI bertanya dengan hipotesis, bukan pertanyaan kosong.

| Ronde | Observasi/dugaan AI | Pilihan user (human phrasing) |
|------|---------------------|-------------------------------|
| welcome | "Nanti Anda tinggal koreksi kalau saya meleset — saya mulai dari mengenali tekanan bisnis" | **Mulai diagnosa** |
| pressure-reading | "Bisnis biasanya tidak goyah karena satu keputusan besar. Tekanannya datang dari kebocoran kecil yang numpuk diam-diam." | "Uang keluar terus, tapi saya nggak merasa lebih ringan" / "Tim sibuk, hasilnya segitu-gitu aja" / "Kalau saya lepas, saya takut ada yang miss" / "Masalah sering baru keliatan setelah telat" / Lainnya |
| root-cause | "Akar masalahnya bukan satu hal besar — tapi salah satu dari pola berikut" | "Kerja kecil berulang" / "Keputusan naik terus ke saya" / "Masalah telat keliatan" / "Campuran semuanya" / Lainnya |
| bottleneck-test | "Waktu hal-hal kecil macet, biasanya berhenti di mana?" | "Input & cek ulang manual" / "Nunggu keputusan saya" / "Data tercecer" / "Cuma 1–2 orang tahu caranya" / Lainnya |
| solution-direction | **Rangkuman dinamis** dari jawaban + "Anda nggak butuh sistem besar dulu" | "Quick win dulu" / "Yang lebih agresif" / "Pilot kecil dulu" / Lainnya |
| report | "Oke, saya sudah cukup paham polanya" | Inline mini report 4 kartu |
| lead gate | "Saya butuh beberapa data singkat" | companyName → name → WA → employeeCount → yearlyRevenue |
| done | — | WhatsApp URL ke tim Pesat.AI |

### AI reaction (momen "iya juga ya")

Setelah setiap pilihan user, AI memutar `reaction` spesifik **sebelum** lanjut ke pertanyaan berikutnya. Contoh:

- User pilih 👤 "Kalau saya lepas, saya takut ada yang miss" → AI: *"Kena. Berarti bisnis masih bergantung ke keterlibatan Anda. Itu biasanya sinyal keputusan kecil belum punya sistem..."*
- User pilih 🚧 "Keputusan naik terus ke saya" → AI: *"Kena. Kalau keputusan kecil terus berhenti di Anda, biaya termahal sebenarnya bukan gaji — tapi lambatnya seluruh alur bisnis."*

Timing: jeda 300ms setelah bubble user → reaction diputar → jeda 500ms → pertanyaan next (supaya reaksi sempat "berdenting").

### Personalisasi AI

- Semua jawaban **“Lainnya”** di-append ke array `freeTextNotes` di `DiagnosticState`, lalu digabung menjadi `detailNote` saat generate hasil.
- Sistem mengambil recent Other answers dari database dan menginjeksi ke prompt LLM agar copy result terasa lebih relevan (real-time “fine-tuning”).
- State diagnosis di-map ke `WizardAnswers` lewat `lib/diagnostic-state.ts#toWizardAnswers`, sehingga rule engine dan LLM prompt tidak perlu diubah.

---

## 10. Key Files & Architecture

| File | Tanggung jawab |
|------|----------------|
| `components/PesatExperience.tsx` | Entry point landing + memunculkan `CoachContainer` |
| `components/coach/CoachContainer.tsx` | Container chatbot coach (header, status, messages, input, lead gate) |
| `components/coach/useCoachSequence.ts` | Orchestrasi pesan, reply, **reaction**, akumulasi insight, & transisi node |
| `components/coach/useFocusTrap.ts` | Focus trap & Escape-to-minimize |
| `components/coach/QuickReplyGrid.tsx` | Grid pilihan quick reply |
| `components/coach/ChatInput.tsx` | Input teks dengan tombol kirim / Lanjut |
| `components/coach/CoachMessage.tsx` | Bubble pesan coach dengan typewriter |
| `components/coach/UserMessage.tsx` | Bubble pesan user |
| `components/coach/InsightAccumulator.tsx` | Panel persistent 4-slot insight (terisi bertahap, badge "baru" via CSS animation) |
| `components/coach/AnalysisStatus.tsx` | Status label di atas chat |
| `components/coach/MiniReport.tsx` | Inline 4-card coaching report |
| `components/coach/StickyConversionBar.tsx` | CTA “Bahas Temuan Ini 20 Menit” |
| `components/ResultView.tsx` | Halaman hasil shareable |
| `components/ImpactComparisonChart.tsx` | Chart Before/After yang readable |
| `lib/diagnostic-flow.ts` | Script percakapan coach: node, pesan, quick replies, **reaction**, **insightSlot**, **dynamicMessages** |
| `lib/diagnostic-state.ts` | State diagnosis + mapper ke `WizardAnswers` |
| `lib/solutions.ts` | Katalog solusi, pertanyaan, loading insights, follow-ups |
| `lib/rule-engine.ts` | Logika seleksi solusi, impact metrics, findings |
| `lib/types.ts` | TypeScript types |
| `lib/validation.ts` | Sanitasi & validasi input, event screen whitelist |
| `lib/openai-result.ts` | LLM copy generation dengan fallback |
| `lib/db.ts` | Database client + helper recent Other examples |
| `app/api/result/route.ts` | Generate & persist result |
| `app/api/session/route.ts` | Persist session answers & contact |
| `app/api/discovery/route.ts` | Handle discovery request |

---

## 11. Testing

```bash
# Run all unit tests
npm run test:admin-summary
npm run test:rule-engine
npm run test:result-normalizer
npm run test:solutions
npm run test:supabase-schema
npm run test:transition-facts
npm run test:validation

# Run full quality gate
npm run check:quality
```

---

## 12. Common Issues

### `workerd-windows-64` not found

**Cause:** Deploy via `opennextjs-cloudflare` tidak support Windows native.
**Fix:** Jalankan deploy di GitHub Actions (Linux) atau WSL.

### Deploy Worker gagal dengan `Invalid access token [code: 9109]`

**Cause:** `CLOUDFLARE_API_TOKEN` di GitHub secrets invalid/expired.
**Fix:** Regenerate token di Cloudflare dengan permission Edit Cloudflare Workers, lalu update GitHub secret.

### Push gagal dengan `User cancelled dialog`

**Cause:** Git Credential Manager meminta dialog autentikasi.
**Fix:** Push dari environment yang sudah authenticated, atau gunakan HTTPS dengan PAT valid.

---

## 13. Useful Commands

```bash
# Check domain readiness
./scripts/check-domain.ps1

# Check Cloudflare secrets
./scripts/check-cloudflare-secrets.ps1

# Smoke test local API
npm run smoke:api

# Smoke test production
npm run smoke:api:prod
npm run smoke:prod
```

---

## 14. Notes

- Jangan commit secret values ke repo.
- Custom domain `pesat.ai` attachment dilakukan via Cloudflare; untuk sementara worker juga accessible via `pesat-ai-homepage.n311311.workers.dev`.
- UI redesign memprioritaskan rasa **"sedang dipetakan, dipahami, dan diarahkan"** — bukan "mengisi kuis". Tiga pilar: observasi→dugaan→konfirmasi, AI reaction per pilihan, insight accumulator persistent.
- **Data-driven conversation**: semua copy, reaction, dan insight slot didefinisikan di `lib/diagnostic-flow.ts`. Mengubah alur percakapan = edit file ini saja, bukan komponen.
- **Insight accumulator** memakai CSS animation murni untuk badge "baru" (bukan state/effect) untuk menghindari cascading renders (lint rule `react-hooks/set-state-in-effect`).
- **DynamicMessages**: node `solution-direction` merakit rangkuman dari `DiagnosticState` lewat `rangkumanMessage()` — baca state via ref agar selalu mendapat snapshot terbaru pasca-reply.
- Plugin `tailwindcss-animate` digunakan untuk animasi quick replies/status; jangan lupa daftarkan di `tailwind.config.ts`.
- Semua copy product dijaga agar tidak mengandung kata “konsultan / konsultasi”; fokus pada **solusi** dan **hasil bisnis**.
