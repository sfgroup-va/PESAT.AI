# Version History

## v0.10 — 2026-07-13

- Type: Feature + Deploy
- Changes:
  - Implement halaman `/deposit` dengan PayPal Smart Buttons (live).
  - Tambah halaman `/deposit/thank-you` setelah pembayaran berhasil.
  - Tambah admin editor `/admin/deposit` untuk konten, jumlah, PayPal Client ID, email, dan publish toggle.
  - Tambah API publik `/api/deposit/config`, `/api/paypal/order`, `/api/paypal/capture`.
  - Tambah API admin `/api/admin/deposit`, `/api/admin/deposit/publish`, `/api/admin/deposit/transactions`.
  - Tambah migration `20260713000000_deposit_pages_and_transactions.sql` (default published, $500).
  - Integrasi PayPal Client ID via `wrangler.jsonc` + `NEXT_PUBLIC_PAYPAL_CLIENT_ID`; secret via `PAYPAL_SECRET`.
  - Set `PAYPAL_SECRET` di Cloudflare Worker via `wrangler secret put`.
  - Tambah step `Apply database migrations` di `.github/workflows/deploy.yml` agar migration dijalankan otomatis saat deploy.
  - Deploy ke production via GitHub Actions workflow #31; `/deposit` sudah live dan memunculkan tombol PayPal.
- Files touched:
  - `app/deposit/page.tsx`
  - `app/deposit/thank-you/page.tsx`
  - `app/admin/deposit/page.tsx`
  - `components/DepositEditor.tsx`
  - `components/deposit/PayPalDepositButtons.tsx`
  - `lib/deposit.ts`
  - `lib/deposit-server.ts`
  - `lib/paypal.ts`
  - `app/api/deposit/config/route.ts`
  - `app/api/paypal/order/route.ts`
  - `app/api/paypal/capture/route.ts`
  - `app/api/admin/deposit/route.ts`
  - `app/api/admin/deposit/publish/route.ts`
  - `app/api/admin/deposit/transactions/route.ts`
  - `supabase/migrations/20260713000000_deposit_pages_and_transactions.sql`
  - `wrangler.jsonc`
  - `.env.example`
  - `.env.production.example`
  - `components/AdminDashboard.tsx`
  - `.github/workflows/deploy.yml`
  - `VERSION.md`
- Breaking: no
