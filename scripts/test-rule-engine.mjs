import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const root = process.cwd();
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pesat-rule-engine-"));

function compileTsToFile(source, targetFile) {
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
      strict: true
    }
  }).outputText;
  fs.writeFileSync(path.join(tempDir, targetFile), compiled, "utf8");
}

try {
  const solutionsSource = fs.readFileSync(path.join(root, "lib", "solutions.ts"), "utf8").replace(/^import type .*;\r?\n/m, "");
  const ruleEngineSource = fs
    .readFileSync(path.join(root, "lib", "rule-engine.ts"), "utf8")
    .replace(/from "@\/lib\/solutions"/g, 'from "./solutions.mjs"')
    .replace(/^import type .*;\r?\n/m, "");

  compileTsToFile(solutionsSource, "solutions.mjs");
  compileTsToFile(ruleEngineSource, "rule-engine.mjs");

  const { AVAILABLE_SOLUTIONS } = await import(pathToFileURL(path.join(tempDir, "solutions.mjs")).href);
  const { selectSolutions, calculateImpactRanges, buildChart, buildDiagnosisPack, buildActionPlan, buildFallbackResult, extractUserSignals, buildCostOfInaction } = await import(pathToFileURL(path.join(tempDir, "rule-engine.mjs")).href);

  const solutionIds = new Set(AVAILABLE_SOLUTIONS.map((solution) => solution.id));
  const expectedPrimary = {
    revenue: ["ai_sales_assistant", "ai_repeat_order", "ai_crm_pintar", "ai_dynamic_pricing"],
    cost: ["ai_pembukuan_otomatis", "ai_invoice_ap_otomatis", "ai_document_processor", "ai_process_intelligence"],
    fraud: ["ai_fraud_detection", "ai_data_quality_auto_heal", "ai_roi_impact_tracker", "ai_quality_control_visual"],
    cash_stock: ["ai_prediksi_cashflow", "ai_demand_planner", "ai_inventory_optimizer", "ai_executive_dashboard"],
    reporting: ["ai_report_generator", "ai_executive_dashboard", "ai_meeting_notetaker", "ai_ticket_router"],
    brand_trust: ["ai_organic_traffic_builder", "ai_local_ai_search_trust_builder", "ai_social_media_manager", "ai_sentiment_pelanggan"]
  };

  // With no detail challenges, selection falls back to the deterministic cluster priority.
  for (const [challenge, expectedIds] of Object.entries(expectedPrimary)) {
    const selected = selectSolutions({
      mainChallenges: [challenge],
      detailChallenges: [],
      impactLevel: "",
      frictionSource: "",
      adoptionStyle: ""
    }).map((solution) => solution.id);

    assert.deepEqual(selected, expectedIds, `${challenge} should map deterministically to its priority solutions`);
    assert.ok(selected.length >= 3 && selected.length <= 4, `${challenge} should return 3-4 solutions`);
    assert.ok(selected.every((id) => solutionIds.has(id)), `${challenge} must only return AVAILABLE_SOLUTIONS ids`);
  }

  // The specific detail challenge must drive the first (most relevant) recommendation.
  const detailCases = [
    { main: "revenue", detail: "follow_up", top: "ai_whatsapp_sales_bot" },
    { main: "cost", detail: "admin_cost", top: "ai_pembukuan_otomatis" },
    { main: "fraud", detail: "transaction_anomaly", top: "ai_fraud_detection" },
    { main: "cash_stock", detail: "cashflow_blind", top: "ai_prediksi_cashflow" },
    { main: "reporting", detail: "slow_reports", top: "ai_report_generator" },
    { main: "brand_trust", detail: "google_visibility", top: "ai_organic_traffic_builder" }
  ];
  for (const testCase of detailCases) {
    const selected = selectSolutions({
      mainChallenges: [testCase.main],
      detailChallenges: [testCase.detail],
      impactLevel: "",
      frictionSource: "",
      adoptionStyle: ""
    }).map((solution) => solution.id);

    assert.equal(selected[0], testCase.top, `${testCase.detail} should drive the first recommended solution`);
    assert.ok(selected.length >= 3 && selected.length <= 4, `${testCase.detail} should return 3-4 solutions`);
    assert.equal(new Set(selected).size, selected.length, `${testCase.detail} selection must be unique`);
    assert.ok(selected.every((id) => solutionIds.has(id)), `${testCase.detail} must only return AVAILABLE_SOLUTIONS ids`);
  }

  const combined = selectSolutions({
    mainChallenges: ["revenue", "cost"],
    detailChallenges: [],
    impactLevel: "",
    frictionSource: "",
    adoptionStyle: ""
  }).map((solution) => solution.id);
  assert.deepEqual(combined, expectedPrimary.revenue, "secondary challenge must not push result over max 4 solutions");
  assert.equal(new Set(combined).size, combined.length, "selected solutions must be unique");

  const frictionDriven = selectSolutions({
    mainChallenges: ["revenue"],
    detailChallenges: [],
    impactLevel: "critical",
    frictionSource: "delayed_response",
    adoptionStyle: "starting"
  }).map((solution) => solution.id);
  assert.equal(frictionDriven[0], "ai_whatsapp_sales_bot", "friction source should influence which solution appears first");

  assert.deepEqual(calculateImpactRanges({ mainChallenges: ["revenue"], detailChallenges: [], impactLevel: "", frictionSource: "", adoptionStyle: "" }), {
    revenueIncrease: "8-18%",
    hoursSaved: "15-35 jam/bulan"
  });
  assert.deepEqual(calculateImpactRanges({ mainChallenges: ["cost"], detailChallenges: [], impactLevel: "", frictionSource: "", adoptionStyle: "" }), {
    costReduction: "8-15%",
    hoursSaved: "15-35 jam/bulan"
  });
  assert.deepEqual(calculateImpactRanges({ mainChallenges: ["fraud", "brand_trust"], detailChallenges: [], impactLevel: "", frictionSource: "", adoptionStyle: "" }), {
    riskReduction: "15-30%",
    trustLift: "12-22% peningkatan trust signal",
    hoursSaved: "15-35 jam/bulan"
  });

  const chart = buildChart({ mainChallenges: ["fraud"], detailChallenges: [], impactLevel: "critical", frictionSource: "transaction_anomaly", adoptionStyle: "dfy" });
  assert.equal(chart.length, 2);
  assert.equal(chart[0].name, "Before");
  assert.ok(chart[0].before > 0);
  assert.equal(chart[0].after, 0);
  assert.equal(chart[1].name, "After AI");
  assert.ok(chart[1].after > 0);
  assert.equal(chart[1].before, 0);

  // The diagnosis pack must produce a measurable, honest, source-backed promise.
  const diagnosisAnswers = { mainChallenges: ["revenue"], detailChallenges: ["follow_up", "repeat_order"], impactLevel: "critical", frictionSource: "delayed_response", adoptionStyle: "starting", detailNote: "" };
  const diagnosisSolutions = selectSolutions(diagnosisAnswers);
  const pack = buildDiagnosisPack(diagnosisAnswers, diagnosisSolutions, calculateImpactRanges(diagnosisAnswers));
  assert.ok(pack.diagnosis.includes("follow-up lead lambat"), "diagnosis must reflect the client's specific detail challenges");
  assert.ok(pack.rootCause.text.length > 0 && pack.rootCause.source.length > 0, "root cause must carry text and a source");
  assert.ok(Array.isArray(pack.promise.measuredBy) && pack.promise.measuredBy.length >= 1, "promise must list how it is measured");
  assert.ok(pack.promise.disclaimer.toLowerCase().includes("estimasi"), "promise must stay honest with an estimate disclaimer");
  assert.ok(pack.firstStep.toLowerCase().includes("pilot"), "first step for a starting adopter must propose a pilot");

  // The action plan must be a concrete, three-phase roadmap tied to the selected solutions.
  const plan = buildActionPlan(diagnosisAnswers, diagnosisSolutions, calculateImpactRanges(diagnosisAnswers));
  assert.equal(plan.length, 3, "action plan must have exactly three phases");
  assert.ok(plan[0].title.includes("Fase 1"), "first phase must be the quick win");
  assert.ok(plan[0].solutions.length >= 1, "quick win phase must name at least one selected solution");
  assert.ok(plan.every((phase) => phase.timeframe && phase.focus && phase.outcome), "each phase must carry timeframe, focus, and outcome");

  const fallbackResult = buildFallbackResult("session-test", diagnosisAnswers, diagnosisSolutions, calculateImpactRanges(diagnosisAnswers));
  assert.ok(fallbackResult.solutionCards?.[0]?.whyThisFits && fallbackResult.solutionCards[0].whyThisFits.includes("follow-up"), "final result cards should explain why a solution fits the selected bottleneck");
  assert.ok(fallbackResult.solutionCards?.[0]?.expectedOutcome && fallbackResult.solutionCards[0].expectedOutcome.length > 0, "final result cards should describe the fastest outcome to expect");
  assert.ok(fallbackResult.solutionCards?.[0]?.watchout && fallbackResult.solutionCards[0].watchout.length > 0, "final result cards should include an implementation watchout");

  // Optional statistics: only echo numbers the user actually typed, never invent them.
  const signals = extractUserSignals("Omzet kami sekitar Rp100 juta/bulan, ada 50 chat WA per hari, tim 5 orang.");
  assert.ok(signals.length >= 2, "user signals must extract numeric figures from the note");
  assert.ok(signals.some((signal) => /chat/i.test(signal)), "should capture cadence-style signals like chat per day");
  assert.deepEqual(extractUserSignals(""), [], "empty note must not fabricate signals");
  assert.deepEqual(extractUserSignals("Kami hanya ingin lebih efisien tanpa menyebut angka."), [], "qualitative-only notes must not invent signals");
  assert.ok(buildCostOfInaction({ mainChallenges: ["cost"], detailChallenges: [], impactLevel: "", frictionSource: "", adoptionStyle: "" }).length > 0, "cost of inaction must be present");

  console.log(JSON.stringify({ ok: true, checked: "rule-engine", challenges: Object.keys(expectedPrimary).length, solutions: AVAILABLE_SOLUTIONS.length }, null, 2));
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
