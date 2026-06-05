# Pesat.AI Homepage

Homepage mobile-first untuk `pesat.ai` dengan hero premium, mini session "Buktikan Sendiri", tracking dasar, hasil shareable, export PDF, admin funnel, dan redirect WhatsApp.

## Setup

1. Install dependency:

```bash
npm install
```

2. Buat env lokal dari `.env.example`:

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.5
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
NEXT_PUBLIC_SITE_URL=https://pesat.ai
```

3. Jalankan SQL di `supabase/schema.sql` pada Supabase project target.

4. Dev lokal:

```bash
npm run dev
```

5. Production smoke test:

```powershell
.\scripts\check-production.ps1
npm run audit:requirements
npm run smoke:api:prod
npm run smoke:prod
npm run check:secrets
npm run check:domain
npm run audit:go-live
```

## Routes

- `/` hero + full-screen mini session.
- `/result/[sessionId]` shareable result.
- `/admin` funnel drop-off dan discovery count.
- `/robots.txt` dan `/sitemap.xml` production SEO basics.

## Deploy Cloudflare

Build/deploy memakai OpenNext Cloudflare:

```bash
npm run deploy
```

Set environment variables di Cloudflare sebelum production deploy. Akun Cloudflare target: `n311311@gmail.com`. Saat pengecekan terakhir, zone `pesat.ai` belum terlihat di akun tersebut, jadi domain binding perlu dilakukan setelah zone/domain tersedia.

Template production tersedia di `.env.production.example`. File itu hanya daftar nama secret/var, bukan tempat menyimpan nilai asli.

## Production Checklist

- Public Worker URL saat ini: `https://pesat-ai-homepage.n311311.workers.dev`
- Health endpoint: `https://pesat-ai-homepage.n311311.workers.dev/api/health`
- Current DNS check: `pesat.ai` masih memakai nameserver Spaceship (`launch1.spaceship.net`, `launch2.spaceship.net`) dan belum berada di Cloudflare account `n311311@gmail.com`.
- Cloudflare Worker secret check:

```powershell
npm run check:secrets
```

- Cloudflare API token saat ini bisa deploy Worker, tetapi belum bisa:
  - membuat zone `pesat.ai` (`zone.create` permission missing)
  - attach Workers custom domain (`workers/domains` attach ditolak)

Langkah final domain:

1. Tambahkan zone `pesat.ai` ke Cloudflare account `n311311@gmail.com`, atau beri token permission `com.cloudflare.api.account.zone.create`.
2. Pindahkan nameserver domain di registrar ke nameserver Cloudflare yang diberikan zone baru.
3. Attach Worker `pesat-ai-homepage` ke custom domain `pesat.ai`.
4. Set env vars production di Worker:

```bash
wrangler secret put OPENAI_API_KEY
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put ADMIN_PASSWORD
wrangler secret put NEXT_PUBLIC_SUPABASE_URL
```

`NEXT_PUBLIC_SITE_URL=https://pesat.ai` dan `OPENAI_MODEL=gpt-5.5` sudah ada sebagai `vars` di `wrangler.jsonc`, jadi tidak perlu dipasang sebagai secret kecuali kebijakan deployment berubah.

Supabase migration-ready file tersedia di `supabase/migrations/20260530000000_pesat_ai_core.sql`.

Guarded Supabase migration helper:

```powershell
$env:SUPABASE_ACCESS_TOKEN="..."
.\scripts\apply-supabase-migration.ps1 -ProjectRef <supabase_project_ref>
```

Script ini default ke dry-run. Gunakan `-Apply` hanya setelah project ref Pesat.AI dipastikan benar.

Read-only Supabase readiness checker setelah migration:

```powershell
$env:SUPABASE_ACCESS_TOKEN="..."
npm run check:supabase -- -ProjectRef <supabase_project_ref>
```

Checker ini memvalidasi tabel, RLS, kolom, index, trigger, dan constraint tanpa mengubah data.

Audit go-live dan cutover juga bisa membuktikan readiness database bila project ref tersedia:

```powershell
$env:SUPABASE_ACCESS_TOKEN="..."
.\scripts\go-live-audit.ps1 -SupabaseProjectRef <supabase_project_ref>
powershell -ExecutionPolicy Bypass -File .\scripts\check-cutover-readiness.ps1 -SupabaseProjectRef <supabase_project_ref>
```

Alternatif finalisasi dengan prompt interaktif:

```powershell
.\scripts\finalize-cloudflare.ps1
```

Script ini memasang secret lewat Wrangler, redeploy Worker, menjalankan smoke/go-live audit, lalu menampilkan command attach custom domain. Secret tidak ditulis ke file. Untuk hanya memasang secret dan deploy tanpa audit, gunakan:

```powershell
.\scripts\finalize-cloudflare.ps1 -SkipAudit
```

## Anti-Halusinasi

- `AVAILABLE_SOLUTIONS` berisi 31 layanan fixed di backend.
- Mapping tantangan ke solusi dilakukan rule engine, bukan LLM.
- OpenAI hanya menerima solusi dan angka impact yang sudah dihitung backend.
- Jika OpenAI gagal atau env belum tersedia, API memakai deterministic fallback copy.
