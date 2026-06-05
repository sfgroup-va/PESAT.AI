param(
  [string]$WorkerName = "pesat-ai-homepage",
  [string]$Domain = "pesat.ai",
  [string]$AccountId = "99dd60debc042e9b615dd44472645e71",
  [string]$SupabaseProjectRef = $env:SUPABASE_PROJECT_REF,
  [switch]$PreflightOnly,
  [switch]$SkipAudit
)

$ErrorActionPreference = "Stop"

function Read-RequiredSecret($Name) {
  $envValue = [Environment]::GetEnvironmentVariable($Name)
  if (-not [string]::IsNullOrWhiteSpace($envValue)) {
    Write-Host "Menggunakan $Name dari environment variable." -ForegroundColor DarkGray
    return $envValue
  }

  $value = Read-Host "Masukkan $Name"
  if ([string]::IsNullOrWhiteSpace($value)) {
    throw "$Name wajib diisi."
  }
  return $value
}

Write-Host "Finalisasi Cloudflare untuk $WorkerName ($Domain)" -ForegroundColor Cyan
Write-Host "Script ini tidak menyimpan secret ke repo. Secret dikirim ke Wrangler via stdin." -ForegroundColor DarkGray
Write-Host "NEXT_PUBLIC_SITE_URL dan OPENAI_MODEL dibaca dari wrangler.jsonc vars, bukan secret." -ForegroundColor DarkGray

Write-Host "Menjalankan preflight quality gate..." -ForegroundColor Cyan
npm.cmd run check:quality
if ($LASTEXITCODE -ne 0) {
  throw "Preflight quality gate gagal. Secret dan deploy dibatalkan."
}

Write-Host "Membangun paket Cloudflare terbaru..." -ForegroundColor Cyan
npx.cmd opennextjs-cloudflare build
if ($LASTEXITCODE -ne 0) {
  throw "OpenNext Cloudflare build gagal. Secret dan deploy dibatalkan."
}

Write-Host "Secret yang saat ini terdaftar di Worker:" -ForegroundColor Cyan
npx.cmd wrangler secret list --name $WorkerName

if ($PreflightOnly) {
  Write-Host "Mode PreflightOnly aktif. Mengecek secret readiness tanpa prompt secret atau deploy..." -ForegroundColor Cyan
  powershell -ExecutionPolicy Bypass -File .\scripts\check-cloudflare-secrets.ps1 -WorkerName $WorkerName
  if (-not [string]::IsNullOrWhiteSpace($SupabaseProjectRef) -and -not [string]::IsNullOrWhiteSpace($env:SUPABASE_ACCESS_TOKEN)) {
    powershell -ExecutionPolicy Bypass -File .\scripts\check-supabase-readiness.ps1 -ProjectRef $SupabaseProjectRef
  } else {
    Write-Host "Supabase readiness dilewati. Set SUPABASE_PROJECT_REF dan SUPABASE_ACCESS_TOKEN untuk mengecek DB production." -ForegroundColor Yellow
  }
  Write-Host "Preflight selesai. Secret input dan deploy dilewati." -ForegroundColor Green
  exit 0
}

$openAiKey = Read-RequiredSecret "OPENAI_API_KEY"
$supabaseUrl = Read-RequiredSecret "NEXT_PUBLIC_SUPABASE_URL"
$supabaseServiceRole = Read-RequiredSecret "SUPABASE_SERVICE_ROLE_KEY"
$adminPassword = Read-RequiredSecret "ADMIN_PASSWORD"

$secretMap = @{
  OPENAI_API_KEY = $openAiKey
  NEXT_PUBLIC_SUPABASE_URL = $supabaseUrl
  SUPABASE_SERVICE_ROLE_KEY = $supabaseServiceRole
  ADMIN_PASSWORD = $adminPassword
}

foreach ($entry in $secretMap.GetEnumerator()) {
  Write-Host "Memasang secret $($entry.Key)..." -ForegroundColor Cyan
  $entry.Value | npx.cmd wrangler secret put $entry.Key --name $WorkerName
}

npx.cmd wrangler deploy

Write-Host "Secrets sudah dipasang dan Worker sudah dideploy ulang." -ForegroundColor Green
if (-not $SkipAudit) {
  Write-Host "Menjalankan production readiness checks..." -ForegroundColor Cyan
  powershell -ExecutionPolicy Bypass -File .\scripts\check-production.ps1
  npm.cmd run smoke:api:prod
  npm.cmd run smoke:prod
  npm.cmd run check:domain
  powershell -ExecutionPolicy Bypass -File .\scripts\go-live-audit.ps1 -SupabaseProjectRef $SupabaseProjectRef
}

Write-Host "Jika zone $Domain sudah ada di Cloudflare, attach custom domain dengan:" -ForegroundColor Yellow
Write-Host "npx.cmd wrangler domains add $Domain --name $WorkerName" -ForegroundColor Yellow
Write-Host "Account target: $AccountId" -ForegroundColor DarkGray
