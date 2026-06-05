# Pesat.AI — Sisa Langkah Deploy

Status per update terakhir:

- ✅ Kode siap produksi — `npm run build` (Next.js) **lolos**, semua route ter-generate.
- ✅ Quality gate hijau penuh — `npm run check:quality` (lint, typecheck, unit test, audit 76 cek).
- ✅ Versioned di git (commit lokal di branch `master`). Belum ada remote/push.
- ❌ **Belum live.** Belum deploy, domain `pesat.ai` belum aktif.

## Blocker yang ditemukan

1. **Toolchain Cloudflare belum lengkap di environment ini.** Dependency terpasang dengan `--ignore-scripts`, jadi binary native dilewati:
   - `opennextjs-cloudflare build` gagal: `@cloudflare/workerd-windows-64 could not be found` (workerd).
   - `esbuild` (nested di wrangler) sempat version-mismatch.
   - **Fix:** di mesin/CI yang bisa install bersih, jalankan: hapus `node_modules`, lalu `npm install` **tanpa** `--ignore-scripts` dan **tanpa** `--no-optional` agar postinstall workerd + esbuild jalan. Verifikasi: `npx opennextjs-cloudflare build`.

## Langkah deploy (urut)

> ⚠️ Langkah ber-🔐 butuh kredensial/akunmu dan **harus kamu yang jalankan** (memasukkan secret & mengubah DNS tidak boleh dilakukan otomatis).

1. **Toolchain bersih** (lihat Blocker #1), lalu pastikan `npm run build` & `npx opennextjs-cloudflare build` sukses.
2. 🔐 **Cloudflare auth** — `wrangler login` atau set `CLOUDFLARE_API_TOKEN` (akun `n311311@gmail.com`).
3. 🔐 **Secret produksi** — pakai **API key OpenAI BARU (rotate dulu, yang lama bocor)**:
   ```
   npx wrangler secret put OPENAI_API_KEY
   npx wrangler secret put NEXT_PUBLIC_SUPABASE_URL
   npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
   npx wrangler secret put ADMIN_PASSWORD
   ```
   Atau pakai helper terpandu: `scripts\finalize-cloudflare.ps1` (baca dari env var / prompt, lalu build+deploy+audit).
4. 🔐 **Supabase** — `scripts\apply-supabase-migration.ps1 -ProjectRef <ref> -Apply`, lalu `npm run check:supabase -- -ProjectRef <ref>`.
5. **Deploy Worker** — `npm run deploy`.
6. 🔐 **Domain `pesat.ai`** — tambah zone ke Cloudflare, pindahkan nameserver dari Spaceship ke Cloudflare, attach custom domain ke Worker `pesat-ai-homepage`.
7. **Verifikasi go-live** — `npm run audit:go-live` dan `npm run check:cutover` sampai `ReadyToCutover: true`.

Catatan: bisa juga push repo ke GitHub lalu hubungkan ke Cloudflare Pages/Workers CI agar deploy otomatis tiap commit (perlu akun GitHub-mu).
