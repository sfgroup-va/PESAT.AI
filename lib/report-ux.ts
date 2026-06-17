import type { ChallengeId, GeneratedResult } from "@/lib/types";

export type HeroCardTone = "muted" | "highlight" | "accent";

export type ReportHeroCard = {
  label: string;
  value: string;
  tone: HeroCardTone;
};

export type InteractiveScenario = {
  enabled: boolean;
  inputLabel?: string;
  annualLabel?: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  currentValueLabel?: string;
  annualValueLabel?: string;
  helper?: string;
};

export type InfographicRow = {
  label: string;
  before: string;
  after: string;
};

export type InfographicModel = {
  eyebrow: string;
  title: string;
  note: string;
  rows: InfographicRow[];
};

export type ReportHeroView = {
  cards: [ReportHeroCard, ReportHeroCard, ReportHeroCard];
  scenario: InteractiveScenario;
};

export type QuickTakeModel = {
  eyebrow: string;
  title: string;
  items: Array<{
    label: string;
    text: string;
  }>;
};

const DEFAULT_INPUTS: Record<ChallengeId, number> = {
  revenue: 500_000_000,
  cost: 80_000_000,
  fraud: 150_000_000,
  cash_stock: 200_000_000,
  reporting: 60_000_000,
  brand_trust: 250_000_000
};

const INPUT_CONFIG: Record<ChallengeId, { min: number; max: number; step: number }> = {
  revenue: { min: 50_000_000, max: 5_000_000_000, step: 50_000_000 },
  cost: { min: 10_000_000, max: 1_000_000_000, step: 10_000_000 },
  fraud: { min: 25_000_000, max: 2_000_000_000, step: 25_000_000 },
  cash_stock: { min: 25_000_000, max: 2_000_000_000, step: 25_000_000 },
  reporting: { min: 10_000_000, max: 500_000_000, step: 10_000_000 },
  brand_trust: { min: 25_000_000, max: 2_000_000_000, step: 25_000_000 }
};

const METRIC_HINTS: Record<ChallengeId, { inputLabel: string; annualLabel: string; helper: string }> = {
  revenue: {
    inputLabel: "Pipeline revenue yang sedang Anda kejar per bulan (Rp)",
    annualLabel: "Potensi tambahan per tahun",
    helper: "Gunakan angka peluang yang sedang dikejar tim saat ini, bukan target ideal."
  },
  cost: {
    inputLabel: "Biaya operasional manual per bulan (Rp)",
    annualLabel: "Potensi penghematan per tahun",
    helper: "Isi dengan biaya admin, follow-up manual, rekonsiliasi, dan pekerjaan berulang yang paling terasa."
  },
  fraud: {
    inputLabel: "Paparan risiko yang ingin dilindungi (Rp)",
    annualLabel: "Potensi nilai risiko yang bisa ditahan per tahun",
    helper: "Pakailah nilai transaksi, approval, atau klaim yang paling sering lolos dari pengawasan."
  },
  cash_stock: {
    inputLabel: "Modal yang paling sering tertahan atau hilang per bulan (Rp)",
    annualLabel: "Potensi modal yang kembali bergerak per tahun",
    helper: "Cocok untuk bisnis yang sering stockout, overstock, atau keputusan pembelian selalu terlambat."
  },
  reporting: {
    inputLabel: "Biaya keputusan yang terlambat per bulan (Rp)",
    annualLabel: "Potensi momentum yang bisa diselamatkan per tahun",
    helper: "Gunakan estimasi biaya meeting tanpa keputusan, laporan telat, atau waktu eksekusi yang tertunda."
  },
  brand_trust: {
    inputLabel: "Nilai demand organik atau inbound yang ingin Anda percepat per bulan (Rp)",
    annualLabel: "Potensi tambahan per tahun",
    helper: "Cocok untuk bisnis yang revenue barunya sangat dipengaruhi Google, review, dan AI search."
  }
};

