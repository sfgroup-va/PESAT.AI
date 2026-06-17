import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const root = process.cwd();
const source = fs.readFileSync(path.join(root, "lib", "solutions.ts"), "utf8").replace(/^import type .*;\r?\n/m, "");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
    strict: true
  }
}).outputText;

const tempFile = path.join(os.tmpdir(), `pesat-solutions-${Date.now()}.mjs`);
fs.writeFileSync(tempFile, compiled, "utf8");

try {
  const { AVAILABLE_SOLUTIONS, CHALLENGE_LABELS, FRICTION_SOLUTION_MAP, buildSmartQuestionCopy, buildTransitionFact } = await import(pathToFileURL(tempFile).href);
  const challengeIds = ["revenue", "cost", "fraud", "cash_stock", "reporting", "brand_trust"];
  const challengeSet = new Set(challengeIds);

  assert.equal(AVAILABLE_SOLUTIONS.length, 31, "AVAILABLE_SOLUTIONS must contain exactly 31 services");
  assert.deepEqual(Object.keys(CHALLENGE_LABELS).sort(), [...challengeIds].sort());

  const ids = AVAILABLE_SOLUTIONS.map((solution) => solution.id);
  const names = AVAILABLE_SOLUTIONS.map((solution) => solution.name);
  assert.equal(new Set(ids).size, ids.length, "solution ids must be unique");
  assert.equal(new Set(names.map((name) => name.toLowerCase())).size, names.length, "solution names must be unique");

  for (const solution of AVAILABLE_SOLUTIONS) {
    assert.match(solution.id, /^ai_[a-z0-9_]+$/, `${solution.id} must be a stable snake_case id`);
    assert.ok(solution.name.length >= 8 && solution.name.length <= 80, `${solution.id} must have a concise name`);
    assert.ok(solution.description.length >= 55 && solution.description.length <= 180, `${solution.id} must have a useful one-sentence description`);
    assert.ok(Array.isArray(solution.cluster) && solution.cluster.length >= 1, `${solution.id} must have at least one cluster`);
    assert.ok(solution.cluster.every((cluster) => challengeSet.has(cluster)), `${solution.id} must only use known challenge clusters`);
  }

  const clustersWithSolutions = new Set(AVAILABLE_SOLUTIONS.flatMap((solution) => solution.cluster));
  assert.deepEqual([...clustersWithSolutions].sort(), [...challengeSet].sort(), "every challenge must have at least one solution");

  assert.ok(Array.isArray(FRICTION_SOLUTION_MAP.delayed_response), "friction map must exist so q4 affects recommendations");
  assert.ok(FRICTION_SOLUTION_MAP.delayed_response.includes("ai_whatsapp_sales_bot"), "delayed response should prioritize solutions that improve response speed");

  const smartCopy = buildSmartQuestionCopy({
    mainChallenges: ["revenue"],
    detailChallenges: ["follow_up"],
    frictionSource: "delayed_response"
  });
  assert.ok(smartCopy.q4.title.toLowerCase().includes("follow-up"), "smart question copy should reflect the selected detail challenge");
  assert.ok(smartCopy.q6.helper.toLowerCase().includes("generik"), "smart question copy should steer the user away from generic answers");

  const detailTransition = buildTransitionFact(
    {
      mainChallenges: ["revenue"],
      detailChallenges: ["follow_up"]
    },
    "q2"
  );
  assert.ok(detailTransition.text.toLowerCase().includes("respons"), "detail transition fact should reflect the selected bottleneck");
  assert.ok(!detailTransition.text.toLowerCase().includes("retensi"), "detail transition fact should avoid unrelated generic copy");

  console.log(JSON.stringify({ ok: true, checked: "solutions", solutions: AVAILABLE_SOLUTIONS.length, clusters: challengeIds.length }, null, 2));
} finally {
  fs.rmSync(tempFile, { force: true });
}
