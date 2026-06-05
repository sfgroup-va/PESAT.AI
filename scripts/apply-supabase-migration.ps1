param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectRef,
  [switch]$Apply
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($env:SUPABASE_ACCESS_TOKEN)) {
  throw "SUPABASE_ACCESS_TOKEN belum tersedia di environment shell ini."
}

if (-not (Test-Path -LiteralPath ".\supabase\migrations\20260530000000_pesat_ai_core.sql")) {
  throw "Migration file tidak ditemukan: .\supabase\migrations\20260530000000_pesat_ai_core.sql"
}

Write-Host "Target Supabase project ref: $ProjectRef" -ForegroundColor Cyan
Write-Host "Linking workspace ke Supabase project..." -ForegroundColor Cyan
npx.cmd supabase link --project-ref $ProjectRef

if (-not $Apply) {
  Write-Host "Mode dry-run. Tidak ada perubahan database yang diterapkan." -ForegroundColor Yellow
  npx.cmd supabase db push --linked --dry-run
  Write-Host "Jika output dry-run sudah sesuai, jalankan:" -ForegroundColor Green
  Write-Host ".\scripts\apply-supabase-migration.ps1 -ProjectRef $ProjectRef -Apply" -ForegroundColor Green
  exit 0
}

$confirmation = Read-Host "Ketik ulang project ref untuk APPLY migration ke database production"
if ($confirmation -ne $ProjectRef) {
  throw "Konfirmasi project ref tidak cocok. Migration dibatalkan."
}

Write-Host "Applying Supabase migration..." -ForegroundColor Cyan
npx.cmd supabase db push --linked

Write-Host "Menjalankan dry-run ulang untuk memastikan tidak ada pending migration." -ForegroundColor Cyan
npx.cmd supabase db push --linked --dry-run

Write-Host "Supabase migration selesai. Lanjutkan pasang Worker secrets dan jalankan audit go-live." -ForegroundColor Green
