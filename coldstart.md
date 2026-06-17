# Pesat.AI Cold Start Guide

Panduan cepat untuk memahami kondisi repo, menjalankan app, dan menyelesaikan go-live.

## 1. Current Status

As of 2026-06-15, repo ini sudah mengakomodasi arah feedback Pak Nell:

- Wizard tidak lagi minta nama dan WhatsApp sebelum hasil.
- Pertanyaan `q4` sekarang fokus ke sumber gesekan utama, bukan mengulang kategori dari `q1`.
- Ada open question optional di `q6` dan context optional tambahan sebelum discovery call.
- Loading insight diperlambat, relevan per challenge, dan bisa di-skip.
- Report result sudah diarahkan ke gaya UX/CRO yang lebih tajam: lebih singkat, lebih personal, dan tidak memaksakan simulasi uang yang ngaco.
- Label "Janji Terukur" sudah diganti menjadi "Solusi Terukur".
- `company_name` di discovery request sekarang optional end-to-end.

Status verifikasi lokal terbaru:

- `npm run check:quality` passes
- `npm run build` passes
- `node scripts/smoke-ui.mjs http://127.0.0.1:3000` passes

External go-live blocker saat ini masih ada di domain, Cloudflare zone, secrets production, dan bukti readiness Supabase production. Lihat [GO_LIVE.md](/C:/Users/alpus/.codex/worktrees/0bcc/PESAT%20AI/GO_LIVE.md).

## 2. Project Overview

Pesat.AI adalah landing page plus mini diagnostic session untuk menawarkan solusi AI consulting secara lebih konkret.

- Framework: Next.js 16 App Router
- Deployment target: Cloudflare Workers via OpenNext
- Persistence: Supabase tables untuk session, events, dan discovery requests
- AI report copy: OpenAI Responses API dengan deterministic fallback
- Styling: Tailwind CSS

## 3. Important Product Behavior

Flow utama saat ini:

`Hero -> q1 -> q2 -> q3 -> q4 -> q5 -> q6 -> review -> loading -> result -> leadGate`

Ringkasan tiap step:

- `q1`: challenge utama bisnis
- `q2`: bottleneck paling terasa di cluster itu
- `q3`: seberapa sering masalah terjadi
- `q4`: sumber gesekan terbesar
- `q5`: model kerja sama yang realistis
- `q6`: open question optional
- `review`: cek jawaban sebelum generate
- `loading`: insight sequence yang lebih pelan
- `result`: report ungated
- `leadGate`: nama dan WhatsApp hanya diminta setelah value diberikan

## 4. Environment Setup

Template env lokal ada di [.env.example](/C:/Users/alpus/.codex/worktrees/0bcc/PESAT%20AI/.env.example):

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.5
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
NEXT_PUBLIC_SITE_URL=https://pesat.ai
```

Catatan penting:

- `.env.example` untuk lokal masih memakai `OPENAI_MODEL=gpt-5.5`.
- Production Worker di [wrangler.jsonc](/C:/Users/alpus/.codex/worktrees/0bcc/PESAT%20AI/wrangler.jsonc) saat ini memakai `OPENAI_MODEL=gpt-4.1`.
- Jangan ubah model production sembarangan. Pakai model yang memang tersedia di OpenAI key production, kalau tidak result akan fallback.

## 5. Install and Run Locally

Install dependency:

```bash
npm install
```

Kalau install di Windows mentok pada script `wrangler/esbuild`, Anda masih bisa lanjut verifikasi app dengan:

```bash
npm install --ignore-scripts
```

Itu cukup untuk lint, typecheck, Next build, dan smoke UI lokal. Untuk deploy Cloudflare tetap lebih aman lewat GitHub Actions, WSL, atau Linux.

Jalankan local dev:

```bash
npm run dev
```

Atau untuk smoke test hasil build:

```bash
npm run build
npm start
```

## 6. Main Files

File yang paling sering disentuh untuk product dan UX saat ini:

- [components/PesatExperience.tsx](/C:/Users/alpus/.codex/worktrees/0bcc/PESAT%20AI/components/PesatExperience.tsx): wizard utama, result entry, lead gate
- [components/ResultView.tsx](/C:/Users/alpus/.codex/worktrees/0bcc/PESAT%20AI/components/ResultView.tsx): shareable result page
- [components/report/StrategicSummary.tsx](/C:/Users/alpus/.codex/worktrees/0bcc/PESAT%20AI/components/report/StrategicSummary.tsx): executive summary baru
- [components/ImpactComparisonChart.tsx](/C:/Users/alpus/.codex/worktrees/0bcc/PESAT%20AI/components/ImpactComparisonChart.tsx): chart perbandingan dampak
- [lib/solutions.ts](/C:/Users/alpus/.codex/worktrees/0bcc/PESAT%20AI/lib/solutions.ts): pertanyaan wizard, label, loading insights
- [lib/rule-engine.ts](/C:/Users/alpus/.codex/worktrees/0bcc/PESAT%20AI/lib/rule-engine.ts): fallback result, findings, action plan, diagnostics
- [lib/report-ux.ts](/C:/Users/alpus/.codex/worktrees/0bcc/PESAT%20AI/lib/report-ux.ts): hero cards, scenario model, mini infographic logic
- [lib/openai-result.ts](/C:/Users/alpus/.codex/worktrees/0bcc/PESAT%20AI/lib/openai-result.ts): OpenAI prompt dan structured output
- [lib/result-normalizer.ts](/C:/Users/alpus/.codex/worktrees/0bcc/PESAT%20AI/lib/result-normalizer.ts): batas panjang output dan sanitasi copy
- [lib/validation.ts](/C:/Users/alpus/.codex/worktrees/0bcc/PESAT%20AI/lib/validation.ts): payload validation
- [app/api/discovery/route.ts](/C:/Users/alpus/.codex/worktrees/0bcc/PESAT%20AI/app/api/discovery/route.ts): discovery request, WhatsApp redirect
- [supabase/schema.sql](/C:/Users/alpus/.codex/worktrees/0bcc/PESAT%20AI/supabase/schema.sql): snapshot schema yang harus sinkron dengan flow app

## 7. Tests and Verification

Core verification commands:

```bash
npm run check:quality
npm run build
node scripts/smoke-ui.mjs http://127.0.0.1:3000
```

Detail `check:quality`:

- `test:admin-summary`
- `test:rule-engine`
- `test:result-normalizer`
- `test:solutions`
- `test:supabase-schema`
- `test:transition-facts`
- `test:validation`
- `audit:requirements`
- `lint`
- `typecheck`

Smoke commands:

```bash
npm run smoke:api
npm run smoke:ui
npm run smoke:api:prod
npm run smoke:prod
```

## 8. Database and Migrations

Jangan anggap hanya migration awal yang penting. Production perlu semua pending migration.

Migration yang relevan untuk flow sekarang:

- `20260530000000_pesat_ai_core.sql`
- `20260612000000_update_event_screens.sql`
- `20260614000000_discovery_company_optional.sql`

Helper yang dipakai:

```powershell
$env:SUPABASE_ACCESS_TOKEN="..."
.\scripts\apply-supabase-migration.ps1 -ProjectRef <supabase_project_ref>
.\scripts\apply-supabase-migration.ps1 -ProjectRef <supabase_project_ref> -Apply
npm run check:supabase -- -ProjectRef <supabase_project_ref>
```

Catatan:

- Script helper melakukan `supabase db push --linked`, jadi ia akan mendorong semua migration yang belum applied.
- [supabase/schema.sql](/C:/Users/alpus/.codex/worktrees/0bcc/PESAT%20AI/supabase/schema.sql) harus tetap sinkron dengan constraint event screen baru dan `company_name text`.

## 9. Production and Go-Live

Public Worker saat ini:

`https://pesat-ai-homepage.n311311.workers.dev`

