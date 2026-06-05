import type { GeneratedResult, ImpactRanges, PesatSolution } from "@/lib/types";

export type ModelPayload = {
  headline: string;
  subheadline: string;
  diagnosis: string;
  promiseStatement: string;
  costOfInaction: string;
  firstStep: string;
  impactCards: Array<{ title: string; value: string; description: string }>;
  beforeAfterText: [string, string];
  uniqueMechanism: string;
  solutionsText: string[];
};

function cleanString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

const percentToken = /\d+(?:[.,]\d+)?\s*%/g;

// Anti-hallucination guard for free-form prose (diagnosis, promise, first step):
// any percentage mentioned must already exist in the backend-supplied impact ranges.
// This keeps the "promise" honest and measurable instead of an invented claim.
function percentClaimsAllowed(text: string, allowedValues: Set<string>): boolean {
  const used = text.match(percentToken);
  if (!used) return true;
  const allowedPercents = new Set([...allowedValues].flatMap((value) => value.match(percentToken) || []).map((token) => token.replace(/\s+/g, "")));
  return used.every((token) => allowedPercents.has(token.replace(/\s+/g, "")));
}

export function normalizeModelPayload(
  payload: Partial<ModelPayload>,
  fallback: GeneratedResult,
  solutions: PesatSolution[],
  impactRanges: ImpactRanges
): Pick<GeneratedResult, "headline" | "subheadline" | "diagnosis" | "costOfInaction" | "firstStep" | "impactCards" | "beforeAfterText" | "uniqueMechanism" | "solutionsText"> & { promiseStatement: string } {
  const allowedImpactValues = new Set(Object.values(impactRanges).filter(Boolean));
  const solutionNames = solutions.map((solution) => solution.name.toLowerCase());

  const cleanDiagnosis = cleanString(payload.diagnosis, 460);
  const diagnosis = cleanDiagnosis && percentClaimsAllowed(cleanDiagnosis, allowedImpactValues) ? cleanDiagnosis : fallback.diagnosis ?? "";

  const cleanPromise = cleanString(payload.promiseStatement, 380);
  const promiseStatement = cleanPromise && percentClaimsAllowed(cleanPromise, allowedImpactValues) ? cleanPromise : fallback.promise?.statement ?? "";

  const cleanCostOfInaction = cleanString(payload.costOfInaction, 380);
  const costOfInaction = cleanCostOfInaction && percentClaimsAllowed(cleanCostOfInaction, allowedImpactValues) ? cleanCostOfInaction : fallback.costOfInaction ?? "";

  const cleanFirstStep = cleanString(payload.firstStep, 380);
  const firstStep = cleanFirstStep && percentClaimsAllowed(cleanFirstStep, allowedImpactValues) ? cleanFirstStep : fallback.firstStep ?? "";

  const impactCards = Array.isArray(payload.impactCards)
    ? payload.impactCards
        .map((card) => ({
          title: cleanString(card?.title, 80),
          value: cleanString(card?.value, 80),
          description: cleanString(card?.description, 220)
        }))
        .filter((card) => card.title && card.description && allowedImpactValues.has(card.value))
        .slice(0, 3)
    : [];

  const beforeAfter =
    Array.isArray(payload.beforeAfterText) && payload.beforeAfterText.length === 2
      ? ([cleanString(payload.beforeAfterText[0], 280), cleanString(payload.beforeAfterText[1], 280)] as [string, string])
      : fallback.beforeAfterText;

  const solutionsText = Array.isArray(payload.solutionsText)
    ? payload.solutionsText
        .map((item) => cleanString(item, 320))
        .filter((item) => solutionNames.some((name) => item.toLowerCase().includes(name)))
        .slice(0, solutions.length)
    : [];

  return {
    headline: cleanString(payload.headline, 140) || fallback.headline,
    subheadline: cleanString(payload.subheadline, 260) || fallback.subheadline,
    diagnosis,
    promiseStatement,
    costOfInaction,
    firstStep,
    impactCards: impactCards.length >= 2 ? impactCards : fallback.impactCards,
    beforeAfterText: beforeAfter[0] && beforeAfter[1] ? beforeAfter : fallback.beforeAfterText,
    uniqueMechanism: cleanString(payload.uniqueMechanism, 420) || fallback.uniqueMechanism,
    solutionsText: solutionsText.length === solutions.length ? solutionsText : fallback.solutionsText
  };
}
