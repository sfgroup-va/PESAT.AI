# Pesat.AI — Cold Start Guide

Panduan cepat untuk menjalankan, mengembangkan, dan deploy project Pesat.AI.

---

## 1. Project Overview

Pesat.AI adalah landing page + Mini Session diagnostic tool untuk B2B AI consulting.

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
- `20260612000000_update_event_screens.sql` — update event screen constraint untuk Mini Session flow baru (q1-q6, review, loading, result, leadGate).

---

## 9. Mini Session Flow (Redesign v2)

Flow terbaru setelah UX/CRO redesign:

```
Hero → Q1 → Q2 → Q3 → Q4 → Q5 → Q6 → Review → Loading → Result → LeadGate
```

| Step | Konten |
|------|--------|
| Q1 | Situasi operasional terberat (revenue, cost, fraud, cash_stock, reporting, brand_trust) |
| Q2 | Metrik yang paling sering merah |
| Q3 | Intensitas masalah (mild, weekly, often, critical) |
| Q4 | Sumber gesekan terbesar (duplicate_data, manual_reports, delayed_response, dll) |
| Q5 | Gaya adopsi AI (dfy, hybrid, diy, starting) |
| Q6 | Optional operational context textarea |
| Review | Ringkasan jawaban |
| Loading | 4 insight edukatif, 5-6 detik per insight |
| Result | Executive summary, hidden cost radar, finding cards, action plan |
| LeadGate | Kontak diminta SETELAH value diberikan |

---

## 10. Key Files & Architecture

| File | Tanggung jawab |
|------|----------------|
| `components/PesatExperience.tsx` | Wizard UI utama |
| `components/ResultView.tsx` | Halaman hasil shareable |
| `components/ImpactComparisonChart.tsx` | Chart Before/After yang readable |
| `lib/solutions.ts` | Katalog solusi, pertanyaan, loading insights |
| `lib/rule-engine.ts` | Logika seleksi solusi, impact metrics, findings |
| `lib/types.ts` | TypeScript types |
| `lib/validation.ts` | Sanitasi & validasi input |
| `lib/openai-result.ts` | LLM copy generation dengan fallback |
| `app/api/result/route.ts` | Generate & persist result |
| `app/api/session/route.ts` | Persist session answers |
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
- Custom domain `pesat.ai` attachment dilakukan via Cloudflare; untuk sementaran worker juga accessible via `pesat-ai-homepage.n311311.workers.dev`.
- UI redesign terbaru memprioritaskan **insight quality** di atas visual polish.
