import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const root = process.cwd();
const sourcePath = path.join(root, "lib", "result-normalizer.ts");
const source = fs.readFileSync(sourcePath, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
    strict: true
  }
}).outputText;

const tempFile = path.join(os.tmpdir(), `pesat-result-normalizer-${Date.now()}.mjs`);
fs.writeFileSync(tempFile, compiled, "utf8");

try {
  const { normalizeModelPayload } = await import(pathToFileURL(tempFile).href);
  const solutions = [
    { id: "ai_sales_assistant", name: "AI Sales Assistant", cluster: ["revenue"], description: "Follow-up pelanggan otomatis." },
    { id: "ai_repeat_order", name: "AI Repeat Order Engine", cluster: ["revenue"], description: "Aktivasi pembelian ulang." },
    { id: "ai_crm_pintar", name: "AI CRM Pintar", cluster: ["revenue"], description: "Segmentasi pelanggan." }
  ];
  const impactRanges = {
    revenueIncrease: "10-30%",
    hoursSaved: "20-60 jam/bulan"
  };
  const fallback = {
    sessionId: "session-test",
    headline: "Fallback headline",
    subheadline: "Fallback subheadline",
    impactCards: [
      { title: "Revenue Increase", value: "10-30%", description: "Fallback revenue." },
      { title: "Hours Saved", value: "20-60 jam/bulan", description: "Fallback hours." }
    ],
    beforeAfterText: ["Fallback before", "Fallback after"],
    uniqueMechanism: "Fallback mechanism",
    solutionsText: solutions.map((solution) => `${solution.name}: ${solution.description}`),
    solutions,
    impactRanges,
    chart: [],
    llmFallback: true
  };

  const normalized = normalizeModelPayload(
    {
      headline: "Headline valid",
      subheadline: "Subheadline valid",
      impactCards: [
        { title: "Angka palsu", value: "90% revenue", description: "Harus ditolak." },
        { title: "Revenue", value: "10-30%", description: "Angka ini disuplai backend." },
        { title: "Jam", value: "20-60 jam/bulan", description: "Angka ini juga disuplai backend." }
      ],
      beforeAfterText: ["Sebelum valid", "Sesudah valid"],
      uniqueMechanism: "Mechanism valid",
      solutionsText: [
        "AI Sales Assistant: valid karena nama solusi disuplai.",
        "AI Repeat Order Engine: valid karena nama solusi disuplai.",
        "AI CRM Pintar: valid karena nama solusi disuplai.",
        "AI Blockchain Quantum Suite: harus ditolak."
      ]
    },
    fallback,
    solutions,
    impactRanges
  );

  assert.equal(normalized.headline, "Headline valid");
  assert.deepEqual(
    normalized.impactCards.map((card) => card.value),
    ["10-30%", "20-60 jam/bulan"]
  );
  assert.equal(normalized.solutionsText.length, 3);
  assert.ok(normalized.solutionsText.every((item) => !item.includes("Blockchain")));

  const fallbackForBadSolutions = normalizeModelPayload(
    {
      impactCards: [
        { title: "Revenue", value: "10-30%", description: "Valid." },
        { title: "Jam", value: "20-60 jam/bulan", description: "Valid." }
      ],
      solutionsText: ["AI Blockchain Quantum Suite: tidak ada di library."]
    },
    fallback,
    solutions,
    impactRanges
  );

  assert.deepEqual(fallbackForBadSolutions.solutionsText, fallback.solutionsText);

  const fallbackForBadImpacts = normalizeModelPayload(
    {
      impactCards: [
        { title: "Palsu", value: "999%", description: "Tidak boleh dipakai." },
        { title: "Palsu 2", value: "Rp1T", description: "Tidak boleh dipakai." }
      ],
      solutionsText: fallback.solutionsText
    },
    fallback,
    solutions,
    impactRanges
  );

  assert.deepEqual(fallbackForBadImpacts.impactCards, fallback.impactCards);

  console.log(JSON.stringify({ ok: true, checked: "result-normalizer", allowedImpacts: normalized.impactCards.length, allowedSolutions: normalized.solutionsText.length }, null, 2));
} finally {
  fs.rmSync(tempFile, { force: true });
}
