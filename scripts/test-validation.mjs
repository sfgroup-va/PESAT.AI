import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const root = process.cwd();
const source = fs.readFileSync(path.join(root, "lib", "validation.ts"), "utf8").replace(/^import type .*;\r?\n/m, "");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
    strict: true
  }
}).outputText;

const tempFile = path.join(os.tmpdir(), `pesat-validation-${Date.now()}.mjs`);
fs.writeFileSync(tempFile, compiled, "utf8");

try {
  const {
    sanitizeAnswers,
    validateCompleteAnswers,
    sanitizeContact,
    hasUsableWhatsAppNumber,
    sanitizeWordLimitedText,
    sanitizeDiscoveryPayload,
    validateDiscoveryPayload,
    sanitizeEventPayload,
    validateEventPayload
  } = await import(pathToFileURL(tempFile).href);

  const thousandWordNote = Array.from({ length: 1005 }, (_, index) => `kata${index + 1}`).join(" ");
  const answers = sanitizeAnswers({
    mainChallenges: ["revenue", "risk_trust", "cost", "fake"],
    detailChallenges: ["follow_up", "follow_up", "repeat_order", "pricing", "lead_quality", "admin_cost", "manual_docs", "invoice_ap", "process_waste", "fake"],
    impactLevel: "critical",
    frictionSource: "delayed_response",
    adoptionStyle: "dfy",
    detailNote: thousandWordNote
  });
  assert.deepEqual(answers.mainChallenges, ["revenue", "risk_trust"]);
  assert.deepEqual(answers.detailChallenges, ["follow_up", "repeat_order", "pricing", "lead_quality", "admin_cost", "manual_docs", "invoice_ap", "process_waste"]);
  assert.equal(answers.detailNote.split(/\s+/).length, 1000);
  assert.deepEqual(validateCompleteAnswers(answers), { ok: true, missing: [] });
  assert.deepEqual(validateCompleteAnswers(sanitizeAnswers({})).missing, ["mainChallenges", "detailChallenges", "impactLevel", "frictionSource", "adoptionStyle"]);
  assert.equal(sanitizeWordLimitedText("  satu dua tiga  ", 2), "satu dua");

  const contact = sanitizeContact({
    companyName: ` ${"A".repeat(200)} `,
    name: ` ${"B".repeat(200)} `,
    wa: "+62 812 abc<script> 345 6789",
    followUpAllowed: 1
  });
  assert.equal(contact.companyName.length, 160);
  assert.equal(contact.name.length, 120);
  assert.equal(contact.wa, "+62 812  345 6789");
  assert.equal(contact.followUpAllowed, true);

  assert.equal(hasUsableWhatsAppNumber("+628123456789"), true);
  assert.equal(hasUsableWhatsAppNumber("123"), false);
  assert.equal(hasUsableWhatsAppNumber("1".repeat(17)), false);

  const discovery = sanitizeDiscoveryPayload({
    sessionId: "s".repeat(120),
    companyName: "Test Co",
    name: "Tester",
    wa: "+62-812-345-6789 ext!",
    employeeCount: "10-50",
    yearlyRevenue: "1-5 miliar",
    budgetContext: "b".repeat(700),
    message: Array.from({ length: 1505 }, (_, index) => `jawaban${index + 1}`).join(" "),
    summary: "s".repeat(700)
  });
  assert.equal(discovery.sessionId.length, 80);
  assert.equal(discovery.wa, "+62-812-345-6789 ");
  assert.equal(discovery.budgetContext.length, 500);
  assert.equal(discovery.message.split(/\s+/).length, 1500);
  assert.equal(discovery.summary.length, 500);
  assert.deepEqual(validateDiscoveryPayload(discovery), { ok: true, missing: [] });
  assert.deepEqual(validateDiscoveryPayload(sanitizeDiscoveryPayload({ companyName: "", name: "", wa: "123" })).missing, ["companyName", "name", "wa", "employeeCount", "yearlyRevenue"]);

  const event = sanitizeEventPayload({
    sessionId: "session-1",
    type: "click",
    screen: "result",
    metadata: {
      "bad key!": "value",
      nested: { no: true },
      okNumber: 12,
      badNumber: Number.NaN,
      okBool: true,
      longText: "z".repeat(220)
    }
  });
  assert.equal(event.type, "click");
  assert.equal(event.screen, "result");
  assert.equal(event.metadata.badkey, "value");
  assert.equal(event.metadata.okNumber, 12);
  assert.equal(event.metadata.okBool, true);
  assert.equal(event.metadata.longText.length, 180);
  assert.equal("nested" in event.metadata, false);
  assert.deepEqual(validateEventPayload(event), { ok: true, missing: [] });
  assert.deepEqual(validateEventPayload(sanitizeEventPayload({ type: "bad", screen: "unknown" })).missing, ["type", "screen"]);

  console.log(JSON.stringify({ ok: true, checked: "validation", answerChallenges: answers.mainChallenges.length, metadataKeys: Object.keys(event.metadata).length }, null, 2));
} finally {
  fs.rmSync(tempFile, { force: true });
}
