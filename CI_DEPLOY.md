# CI Auto-Deploy (GitHub Actions → Cloudflare)

Workflow: `.github/workflows/deploy.yml`. On every push to `main`/`master`, GitHub
runs quality gate → OpenNext build → deploy to Cloudflare Workers. The Linux runner
installs native binaries cleanly (no `--ignore-scripts` issue).

First deploy goes to `*.workers.dev` (custom domain routes are temporarily disabled
in `wrangler.jsonc` until the `pesat.ai` zone exists in Cloudflare).

## One-time setup (only you can do these — they need your accounts/credentials)

### 1. Cloudflare API Token
Cloudflare dashboard → My Profile → API Tokens → Create Token. Permissions:
- Account → **Workers Scripts: Edit**
- Account → **Account Settings: Read**
- (later, for the domain) Zone → **DNS: Edit**, Zone → **Zone: Edit**, Account → **Workers Routes: Edit**
Account: `n311311@gmail.com`. Account ID is already in `wrangler.jsonc` (`99dd60debc042e9b615dd44472645e71`).

### 2. Push repo to GitHub
Create a repo (private is fine), then:
```
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin master
```

### 3. Add GitHub Actions secrets
Repo → Settings → Secrets and variables → Actions → New repository secret:
- `CLOUDFLARE_API_TOKEN`  (required)
- `CLOUDFLARE_ACCOUNT_ID` = `99dd60debc042e9b615dd44472645e71` (required)
- `DATABASE_URL`  (Neon pooled connection string) — optional in GitHub; if set, CI pushes it to the Worker
- `OPENAI_API_KEY` (rotated key) — optional; if set, CI pushes it
- `ADMIN_PASSWORD` — optional; if set, CI pushes it

> Alternative to putting runtime secrets in GitHub: set them once directly on the Worker
> (`npx wrangler secret put DATABASE_URL`, etc.) — Cloudflare persists them across deploys.

### 4. Trigger
Push any commit (or run the workflow manually via "Run workflow"). The Worker goes live at
`https://pesat-ai-homepage.<subdomain>.workers.dev`.

## Later: attach the domain `pesat.ai`
1. Add `pesat.ai` as a zone in Cloudflare (account above).
2. Change nameservers at the registrar (Spaceship) to the Cloudflare ones.
3. Re-enable the `routes` block in `wrangler.jsonc` (commented at the bottom) and push.

## What CI cannot do for you
Create the Cloudflare token, change DNS/nameservers, create the zone, and choose secret
values — those require your accounts and must be done by you.
