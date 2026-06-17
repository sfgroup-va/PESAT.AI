import { CHALLENGE_LABELS, DETAIL_LABELS } from "@/lib/solutions";
import type { AdoptionId, ChallengeId, DetailId, FrictionSourceId, ImpactId, IntakePathId, OtherAnswerKey, WizardAnswers } from "@/lib/types";

export type ChoiceOption<T extends string> = {
  id: T | "other";
  label: string;
  note?: string;
  emoji?: string;
};

export const INTAKE_PATH_OPTIONS: ChoiceOption<IntakePathId>[] = [
  { id: "sales", label: "Penjualan / omzet bocor", note: "Lead ada, tapi closing atau repeat order tidak naik", emoji: "📈" },
  { id: "ops", label: "Operasional masih manual", note: "Tim sibuk input ulang, laporan telat, kerja admin numpuk", emoji: "⚙️" },
  { id: "cash_control", label: "Kas, stok, atau kontrol sering meleset", note: "Cashflow, approval, stok, atau anomali bikin keputusan reaktif", emoji: "🧭" },
  { id: "brand", label: "Brand sulit dipercaya / ditemukan", note: "Google, review, dan AI search belum bantu demand", emoji: "🔎" },
  { id: "other", label: "Other", note: "Kalau tidak ada yang pas, tulis singkat versi Anda", emoji: "✍️" }
];

export const DETAIL_OPTIONS_BY_PATH: Record<Exclude<IntakePathId, "other">, ChoiceOption<DetailId>[]> = {
  sales: [
    { id: "follow_up", label: "Follow-up lambat", note: "Chat masuk, tapi tidak cepat dibalas", emoji: "⚡" },
    { id: "repeat_order", label: "Repeat order rendah", note: "Pelanggan lama jarang ditrigger beli lagi", emoji: "🔁" },
    { id: "pricing", label: "Harga / margin kurang sehat", note: "Harga sulit diatur dan diskon tidak terukur", emoji: "💸" },
    { id: "lead_quality", label: "Lead ramai tapi kurang pas", note: "Sales habis waktu di prospek yang lemah", emoji: "🎯" },
    { id: "other", label: "Other", note: "Tulis masalah penjualan Anda sendiri", emoji: "✍️" }
  ],
  ops: [
    { id: "admin_cost", label: "Kerja admin terlalu banyak", note: "Tim terlalu sering input dan cek manual", emoji: "🧾" },
    { id: "manual_docs", label: "Dokumen lambat diproses", note: "Baca file dan input ulang masih manual", emoji: "📄" },
    { id: "slow_reports", label: "Laporan telat siap", note: "Keputusan mundur karena angka datang terlambat", emoji: "📊" },
    { id: "no_bi", label: "Belum ada dashboard rapi", note: "Setiap tim punya angka versi sendiri", emoji: "🖥️" },
    { id: "other", label: "Other", note: "Tulis masalah operasional Anda sendiri", emoji: "✍️" }
  ],
  cash_control: [
    { id: "cashflow_blind", label: "Cashflow sulit diprediksi", note: "Keputusan selalu reaktif saat kas mulai ketat", emoji: "💰" },
    { id: "stockout", label: "Stok sering habis mendadak", note: "Barang kosong saat demand datang", emoji: "📦" },
    { id: "transaction_anomaly", label: "Anomali telat ketahuan", note: "Masalah baru terlihat setelah rugi", emoji: "🚨" },
    { id: "approval_gap", label: "Approval gampang jebol", note: "Kontrol lemah dan audit trail kurang jelas", emoji: "🛡️" },
    { id: "other", label: "Other", note: "Tulis masalah kas, stok, atau kontrol Anda sendiri", emoji: "✍️" }
  ],
  brand: [
    { id: "google_visibility", label: "Susah muncul di Google", note: "Traffic organik tidak tumbuh seperti yang diharapkan", emoji: "🌐" },
    { id: "ai_search", label: "Belum kebaca di AI search", note: "ChatGPT atau Perplexity belum menjelaskan brand Anda", emoji: "🤖" },
    { id: "review_sentiment", label: "Review / sentimen kurang terbaca", note: "Sinyal trust tidak cepat tertangkap", emoji: "💬" },
    { id: "other", label: "Other", note: "Tulis masalah brand atau demand Anda sendiri", emoji: "✍️" }
  ]
};