Secret production yang wajib ada di Worker:

- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`

Safe preflight:

```powershell
.\scripts\finalize-cloudflare.ps1 -PreflightOnly
```

Final secret + deploy:

```powershell
.\scripts\finalize-cloudflare.ps1
```

Audit cutover:

```powershell
.\scripts\go-live-audit.ps1 -SupabaseProjectRef <supabase_project_ref>
npm run check:cutover
```

App baru dianggap live penuh di `pesat.ai` kalau audit menunjukkan `ReadyToCutover: true`.

## 10. Current External Blockers

Menurut status repo saat ini:

- `pesat.ai` masih belum menjadi zone aktif di Cloudflare account target
- nameserver domain masih di Spaceship
- secret production belum terpasang
- Supabase production readiness belum dibuktikan karena project ref belum dikonfirmasi

Setelah blocker itu selesai, lanjut:

```powershell
npx.cmd wrangler domains add pesat.ai --name pesat-ai-homepage
```

## 11. Common Issues

### Result terasa generic atau fallback

Penyebab umum:

- `OPENAI_API_KEY` belum terpasang
- model di production tidak tersedia untuk key tersebut

Cek:

- [app/api/health/route.ts](/C:/Users/alpus/.codex/worktrees/0bcc/PESAT%20AI/app/api/health/route.ts)
- `https://pesat-ai-homepage.n311311.workers.dev/api/health`

### Install npm gagal di Windows karena `esbuild` atau `workerd`

Gunakan `npm install --ignore-scripts` untuk verifikasi app, lalu deploy lewat GitHub Actions, WSL, atau Linux.

### UI smoke gagal setelah copy atau flow berubah

Sinkronkan [scripts/smoke-ui.mjs](/C:/Users/alpus/.codex/worktrees/0bcc/PESAT%20AI/scripts/smoke-ui.mjs), terutama bila:

- placeholder open question berubah
- label CTA berubah
- durasi loading diperpanjang

## 12. Quick Commands

```bash
npm run check:quality
npm run build
npm run smoke:api
npm run smoke:ui
npm run check:secrets
npm run check:domain
npm run audit:go-live
```

## 13. Working Notes

- Treat result UX and wording as a product contract, not cosmetic copy.
- Jangan kembalikan contact gate sebelum result tanpa alasan bisnis yang jelas.
- Untuk result math, jangan memaksakan simulasi rupiah jika basis terbaiknya bukan uang.
- Kalau ada perubahan wizard step, update sekaligus:
  - `components/PesatExperience.tsx`
  - `lib/solutions.ts`
  - `lib/validation.ts`
  - `lib/admin-summary.ts`
  - `supabase/schema.sql`
  - `scripts/smoke-api.mjs`
  - `scripts/smoke-ui.mjs`
  - test terkait
