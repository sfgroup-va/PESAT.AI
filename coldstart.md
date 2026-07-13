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
- **LLM discovery:** `public/llms.txt` tersedia di `/llms.txt` untuk AI crawlers (lihat [LLMs.txt](#llmstxt))

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

## 12. LLMs.txt

Project menyediakan file `public/llms.txt` yang dipublikasikan di endpoint `/llms.txt`. File ini berisi ringkasan project, produk, metodologi, kontak, dan resources dalam format yang mudah dibaca oleh AI crawlers.

### URL

- Production: https://pesat.ai/llms.txt
- Worker staging: https://pesat-ai-homepage.n311311.workers.dev/llms.txt

### Cara maintain

File `public/llms.txt` adalah file statis. Untuk mengupdate:

1. Edit `public/llms.txt`.
2. Jalankan `npm run check:quality` untuk memastikan tidak ada masalah.
3. Commit dan push ke `main` — deploy otomatis akan memublikasikan versi baru.

> Tips: jangan mengubah struktur markdown secara drastis karena banyak AI parser mengandalkan heading `#`, `##`, dan list.

---

## 13. Common Issues

### `workerd-windows-64` not found

**Cause:** Deploy via `opennextjs-cloudflare` tidak support Windows native.
**Fix:** Jalankan deploy di GitHub Actions (Linux) atau WSL.

### Deploy Worker gagal dengan `Invalid access token [code: 9109]`

**Cause:** `CLOUDFLARE_API_TOKEN` di GitHub secrets invalid/expired.
**Fix:** Regenerate token di Cloudflare dengan permission Edit Cloudflare Workers, lalu update GitHub secret.

### Push gagal dengan `User cancelled dialog`

**Cause:** Git Credential Manager meminta dialog autentikasi.
**Fix:** Push dari environment yang sudah authenticated, atau gunakan HTTPS dengan PAT valid.

### Typecheck / lint error karena file backup `-Keplu`, `-Desktop-Nell`, atau `-NoiroPC`

**Cause:** File backup/machine-copy ikut masuk ke TypeScript compilation atau ESLint scan.
**Fix:** Pindahkan file-file tersebut ke folder `backups/` (sudah di-ignore) atau hapus. Pastikan `.gitignore` dan `tsconfig.json` exclude folder `backups/`.

---

## 14. Useful Commands

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

## 15. Notes

- Jangan commit secret values ke repo.
- Custom domain `pesat.ai` attachment dilakukan via Cloudflare; untuk sementara worker juga accessible via `pesat-ai-homepage.n311311.workers.dev`.
- UI redesign memprioritaskan rasa **"sedang dipetakan, dipahami, dan diarahkan"** — bukan "mengisi kuis". Tiga pilar: observasi→dugaan→konfirmasi, AI reaction per pilihan, insight accumulator persistent.
- **Data-driven conversation**: semua copy, reaction, dan insight slot didefinisikan di `lib/diagnostic-flow.ts`. Mengubah alur percakapan = edit file ini saja, bukan komponen.
- **Insight accumulator** memakai CSS animation murni untuk badge "baru" (bukan state/effect) untuk menghindari cascading renders (lint rule `react-hooks/set-state-in-effect`).
- **DynamicMessages**: node `solution-direction` merakit rangkuman dari `DiagnosticState` lewat `rangkumanMessage()` — baca state via ref agar selalu mendapat snapshot terbaru pasca-reply.
- Plugin `tailwindcss-animate` digunakan untuk animasi quick replies/status; jangan lupa daftarkan di `tailwind.config.ts`.
- Semua copy product dijaga agar tidak mengandung kata “konsultan / konsultasi”; fokus pada **solusi** dan **hasil bisnis**.

---

## 16. CMS Landing Pages

CMS untuk mengelola landing page bisnis berada di `/admin/landing` (dashboard) dan `/admin/landing/[slug]` (editor per halaman). Route `/cms` juga redirect ke `/admin/landing`.

| File | Tanggung jawab |
|------|----------------|
| `app/admin/landing/page.tsx` | Route dashboard CMS landing page |
| `app/admin/landing/[slug]/page.tsx` | Route editor untuk satu landing page |
| `app/cms/page.tsx` | Redirect `/cms` → `/admin/landing` |
| `components/LandingCmsDashboard.tsx` | Dashboard daftar landing page |
| `components/LandingEditor.tsx` | Editor konten, layout, dan CTA landing page |

### 16.1 Form submission UX

Form di landing page **tidak langsung redirect ke WhatsApp** setelah submit. Alur wajib:

1. User isi form → submit.
2. Sistem persist data (ke database / discovery request).
3. User diarahkan ke **thank-you page** internal.
4. Di thank-you page baru muncul tombol **Hubungkan ke WhatsApp** sebagai pilihan, bukan redirect paksa.

Tujuannya: user merasa datanya terekam dan akan di-follow-up oleh tim `pesat.ai`, bukan sekadar dilempar ke chat.

### 16.2 Thank-you page spec

Tampilan thank-you page mengikuti referensi dari tim Conversion:

- **Headline:** `Data Berhasil Dikirim!`
- **Subcopy:** `Terima kasih sudah mengisi data. Izinkan kami mengarahkan Anda ke WhatsApp Sales Konsultan untuk detail promo & brosur?`
- **Primary CTA:** tombol hijau dengan ikon WhatsApp — `Hubungkan ke WhatsApp`
- **Secondary action:** link teks `Nanti Saja, Kembali ke Halaman Utama`
- **Visual:** ikon / ilustrasi success (sparkle / check) di atas headline untuk memberi feedback positif.

Button WhatsApp membawa URL ke WA sales Pesat.AI dengan pesan yang sudah tersusun. Link kembali mengarahkan ke homepage (`/`).

### 16.3 Tracking

- **Tracking pixel / event tracker dipasang pada tombol `Hubungkan ke WhatsApp` di thank-you page**, bukan pada submit form awal.
- Jika CMS menyediakan field tracking (UTM, pixel ID, event name), field tersebut di-bind ke button WA agar tim Conversion bisa mengukur konversi dari thank-you page ke WhatsApp.

### 16.4 Known issues / todo

- Beberapa section landing page (misalnya *Use Case* dan *Portfolio/Hasil Nyata*) masih tampak kosong di preview; perlu diisi konten default atau validasi required field di CMS editor.
- Saat membuat landing page baru, cek setiap section sudah memiliki konten / asset sebelum publish.

---

## 17. Fix Log / Changelog

| Date | Perubahan | Status |
|------|-----------|--------|
| 2026-07-10 | Update `coldstart.md`: tambahkan section **CMS Landing Pages** — spec form submit → thank-you page, desain thank-you page, tracking di tombol WA, dan catatan section kosong | ✅ Dokumentasi updated |
| 2026-07-08 | Implementasi `public/llms.txt` untuk AI crawlers; deploy ke Cloudflare Workers via GitHub Actions | ✅ Deployed |
| 2026-07-08 | Bersihkan file backup `-Keplu` dan update `.gitignore` + `tsconfig.json` agar tidak ikut compile | ✅ Repo clean |
| 2026-07-08 | Fix lint error `react-hooks/set-state-in-effect` di `components/LandingEditor.tsx` | ✅ Quality gate lolos |

---

## 2026-07-13 21:30 — Implement deposit page + PayPal integration

- **Type:** CODING
- **Status:** COMPLETED
- **Files touched:** `app/deposit/page.tsx`, `app/deposit/thank-you/page.tsx`, `app/admin/deposit/page.tsx`, `components/DepositEditor.tsx`, `components/deposit/PayPalDepositButtons.tsx`, `lib/deposit.ts`, `lib/deposit-server.ts`, `lib/paypal.ts`, `app/api/deposit/config/route.ts`, `app/api/paypal/order/route.ts`, `app/api/paypal/capture/route.ts`, `app/api/admin/deposit/route.ts`, `app/api/admin/deposit/publish/route.ts`, `app/api/admin/deposit/transactions/route.ts`, `supabase/migrations/20260713000000_deposit_pages_and_transactions.sql`, `wrangler.jsonc`, `.env.example`, `.env.production.example`, `components/AdminDashboard.tsx`, `VERSION.md`
- **Key decisions:**
  - Mengimplementasi spesifikasi `docs/superpowers/specs/2026-07-13-deposit-page-design.md` secara penuh.
  - Default `deposit_pages.is_published` di-set `true` agar `/deposit` langsung tidak 404 setelah migrasi dan deploy.
  - PayPal Client ID publik disimpan di `wrangler.jsonc` sebagai fallback; secret `PAYPAL_SECRET` diset di `.env.local` (lokal) dan sebagai Worker secret (production).
  - Menggunakan PayPal live endpoint `https://api-m.paypal.com` dengan server-side order creation & capture.
- **Blockers:** none — deployment production memerlukan push ke main + apply migrasi DB + set Worker secret PAYPAL_SECRET.
- **Next step:** Push ke `main`, apply `supabase/migrations/20260713000000_deposit_pages_and_transactions.sql`, dan set `wrangler secret put PAYPAL_SECRET`.
- **Inspector:** PASSED
- **Backup location:** `backups/2026-07-13_000000_implement-deposit-page/`
- **coldstart.md stored at:** `D:\Ansel-OneDrive\OneDrive\PESAT AI\coldstart.md`
- **Browser used:** none

## 2026-07-10 00:00 — Update coldstart.md CMS Landing Page spec

- **Type:** WRITING
- **Status:** COMPLETED
- **Files touched:** `coldstart.md`
- **Key decisions:** Menambahkan section **CMS Landing Pages** berdasarkan screenshot feedback WA tim Conversion. Menyepakati alur form submit → thank-you page internal → tombol WA, spesifikasi copy & CTA thank-you page, serta tracking hanya di tombol WhatsApp.
- **Blockers:** none
- **Next step:** Implementasi perubahan di form handler + buat komponen thank-you page di landing/offer flow; tambahkan tracking event pada tombol WA.
- **Inspector:** PASSED
- **Backup location:** `backups/2026-07-10_000000_update-coldstart-cms/`
- **coldstart.md stored at:** `D:\Ansel-OneDrive\OneDrive\PESAT AI\coldstart.md`
- **Browser used:** none