export const DEFAULT_CHALLENGE_BY_PATH: Record<Exclude<IntakePathId, "other">, ChallengeId> = {
  sales: "revenue",
  ops: "cost",
  cash_control: "cash_stock",
  brand: "brand_trust"
};

export const IMPACT_OPTIONS: ChoiceOption<ImpactId>[] = [
  { id: "mild", label: "Jarang", note: "Masih sesekali, tapi mulai ganggu", emoji: "🟢" },
  { id: "weekly", label: "Setiap minggu", note: "Sudah rutin bikin tim repot", emoji: "🟡" },
  { id: "often", label: "Hampir tiap hari", note: "Tim sibuk mengejar masalah yang sama", emoji: "🟠" },
  { id: "critical", label: "Tiap hari dan ganggu growth", note: "Peluang hilang atau biaya naik terus", emoji: "🔴" },
  { id: "other", label: "Other", note: "Kalau polanya beda, tulis sendiri", emoji: "✍️" }
];

export const FRICTION_OPTIONS: ChoiceOption<FrictionSourceId>[] = [
  { id: "duplicate_data", label: "Input ulang / kerja manual", note: "Data yang sama disentuh berkali-kali", emoji: "🔁" },
  { id: "manual_reports", label: "Laporan dirapikan manual", note: "Copy-paste dan cocokkan angka masih dominan", emoji: "📑" },
  { id: "delayed_response", label: "Follow-up / respon lambat", note: "Peluang hilang karena tim telat balas", emoji: "⏳" },
  { id: "approval_bottleneck", label: "Approval / SOP tidak jelas", note: "Tanggung jawab akhir sering menggantung", emoji: "🚧" },
  { id: "other", label: "Other", note: "Tulis sumber gesekan utamanya", emoji: "✍️" }
];

export const ADOPTION_OPTIONS: ChoiceOption<AdoptionId>[] = [
  { id: "dfy", label: "Pesat bangunkan untuk kami", note: "Kami butuh hasil cepat", emoji: "🚀" },
  { id: "hybrid", label: "Setup bareng tim kami", note: "Kami ingin jalan sambil belajar", emoji: "🤝" },
  { id: "diy", label: "Kami eksekusi sendiri", note: "Butuh blueprint dan arahan", emoji: "🛠️" },
  { id: "starting", label: "Mulai pilot kecil dulu", note: "Kami ingin bukti dampak lebih dulu", emoji: "🧪" },
  { id: "other", label: "Other", note: "Kalau modelnya beda, tulis singkat", emoji: "✍️" }
];

const OTHER_PLACEHOLDERS: Record<OtherAnswerKey, string> = {
  mainChallenge: "Contoh: banyak approval lewat chat pribadi dan owner baru sadar masalah saat akhir minggu.",
  detailChallenge: "Contoh: banyak order masuk, tapi tim bingung mana yang harus diprioritaskan lebih dulu.",
  impactLevel: "Contoh: masalahnya muncul 2-3 kali per minggu dan paling kerasa pas akhir bulan.",
  frictionSource: "Contoh: tiap tim punya format sendiri, jadi angka sering tidak ketemu saat dicek ulang.",
  adoptionStyle: "Contoh: kami butuh partner yang bantu setup dulu, lalu tim internal ambil alih pelan-pelan."
};

export function getOtherPlaceholder(key: OtherAnswerKey) {
  return OTHER_PLACEHOLDERS[key];
}

export function getDetailOptionsForPath(path: IntakePathId | ""): ChoiceOption<DetailId>[] {
  if (!path || path === "other") return DETAIL_OPTIONS_BY_PATH.sales;
  return DETAIL_OPTIONS_BY_PATH[path];
}

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

export function inferIntakePathFromText(value: string): Exclude<IntakePathId, "other"> {
  const text = value.toLowerCase();
  if (includesAny(text, ["google", "review", "brand", "konten", "search", "reputasi", "traffic"])) return "brand";
  if (includesAny(text, ["stok", "cash", "kas", "approval", "fraud", "anomali", "kontrol"])) return "cash_control";
  if (includesAny(text, ["laporan", "admin", "input", "dokumen", "operasional", "manual"])) return "ops";
  return "sales";
}

