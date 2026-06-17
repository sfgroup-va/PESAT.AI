import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const sourcePath = path.join(root, "lib", "admin-summary.ts");
const source = fs.readFileSync(sourcePath, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
    strict: true
  }
}).outputText;

const tempFile = path.join(os.tmpdir(), `pesat-admin-summary-${Date.now()}.mjs`);
fs.writeFileSync(tempFile, compiled, "utf8");

try {
  const { buildAdminSummary } = await import(pathToFileURL(tempFile).href);
  const summary = buildAdminSummary(
    [
      { completed: true, discovery_requested: true },
      { completed: true, discovery_requested: false },
      { completed: false, discovery_requested: false }
    ],
    [
      { type: "screen_view", screen: "q1", metadata: null },
      { type: "screen_view", screen: "q1", metadata: null },
      { type: "screen_view", screen: "q2", metadata: null },
      { type: "click", screen: "result", metadata: { cta: "Export PDF" } },
      { type: "click", screen: "result", metadata: { cta: "Export PDF" } },
      { type: "click", screen: "result", metadata: { cta: "Copy Link" } },
      { type: "click", screen: "leadGate", metadata: {} }
    ],
    [{ id: "discovery-1" }]
  );

  assert.equal(summary.sessions.total, 3);
  assert.equal(summary.sessions.completed, 2);
  assert.equal(summary.sessions.discoveryRequested, 1);
  assert.equal(summary.discoveryRequests, 1);
  assert.equal(summary.rates.completionRate, 66.7);
  assert.equal(summary.rates.discoveryRate, 50);
  assert.deepEqual(summary.funnel.slice(0, 3), [
    { screen: "q1", count: 2 },
    { screen: "q2", count: 1 },
    { screen: "q3", count: 0 }
  ]);
  assert.deepEqual(summary.dropOff.slice(0, 3), [
    { screen: "q1", count: 2, previous: 2, lost: 0, conversionRate: 100, dropOffRate: 0 },
    { screen: "q2", count: 1, previous: 2, lost: 1, conversionRate: 50, dropOffRate: 50 },
    { screen: "q3", count: 0, previous: 1, lost: 1, conversionRate: 0, dropOffRate: 100 }
  ]);
  assert.equal(summary.clicks.total, 4);
  assert.deepEqual(summary.clicks.byCta, [
    { cta: "Export PDF", count: 2 },
    { cta: "Copy Link", count: 1 },
    { cta: "leadGate", count: 1 }
  ]);

  console.log(JSON.stringify({ ok: true, checked: "admin-summary", clicks: summary.clicks.total }, null, 2));
} finally {
  fs.rmSync(tempFile, { force: true });
}
