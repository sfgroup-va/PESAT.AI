import type { AdoptionId, ChallengeId, ContactData, DetailId, ImpactId, WizardAnswers } from "@/lib/types";

const challengeIds = ["revenue", "cost", "fraud", "cash_stock", "reporting", "brand_trust"] as const satisfies readonly ChallengeId[];
const detailIds = [
  "follow_up",
  "repeat_order",
  "pricing",
  "lead_quality",
  "admin_cost",
  "manual_docs",
  "invoice_ap",
  "process_waste",
  "transaction_anomaly",
  "data_leak",
  "approval_gap",
  "cashflow_blind",
  "stockout",
  "overstock",
  "slow_reports",
  "no_bi",
  "manual_meetings",
  "google_visibility",
  "ai_search",
  "review_sentiment"
] as const satisfies readonly DetailId[];
const impactIds = ["revenue", "hours", "risk", "cash", "trust"] as const satisfies readonly ImpactId[];
const adoptionIds = ["dfy", "diy", "hybrid", "starting"] as const satisfies readonly AdoptionId[];
const eventTypes = ["screen_view", "click"] as const;
const eventScreens = ["hero", "s1", "fact1", "s2", "fact2", "s3", "s4", "s5", "s6", "s7", "s8", "result", "admin"] as const;

const challengeSet = new Set<string>(challengeIds);
const detailSet = new Set<string>(detailIds);
const impactSet = new Set<string>(impactIds);
const adoptionSet = new Set<string>(adoptionIds);
const eventTypeSet = new Set<string>(eventTypes);
const eventScreenSet = new Set<string>(eventScreens);

export type EventType = (typeof eventTypes)[number];
export type EventScreen = (typeof eventScreens)[number];

export function sanitizeText(value: unknown, maxLength = 500) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function uniqueAllowed<T extends string>(value: unknown, allowed: Set<string>, maxItems: number): T[] {
  if (!Array.isArray(value)) return [];
  const selected: T[] = [];
  for (const item of value) {
    if (typeof item === "string" && allowed.has(item) && !selected.includes(item as T)) {
      selected.push(item as T);
    }
    if (selected.length >= maxItems) break;
  }
  return selected;
}

export function sanitizeAnswers(value: unknown): WizardAnswers {
  const input = typeof value === "object" && value ? (value as Record<string, unknown>) : {};
  const impactLevel = typeof input.impactLevel === "string" && impactSet.has(input.impactLevel) ? (input.impactLevel as ImpactId) : "";
  const adoptionStyle = typeof input.adoptionStyle === "string" && adoptionSet.has(input.adoptionStyle) ? (input.adoptionStyle as AdoptionId) : "";

  return {
    mainChallenges: uniqueAllowed<ChallengeId>(input.mainChallenges, challengeSet, 2),
    detailChallenges: uniqueAllowed<DetailId>(input.detailChallenges, detailSet, 8),
    impactLevel,
    adoptionStyle,
    detailNote: sanitizeText(input.detailNote, 1600)
  };
}

export function validateCompleteAnswers(answers: WizardAnswers) {
  const missing = [
    answers.mainChallenges.length === 0 ? "mainChallenges" : "",
    answers.detailChallenges.length === 0 ? "detailChallenges" : "",
    !answers.impactLevel ? "impactLevel" : "",
    !answers.adoptionStyle ? "adoptionStyle" : ""
  ].filter(Boolean);

  return {
    ok: missing.length === 0,
    missing
  };
}

export function sanitizeContact(value: unknown): ContactData {
  const input = typeof value === "object" && value ? (value as Record<string, unknown>) : {};
  return {
    companyName: sanitizeText(input.companyName, 160),
    name: sanitizeText(input.name, 120),
    wa: sanitizeText(input.wa, 40).replace(/[^\d+()\-\s]/g, ""),
    followUpAllowed: Boolean(input.followUpAllowed)
  };
}

export function hasUsableWhatsAppNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 16;
}

export function sanitizeDiscoveryPayload(value: unknown) {
  const input = typeof value === "object" && value ? (value as Record<string, unknown>) : {};
  return {
    sessionId: sanitizeText(input.sessionId, 80),
    companyName: sanitizeText(input.companyName, 160),
    name: sanitizeText(input.name, 120),
    wa: sanitizeText(input.wa, 40).replace(/[^\d+()\-\s]/g, ""),
    budgetContext: sanitizeText(input.budgetContext, 500),
    message: sanitizeText(input.message, 1600),
    summary: sanitizeText(input.summary, 500)
  };
}

export function validateDiscoveryPayload(payload: ReturnType<typeof sanitizeDiscoveryPayload>) {
  const missing = [
    !payload.companyName ? "companyName" : "",
    !payload.name ? "name" : "",
    !payload.wa ? "wa" : "",
    payload.wa && !hasUsableWhatsAppNumber(payload.wa) ? "wa" : ""
  ].filter(Boolean);

  return {
    ok: missing.length === 0,
    missing
  };
}

function sanitizeEventMetadata(value: unknown) {
  if (typeof value !== "object" || !value || Array.isArray(value)) return {};

  const metadata: Record<string, string | number | boolean> = {};
  for (const [key, raw] of Object.entries(value).slice(0, 12)) {
    const cleanKey = sanitizeText(key, 40).replace(/[^\w.-]/g, "");
    if (!cleanKey) continue;

    if (typeof raw === "string") {
      metadata[cleanKey] = sanitizeText(raw, 180);
    } else if (typeof raw === "number" && Number.isFinite(raw)) {
      metadata[cleanKey] = raw;
    } else if (typeof raw === "boolean") {
      metadata[cleanKey] = raw;
    }
  }

  return metadata;
}

export function sanitizeEventPayload(value: unknown) {
  const input = typeof value === "object" && value ? (value as Record<string, unknown>) : {};
  const type = typeof input.type === "string" && eventTypeSet.has(input.type) ? (input.type as EventType) : "";
  const screen = typeof input.screen === "string" && eventScreenSet.has(input.screen) ? (input.screen as EventScreen) : "";

  return {
    sessionId: sanitizeText(input.sessionId, 80),
    type,
    screen,
    metadata: sanitizeEventMetadata(input.metadata)
  };
}

export function validateEventPayload(event: ReturnType<typeof sanitizeEventPayload>) {
  const missing = [!event.type ? "type" : "", !event.screen ? "screen" : ""].filter(Boolean);

  return {
    ok: missing.length === 0,
    missing
  };
}
