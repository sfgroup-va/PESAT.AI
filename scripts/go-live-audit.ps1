param(
  [string]$BaseUrl = "https://pesat-ai-homepage.n311311.workers.dev",
  [string]$Domain = "pesat.ai",
  [string]$SupabaseProjectRef = $env:SUPABASE_PROJECT_REF
)

$ErrorActionPreference = "Stop"

function Run-JsonCommand($Command, $Arguments) {
  $output = & $Command @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "$Command $($Arguments -join ' ') failed."
  }
  $text = ($output | Out-String).Trim()
  $jsonStart = $text.IndexOf("{")
  if ($jsonStart -lt 0) {
    throw "No JSON object returned by $Command $($Arguments -join ' ')"
  }
  return $text.Substring($jsonStart) | ConvertFrom-Json
}

function Get-SupabaseReadiness($ProjectRef) {
  if ([string]::IsNullOrWhiteSpace($ProjectRef)) {
    return [pscustomobject]@{
      ok = $false
      skipped = $true
      reason = "SUPABASE_PROJECT_REF belum tersedia."
      blockers = @("Set SUPABASE_PROJECT_REF atau jalankan audit dengan -SupabaseProjectRef <ref> untuk membuktikan database production sudah siap.")
    }
  }

  if ([string]::IsNullOrWhiteSpace($env:SUPABASE_ACCESS_TOKEN)) {
    return [pscustomobject]@{
      ok = $false
      skipped = $true
      projectRef = $ProjectRef
      reason = "SUPABASE_ACCESS_TOKEN belum tersedia."
      blockers = @("Set SUPABASE_ACCESS_TOKEN untuk menjalankan Supabase readiness check read-only.")
    }
  }

  return Run-JsonCommand "powershell.exe" @("-ExecutionPolicy", "Bypass", "-File", ".\scripts\check-supabase-readiness.ps1", "-ProjectRef", $ProjectRef)
}

$qualityGate = Run-JsonCommand "npm.cmd" @("run", "check:quality")
$requirementAudit = $qualityGate.requirementAudit
$secretsAudit = Run-JsonCommand "powershell.exe" @("-ExecutionPolicy", "Bypass", "-File", ".\scripts\check-cloudflare-secrets.ps1")
$supabaseReadiness = Get-SupabaseReadiness $SupabaseProjectRef
$domainAudit = Run-JsonCommand "npm.cmd" @("run", "check:domain")
$productionAudit = Run-JsonCommand "powershell.exe" @("-ExecutionPolicy", "Bypass", "-File", ".\scripts\check-production.ps1", "-BaseUrl", $BaseUrl)
$apiSmoke = Run-JsonCommand "npm.cmd" @("run", "smoke:api:prod")
$uiSmoke = Run-JsonCommand "npm.cmd" @("run", "smoke:prod")

$runtimeReady = [bool]$productionAudit.Ready
$domainReady = [bool]$domainAudit.CloudflareNameserversDetected -and ($domainAudit.DomainHttpsStatus -eq 200)
$functionalReady = [bool]$apiSmoke.ok -and [bool]$uiSmoke.hasResult -and [bool]$uiSmoke.hasDiscoveryCta -and [bool]$uiSmoke.hasPdfExport
$codeReady = [bool]$qualityGate.ok -and [bool]$requirementAudit.ok
$databaseReady = [bool]$supabaseReadiness.ok

$blockers = @()
if (-not $codeReady) { $blockers += "Quality gate failed." }
if (-not $databaseReady) { $blockers += @($supabaseReadiness.blockers) }
if (-not $functionalReady) { $blockers += "Production API/UI smoke test failed." }
if (-not [bool]$secretsAudit.Ready) { $blockers += "Cloudflare Worker secrets missing: $(@($secretsAudit.Missing) -join ', ')." }
if (-not $runtimeReady) { $blockers += @($productionAudit.Blockers) }
if (-not $domainReady) { $blockers += "Domain $Domain is not yet routed through Cloudflare to this Worker." }

[pscustomobject]@{
  BaseUrl = $BaseUrl
  Domain = $Domain
  CodeReady = $codeReady
  DatabaseReady = $databaseReady
  RuntimeReady = $runtimeReady
  DomainReady = $domainReady
  FunctionalReady = $functionalReady
  ReadyToCutover = $codeReady -and $databaseReady -and $runtimeReady -and $domainReady -and $functionalReady
  Blockers = @($blockers | Where-Object { $_ })
  Evidence = [pscustomobject]@{
    QualityGate = $qualityGate
    RequirementAudit = $requirementAudit
    SupabaseReadiness = $supabaseReadiness
    SecretsAudit = $secretsAudit
    DomainAudit = $domainAudit
    ProductionAudit = $productionAudit
    ApiSmoke = $apiSmoke
    UiSmoke = $uiSmoke
  }
} | ConvertTo-Json -Depth 8
