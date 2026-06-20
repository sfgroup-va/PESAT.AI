// Diagnostic state for the AI Business Coach conversation.
// Maps coach-style answers back to the existing WizardAnswers shape so the
// rule engine and LLM prompt stay unchanged.

import type { WizardAnswers, ChallengeId, DetailId, FrictionSourceId, ImpactId, AdoptionId } from "./types";

export type PressureSource = "cost_pressure" | "revenue_pressure" | "cash_stock_pressure" | "risk_trust_pressure";
export type RootCause = "repeated_work" | "owner_bottleneck" | "late_visibility" | "mixed";
export type Bottleneck = "manual_admin" | "approval_pileup" | "data_scattered" | "knowledge_silo";
export type SolutionStyle = "quick_win" | "full_setup" | "pilot" | "diy";

export type DiagnosticState = {
  pressureSource: PressureSource | null;
  rootCause: RootCause | null;
  bottleneck: Bottleneck | null;
  solutionStyle: SolutionStyle | null;
  severity: "mild" | "moderate" | "serious" | null;
};

export type PartialDiagnosticState = Partial<DiagnosticState>;

export const initialDiagnosticState: DiagnosticState = {
  pressureSource: null,
  rootCause: null,
  bottleneck: null,
  solutionStyle: null,
  severity: null
};

const PRESSURE_TO_CHALLENGE: Record<PressureSource, ChallengeId> = {
  cost_pressure: "cost",
  revenue_pressure: "revenue",
  cash_stock_pressure: "cash_stock",
  risk_trust_pressure: "risk_trust"
};

function detailFromState(state: DiagnosticState): DetailId {
  const { pressureSource, rootCause, bottleneck } = state;

  // If root cause is owner bottleneck, approval_gap is the strongest signal.
  if (rootCause === "owner_bottleneck" || bottleneck === "approval_pileup") {
    return "approval_gap";
  }

  // Repeated work / manual admin maps to admin_cost.
  if (rootCause === "repeated_work" || bottleneck === "manual_admin") {
    return "admin_cost";
  }

  // Late visibility / scattered data maps to cashflow_blind.
  if (rootCause === "late_visibility" || bottleneck === "data_scattered") {
    return "cashflow_blind";
  }

  // Knowledge silo maps to manual_meetings or process_waste.
  if (bottleneck === "knowledge_silo") {
    return "process_waste";
  }

  // Fallback per pressure source.
  if (pressureSource === "revenue_pressure") return "follow_up";
  if (pressureSource === "cash_stock_pressure") return "cashflow_blind";
  if (pressureSource === "risk_trust_pressure") return "transaction_anomaly";
  return "admin_cost";
}

function frictionFromState(state: DiagnosticState): FrictionSourceId {
  const { bottleneck, rootCause } = state;

  if (bottleneck === "manual_admin" || bottleneck === "data_scattered" || rootCause === "repeated_work") {
    return "duplicate_data";
  }
  if (bottleneck === "approval_pileup" || rootCause === "owner_bottleneck") {
    return "error_control";
  }
  if (bottleneck === "knowledge_silo") {
    return "knowledge_silo";
  }
  if (rootCause === "late_visibility") {
    return "manual_reports";
  }
  return "duplicate_data";
}

function adoptionFromState(state: DiagnosticState): AdoptionId {
  switch (state.solutionStyle) {
    case "full_setup":
      return "dfy";
    case "diy":
      return "diy";
    case "pilot":
    case "quick_win":
    default:
      return "starting";
  }
}

function impactFromState(state: DiagnosticState): ImpactId {
  if (state.severity === "serious") return "critical";
  if (state.severity === "moderate") return "often";
  return "weekly";
}

export function toWizardAnswers(state: DiagnosticState): WizardAnswers {
  const mainChallenge = state.pressureSource ? PRESSURE_TO_CHALLENGE[state.pressureSource] : "cost";
  const detailChallenge = state.pressureSource ? detailFromState(state) : "admin_cost";
  const frictionSource = state.pressureSource ? frictionFromState(state) : "duplicate_data";

  return {
    mainChallenges: [mainChallenge],
    detailChallenges: [detailChallenge],
    impactLevel: impactFromState(state),
    frictionSource,
    adoptionStyle: adoptionFromState(state),
    detailNote: "",
    contextAnswers: {}
  };
}

export function isDiagnosticComplete(state: DiagnosticState): boolean {
  return Boolean(state.pressureSource && state.rootCause && state.bottleneck && state.solutionStyle);
}
