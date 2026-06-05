param(
  [string]$BaseUrl = "https://pesat-ai-homepage.n311311.workers.dev"
)

$ErrorActionPreference = "Stop"

$homeResponse = Invoke-WebRequest -Uri $BaseUrl -UseBasicParsing -TimeoutSec 30
$health = Invoke-RestMethod -Uri "$BaseUrl/api/health" -TimeoutSec 30

$body = @{
  answers = @{
    mainChallenges = @("revenue")
    detailChallenges = @("follow_up")
    impactLevel = "revenue"
    adoptionStyle = "dfy"
  }
  contact = @{}
} | ConvertTo-Json -Depth 8

$result = Invoke-RestMethod -Uri "$BaseUrl/api/result" -Method Post -ContentType "application/json" -Body $body -TimeoutSec 30

[pscustomobject]@{
  BaseUrl = $BaseUrl
  HomeStatus = $homeResponse.StatusCode
  HealthOk = $health.ok
  Ready = $health.ready
  Blockers = $health.blockers
  OpenAIConfigured = $health.env.openai
  DatabaseConfigured = $health.env.database
  AdminPasswordConfigured = $health.env.adminPassword
  ResultHeadline = $result.headline
  ResultCards = @($result.impactCards).Count
  LlmFallback = $result.llmFallback
} | ConvertTo-Json -Depth 5
