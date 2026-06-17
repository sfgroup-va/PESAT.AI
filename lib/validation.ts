import type { AdoptionId, ChallengeId, ContactData, DetailId, FrictionSourceId, ImpactId, IntakePathId, OtherAnswers, WizardAnswers } from "@/lib/types";

const challengeIds = ["revenue", "cost", "fraud", "cash_stock", "reporting", "brand_trust"] as const satisfies readonly ChallengeId[];
const intakePathIds = ["sales", "ops", "cash_control", "brand", "other"] as const satisfies readonly IntakePathId[];
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
const impactIds = ["mild", "weekly", "often", "critical"] as const satisfies readonly ImpactId[];
const frictionSourceIds = [
  "duplicate_data",
  "manual_reports",
  "delayed_response",
  "human_error",
  "approval_bottleneck",
  "knowledge_silo"
] as const satisfies readonly FrictionSourceId[];
const adoptionIds = ["dfy", "diy", "hybrid", "starting"] as const satisfies readonly AdoptionId[];
const eventTypes = ["screen_view", "click"] as const;
const eventScreens = ["hero", "q1", "q2", "q3", "q4", "q5", "q6", "review", "loading", "result", "leadGate", "admin"] as const;

const challengeSet = new Set<string>(challengeIds);
const intakePathSet = new Set<string>(intakePathIds);
const detailSet = new Set<string>(detailIds);
const impactSet = new Set<string>(impactIds);
const frictionSourceSet = new Set<string>(frictionSourceIds);
const adoptionSet = new Set<string>(adoptionIds);
const eventTypeSet = new Set<string>(eventTypes);
const eventScreenSet = new Set<string>(eventScreens);

export type EventType = (typeof eventTypes)[number];
export type EventScreen = (typeof eventScreens)[number];

export function sanitizeText(value: unknown, maxLength = 500) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export function sanitizeWordLimitedText(value: unknown, maxWords: number, maxLength = 12000) {
  if (typeof value !== "string") return "";

  const normalized = value.replace(/\r\n/g, "\n").trim().slice(0, maxLength);
  const words = normalized.match(/\S+/g);
  if (!words || words.length <= maxWords) return normalized;

  let wordCount = 0;
  let lastAllowedIndex = 0;
  const matcher = /\S+/g;
  let match: RegExpExecArray | null;

  while ((match = matcher.exec(normalized)) !== null) {
    wordCount += 1;
    if (wordCount > maxWords) break;
    lastAllowedIndex = match.index + match[0].length;
  }

  return normalized.slice(0, lastAllowedIndex).trimEnd();
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

function sanitizeOtherAnswers(value: unknown): OtherAnswers {
  const input = typeof value === "object" && value ? (value as Record<string, unknown>) : {};
  return {
    mainChallenge: sanitizeText(input.mainChallenge, 220),
    detailChallenge: sanitizeText(input.detailChallenge, 220),
    impactLevel: sanitizeText(input.impactLevel, 220),
    frictionSource: sanitizeText(input.frictionSource, 220),
    adoptionStyle: sanitizeText(input.adoptionStyle, 220)
  };
}

export function sanitizeAnswers(value: unknown): WizardAnswers {
  const input = typeof value === "object" && value ? (value as Record<string, unknown>) : {};
  const intakePath = typeof input.intakePath === "string" && intakePathSet.has(input.intakePath) ? (input.intakePath as IntakePathId) : "";
  const impactLevel = typeof input.impactLevel === "string" && impactSet.has(input.impactLevel) ? (input.impactLevel as ImpactId) : "";
  const frictionSource =
    typeof input.frictionSource === "string" && frictionSourceSet.has(input.frictionSource) ? (input.frictionSource as FrictionSourceId) : "";
  const adoptionStyle = typeof input.adoptionStyle === "string" && adoptionSet.has(input.adoptionStyle) ? (input.adoptionStyle as AdoptionId) : "";

  return {
    intakePath,
    mainChallenges: uniqueAllowed<ChallengeId>(input.mainChallenges, challengeSet, 2),
    detailChallenges: uniqueAllowed<DetailId>(input.detailChallenges, detailSet, 8),
    impactLevel,
    frictionSource,
    adoptionStyle,
    otherAnswers: sanitizeOtherAnswers(input.otherAnswers),
    detailNote: sanitizeWordLimitedText(input.detailNote, 1000)
  };
}

export function validateCompleteAnswers(answers: WizardAnswers) {
  const missing = [
    answers.mainChallenges.length === 0 ? "mainChallenges" : "",
    answers.detailChallenges.length === 0 ? "detailChallenges" : "",
    !answers.impactLevel ? "impactLevel" : "",
    !answers.frictionSource ? "frictionSource" : "",
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
    employeeCount: sanitizeText(input.employeeCount, 80),
    yearlyRevenue: sanitizeText(input.yearlyRevenue, 120),
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
    employeeCount: sanitizeText(input.employeeCount, 80),
    yearlyRevenue: sanitizeText(input.yearlyRevenue, 120),
    budgetContext: sanitizeText(input.budgetContext, 500),
    message: sanitizeWordLimitedText(input.message, 1500, 18000),
    summary: sanitizeText(input.summary, 500)
  };
}

export function validateDiscoveryPayload(payload: ReturnType<typeof sanitizeDiscoveryPayload>) {
  const missing = [
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