function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}M`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}jt`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}rb`;
  return `${Math.round(value)}`;
}

function parseRangeMidpoint(value?: string): number | null {
  if (!value) return null;
  const matches = [...value.matchAll(/\d+(?:[.,]\d+)?/g)].map((match) => Number(match[0].replace(",", "."))).filter(Number.isFinite);
  if (!matches.length) return null;
  if (matches.length === 1) return matches[0];
  return Math.round(((matches[0] + matches[1]) / 2) * 10) / 10;
}

function firstThought(text: string, maxLength = 160) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  const sliced = clean.slice(0, maxLength);
  const lastStop = Math.max(sliced.lastIndexOf("."), sliced.lastIndexOf(","), sliced.lastIndexOf(";"));
  return `${(lastStop > 40 ? sliced.slice(0, lastStop) : sliced).trim()}...`;
}

function inferPrimaryChallengeFromMetrics(result: GeneratedResult): ChallengeId {
  const firstMetricLabel = result.efficiencyMetrics[0]?.label.toLowerCase() || "";

  if (firstMetricLabel.includes("lead") || firstMetricLabel.includes("sales")) return "revenue";
  if (firstMetricLabel.includes("anomali") || firstMetricLabel.includes("risiko")) return "fraud";
  if (firstMetricLabel.includes("cashflow") || firstMetricLabel.includes("stock")) return "cash_stock";
  if (firstMetricLabel.includes("laporan") || firstMetricLabel.includes("meeting")) return "reporting";
  if (firstMetricLabel.includes("visibility") || firstMetricLabel.includes("review")) return "brand_trust";
  return "cost";
}

export function getPrimaryChallenge(result: GeneratedResult): ChallengeId {
  return result.primaryChallenge || inferPrimaryChallengeFromMetrics(result);
}

export function getScenarioDefaultValue(result: GeneratedResult): number {
  return DEFAULT_INPUTS[getPrimaryChallenge(result)];
}

export function getScenarioInputConfig(result: GeneratedResult): InteractiveScenario {
  const primary = getPrimaryChallenge(result);
  const rangeValue =
    primary === "revenue"
      ? result.impactRanges.revenueIncrease
      : primary === "brand_trust"
        ? result.impactRanges.trustLift
        : primary === "cost"
          ? result.impactRanges.costReduction
          : primary === "fraud"
            ? result.impactRanges.riskReduction
            : primary === "cash_stock"
              ? result.impactRanges.cashAccuracy
              : undefined;

  const impactMidpoint = parseRangeMidpoint(rangeValue);
  const config = INPUT_CONFIG[primary];
  const hints = METRIC_HINTS[primary];

  if (primary === "reporting" || impactMidpoint === null) {
    return { enabled: false };
  }

  return {
    enabled: true,
    inputLabel: hints.inputLabel,
    annualLabel: hints.annualLabel,
    defaultValue: DEFAULT_INPUTS[primary],
    min: config.min,
    max: config.max,
    step: config.step,
    helper: hints.helper
  };
}

function metricCards(result: GeneratedResult): [ReportHeroCard, ReportHeroCard, ReportHeroCard] {
  const [firstMetric, secondMetric] = result.efficiencyMetrics;
  const hiddenCostTotal = result.hiddenCosts.reduce((sum, item) => sum + item.monthlyEstimate, 0);

  return [
    {
      label: firstMetric ? "Sebelum" : "Titik bocor utama",
      value: firstMetric?.before || result.beforeAfterText[0],
      tone: "muted"
    },
    {
      label: firstMetric ? "Sesudah AI" : "Setelah sistem rapi",
      value: firstMetric?.after || result.beforeAfterText[1],
      tone: "highlight"
    },
    {
      label: secondMetric ? secondMetric.label : hiddenCostTotal ? "Biaya tersembunyi" : "Potensi hasil",
      value: secondMetric?.impact || (hiddenCostTotal ? `Rp ${formatCompactCurrency(hiddenCostTotal)}/bulan` : result.promise.timeframe),
      tone: "accent"
    }
  ];
}

export function buildHeroView(result: GeneratedResult, scenarioValue: number): ReportHeroView {
  const primary = getPrimaryChallenge(result);
  const rangeValue =
    primary === "revenue"
      ? result.impactRanges.revenueIncrease
      : primary === "brand_trust"
        ? result.impactRanges.trustLift
        : primary === "cost"
          ? result.impactRanges.costReduction
          : primary === "fraud"
            ? result.impactRanges.riskReduction
            : primary === "cash_stock"
              ? result.impactRanges.cashAccuracy
              : undefined;
  const impactMidpoint = parseRangeMidpoint(rangeValue);
  const interactive = getScenarioInputConfig(result);

  if (!interactive.enabled || impactMidpoint === null) {
    return { cards: metricCards(result), scenario: interactive };
  }

  if (primary === "cost") {
    const projectedSaving = Math.round(scenarioValue * (impactMidpoint / 100));
    const afterValue = Math.max(0, scenarioValue - projectedSaving);
    return {
      cards: [
        { label: "Biaya Sekarang", value: `Rp ${formatCompactCurrency(scenarioValue)}`, tone: "muted" },
        { label: "Biaya Setelah AI", value: `Rp ${formatCompactCurrency(afterValue)}`, tone: "highlight" },
        { label: "Potensi Penghematan", value: `Rp ${formatCompactCurrency(projectedSaving)}/bulan`, tone: "accent" }
      ],
      scenario: {
        ...interactive,
        currentValueLabel: `Rp ${formatCompactCurrency(scenarioValue)}`,
        annualValueLabel: `Rp ${formatCompactCurrency(projectedSaving * 12)}`
      }
    };
  }

  const projectedGain = Math.round(scenarioValue * (impactMidpoint / 100));

  if (primary === "fraud") {
    return {
      cards: [
        { label: "Risiko Sekarang", value: `Rp ${formatCompactCurrency(scenarioValue)}`, tone: "muted" },
        { label: "Risiko Setelah AI", value: `Rp ${formatCompactCurrency(Math.max(0, scenarioValue - projectedGain))}`, tone: "highlight" },
        { label: "Nilai Risiko Tertahan", value: `Rp ${formatCompactCurrency(projectedGain)}/bulan`, tone: "accent" }
      ],
      scenario: {
        ...interactive,
        currentValueLabel: `Rp ${formatCompactCurrency(scenarioValue)}`,
        annualValueLabel: `Rp ${formatCompactCurrency(projectedGain * 12)}`
      }
    };
  }

  if (primary === "cash_stock") {
    return {
      cards: [
        { label: "Modal Tertahan", value: `Rp ${formatCompactCurrency(scenarioValue)}`, tone: "muted" },
        { label: "Modal yang Kembali Bergerak", value: `Rp ${formatCompactCurrency(projectedGain)}`, tone: "highlight" },
        { label: "Keputusan Lebih Presisi", value: rangeValue || `${impactMidpoint}%`, tone: "accent" }
      ],
      scenario: {
        ...interactive,
        currentValueLabel: `Rp ${formatCompactCurrency(scenarioValue)}`,
        annualValueLabel: `Rp ${formatCompactCurrency(projectedGain * 12)}`
      }
    };
  }

  return {
    cards: [
      { label: "Before", value: `Rp ${formatCompactCurrency(scenarioValue)}`, tone: "muted" },
      { label: "After AI", value: `Rp ${formatCompactCurrency(scenarioValue + projectedGain)}`, tone: "highlight" },
      { label: primary === "brand_trust" ? "Potensi Demand Baru" : "Potensi Pertumbuhan", value: `+${impactMidpoint}%`, tone: "accent" }
    ],
    scenario: {
      ...interactive,
      currentValueLabel: `Rp ${formatCompactCurrency(scenarioValue)}`,
      annualValueLabel: `Rp ${formatCompactCurrency(projectedGain * 12)}`
    }
  };
}

export function buildQuickTakeModel(result: GeneratedResult): QuickTakeModel {
  const topSolution = result.solutionCards?.[0]?.name || result.solutions[0]?.name || "pilot prioritas";
  const primaryMetric = result.promise.measuredBy?.[0] || "metrik utama";

  return {
    eyebrow: "TLDR",
    title: firstThought(result.firstStep || `${topSolution} dipasang lebih dulu supaya bottleneck utama cepat tertutup.`, 170),
    items: [
      {
        label: "Masalah utama",
        text: firstThought(result.headline, 120)
      },
      {
        label: "Cara kerja",
        text: firstThought(result.uniqueMechanism, 145)
      },
      {
        label: "Efek cepat",
        text: firstThought(`${result.promise.statement} Cek lewat ${primaryMetric}.`, 145)
      }
    ]
  };
}

function formatReducedCost(value: number, reductionPercent: number) {
  const reduced = Math.max(0, Math.round(value * (1 - reductionPercent / 100)));
  return `Rp ${formatCompactCurrency(reduced)}`;
}

export function buildInfographicModel(result: GeneratedResult): InfographicModel {
  const primary = getPrimaryChallenge(result);
  const reductionPercent = parseRangeMidpoint(result.impactRanges.costReduction) || 15;

  switch (primary) {
    case "cost": {
      const rows = result.hiddenCosts.slice(0, 3).map((item) => ({
        label: item.label,
        before: `Rp ${formatCompactCurrency(item.monthlyEstimate)}`,
        after: formatReducedCost(item.monthlyEstimate, reductionPercent)
      }));
      return {
        eyebrow: "Mini Infographic",
        title: "Tiga biaya kecil yang biasanya tidak masuk dashboard",
        note: "Masalah cost jarang datang dari satu pos besar. Ia menumpuk dari pekerjaan kecil yang diulang terus-menerus.",
        rows
      };
    }
    case "fraud":
      return {
        eyebrow: "Mini Infographic",
        title: "Pola risikonya bukan besar di awal, tapi dibiarkan terlalu lama",
        note: "Begitu waktu deteksi mengecil, nilai kerugian yang sempat lolos juga ikut turun tajam.",
        rows: result.efficiencyMetrics.slice(0, 3).map((metric) => ({
          label: metric.label,
          before: metric.before,
          after: metric.after
        }))
      };
    case "cash_stock":
      return {
        eyebrow: "Mini Infographic",
        title: "Masalah stok dan kas sering terjadi di dua arah sekaligus",
        note: "Di satu sisi stok habis, di sisi lain modal tertahan. Perbaikannya harus membaca timing, bukan hanya angka akhir bulan.",
        rows: result.efficiencyMetrics.slice(0, 3).map((metric) => ({
          label: metric.label,
          before: metric.before,
          after: metric.after
        }))
      };
    case "reporting":
      return {
        eyebrow: "Mini Infographic",
        title: "Keputusan telat biasanya dimulai dari laporan yang datang terlambat",
        note: "Semakin singkat waktu laporan, semakin cepat tim bergerak saat momentum masih ada.",
        rows: result.efficiencyMetrics.slice(0, 3).map((metric) => ({
          label: metric.label,
          before: metric.before,
          after: metric.after
        }))
      };
    case "brand_trust":
      return {
        eyebrow: "Mini Infographic",
        title: "Trust digital yang tidak tertata membuat calon klien berhenti sebelum bertanya",
        note: "Begitu visibilitas, review, dan sinyal AI search naik bersama, brand lebih sering masuk shortlist.",
        rows: result.efficiencyMetrics.slice(0, 3).map((metric) => ({
          label: metric.label,
          before: metric.before,
          after: metric.after
        }))
      };
    case "revenue":
    default:
      return {
        eyebrow: "Mini Infographic",
        title: "Revenue bocor biasanya terjadi di follow-up, bukan di jumlah lead",
        note: "Begitu coverage naik dan siklus penjualan memendek, peluang yang tadinya hilang mulai tertutup.",
        rows: result.efficiencyMetrics.slice(0, 3).map((metric) => ({
          label: metric.label,
          before: metric.before,
          after: metric.after
        }))
      };
  }
}
