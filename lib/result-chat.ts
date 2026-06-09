import type { ResultChatMessage, ResultChatReply, ResultFollowUpContext } from "@/lib/types";

const OPENAI_TIMEOUT_MS = 18000;
const MAX_RESULT_CHAT_TURNS = 3;

type ModelPayload = {
  answer?: string;
  suggestions?: string[];
};

export async function generateResultChatReply({
  question,
  history,
  context
}: {
  question: string;
  history: ResultChatMessage[];
  context: ResultFollowUpContext;
}): Promise<ResultChatReply> {
  const usedTurns = history.filter((item) => item.role === "user").length + 1;
  const remainingQuestions = Math.max(0, MAX_RESULT_CHAT_TURNS - usedTurns);
  const fallback = buildFallbackReply(question, context, remainingQuestions);

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
              "Kamu advisor senior Pesat.AI yang menjawab pertanyaan lanjutan setelah mini session selesai.",
              "Jawaban HARUS grounded pada context yang diberikan. Jangan menciptakan angka, tools, vendor, biaya pasti, timeline pasti, atau janji baru di luar context.",
              "Jika user menanyakan detail yang belum bisa dipastikan dari context, jawab jujur apa yang sudah bisa diketahui lalu sebut apa yang perlu divalidasi saat discovery call.",
              "Lanjutkan konteks dari jawaban sebelumnya bila ada history. Nada: profesional, hangat, to-the-point, mudah dipahami pemilik bisnis.",
              "Panjang jawaban ideal 90-180 kata. Lebih baik 2 paragraf pendek atau bullet singkat daripada paragraf panjang.",
              "Beri maksimal 2 saran pertanyaan lanjutan yang benar-benar membantu user mengambil keputusan berikutnya."
            ].join("\n")
          },
          {
            role: "user",
            content: JSON.stringify({
              question,
              history,
              context,
              rules: {
                remainingQuestions,
                maxUserQuestions: MAX_RESULT_CHAT_TURNS,
                answerMustUseOnlyContext: true
              },
              requiredShape: {
                answer: "string",
                suggestions: ["string"]
              }
            })
          }
        ],
        text: {
          format: {
            type: "json_schema",
            name: "pesat_ai_result_chat",
            schema: {
              type: "object",
              additionalProperties: false,
              required: ["answer", "suggestions"],
              properties: {
                answer: { type: "string" },
                suggestions: {
                  type: "array",
                  maxItems: 2,
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

    const parsed = JSON.parse(text) as ModelPayload;
    const answer = typeof parsed.answer === "string" ? parsed.answer.trim() : "";
    const suggestions = Array.isArray(parsed.suggestions)
      ? parsed.suggestions.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 2)
      : [];

    if (!answer) return fallback;

    return {
      answer,
      suggestions,
      remainingQuestions,
      fallback: false
    };
  } catch {
    return fallback;
  }
}

function buildFallbackReply(question: string, context: ResultFollowUpContext, remainingQuestions: number): ResultChatReply {
  const lower = question.toLowerCase();
  const mentionsCost = /\b(biaya|budget|modal|harga|cost)\b/.test(lower);
  const mentionsStep = /\b(langkah|mulai|implement|eksekusi|fase|prioritas)\b/.test(lower);
  const mentionsWhy = /\b(kenapa|mengapa|akar|masalah|problem|tantangan)\b/.test(lower);
  const mentionsMetric = /\b(ukur|indikator|metric|metrik|kpi|hasil)\b/.test(lower);

  let answer = "";

  if (mentionsCost) {
    answer = [
      `Dari hasil mini session ini, yang sudah paling jelas adalah prioritas awal Anda: ${context.firstStep || context.headline}.`,
      "Soal biaya pasti, hasil ini memang belum cukup untuk menguncinya. Yang baru bisa dipastikan sekarang adalah area yang harus diprioritaskan lebih dulu, outcome yang ingin dikejar, dan metrik yang akan dipakai. Biaya final biasanya baru realistis setelah discovery melihat scope implementasi, data yang tersedia, dan seberapa besar bagian yang ingin diotomasi lebih dulu."
    ].join(" ");
  } else if (mentionsStep) {
    const firstPhase = context.plan[0];
    answer = [
      `Kalau ingin mulai paling realistis, pegang dulu langkah pertama ini: ${context.firstStep}.`,
      firstPhase
        ? `Urutannya sebaiknya mengikuti ${firstPhase.title}${firstPhase.timeframe ? ` (${firstPhase.timeframe})` : ""}: ${firstPhase.focus}. Setelah itu baru diperluas bertahap supaya tim tidak kewalahan dan hasilnya tetap bisa diukur.`
        : "Mulailah dari satu use case yang paling dekat ke dampak bisnis, lalu ukur hasilnya sebelum memperluas ke proses lain."
    ].join(" ");
  } else if (mentionsWhy) {
    answer = [
      `Akar masalah yang tertangkap dari hasil ini adalah: ${context.diagnosis}.`,
      context.costOfInaction
        ? `Karena itu, fokusnya bukan sekadar menambah software AI, tapi memastikan software tersebut memperbaiki titik bocor yang paling mahal. Jika dibiarkan, ${context.costOfInaction.toLowerCase()}`
        : "Jadi fokus perbaikannya bukan sekadar menambah tools, tetapi membenahi proses yang paling memengaruhi hasil bisnis."
    ].join(" ");
  } else if (mentionsMetric) {
    answer = [
      `Untuk menilai apakah implementasinya berhasil, hasil mini session ini menyarankan pengukuran lewat: ${context.measuredBy.join(", ") || "metrik operasional utama Anda"}.`,
      context.promiseStatement
        ? `Janji hasil yang ditangkap sekarang adalah ${context.promiseStatement.toLowerCase()}`
        : "Gunakan metrik yang paling dekat ke dampak bisnis supaya keputusan Anda tetap berbasis angka, bukan asumsi."
    ].join(" ");
  } else {
    const strongestCard = context.impactCards[0];
    answer = [
      `Berdasarkan hasil mini session Anda, fokus utamanya saat ini adalah ${context.headline}.`,
      `Arah yang paling masuk akal sekarang: ${context.firstStep || context.uniqueMechanism}.`,
      strongestCard ? `Impact utama yang sedang dikejar adalah ${strongestCard.title} di kisaran ${strongestCard.value}.` : ""
    ]
      .filter(Boolean)
      .join(" ");
  }

  const suggestions = buildFallbackSuggestions(context, question).slice(0, Math.min(2, remainingQuestions));

  return {
    answer,
    suggestions,
    remainingQuestions,
    fallback: true
  };
}

function buildFallbackSuggestions(context: ResultFollowUpContext, question: string) {
  const lower = question.toLowerCase();
  const candidates = [
    `Kalau saya mulai dari ${context.adoptionLabel || "mode ini"}, data apa yang wajib saya siapkan dulu?`,
    `Dari rencana aksi di atas, fase pertama mana yang paling cepat memberi dampak?`,
    `Apa risiko terbesar kalau saya menunda langkah pertama ini 1-2 bulan?`,
    `Kalau fokus saya ${context.priorityFocus || context.mainChallenges[0] || "area ini"}, modul AI mana yang paling dulu diprioritaskan?`
  ];

  if (/\b(biaya|budget|harga|cost)\b/.test(lower)) {
    return candidates.filter((item) => !/\b(biaya|budget|harga|cost)\b/i.test(item));
  }

  return candidates;
}
