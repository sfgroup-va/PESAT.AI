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
    validateEventPayload,
    sanitizeResultChatPayload,
    validateResultChatPayload
  } = await import(pathToFileURL(tempFile).href);

  const thousandWordNote = Array.from({ length: 1005 }, (_, index) => `kata${index + 1}`).join(" ");
  const answers = sanitizeAnswers({
    mainChallenges: ["revenue", "fraud", "cost", "fake"],
    detailChallenges: ["follow_up", "follow_up", "repeat_order", "pricing", "lead_quality", "admin_cost", "manual_docs", "invoice_ap", "process_waste", "fake"],
    impactLevel: "revenue",
    adoptionStyle: "dfy",
    detailNote: thousandWordNote
  });
  assert.deepEqual(answers.mainChallenges, ["revenue", "fraud"]);
  assert.deepEqual(answers.detailChallenges, ["follow_up", "repeat_order", "pricing", "lead_quality", "admin_cost", "manual_docs", "invoice_ap", "process_waste"]);
  assert.equal(answers.detailNote.split(/\s+/).length, 1000);
  assert.deepEqual(validateCompleteAnswers(answers), { ok: true, missing: [] });
  assert.deepEqual(validateCompleteAnswers(sanitizeAnswers({})).missing, ["mainChallenges", "detailChallenges", "impactLevel", "adoptionStyle"]);
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
  assert.deepEqual(validateDiscoveryPayload(sanitizeDiscoveryPayload({ companyName: "", name: "", wa: "123" })).missing, ["companyName", "name", "wa"]);

  const event = sanitizeEventPayload({
    sessionId: "session-1",
    type: "click",
    screen: "s7",
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
  assert.equal(event.screen, "s7");
  assert.equal(event.metadata.badkey, "value");
  assert.equal(event.metadata.okNumber, 12);
  assert.equal(event.metadata.okBool, true);
  assert.equal(event.metadata.longText.length, 180);
  assert.equal("nested" in event.metadata, false);
  assert.deepEqual(validateEventPayload(event), { ok: true, missing: [] });
  assert.deepEqual(validateEventPayload(sanitizeEventPayload({ type: "bad", screen: "unknown" })).missing, ["type", "screen"]);

  const chatPayload = sanitizeResultChatPayload({
    sessionId: "s".repeat(120),
    question: Array.from({ length: 140 }, (_, index) => `tanya${index + 1}`).join(" "),
    context: {
      headline: "Optimasi AI untuk penjualan pisang goreng",
      subheadline: "Ringkas",
      diagnosis: "Follow-up belum konsisten",
      firstStep: "Mulai dari SOP follow-up",
      costOfInaction: "Peluang repeat order terus bocor",
      uniqueMechanism: "Workflow follow-up AI",
      promiseStatement: "Naik 10-20%",
      measuredBy: ["closing rate", "repeat order", "lead response time", "extra"],
      solutionsText: ["Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh"],
      mainChallenges: ["revenue", "cost", "fraud", "extra"],
      adoptionLabel: "Mode DIY",
      detailNote: Array.from({ length: 1005 }, (_, index) => `detail${index + 1}`).join(" "),
      priorityFocus: "pricing",
      discoveryGoal: "cek scope",
      impactCards: [{ title: "Revenue", value: "10-20%", description: "desc", extra: "ignore" }],
      plan: [{ title: "Fase 1", timeframe: "Minggu 1-2", focus: "pilot", outcome: "hasil", extra: "ignore" }]
    },
    history: [
      { role: "user", content: "Apa dulu yang dibenahi?" },
      { role: "assistant", content: "Mulai dari follow-up." },
      { role: "bad", content: "Ignore me" }
    ]
  });
  assert.equal(chatPayload.sessionId.length, 80);
  assert.equal(chatPayload.question.split(/\s+/).length, 120);
  assert.equal(chatPayload.context.measuredBy.length, 4);
  assert.equal(chatPayload.context.solutionsText.length, 6);
  assert.equal(chatPayload.context.mainChallenges.length, 3);
  assert.equal(chatPayload.context.detailNote.split(/\s+/).length, 1000);
  assert.equal(chatPayload.history.length, 2);
  assert.deepEqual(validateResultChatPayload(chatPayload), { ok: true, missing: [] });
  assert.deepEqual(
    validateResultChatPayload(
      sanitizeResultChatPayload({
        question: "",
        context: { headline: "", diagnosis: "" },
        history: [
          { role: "user", content: "1" },
          { role: "assistant", content: "a" },
          { role: "user", content: "2" },
          { role: "assistant", content: "b" },
          { role: "user", content: "3" }
        ]
      })
    ).missing,
    ["question", "context.headline", "context.diagnosis", "limit"]
  );

  console.log(JSON.stringify({ ok: true, checked: "validation", answerChallenges: answers.mainChallenges.length, metadataKeys: Object.keys(event.metadata).length }, null, 2));
} finally {
  fs.rmSync(tempFile, { force: true });
}
