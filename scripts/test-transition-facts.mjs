import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const root = process.cwd();
const sourcePath = path.join(root, "lib", "solutions.ts");
let source = fs.readFileSync(sourcePath, "utf8");
source = source.replace(/^import type .*;\r?\n/m, "");

const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
    strict: true
  }
}).outputText;

const tempFile = path.join(os.tmpdir(), `pesat-transition-facts-${Date.now()}.mjs`);
fs.writeFileSync(tempFile, compiled, "utf8");

try {
  const { TRANSITION_FACTS } = await import(pathToFileURL(tempFile).href);
  const challenges = ["revenue", "cost", "risk_trust", "cash_stock", "reporting"];
  const allowedSources = ["hbr", "orange business", "acfe", "mckinsey", "gartner", "google search central"];

  assert.deepEqual(Object.keys(TRANSITION_FACTS).sort(), [...challenges].sort());

  for (const challenge of challenges) {
    const fact = TRANSITION_FACTS[challenge];
    assert.equal(typeof fact.first, "string", `${challenge}.first must be a string`);
    assert.equal(typeof fact.second, "string", `${challenge}.second must be a string`);
    assert.equal(typeof fact.source, "string", `${challenge}.source must be a string`);
    assert.ok(fact.first.length >= 80 && fact.first.length <= 260, `${challenge}.first length must stay useful for full-screen transition`);
    assert.ok(fact.second.length >= 70 && fact.second.length <= 260, `${challenge}.second length must stay useful for full-screen transition`);
    assert.ok(fact.source.length >= 8 && fact.source.length <= 90, `${challenge}.source must be concise`);
    assert.ok(allowedSources.some((sourceName) => fact.source.toLowerCase().includes(sourceName)), `${challenge}.source must use an approved hardcoded source`);
  }

  console.log(JSON.stringify({ ok: true, checked: "transition-facts", challenges: challenges.length, allowedSources: allowedSources.length }, null, 2));
} finally {
  fs.rmSync(tempFile, { force: true });
}
