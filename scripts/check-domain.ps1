param(
  [string]$Domain = "pesat.ai",
  [string]$WorkerUrl = "https://pesat-ai-homepage.n311311.workers.dev"
)

$ErrorActionPreference = "Stop"

function Resolve-Records($Name, $Type) {
  try {
    @(Resolve-DnsName -Name $Name -Type $Type -ErrorAction Stop)
  } catch {
    @()
  }
}

function Get-Status($Url) {
  try {
    $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 30
    [int]$response.StatusCode
  } catch {
    if ($_.Exception.Response) {
      [int]$_.Exception.Response.StatusCode
    } else {
      $_.Exception.Message
    }
  }
}

$ns = Resolve-Records -Name $Domain -Type NS
$a = Resolve-Records -Name $Domain -Type A
$cname = Resolve-Records -Name $Domain -Type CNAME

$nsHosts = @($ns | ForEach-Object { $_.NameHost } | Where-Object { $_ })
$aRecords = @($a | ForEach-Object { $_.IPAddress } | Where-Object { $_ })
$cnameRecords = @($cname | ForEach-Object { $_.NameHost } | Where-Object { $_ })
$cloudflareNs = @($nsHosts | Where-Object { $_ -match "cloudflare\.com$" })

$workerStatus = Get-Status -Url $WorkerUrl
$domainStatus = Get-Status -Url "https://$Domain"

[pscustomobject]@{
  Domain = $Domain
  WorkerUrl = $WorkerUrl
  WorkerStatus = $workerStatus
  DomainHttpsStatus = $domainStatus
  Nameservers = $nsHosts
  ARecords = $aRecords
  CNAMERecords = $cnameRecords
  CloudflareNameserversDetected = $cloudflareNs.Count -gt 0
  NeedsCloudflareZoneOrNameserverMove = $cloudflareNs.Count -eq 0
  ExpectedNextStep = if ($cloudflareNs.Count -eq 0) {
    "Add $Domain as a Cloudflare zone in account n311311@gmail.com, then move registrar nameservers to Cloudflare."
  } else {
    "Attach Worker pesat-ai-homepage to $Domain and verify HTTPS."
  }
} | ConvertTo-Json -Depth 5
