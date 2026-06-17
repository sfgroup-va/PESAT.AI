export type ChallengeId = "revenue" | "cost" | "fraud" | "cash_stock" | "reporting" | "brand_trust";

export type IntakePathId = "sales" | "ops" | "cash_control" | "brand" | "other";

export type DetailId =
  | "follow_up"
  | "repeat_order"
  | "pricing"
  | "lead_quality"
  | "admin_cost"
  | "manual_docs"
  | "invoice_ap"
  | "process_waste"
  | "transaction_anomaly"
  | "data_leak"
  | "approval_gap"
  | "cashflow_blind"
  | "stockout"
  | "overstock"
  | "slow_reports"
  | "no_bi"
  | "manual_meetings"
  | "google_visibility"
  | "ai_search"
  | "review_sentiment";

export type ImpactId = "mild" | "weekly" | "often" | "critical";
export type FrictionSourceId =
  | "duplicate_data"
  | "manual_reports"
  | "delayed_response"
  | "human_error"
  | "approval_bottleneck"
  | "knowledge_silo";
export type AdoptionId = "dfy" | "diy" | "hybrid" | "starting";

export type OtherAnswerKey = "mainChallenge" | "detailChallenge" | "impactLevel" | "frictionSource" | "adoptionStyle";

export type OtherAnswers = Partial<Record<OtherAnswerKey, string>>;

export type WizardAnswers = {
  intakePath?: IntakePathId | "";
  mainChallenges: ChallengeId[];
  detailChallenges: DetailId[];
  impactLevel: ImpactId | "";
  frictionSource: FrictionSourceId | "";
  adoptionStyle: AdoptionId | "";
  otherAnswers?: OtherAnswers;
  detailNote?: string;
};

export type ContactData = {
  companyName?: string;
  name?: string;
  wa?: string;
  employeeCount?: string;
  yearlyRevenue?: string;
  followUpAllowed?: boolean;
};

export type PesatSolution = {
  id: string;
  name: string;
  cluster: ChallengeId[];
  description: string;
  setupTime?: string;
  impactBadge?: "quick-win" | "high-impact" | "strategic";
};

export type ImpactRanges = {
  revenueIncrease?: string;
  costReduction?: string;
  hoursSaved?: string;
  riskReduction?: string;
  cashAccuracy?: string;
  trustLift?: string;
};

export type RootCause = {
  text: string;
  source: string;
};

export type ResultPromise = {
  statement: string;
  timeframe: string;
  measuredBy: string[];
  disclaimer: string;
};

export type PlanPhase = {
  title: string;
  timeframe: string;
  focus: string;
  solutions: string[];
  outcome: string;
};

export type SolutionCard = {
  name: string;
  description: string;
  impactBadge: "quick-win" | "high-impact" | "strategic";
  setupTime: string;
  confidenceScore: number;
  proofBasis: string;
  whyThisFits?: string;
  expectedOutcome?: string;
  watchout?: string;
};

export type DiagnosisPack = {
  diagnosis: string;
  rootCause: RootCause;
  promise: ResultPromise;
  firstStep: string;
};

export type EfficiencyMetric = {
  label: string;
  before: string;
  after: string;
  impact: string;
  impactType: "positive" | "negative";
  description: string;
};

export type HiddenCost = {
  id: string;
  label: string;
  monthlyEstimate: number;
  description: string;
};

export type Finding = {
  title: string;
  finding: string;
  impact: string;
  risk: string;
  solution: string;
  potential: string;
};

export type BeforeAfterMetric = {
  label: string;
  beforeValue: number;
  afterValue: number;
  unit: "%" | "Rp" | "count";
};

export type GeneratedResult = {
  sessionId: string;
  primaryChallenge: ChallengeId;
  headline: string;
  subheadline: string;
  diagnosis: string;
  rootCause: RootCause;
  promise: ResultPromise;
  firstStep: string;
  costOfInaction: string;
  userSignals: string[];
  plan: PlanPhase[];
  impactCards: Array<{ title: string; value: string; description: string }>;
  beforeAfterText: [string, string];
  uniqueMechanism: string;
  solutionsText: string[];
  solutions: PesatSolution[];
  solutionCards?: SolutionCard[];
  impactRanges: ImpactRanges;
  chart: Array<{ name: string; before: number; after: number }>;
  efficiencyMetrics: EfficiencyMetric[];
  hiddenCosts: HiddenCost[];
  findings: Finding[];
  beforeAfterMetrics: BeforeAfterMetric[];
  persisted?: boolean;
  llmFallback?: boolean;
};
