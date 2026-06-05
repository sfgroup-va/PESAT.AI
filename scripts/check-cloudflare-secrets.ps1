param(
  [string]$WorkerName = "pesat-ai-homepage"
)

$ErrorActionPreference = "Stop"

$requiredSecrets = @(
  "OPENAI_API_KEY",
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_PASSWORD"
)

$output = npx.cmd wrangler secret list --name $WorkerName
if ($LASTEXITCODE -ne 0) {
  throw "wrangler secret list failed for Worker $WorkerName."
}

$text = ($output | Out-String).Trim()
$jsonStart = $text.IndexOf("[")
if ($jsonStart -lt 0) {
  throw "No JSON array returned by wrangler secret list."
}

$listed = $text.Substring($jsonStart) | ConvertFrom-Json
$secretNames = @($listed | ForEach-Object { $_.name })
$missing = @($requiredSecrets | Where-Object { $secretNames -notcontains $_ })

[pscustomobject]@{
  WorkerName = $WorkerName
  Required = $requiredSecrets
  Present = @($requiredSecrets | Where-Object { $secretNames -contains $_ })
  Missing = $missing
  Ready = ($missing.Count -eq 0)
} | ConvertTo-Json -Depth 4
