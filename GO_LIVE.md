# Pesat.AI Go-Live Status

Current public Worker:

```text
https://pesat-ai-homepage.n311311.workers.dev
```

Run the full go-live audit:

```powershell
.\scripts\go-live-audit.ps1
```

To include production database proof in the audit:

```powershell
$env:SUPABASE_ACCESS_TOKEN="..."
.\scripts\go-live-audit.ps1 -SupabaseProjectRef <supabase_project_ref>
```

Run a cutover-specific readiness check:

```powershell
npm run check:cutover
```

For the final cutover check, include the same Supabase project ref:

```powershell
$env:SUPABASE_ACCESS_TOKEN="..."
powershell -ExecutionPolicy Bypass -File .\scripts\check-cutover-readiness.ps1 -SupabaseProjectRef <supabase_project_ref>
```

The app should only be considered fully live on `pesat.ai` when the audit returns:

```json
{
  "ReadyToCutover": true
}
```

## Current External Blockers

- `pesat.ai` is still on Spaceship nameservers, not Cloudflare nameservers.
- Cloudflare account `n311311@gmail.com` currently does not show a `pesat.ai` zone.
- Current Cloudflare API access can deploy the Worker but cannot create the zone. The latest API attempt failed with missing permission `com.cloudflare.api.account.zone.create`.
- Production secrets are not installed yet:
  - `OPENAI_API_KEY`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `ADMIN_PASSWORD`
- Supabase production database readiness has not been verified yet because the Pesat.AI Supabase project ref is not confirmed.

## Final Cutover Steps

1. Add `pesat.ai` as a Cloudflare zone under account `n311311@gmail.com`.
2. Move registrar nameservers from Spaceship to the Cloudflare nameservers given by the new zone.
3. Run the Supabase migration:

```sql
supabase/migrations/20260530000000_pesat_ai_core.sql
```

If the Supabase project ref is known, use the guarded script instead of guessing:

```powershell
$env:SUPABASE_ACCESS_TOKEN="..."
.\scripts\apply-supabase-migration.ps1 -ProjectRef <supabase_project_ref>
```

The default mode is dry-run. To apply, rerun with `-Apply` and type the same project ref when prompted:

```powershell
.\scripts\apply-supabase-migration.ps1 -ProjectRef <supabase_project_ref> -Apply
```

After migration, verify the live database structure with the read-only readiness checker:

```powershell
$env:SUPABASE_ACCESS_TOKEN="..."
npm run check:supabase -- -ProjectRef <supabase_project_ref>
```

This confirms tables, RLS, columns, indexes, trigger, and constraints without changing database data.

4. Install Worker secrets:

```powershell
.\scripts\finalize-cloudflare.ps1
```

The script will:

- run the local quality gate,
- build the latest Cloudflare bundle,
- list existing Worker secrets,
- read required production secrets from environment variables when available, otherwise prompt for them,
- deploy the Worker again,
- run production health, API smoke, UI smoke, domain check, and full go-live audit.

Use `.\scripts\finalize-cloudflare.ps1 -SkipAudit` only when you intentionally want to defer verification.

To run the safe preflight path without entering secrets or deploying:

```powershell
.\scripts\finalize-cloudflare.ps1 -PreflightOnly
```

This runs the quality gate, builds the Cloudflare bundle, lists current Worker secrets, checks missing required secrets, then stops before prompts/deploy.

5. Attach custom domain:

```powershell
npx.cmd wrangler domains add pesat.ai --name pesat-ai-homepage
```

6. Run:

```powershell
.\scripts\go-live-audit.ps1
npm run check:cutover
```
