import { buildFallbackResult } from "@/lib/rule-engine";
import { normalizeModelPayload, type ModelPayload } from "@/lib/result-normalizer";
import type { GeneratedResult, ImpactRanges, PesatSolution, WizardAnswers } from "@/lib/types";

const OPENAI_TIMEOUT_MS = 20000;

export async function generateResultCopy(sessionId: string, answers: WizardAnswers, solutions: PesatSolution[], impactRanges: ImpactRanges): Promise<GeneratedResult> {
  const fallback = buildFallbackResult(sessionId, answers, solutions, impactRanges);

  if (!process.env.OPENAI_API_KEY) {
    return fallback;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.5",
        input: [
          {
            role: "system",
            content: [
              "Kamu konsultan transformasi AI senior di Pesat.AI yang menulis ringkasan hasil untuk pemilik bisnis. Ubah input terstruktur menjadi JSON valid sesuai schema.",
              "ATURAN KERAS (anti-halusinasi): jangan menciptakan solusi, angka, persentase, sumber, atau statistik baru di luar input. Setiap angka/persentase WAJIB persis dari impactRanges atau userSignals. Jika tidak ada angka di input, tetap kualitatif, JANGAN mengarang statistik.",
              "Gaya: bahasa Indonesia, profesional dan kredibel seperti konsultan strategi; tajam, spesifik, berbasis bukti, percaya diri tanpa hype. Hindari klise dan kata kosong.",
              "Tujuan: pembaca merasa benar-benar dipahami dan melihat jalan keluar yang jelas, sehingga tertarik melanjutkan ke discovery call dengan Pesat.AI.",
              "Buat hasil personal dan insightful, bukan generik:",
              "- 'headline': tajam, singkat, dan spesifik. Sebut area fokus utama dari diagnosisContext.focusRows bila tersedia. Hindari headline template seperti 'ada peluang' atau 'bisa ditingkatkan'.",
              "- 'subheadline': jelaskan kenapa masalah ini penting sekarang, hubungkan ke ritme bisnis user dan metrik yang akan diukur. Gunakan diagnosisContext.insightStats sebagai anchor bila membantu.",
              "- 'diagnosis': cerminkan masalah SPESIFIK klien dari answers.detailChallenges dan detailNote. Jika userSignals berisi angka dari klien (mis. jumlah chat, omzet, jam kerja), gunakan untuk membuat insight lebih konkret. Tunjukkan kamu paham, lalu reframe ke akar masalah. Dasar: diagnosisContext.deterministicDiagnosis.",
              "- 'promiseStatement': janji meyakinkan TAPI jujur. Wajib menyebut rentang dari impactRanges apa adanya, sebut diukur lewat diagnosisContext.promiseFrame.measuredBy, dan tegaskan ini estimasi bukan garansi.",
              "- 'costOfInaction': konsekuensi jujur bila masalah dibiarkan, untuk membangun urgensi tanpa menakut-nakuti berlebihan. Boleh merujuk userSignals, tapi JANGAN mengarang angka. Dasar: diagnosisContext.costOfInactionFrame.",
              "- 'firstStep': satu langkah pertama konkret dan realistis, sesuaikan dengan answers.adoptionStyle. Dasar: diagnosisContext.firstStepFrame.",
              "- 'headline','subheadline','impactCards','beforeAfterText','uniqueMechanism','solutionsText': isi sesuai input. impactCards.value harus salah satu nilai dari impactRanges.",
              "Jika ragu, ikuti deterministicDiagnosis/promiseFrame/firstStepFrame/costOfInactionFrame daripada mengarang."
            ].join("\n")
          },
          {
            role: "user",
            content: JSON.stringify({
              answers,
              detailNote: answers.detailNote || "",
              userSignals: fallback.userSignals,
              solutions,
              impactRanges,
              diagnosisContext: {
                deterministicDiagnosis: fallback.diagnosis,
                rootCause: fallback.rootCause,
                promiseFrame: {
                  ranges: impactRanges,
                  timeframe: fallback.promise.timeframe,
                  measuredBy: fallback.promise.measuredBy,
                  disclaimer: fallback.promise.disclaimer
                },
                insightStats: fallback.insightStats,
                focusRows: fallback.focusRows,
                firstStepFrame: fallback.firstStep,
                costOfInactionFrame: fallback.costOfInaction,
                adoptionStyle: answers.adoptionStyle
              },
              requiredShape: {
                headline: "string",
                subheadline: "string",
                diagnosis: "string (cermin masalah spesifik klien, pakai userSignals bila ada)",
                promiseStatement: "string (janji terukur + jujur)",
                costOfInaction: "string (konsekuensi jujur bila dibiarkan)",
                firstStep: "string (langkah pertama sesuai adoptionStyle)",
                impactCards: [{ title: "string", value: "string", description: "string" }],
                beforeAfterText: ["string sebelum", "string sesudah"],
                uniqueMechanism: "string",
                solutionsText: ["string"]
              }
            })
          }
        ],
        text: {
          format: {
            type: "json_schema",
            name: "pesat_ai_result",
            schema: {
              type: "object",
              additionalProperties: false,
              required: ["headline", "subheadline", "diagnosis", "promiseStatement", "costOfInaction", "firstStep", "impactCards", "beforeAfterText", "uniqueMechanism", "solutionsText"],
              properties: {
                headline: { type: "string" },
                subheadline: { type: "string" },
                diagnosis: { type: "string" },
                promiseStatement: { type: "string" },
                costOfInaction: { type: "string" },
                firstStep: { type: "string" },
                impactCards: {
                  type: "array",
                  minItems: 2,
                  maxItems: 3,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["title", "value", "description"],
                    properties: {
                      title: { type: "string" },
                      value: { type: "string" },
                      description: { type: "string" }
                    }
                  }
                },
                beforeAfterText: {
                  type: "array",
                  minItems: 2,
                  maxItems: 2,
                  items: { type: "string" }
                },
                uniqueMechanism: { type: "string" },
                solutionsText: {
                  type: "array",
                  minItems: 3,
                  maxItems: 4,
                  items: { type: "string" }
                }
              }
            },
            strict: true
          }
        }
      })
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return fallback;
    }

    const data = (await response.json()) as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> };
    const text = data.output_text || data.output?.flatMap((item) => item.content || []).map((content) => content.text).filter(Boolean).join("\n");
    if (!text) return fallback;

    const parsed = normalizeModelPayload(JSON.parse(text) as Partial<ModelPayload>, fallback, solutions, impactRanges);
    const { diagnosis, promiseStatement, costOfInaction, firstStep, ...copy } = parsed;
    return {
      ...fallback,
      ...copy,
      sessionId,
      solutions,
      impactRanges,
      chart: fallback.chart,
      diagnosis,
      // rootCause and the structured promise frame stay deterministic to protect
      // source attribution and keep the promise measurable; the LLM only writes the prose statement.
      rootCause: fallback.rootCause,
      promise: { ...fallback.promise, statement: promiseStatement },
      costOfInaction,
      // userSignals are extracted deterministically from the user's own input — never invented by the LLM.
      userSignals: fallback.userSignals,
      firstStep,
      llmFallback: false
    };
  } catch {
    return fallback;
  }
}