export function inferDetailFromText(path: IntakePathId | "", value: string): { detail: DetailId; challenge: ChallengeId } {
  const text = value.toLowerCase();

  if (path === "brand") {
    if (includesAny(text, ["review", "rating", "sentimen", "komplain"])) return { detail: "review_sentiment", challenge: "brand_trust" };
    if (includesAny(text, ["ai", "chatgpt", "perplexity", "answer engine"])) return { detail: "ai_search", challenge: "brand_trust" };
    return { detail: "google_visibility", challenge: "brand_trust" };
  }

  if (path === "cash_control") {
    if (includesAny(text, ["stok", "stockout", "gudang"])) return { detail: "stockout", challenge: "cash_stock" };
    if (includesAny(text, ["approval", "otorisasi", "sop", "audit"])) return { detail: "approval_gap", challenge: "fraud" };
    if (includesAny(text, ["anomali", "fraud", "mencurigakan", "selisih"])) return { detail: "transaction_anomaly", challenge: "fraud" };
    return { detail: "cashflow_blind", challenge: "cash_stock" };
  }

  if (path === "ops") {
    if (includesAny(text, ["dashboard", "bi", "single source", "angka beda"])) return { detail: "no_bi", challenge: "reporting" };
    if (includesAny(text, ["laporan", "meeting", "rekap"])) return { detail: "slow_reports", challenge: "reporting" };
    if (includesAny(text, ["dokumen", "invoice", "file", "pdf"])) return { detail: "manual_docs", challenge: "cost" };
    return { detail: "admin_cost", challenge: "cost" };
  }

  if (includesAny(text, ["repeat", "pelanggan lama", "retensi"])) return { detail: "repeat_order", challenge: "revenue" };
  if (includesAny(text, ["harga", "margin", "diskon"])) return { detail: "pricing", challenge: "revenue" };
  if (includesAny(text, ["lead quality", "lead jelek", "prospek", "closing"])) return { detail: "lead_quality", challenge: "revenue" };
  return { detail: "follow_up", challenge: "revenue" };
}

export function inferImpactFromText(value: string): ImpactId {
  const text = value.toLowerCase();
  if (includesAny(text, ["tiap hari", "setiap hari", "harian", "daily", "growth"])) return "critical";
  if (includesAny(text, ["hampir tiap hari", "sering banget", "nyaris tiap hari"])) return "often";
  if (includesAny(text, ["minggu", "weekly", "1-2 kali"])) return "weekly";
  return "mild";
}

export function inferFrictionFromText(value: string): FrictionSourceId {
  const text = value.toLowerCase();
  if (includesAny(text, ["follow-up", "follow up", "balas", "respon", "response"])) return "delayed_response";
  if (includesAny(text, ["laporan", "rekap", "angka", "copy", "paste"])) return "manual_reports";
  if (includesAny(text, ["approval", "otorisasi", "sop", "handover"])) return "approval_bottleneck";
  return "duplicate_data";
}

export function inferAdoptionFromText(value: string): AdoptionId {
  const text = value.toLowerCase();
  if (includesAny(text, ["sendiri", "internal", "eksekusi"])) return "diy";
  if (includesAny(text, ["bareng", "bersama", "belajar"])) return "hybrid";
  if (includesAny(text, ["pilot", "kecil", "bukti dulu", "tes dulu"])) return "starting";
  return "dfy";
}

export function getReviewValue(stage: OtherAnswerKey | "detailNote", answers: WizardAnswers): string {
  if (stage === "mainChallenge" && answers.otherAnswers?.mainChallenge) return answers.otherAnswers.mainChallenge;
  if (stage === "detailChallenge" && answers.otherAnswers?.detailChallenge) return answers.otherAnswers.detailChallenge;
  if (stage === "impactLevel" && answers.otherAnswers?.impactLevel) return answers.otherAnswers.impactLevel;
  if (stage === "frictionSource" && answers.otherAnswers?.frictionSource) return answers.otherAnswers.frictionSource;
  if (stage === "adoptionStyle" && answers.otherAnswers?.adoptionStyle) return answers.otherAnswers.adoptionStyle;
  if (stage === "detailNote") return answers.detailNote || "";

  if (stage === "mainChallenge") return answers.mainChallenges[0] ? CHALLENGE_LABELS[answers.mainChallenges[0]] : "-";
  if (stage === "detailChallenge") return answers.detailChallenges[0] ? DETAIL_LABELS[answers.detailChallenges[0]] : "-";
  if (stage === "impactLevel") return answers.impactLevel || "-";
  if (stage === "frictionSource") return answers.frictionSource || "-";
  return answers.adoptionStyle || "-";
}
