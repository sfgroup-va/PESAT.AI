"use client";

import { useState } from "react";
import { AlertTriangle, ArrowRight, BarChart3, Sparkles } from "lucide-react";
import { buildHeroView, buildInfographicModel, buildQuickTakeModel, getScenarioDefaultValue } from "@/lib/report-ux";
import type { GeneratedResult } from "@/lib/types";

export function StrategicSummary({ result }: { result: GeneratedResult }) {
  const [scenarioValue, setScenarioValue] = useState(() => getScenarioDefaultValue(result));
  const quickTake = buildQuickTakeModel(result);
  const hero = buildHeroView(result, scenarioValue);
  const infographic = buildInfographicModel(result);
  const firstMetric = result.efficiencyMetrics[0];

  return (
    <>
      <div className="mt-8 overflow-hidden rounded-[1.55rem] border border-[#d8cbff] bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.18),_transparent_38%),linear-gradient(135deg,#faf7ff_0%,#f4efff_52%,#ffffff_100%)] p-6">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#7c3aed]">
          <Sparkles className="h-4 w-4" />
          {quickTake.eyebrow}
        </div>
        <h3 className="mt-3 max-w-3xl text-2xl font-semibold leading-tight text-[#221041] sm:text-3xl">{quickTake.title}</h3>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {quickTake.items.map((item) => (
            <div key={item.label} className="rounded-[1.15rem] border border-white/70 bg-white/90 p-4 shadow-[0_18px_40px_-30px_rgba(76,29,149,0.45)]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7c3aed]">{item.label}</p>
              <p className="mt-2 text-sm leading-6 text-[#45346d]">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {hero.cards.map((card) => (
          <HeroCard key={card.label} label={card.label} value={card.value} tone={card.tone} />
        ))}
      </div>

      <div className="mt-8 rounded-[1.45rem] border border-[#d8cbff] bg-[linear-gradient(145deg,#2b1553_0%,#4c1d95_58%,#7c3aed_100%)] p-6 text-white shadow-[0_32px_80px_-42px_rgba(76,29,149,0.8)]">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#d7c9ff]">
          <Sparkles className="h-4 w-4" />
          Insight yang sering luput
        </div>
        <h3 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl">{result.rootCause.text}</h3>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#efe9ff]">{result.diagnosis}</p>
        <p className="mt-4 text-xs font-semibold text-[#c4b5fd]">Sumber: {result.rootCause.source}</p>
      </div>

      {result.userSignals.length ? (
        <div className="mt-6 rounded-[1.35rem] border border-neutral-200 bg-white p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Sinyal dari cerita Anda</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {result.userSignals.map((signal) => (
              <span key={signal} className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-800">
                {signal}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-8 rounded-[1.35rem] border border-[#e3d8ff] bg-white p-6 shadow-[0_24px_60px_-44px_rgba(91,33,182,0.35)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7c3aed]">{infographic.eyebrow}</p>
            <h3 className="mt-2 text-2xl font-semibold text-neutral-950">{infographic.title}</h3>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f3e8ff] px-4 py-2 text-sm font-semibold text-[#7c3aed]">
            <BarChart3 className="h-4 w-4" />
            Before to After yang paling penting
          </span>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-500">{infographic.note}</p>

        <div className="mt-5 overflow-hidden rounded-[1.15rem] border border-neutral-200">
          <div className="grid grid-cols-[1.6fr_1fr_40px_1fr] bg-[#f8f4ff] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#7c3aed]">
            <span>Fokus</span>
            <span>Before</span>
            <span />
            <span>After</span>
          </div>
          <div className="divide-y divide-neutral-100">
            {infographic.rows.map((row) => (
              <div key={row.label} className="grid grid-cols-[1.6fr_1fr_40px_1fr] items-center gap-3 px-4 py-4">
                <div className="text-sm font-semibold text-neutral-900">{row.label}</div>
                <div className="rounded-2xl bg-[#f3e8ff] px-3 py-2 text-sm font-semibold text-[#6d28d9]">{row.before}</div>
                <div className="flex justify-center text-[#c4b5fd]">
                  <ArrowRight className="h-4 w-4" />
                </div>
                <div className="rounded-2xl bg-[#4c1d95] px-3 py-2 text-sm font-semibold text-white">{row.after}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {hero.scenario.enabled ? (
        <div className="mt-8 rounded-[1.35rem] border border-[#e3d8ff] bg-gradient-to-br from-white via-[#faf7ff] to-[#f3e8ff] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7c3aed]">Scenario model</p>
          <h3 className="mt-2 text-2xl font-semibold text-neutral-950">Ukur dampaknya dengan angka bisnis Anda sendiri</h3>
          <p className="mt-3 text-sm leading-6 text-neutral-500">{hero.scenario.helper}</p>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-neutral-700">{hero.scenario.inputLabel}</label>
            <input
              type="range"
              min={hero.scenario.min}
              max={hero.scenario.max}
              step={hero.scenario.step}
              value={scenarioValue}
              onChange={(event) => setScenarioValue(Number(event.target.value))}
              className="w-full accent-[#6d28d9]"
            />
            <div className="mt-2 flex justify-between text-sm font-semibold text-neutral-600">
              <span>Min</span>
              <span className="text-lg text-neutral-950">{hero.scenario.currentValueLabel}</span>
              <span>Max</span>
            </div>
          </div>

          <div className="mt-5 rounded-[1.35rem] bg-[#4c1d95] p-5 text-white">
            <p className="text-sm text-[#ddd6fe]">{hero.scenario.annualLabel}</p>
            <p className="mt-1 text-3xl font-semibold">{hero.scenario.annualValueLabel}</p>
            <p className="mt-2 text-xs leading-6 text-[#ddd6fe]">Estimasi ini sengaja konservatif dan dipakai hanya sebagai model awal sebelum discovery.</p>
          </div>
        </div>
      ) : firstMetric ? (
        <div className="mt-8 rounded-[1.35rem] border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            <AlertTriangle className="h-4 w-4" />
            Fokus outcome, bukan asumsi rupiah
          </div>
          <h3 className="mt-2 text-2xl font-semibold text-amber-950">Untuk kasus seperti ini, angka yang paling jujur dilihat dulu adalah {firstMetric.label.toLowerCase()}.</h3>
          <p className="mt-3 text-sm leading-6 text-amber-900">
            Supaya report tidak terasa ngaco, kami tidak memaksakan simulasi uang jika basis terbaiknya justru ada pada kecepatan deteksi, akurasi keputusan, atau ritme operasional.
          </p>
        </div>
      ) : null}
    </>
  );
}

function HeroCard({ label, value, tone }: { label: string; value: string; tone: "muted" | "highlight" | "accent" }) {
  const toneStyles = {
    muted: "border border-[#e3d8ff] bg-[#faf7ff] text-[#6d28d9]",
    highlight: "bg-[#2b1553] text-white",
    accent: "bg-[#7c3aed] text-white"
  };

  return (
    <div className={`rounded-[1.35rem] p-5 shadow-[0_24px_60px_-44px_rgba(91,33,182,0.45)] ${toneStyles[tone]}`}>
      <p className="text-sm font-semibold opacity-80">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
