"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import type { GeneratedResult } from "@/lib/types";

export function ImpactComparisonChart({ result }: { result: GeneratedResult }) {
  const metric = result.efficiencyMetrics[0];
  if (!metric) return null;

  const beforeNum = parseNumericValue(metric.before);
  const afterNum = parseNumericValue(metric.after);
  const max = Math.max(beforeNum, afterNum, 1);
  const beforeHeight = Math.max((beforeNum / max) * 100, 12);
  const afterHeight = Math.max((afterNum / max) * 100, 12);

  const isImprovement = metric.impactType === "positive";

  return (
    <div className="mt-8 rounded-[1.35rem] border border-violet-100 bg-white p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-500">Perbandingan dampak</p>
          <h3 className="mt-2 text-xl font-semibold text-neutral-950">{metric.label}</h3>
        </div>
        <span
          className={`inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
            isImprovement ? "bg-violet-50 text-violet-700" : "bg-amber-50 text-amber-700"
          }`}
        >
          {isImprovement ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {metric.impact}
        </span>
      </div>

      <div className="mt-6 flex items-end gap-3 sm:gap-6">
        {/* Before */}
        <div className="flex flex-1 flex-col items-center">
          <div className="mb-2 text-center">
            <p className="text-2xl font-semibold text-violet-300">{metric.before}</p>
            <p className="text-xs font-medium text-violet-400">Before</p>
          </div>
          <div
            className="w-full rounded-t-2xl bg-violet-200 transition-all duration-700"
            style={{ height: `${beforeHeight * 1.5}px` }}
          />
        </div>

        {/* After AI */}
        <div className="flex flex-1 flex-col items-center">
          <div className="mb-2 text-center">
            <p className="text-2xl font-semibold text-violet-700">{metric.after}</p>
            <p className="text-xs font-medium text-violet-500">After AI</p>
          </div>
          <div
            className="w-full rounded-t-2xl bg-gradient-to-t from-indigo-500 via-violet-500 to-fuchsia-500 transition-all duration-700"
            style={{ height: `${afterHeight * 1.5}px` }}
          />
        </div>
      </div>

      <p className="mt-5 text-sm leading-6 text-neutral-600">{metric.description}</p>
    </div>
  );
}

function parseNumericValue(value: string): number {
  const cleaned = value.replace(/[^\d.]/g, "");
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : 0;
}
