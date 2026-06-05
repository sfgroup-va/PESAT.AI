import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));
const failures = [];

function check(name, condition, detail = "") {
  if (!condition) failures.push({ name, detail });
}

const solutions = read("lib/solutions.ts");
const ruleEngine = read("lib/rule-engine.ts");
const experience = read("components/PesatExperience.tsx");
const homeData = read("components/home/data.ts");
const schema = read("supabase/migrations/20260530000000_pesat_ai_core.sql");
const packageJson = JSON.parse(read("package.json"));
const wrangler = read("wrangler.jsonc");
const envExample = read(".env.example");
const envProductionExample = read(".env.production.example");
const nextConfig = read("next.config.ts");
const adminPage = read("app/admin/page.tsx");
const adminSummary = read("app/api/admin/summary/route.ts");
const adminSummaryLib = read("lib/admin-summary.ts");
const adminDashboard = read("components/AdminDashboard.tsx");
const resultView = read("components/ResultView.tsx");
const resultGetRoute = read("app/api/result/[sessionId]/route.ts");
const eventRoute = read("app/api/event/route.ts");
const smokeApi = read("scripts/smoke-api.mjs");
const finalizer = read("scripts/finalize-cloudflare.ps1");
const secretsCheck = read("scripts/check-cloudflare-secrets.ps1");
const cutoverCheck = read("scripts/check-cutover-readiness.ps1");
const supabaseApply = read("scripts/apply-supabase-migration.ps1");
const supabaseReadiness = read("scripts/check-supabase-readiness.ps1");
const adminSummaryTest = read("scripts/test-admin-summary.mjs");
const ruleEngineTest = read("scripts/test-rule-engine.mjs");
const solutionsTest = read("scripts/test-solutions.mjs");
const supabaseSchemaTest = read("scripts/test-supabase-schema.mjs");
const transitionFactsTest = read("scripts/test-transition-facts.mjs");
const validationTest = read("scripts/test-validation.mjs");
const readme = read("README.md");
const openaiResult = read("lib/openai-result.ts");
const resultNormalizer = read("lib/result-normalizer.ts");
const resultNormalizerTest = read("scripts/test-result-normalizer.mjs");
const qualityGate = read("scripts/quality-gate.mjs");
const goLiveAudit = read("scripts/go-live-audit.ps1");

