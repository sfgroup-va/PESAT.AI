param(
  [string]$Domain = "pesat.ai",
  [string]$WorkerName = "pesat-ai-homepage",
  [string]$WorkerUrl = "https://pesat-ai-homepage.n311311.workers.dev",
  [string]$SupabaseProjectRef = $env:SUPABASE_PROJECT_REF
)

$ErrorActionPreference = "Stop"

function Run-JsonCommand($Command, $Arguments) {
  $output = & $Command @Arguments
  $exitCode = $LASTEXITCODE
  $text = ($output | Out-String).Trim()
  if ($exitCode -ne 0) {
    return [pscustomobject]@{
      ok = $false
      error = "$Command $($Arguments -join ' ') failed."
      raw = $text
    }
  }

  $jsonStart = $text.IndexOf("{")
  if ($jsonStart -lt 0) {
    return [pscustomobject]@{
      ok = $false
      error = "No JSON object returned by $Command $($Arguments -join ' ')"
      raw = $text
    }
  }

  return $text.Substring($jsonStart) | ConvertFrom-Json
}

function Get-SupabaseReadiness($ProjectRef) {
  if ([string]::IsNullOrWhiteSpace($ProjectRef)) {
    return [pscustomobject]@{
      ok = $false
      skipped = $true
      reason = "SUPABASE_PROJECT_REF belum tersedia."
      blockers = @("Set SUPABASE_PROJECT_REF atau jalankan check:cutover dengan -SupabaseProjectRef <ref>.")
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

$domainAudit = Run-JsonCommand "powershell.exe" @("-ExecutionPolicy", "Bypass", "-File", ".\scripts\check-domain.ps1", "-Domain", $Domain, "-WorkerUrl", $WorkerUrl)
$secretsAudit = Run-JsonCommand "powershell.exe" @("-ExecutionPolicy", "Bypass", "-File", ".\scripts\check-cloudflare-secrets.ps1", "-WorkerName", $WorkerName)
$supabaseReadiness = Get-SupabaseReadiness $SupabaseProjectRef

$workerReachable = $domainAudit.WorkerStatus -eq 200
$nameserversReady = [bool]$domainAudit.CloudflareNameserversDetected
$domainHttpsReady = $domainAudit.DomainHttpsStatus -eq 200
$secretsReady = [bool]$secretsAudit.Ready
$databaseReady = [bool]$supabaseReadiness.ok
$customDomainLikelyAttached = $domainHttpsReady

$nextActions = @()
if (-not $workerReachable) { $nextActions += "Fix Worker deployment before changing DNS." }
if (-not $secretsReady) { $nextActions += "Install missing Worker secrets: $(@($secretsAudit.Missing) -join ', ')." }
if (-not $databaseReady) { $nextActions += @($supabaseReadiness.blockers) }
if (-not $nameserversReady) { $nextActions += "Create Cloudflare zone for $Domain and move registrar nameservers to Cloudflare." }
if ($nameserversReady -and -not $customDomainLikelyAttached) { $nextActions += "Attach Worker custom domain: npx.cmd wrangler domains add $Domain --name $WorkerName." }
if ($customDomainLikelyAttached -and -not $domainHttpsReady) { $nextActions += "Wait for custom domain certificate/DNS propagation, then rerun this check." }

[pscustomobject]@{
  Domain = $Domain
  WorkerName = $WorkerName
  WorkerUrl = $WorkerUrl
  WorkerReachable = $workerReachable
  SecretsReady = $secretsReady
  DatabaseReady = $databaseReady
  NameserversReady = $nameserversReady
  CustomDomainLikelyAttached = $customDomainLikelyAttached
  DomainHttpsReady = $domainHttpsReady
  ReadyForCutover = $workerReachable -and $secretsReady -and $databaseReady -and $nameserversReady -and $customDomainLikelyAttached -and $domainHttpsReady
  NextActions = @($nextActions)
  Evidence = [pscustomobject]@{
    DomainAudit = $domainAudit
    SecretsAudit = $secretsAudit
    SupabaseReadiness = $supabaseReadiness
  }
} | ConvertTo-Json -Depth 8
