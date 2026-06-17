"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Shield, Sparkles, TrendingDown, Search, AlertTriangle, Brain, ArrowRight, BarChart3 } from "lucide-react";
import { ImpactComparisonChart } from "@/components/ImpactComparisonChart";
import { StrategicSummary } from "@/components/report/StrategicSummary";
import type { GeneratedResult } from "@/lib/types";

export function ResultView({ sessionId }: { sessionId: string }) {
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/result/${sessionId}`)
      .then(async (response) => {
        if (response.ok) return response.json();
        if (response.status === 503) throw new Error("Supabase belum terhubung, jadi link hasil belum bisa dibuka ulang.");
        if (response.status === 409) throw new Error("Hasil mini session belum selesai. Silakan lanjutkan dari sesi utama.");
        throw new Error("Hasil tidak ditemukan.");
      })
      .then((data) => setResult(data))
      .catch((reason: Error) => setError(reason.message));
  }, [sessionId]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center bg-white px-6 text-neutral-950">
        <section className="mx-auto max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Pesat.AI result</p>
          <h1 className="text-4xl font-semibold leading-tight">{error}</h1>
          <Link href="/" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-[#4c1d95] px-6 text-sm font-semibold text-white">
            Kembali ke mini session
          </Link>
        </section>
      </main>
    );
  }

  if (!result) {
    return (
      <div className="mx-auto flex min-h-screen max-w-2xl items-center px-6 text-2xl font-semibold">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-950" />
          Memuat hasil...
        </div>
      </div>
    );
  }

  const hiddenCostTotal = result.hiddenCosts.reduce((sum, cost) => sum + cost.monthlyEstimate, 0);

  return (
    <main className="min-h-screen bg-white px-5 py-8 text-neutral-950">
      <article className="mx-auto max-w-5xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Pesat.AI result</p>
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">{result.headline}</h1>
        <p className="mt-5 text-lg leading-8 text-neutral-600">{result.subheadline}</p>

        {/* Executive Summary: Before → After → Savings/Lift */}
        <StrategicSummary result={result} />

        {/* Efficiency Metrics */}
        {result.efficiencyMetrics.length ? (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold">Efisiensi yang bisa diukur</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">Perbandingan Before vs After AI untuk metrik kunci bisnis Anda.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {result.efficiencyMetrics.map((metric) => (
                <div key={metric.label} className="rounded-[1.35rem] border border-neutral-200 p-5">
                  <p className="text-sm font-semibold text-neutral-500">{metric.label}</p>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-neutral-400">Before</p>
                      <p className="text-lg font-semibold">{metric.before}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-neutral-300" />
                    <div className="text-right">
                      <p className="text-xs text-neutral-400">After AI</p>
                      <p className="text-lg font-semibold text-emerald-600">{metric.after}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-emerald-700">{metric.impact}</p>
                  <p className="mt-1 text-xs leading-5 text-neutral-500">{metric.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Hidden Cost Radar */}
        {result.hiddenCosts.length ? (
          <div className="mt-8 rounded-[1.35rem] border border-neutral-200 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Biaya Tersembunyi yang Sering Diabaikan</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {result.hiddenCosts.map((cost) => (
                <div key={cost.id} className="rounded-[1.25rem] bg-neutral-50 p-5">
                  <p className="text-base font-semibold">{cost.label}</p>
                  <p className="mt-2 text-2xl font-semibold">Rp {formatRupiah(cost.monthlyEstimate)}/bulan</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-500">{cost.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-[1.25rem] bg-neutral-950 p-5 text-white">
              <p className="text-sm text-neutral-400">Total biaya tersembunyi yang teridentifikasi</p>
              <p className="mt-1 text-3xl font-semibold">Rp {formatRupiah(hiddenCostTotal)}/bulan</p>
            </div>
          </div>
        ) : null}

        {/* Finding Cards */}
        {result.findings.length ? (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold">Yang Mungkin Belum Terlihat</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">Insight yang biasanya baru terasa setelah biaya, delay, atau peluang hilang mulai menumpuk.</p>
            <div className="mt-4 grid gap-4">
              {result.findings.map((finding, index) => (
                <div key={finding.title} className="rounded-[1.35rem] border border-neutral-200 p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-lg font-bold text-white">{index + 1}</div>
                    <h3 className="text-lg font-semibold">{finding.title}</h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FindingBlock icon={<Search className="h-4 w-4" />} title="Temuan" text={finding.finding} />
                    <FindingBlock icon={<AlertTriangle className="h-4 w-4" />} title="Dampak" text={finding.impact} />
                    <FindingBlock icon={<TrendingDown className="h-4 w-4" />} title="Risiko" text={finding.risk} />
                    <FindingBlock icon={<Brain className="h-4 w-4" />} title="Solusi Terukur" text={finding.solution} />
                  </div>
                  <div className="mt-4 rounded-[1rem] bg-emerald-50 p-4">
                    <p className="text-sm font-semibold text-emerald-800">📈 Potensi Hasil</p>
                    <p className="mt-1 text-sm leading-6 text-emerald-700">{finding.potential}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Impact Comparison */}
        <ImpactComparisonChart result={result} />

        {/* Solusi Terukur */}
        {result.promise?.statement ? (
          <div className="mt-8 rounded-[1.35rem] bg-[#2b1553] p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d7c9ff]">Solusi Terukur</p>
            <p className="mt-3 text-xl font-semibold leading-8">{result.promise.statement}</p>
            {result.promise.measuredBy?.length ? (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c4b5fd]">Diukur lewat</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.promise.measuredBy.map((metric) => (
                    <span key={metric} className="rounded-full border border-[#5b21b6] px-3 py-1 text-sm text-[#efe9ff]">
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {result.promise.disclaimer ? <p className="mt-5 text-xs leading-6 text-[#d7c9ff]">{result.promise.disclaimer}</p> : null}
          </div>
        ) : null}

        {/* First Step */}
        {result.firstStep ? (
          <div className="mt-8 rounded-[1.35rem] border border-neutral-200 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Langkah pertama</p>
            <p className="mt-3 text-lg font-medium leading-8 text-neutral-900">{result.firstStep}</p>
          </div>
        ) : null}

        {/* Cost of Inaction */}
        {result.costOfInaction ? (
          <div className="mt-8 rounded-[1.35rem] border border-neutral-200 border-l-4 border-l-neutral-900 bg-neutral-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Jika dibiarkan</p>
            <p className="mt-3 text-base font-medium leading-7 text-neutral-800">{result.costOfInaction}</p>
          </div>
        ) : null}

        <div className="mt-8 rounded-[1.35rem] bg-[linear-gradient(145deg,#4c1d95_0%,#7c3aed_100%)] p-6 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#efe9ff]">Kenapa solusi ini masuk akal</p>
          <p className="mt-3 text-xl font-semibold leading-8">{result.uniqueMechanism}</p>
        </div>

        {/* Solution Cards */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Solusi yang paling relevan</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-500">Bukan semua dipasang sekaligus. Ini urutan solusi yang paling masuk akal untuk menutup bottleneck utama lebih dulu.</p>
          <div className="mt-4 grid gap-3">
            {result.solutionCards?.map((card, index) => (
              <div
                key={card.name}
                className="group relative overflow-hidden rounded-[1.35rem] border border-neutral-200 bg-white p-5 transition-all duration-300 hover:border-neutral-300 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-lg font-bold text-white">{index + 1}</div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">{card.name}</h3>
                      <ImpactBadge badge={card.impactBadge} />
                      <ConfidenceBadge score={card.confidenceScore} />
                    </div>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">{card.description}</p>
                    {card.whyThisFits || card.expectedOutcome || card.watchout ? (
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {card.whyThisFits ? (
                          <div className="rounded-[1rem] bg-neutral-50 p-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Kenapa Ini</p>
                            <p className="mt-2 text-sm leading-6 text-neutral-700">{card.whyThisFits}</p>
                          </div>
                        ) : null}
                        {card.expectedOutcome ? (
                          <div className="rounded-[1rem] bg-emerald-50 p-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Efek Cepat</p>
                            <p className="mt-2 text-sm leading-6 text-emerald-900">{card.expectedOutcome}</p>
                          </div>
                        ) : null}
                        {card.watchout ? (
                          <div className="rounded-[1rem] bg-amber-50 p-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Yang Perlu Dijaga</p>
                            <p className="mt-2 text-sm leading-6 text-amber-900">{card.watchout}</p>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-neutral-500">
                      <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1">
                        <Clock className="h-3 w-3" />
                        Setup: {card.setupTime}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                        <Shield className="h-3 w-3" />
                        {card.proofBasis}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )) ??
              result.solutionsText.map((solution) => (
                <div key={solution} className="rounded-[1.35rem] border border-neutral-200 p-5 leading-7 text-neutral-700">
                  {solution}
                </div>
              ))}
          </div>
        </div>

        {/* Action Plan */}
        {result.plan?.length ? (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold">Rencana aksi</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">Tiga fase agar perbaikan terjadi bertahap dan terukur, bukan sekaligus.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {result.plan.map((phase) => (
                <div key={phase.title} className="flex flex-col rounded-[1.35rem] border border-neutral-200 p-5">
                  <p className="text-base font-semibold">{phase.title}</p>
                  <span className="mt-2 inline-flex w-fit rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">{phase.timeframe}</span>
                  <p className="mt-3 text-sm leading-6 text-neutral-700">{phase.focus}</p>
                  {phase.solutions.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {phase.solutions.map((name) => (
                        <span key={name} className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600">
                          {name}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <p className="mt-3 text-sm font-medium leading-6 text-neutral-900">Hasil: {phase.outcome}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Sticky CTA */}
        <div className="sticky bottom-4 mt-8 rounded-[1.35rem] border border-neutral-200 bg-white p-4 shadow-lg sm:p-5">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div>
              <p className="text-sm font-semibold text-neutral-500">Mau simpan laporan lengkap ini?</p>
              <p className="text-base font-semibold text-neutral-950">Dapatkan PDF + roadmap 90 hari + strategy call 30 menit.</p>
            </div>
            <Link
              href="/"
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#4c1d95] px-6 text-sm font-semibold text-white transition hover:bg-[#3b1476] sm:w-auto"
            >
              <BarChart3 className="h-4 w-4" />
              Mulai Lagi & Simpan Laporan
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}

function FindingBlock({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-[1rem] bg-neutral-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-700">
        {icon}
        {title}
      </div>
      <p className="text-sm leading-6 text-neutral-600">{text}</p>
    </div>
  );
}

/* ─── Helper Components ─── */

function ImpactBadge({ badge }: { badge: string }) {
  const styles: Record<string, string> = {
    "quick-win": "bg-amber-50 text-amber-700 border-amber-200",
    "high-impact": "bg-emerald-50 text-emerald-700 border-emerald-200",
    strategic: "bg-blue-50 text-blue-700 border-blue-200"
  };
  const labels: Record<string, string> = {
    "quick-win": "⚡ Quick Win",
    "high-impact": "🎯 High Impact",
    strategic: "🧭 Strategic"
  };
  return <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[badge] || styles["high-impact"]}`}>{labels[badge] || badge}</span>;
}

function ConfidenceBadge({ score }: { score: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-600">
      <Sparkles className="h-3 w-3" />
      {score}% match
    </span>
  );
}

/* ─── Utilities ─── */

function formatRupiah(value: number): string {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}M`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(0)}jt`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}rb`;
  return value.toString();
}