const solutionIds = [...solutions.matchAll(/\{\s*id:\s*"([^"]+)"/g)].map((match) => match[1]);
const uniqueSolutionIds = new Set(solutionIds);
const challengeKeys = ["revenue", "cost", "fraud", "cash_stock", "reporting", "brand_trust"];
const routeFiles = [
  "app/page.tsx",
  "app/admin/page.tsx",
  "app/result/[sessionId]/page.tsx",
  "app/api/session/route.ts",
  "app/api/event/route.ts",
  "app/api/result/route.ts",
  "app/api/result/[sessionId]/route.ts",
  "app/api/discovery/route.ts",
  "app/api/admin/summary/route.ts",
  "app/api/health/route.ts"
];
const requiredSecrets = ["OPENAI_API_KEY", "NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "ADMIN_PASSWORD"];
const publicVars = ["OPENAI_MODEL", "NEXT_PUBLIC_SITE_URL"];

check("31 fixed solutions", solutionIds.length === 31, `found ${solutionIds.length}`);
check("solution IDs are unique", uniqueSolutionIds.size === solutionIds.length);
check("solutions library has executable coverage", solutionsTest.includes("AVAILABLE_SOLUTIONS.length, 31") && solutionsTest.includes("every challenge must have at least one solution") && packageJson.scripts["test:solutions"] && qualityGate.includes("test:solutions"));
check("all challenge labels exist", challengeKeys.every((key) => solutions.includes(`${key}:`)));
check("transition facts include source labels", challengeKeys.every((key) => solutions.includes(`${key}: {`) && solutions.includes("source:")));
check("transition facts have executable coverage", transitionFactsTest.includes("allowedSources") && transitionFactsTest.includes("orange business") && packageJson.scripts["test:transition-facts"] && qualityGate.includes("test:transition-facts"));
check("rule engine has each challenge cluster", challengeKeys.every((key) => ruleEngine.includes(`${key}: [`)));
check("rule engine selects max 4 solutions", ruleEngine.includes(".slice(0, 4)"));
check("rule engine has deterministic executable coverage", ruleEngineTest.includes("expectedPrimary") && ruleEngineTest.includes("secondary challenge must not push result over max 4") && packageJson.scripts["test:rule-engine"] && qualityGate.includes("test:rule-engine"));
check("OpenAI fallback exists", ruleEngine.includes("llmFallback: true") && read("lib/openai-result.ts").includes("return fallback"));
check("OpenAI request has timeout", openaiResult.includes("OPENAI_TIMEOUT_MS") && openaiResult.includes("AbortController") && openaiResult.includes("signal: controller.signal"));
check("OpenAI output is constrained after parsing", openaiResult.includes("normalizeModelPayload") && resultNormalizer.includes("allowedImpactValues") && resultNormalizer.includes("solutionNames"));
check("OpenAI output constraints are tested", resultNormalizerTest.includes("90% revenue") && resultNormalizerTest.includes("AI Blockchain Quantum Suite") && packageJson.scripts["test:result-normalizer"]);
check("server-side validation exists", exists("lib/validation.ts") && read("app/api/result/route.ts").includes("validateCompleteAnswers"));
check("server-side validation has executable coverage", validationTest.includes("sanitizeAnswers") && validationTest.includes("validateDiscoveryPayload") && validationTest.includes("validateEventPayload") && packageJson.scripts["test:validation"] && qualityGate.includes("test:validation"));
check("hero rolling lines complete", [
  "Menghemat jutaan rupiah per bulan",
  "Melipatgandakan revenue dari pelanggan yang sama",
  "Mencegah fraud senilai ratusan juta",
  "Memprediksi kas & stok sebelum habis",
  "Membangun dashboard Business Intelligence dalam hitungan hari",
  "Meningkatkan brand trust di Google & AI search"
].every((line) => homeData.includes(line)));
check("wizard screens present", ["s1", "fact1", "s2", "fact2", "s3", "s4", "s5", "s6", "s7", "s8"].every((step) => experience.includes(`"${step}"`)));
check("WhatsApp target configured", read("app/api/discovery/route.ts").includes("6281290401240"));
check("API smoke validates WhatsApp target and message", smokeApi.includes("discoveryWhatsappTargetOk") && smokeApi.includes("discoveryWhatsappMessageOk") && smokeApi.includes("Perusahaan: Test Co"));
check("share and PDF controls exist", experience.includes("Copy Link") && experience.includes("Export PDF") && packageJson.dependencies.jspdf);
check("Recharts dependency exists", Boolean(packageJson.dependencies.recharts));
check("Supabase schema tables exist", ["public.sessions", "public.events", "public.discovery_requests"].every((table) => schema.includes(table)));
check("Supabase RLS enabled", ["alter table public.sessions enable row level security", "alter table public.events enable row level security", "alter table public.discovery_requests enable row level security"].every((line) => schema.includes(line)));
check("Supabase event constraints match app events", schema.includes("type in ('screen_view', 'click')") && schema.includes("'hero', 's1', 'fact1'"));
check("Supabase discovery WA constraint exists", schema.includes("regexp_replace(wa") && schema.includes("between 9 and 16"));
check("Supabase admin time indexes exist", ["events_created_at_idx", "sessions_created_at_idx", "sessions_updated_at_idx", "discovery_requests_created_at_idx"].every((indexName) => schema.includes(indexName)));
check("Supabase schema has executable coverage", supabaseSchemaTest.includes("sessions_set_updated_at") && supabaseSchemaTest.includes("events_screen_type_idx") && packageJson.scripts["test:supabase-schema"]);
check("required route files exist", routeFiles.every(exists));
check("Cloudflare config targets account", wrangler.includes("99dd60debc042e9b615dd44472645e71") && wrangler.includes("nodejs_compat"));
check("env templates match required secrets and vars", requiredSecrets.every((name) => envExample.includes(`${name}=`) && envProductionExample.includes(`${name}=`) && secretsCheck.includes(name)) && publicVars.every((name) => envExample.includes(`${name}=`) && envProductionExample.includes(`${name}=`) && wrangler.includes(name)));
check("production env template has no committed secret values", requiredSecrets.every((name) => envProductionExample.includes(`${name}=\n`)));
check("production scripts exist", exists("scripts/check-production.ps1") && exists("scripts/smoke-ui.mjs") && exists("scripts/finalize-cloudflare.ps1"));
check("production security headers configured", ["X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Permissions-Policy"].every((header) => nextConfig.includes(header)));
check("API smoke validates production security and SEO", smokeApi.includes("securityHeadersOk") && smokeApi.includes("robotsOk") && smokeApi.includes("sitemapOk") && smokeApi.includes("Disallow: /admin"));
check("admin page is noindex", adminPage.includes("index: false") && adminPage.includes("follow: false"));
check("admin funnel drop-off metrics exist", adminSummaryLib.includes("dropOff") && adminSummaryLib.includes("conversionRate") && adminDashboard.includes("Drop-off"));
check("admin click analytics exist", adminSummaryLib.includes("clicks") && adminSummaryLib.includes("byCta") && adminDashboard.includes("Click Events"));
check("admin summary has isolated test", adminSummary.includes("buildAdminSummary") && adminSummaryTest.includes("Export PDF") && packageJson.scripts["test:admin-summary"]);
check("event tracking payload validation exists", eventRoute.includes("validateEventPayload") && eventRoute.includes("Invalid event payload"));
check("API smoke validates event rejection", smokeApi.includes("invalidEventRejected") && smokeApi.includes("unknown_screen"));
check("API smoke validates health readiness shape", smokeApi.includes("healthReadyFlagOk") && smokeApi.includes("healthEnvShapeOk") && smokeApi.includes("healthBlockersShapeOk"));
check("key result actions are click-tracked", experience.includes('cta: "Export PDF"') && experience.includes('cta: "Copy Link"') && experience.includes('cta: "Submit Discovery Call"'));
check("session payload rejection exists", read("app/api/session/route.ts").includes("Invalid session payload") && smokeApi.includes("invalidSessionRejected"));
check("hero click tracking is session-scoped", experience.includes("activeSessionId = await saveSession()") && experience.includes('track("click", "hero"'));
check("post-result detail note is persisted", experience.includes("saveResultDetailNote") && experience.includes("onDetailNoteBlur") && experience.includes("detailNote: note"));
check("UI smoke exercises detail textarea", read("scripts/smoke-ui.mjs").includes("hasDetailTextarea") && read("scripts/smoke-ui.mjs").includes("Smoke test: follow-up WhatsApp"));
check("result generation error state exists", experience.includes("resultError") && experience.includes("result_generation_failed") && experience.includes("Format hasil belum valid"));
check("discovery request error state exists", experience.includes("discoveryError") && experience.includes("discovery_request_failed") && experience.includes("Discovery call belum bisa diproses"));
check("result invalid JSON rejection exists", read("app/api/result/route.ts").includes("Invalid result payload") && smokeApi.includes("invalidResultJsonRejected"));
check("discovery invalid JSON rejection exists", read("app/api/discovery/route.ts").includes("Invalid discovery payload") && smokeApi.includes("invalidDiscoveryJsonRejected"));
check("discovery WA validation exists", read("lib/validation.ts").includes("hasUsableWhatsAppNumber") && smokeApi.includes("invalidDiscoveryWaRejected"));
check("admin password is not sent in URL", adminDashboard.includes('fetch("/api/admin/summary"') && !adminDashboard.includes("?password="));
check("admin conversion metrics exist", adminSummaryLib.includes("completionRate") && adminSummaryLib.includes("discoveryRate") && adminDashboard.includes("Largest Drop-off"));
check("API smoke validates admin auth rejection", smokeApi.includes("unauthorizedAdminRejected") && smokeApi.includes("/api/admin/summary"));
check("share result route has explicit not-ready states", resultGetRoute.includes("LIMIT 1") && resultGetRoute.includes("Result not found") && resultGetRoute.includes("Result not ready") && resultGetRoute.includes("Invalid session id"));
check("share result page has recovery CTA", resultView.includes("Kembali ke mini session") && resultView.includes("Supabase belum terhubung"));
check("API smoke validates share result unavailable state", smokeApi.includes("shareResultUnavailableOk") && smokeApi.includes("/api/result/"));
check("UI smoke validates PDF download", read("scripts/smoke-ui.mjs").includes("pdfDownloadOk") && read("scripts/smoke-ui.mjs").includes('waitForEvent("download"'));
check("UI smoke validates discovery prefill", read("scripts/smoke-ui.mjs").includes("discoveryPrefillOk") && read("scripts/smoke-ui.mjs").includes("Smoke Prefill Co"));
check("UI smoke validates result recovery page", read("scripts/smoke-ui.mjs").includes("resultRecoveryCtaOk") && read("scripts/smoke-ui.mjs").includes("/result/00000000-0000-0000-0000-000000000000"));
check("finalizer runs preflight before secrets", finalizer.includes("npm.cmd run check:quality") && finalizer.includes("opennextjs-cloudflare build") && finalizer.indexOf("npm.cmd run check:quality") < finalizer.indexOf("wrangler secret list"));
check("finalizer has safe preflight-only mode", finalizer.includes("$PreflightOnly") && finalizer.includes("check-cloudflare-secrets.ps1") && read("GO_LIVE.md").includes("-PreflightOnly"));
check("finalizer runs post-secret verification", finalizer.includes("check-production.ps1") && finalizer.includes("smoke:api:prod") && finalizer.includes("go-live-audit.ps1"));
check("finalizer can read secrets from environment", finalizer.includes("GetEnvironmentVariable") && read("GO_LIVE.md").includes("environment variables"));
check("Cloudflare secret readiness checker exists", secretsCheck.includes("wrangler secret list") && secretsCheck.includes("OPENAI_API_KEY") && read("package.json").includes("check:secrets"));
check("go-live audit includes secrets evidence", read("scripts/go-live-audit.ps1").includes("SecretsAudit") && read("scripts/go-live-audit.ps1").includes("check-cloudflare-secrets.ps1"));
check("go-live audit includes quality gate", qualityGate.includes("test:result-normalizer") && packageJson.scripts["check:quality"] && goLiveAudit.includes("QualityGate"));
check("go-live audit requires database readiness", goLiveAudit.includes("SupabaseReadiness") && goLiveAudit.includes("DatabaseReady") && goLiveAudit.includes("SUPABASE_PROJECT_REF") && finalizer.includes("check-supabase-readiness.ps1"));
check("cutover readiness checker exists", packageJson.scripts["check:cutover"] && cutoverCheck.includes("ReadyForCutover") && cutoverCheck.includes("DomainHttpsReady") && read("GO_LIVE.md").includes("check:cutover"));
check("cutover readiness requires database readiness", cutoverCheck.includes("SupabaseReadiness") && cutoverCheck.includes("DatabaseReady") && cutoverCheck.includes("SUPABASE_PROJECT_REF"));
check("docs keep public site URL as wrangler var", readme.includes("NEXT_PUBLIC_SITE_URL=https://pesat.ai") && readme.includes("sudah ada sebagai `vars`"));
check("guarded Supabase migration script exists", supabaseApply.includes("db push --linked --dry-run") && supabaseApply.includes("Ketik ulang project ref"));
check("docs mention guarded Supabase migration helper", readme.includes("apply-supabase-migration.ps1") && read("GO_LIVE.md").includes("apply-supabase-migration.ps1"));
check("read-only Supabase readiness checker exists", packageJson.scripts["check:supabase"] && supabaseReadiness.includes("SUPABASE_ACCESS_TOKEN") && supabaseReadiness.includes("relrowsecurity") && supabaseReadiness.includes("sessions_set_updated_at") && supabaseReadiness.includes("to_regclass") && supabaseReadiness.includes("db query --linked --output json") && readme.includes("check:supabase") && read("GO_LIVE.md").includes("check:supabase"));

if (failures.length) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, checked: 76, solutions: solutionIds.length, routes: routeFiles.length }, null, 2));
