import { getDb } from "@/lib/db";

const PROMPT_LEARNING_TIMEOUT_MS = 6000;

export type PromptLearningSource = "session_result" | "discovery_request";

type PromptLearningRecommendation = {
  focus: string;
  promptPatch: string;
  reason: string;
};

function buildFallbackRecommendation(sourceType: PromptLearningSource, snapshot: Record<string, unknown>): PromptLearningRecommendation {
  const answers = (snapshot.answers && typeof snapshot.answers === "object" ? snapshot.answers : {}) as {
    otherAnswers?: Record<string, string>;
  };
  const otherCount = Object.values(answers.otherAnswers || {}).filter(Boolean).length;

  if (otherCount > 0) {
    return {
      focus: "Perluasan pilihan funnel",
      promptPatch: "Tambahkan lebih banyak contoh konkret dan sinonim pada pertanyaan yang paling sering dijawab lewat Other, lalu gunakan istilah yang lebih pendek.",
      reason: "Session ini memakai jalur Other sehingga prompt funnel kemungkinan masih terlalu sempit atau terlalu teknis."
    };
  }

  if (sourceType === "discovery_request") {
    return {
      focus: "Konteks discovery",
      promptPatch: "Pastikan prompt discovery selalu meminta ukuran bisnis, yearly revenue, dan prioritas implementasi sebelum memberi rekomendasi berikutnya.",
      reason: "Discovery request baru memberi sinyal bahwa prompt perlu lebih cepat menangkap konteks bisnis inti."
    };
  }

  return {
    focus: "Ringkas dan tajam",
    promptPatch: "Perkuat pembuka report agar diawali TLDR, unique mechanism, dan perubahan tercepat yang bisa dirasakan sebelum masuk detail teknis.",
    reason: "Fallback rule menandakan prompt masih bisa dibuat lebih cepat dipahami."
  };
}

async function buildPromptLearningRecommendation(sourceType: PromptLearningSource, snapshot: Record<string, unknown>): Promise<PromptLearningRecommendation> {
  if (!process.env.OPENAI_API_KEY) {
    return buildFallbackRecommendation(sourceType, snapshot);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROMPT_LEARNING_TIMEOUT_MS);

  try {
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
              "Act as UX and CRO prompt tuner for Pesat.AI.",
              "Baca satu record baru dari database dan sarankan SATU patch prompt yang paling berguna.",
              "Fokus pada hal yang membuat funnel lebih mudah dipahami, pilihan jawaban lebih relevan, dan report lebih cepat memberi nilai.",
              "Jawab ringkas dalam JSON valid."
            ].join("\n")
          },
          {
            role: "user",
            content: JSON.stringify({ sourceType, snapshot })
          }
        ],
        text: {
          format: {
            type: "json_schema",
            name: "prompt_learning_recommendation",
            schema: {
              type: "object",
              additionalProperties: false,
              required: ["focus", "promptPatch", "reason"],
              properties: {
                focus: { type: "string" },
                promptPatch: { type: "string" },
                reason: { type: "string" }
              }
            },
            strict: true
          }
        }
      })
    });

    if (!response.ok) {
      return buildFallbackRecommendation(sourceType, snapshot);
    }

    const data = (await response.json()) as { output_text?: string };
    if (!data.output_text) {
      return buildFallbackRecommendation(sourceType, snapshot);
    }

    return JSON.parse(data.output_text) as PromptLearningRecommendation;
  } catch {
    return buildFallbackRecommendation(sourceType, snapshot);
  } finally {
    clearTimeout(timeout);
  }
}

export async function storePromptLearningEvent({
  sessionId,
  sourceRef,
  sourceType,
  snapshot
}: {
  sessionId?: string | null;
  sourceRef: string;
  sourceType: PromptLearningSource;
  snapshot: Record<string, unknown>;
}) {
  const sql = getDb();
  if (!sql) return;

  const recommendation = await buildPromptLearningRecommendation(sourceType, snapshot);

  await sql`
    INSERT INTO prompt_learning_events (session_id, source_type, source_ref, recommendation, snapshot)
    VALUES (${sessionId || null}, ${sourceType}, ${sourceRef}, ${JSON.stringify(recommendation)}::jsonb, ${JSON.stringify(snapshot)}::jsonb)
  `;
}
