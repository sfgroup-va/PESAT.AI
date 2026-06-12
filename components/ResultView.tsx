"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Clock, TrendingUp, Zap, Shield, Sparkles, TrendingDown, Search, AlertTriangle, Brain, ArrowRight, BarChart3 } from "lucide-react";
import { ImpactComparisonChart } from "@/components/ImpactComparisonChart";
import type { GeneratedResult } from "@/lib/types";

export function ResultView({ sessionId }: { sessionId: string }) {
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState(500000000);
  const [monthlyCost, setMonthlyCost] = useState(80_000_000);

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
          <Link href="/" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white">
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

  const impactPercent = parseImpactPercent(result.impactCards);
  const projectedGain = Math.round(monthlyRevenue * (impactPercent / 100));
  const annualGain = projectedGain * 12;
  const projectedCostSaving = Math.round(monthlyCost * (impactPercent / 100));
  const annualCostSaving = projectedCostSaving * 12;
  const isRevenueCluster = result.efficiencyMetrics.some((m) => m.label.toLowerCase().includes("lead") || m.label.toLowerCase().includes("revenue"));
  const hiddenCostTotal = result.hiddenCosts.reduce((sum, cost) => sum + cost.monthlyEstimate, 0);

  return (
    <main className="min-h-screen bg-white px-5 py-8 text-neutral-950">
      <article className="mx-auto max-w-5xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Pesat.AI result</p>
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">{result.headline}</h1>
        <p className="mt-5 text-lg leading-8 text-neutral-600">{result.subheadline}</p>

        {/* Executive Summary: Before → After → Savings/Lift */}
        {isRevenueCluster ? (
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <BeforeAfterCard label="Before" value={`Rp ${formatRupiah(monthlyRevenue)}`} tone="muted" />
            <BeforeAfterCard label="After AI" value={`Rp ${formatRupiah(monthlyRevenue + projectedGain)}`} tone="highlight" />
            <BeforeAfterCard label="Potensi Pertumbuhan" value={`+${impactPercent}%`} tone="accent" />
          </div>
        ) : (
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <BeforeAfterCard label="Biaya Sekarang" value={`Rp ${formatRupiah(monthlyCost)}`} tone="muted" />
            <BeforeAfterCard label="Biaya Setelah AI" value={`Rp ${formatRupiah(monthlyCost - projectedCostSaving)}`} tone="highlight" />
            <BeforeAfterCard label="Potensi Penghematan" value={`Rp ${formatRupiah(projectedCostSaving)}/bulan`} tone="accent" />
          </div>
        )}

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

        {/* Diagnosis */}
        {result.diagnosis ? (
          <div className="mt-8 rounded-[1.35rem] border border-neutral-200 bg-neutral-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Diagnosa</p>
            <p className="mt-3 text-lg font-medium leading-8 text-neutral-900">{result.diagnosis}</p>
            {result.rootCause?.text ? (
              <div className="mt-4 border-l-2 border-neutral-900 pl-4">
                <p className="text-base leading-7 text-neutral-700">{result.rootCause.text}</p>
                <p className="mt-2 text-xs font-semibold text-neutral-400">Sumber: {result.rootCause.source}</p>
              </div>
            ) : null}
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

        {/* Before vs After Visual */}
        {result.beforeAfterMetrics.length ? (
          <div className="mt-8 rounded-[1.35rem] border border-neutral-200 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Before vs After</p>
            <div className="mt-5 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.beforeAfterMetrics} layout="vertical" margin={{ left: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="label" type="category" width={120} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="beforeValue" name="Before" fill="#d4d4d4" radius={[0, 8, 8, 0]} />
                  <Bar dataKey="afterValue" name="After AI" fill="#111111" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : null}

        {/* User Signals */}
        {result.userSignals?.length ? (
          <div className="mt-8 rounded-[1.35rem] border border-neutral-200 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Sinyal dari bisnis Anda</p>
            <p className="mt-2 text-sm leading-6 text-neutral-500">Angka yang Anda sebutkan, kami jadikan dasar agar analisis lebih konkret.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.userSignals.map((signal) => (
                <span key={signal} className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-800">
                  {signal}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {/* Finding Cards */}
        {result.findings.length ? (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold">Temuan Konsultan</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">Insight spesifik berbasis jawaban Anda.</p>
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

        {/* Impact Cards */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {result.impactCards.map((card) => (
            <div key={card.title} className="rounded-[1.35rem] border border-neutral-200 p-5">
              <p className="text-sm font-semibold text-neutral-500">{card.title}</p>
              <p className="mt-2 text-3xl font-semibold">{card.value}</p>
              <p className="mt-3 text-sm leading-6 text-neutral-500">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Impact Comparison */}
        <ImpactComparisonChart result={result} />

        {/* Before / After Text */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {result.beforeAfterText.map((text, index) => (
            <div key={text} className="rounded-[1.35rem] bg-neutral-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">{index === 0 ? "Before" : "After"}</p>
              <p className="mt-3 text-base font-medium leading-7 text-neutral-800">{text}</p>
            </div>
          ))}
        </div>

        {/* ROI Calculator */}
        <div className="mt-8 rounded-[1.35rem] border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Kalkulator ROI</p>
          <p className="mt-2 text-sm leading-6 text-neutral-500">Geser untuk melihat potensi impact di bisnis Anda.</p>
          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-neutral-700">
              {isRevenueCluster ? "Omzet bulanan (Rp)" : "Biaya operasional manual/bulan (Rp)"}
            </label>
            <input
              type="range"
              min="10000000"
              max="5000000000"
              step="50000000"
              value={isRevenueCluster ? monthlyRevenue : monthlyCost}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (isRevenueCluster) setMonthlyRevenue(value);
                else setMonthlyCost(value);
              }}
              className="w-full accent-neutral-950"
            />
            <div className="mt-2 flex justify-between text-sm font-semibold text-neutral-600">
              <span>Rp 10jt</span>
              <span className="text-lg text-neutral-950">Rp {formatRupiah(isRevenueCluster ? monthlyRevenue : monthlyCost)}</span>
              <span>Rp 5M</span>
            </div>
          </div>
          <div className="mt-5 rounded-[1.35rem] bg-neutral-950 p-5 text-white">
            <p className="text-sm text-neutral-400">{isRevenueCluster ? "Potensi tambahan per tahun" : "Potensi penghematan per tahun"}</p>
            <p className="mt-1 text-3xl font-semibold">Rp {formatRupiah(isRevenueCluster ? annualGain : annualCostSaving)}</p>
            <p className="mt-2 text-xs text-neutral-500">Estimasi berbasis benchmark industri. Angka final setelah discovery.</p>
          </div>
        </div>

        {/* Solusi Terukur */}
        {result.promise?.statement ? (
          <div className="mt-8 rounded-[1.35rem] bg-neutral-950 p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Solusi Terukur</p>
            <p className="mt-3 text-xl font-semibold leading-8">{result.promise.statement}</p>
            {result.promise.measuredBy?.length ? (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Diukur lewat</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.promise.measuredBy.map((metric) => (
                    <span key={metric} className="rounded-full border border-neutral-700 px-3 py-1 text-sm text-neutral-200">
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {result.promise.disclaimer ? <p className="mt-5 text-xs leading-6 text-neutral-400">{result.promise.disclaimer}</p> : null}
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

        {/* Solution Cards */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Solusi yang paling relevan</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-500">Diurutkan berdasarkan match dengan profil bisnis Anda.</p>
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
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white transition hover:bg-black sm:w-auto"
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

function BeforeAfterCard({ label, value, tone }: { label: string; value: string; tone: "muted" | "highlight" | "accent" }) {
  const toneStyles = {
    muted: "bg-neutral-100 text-neutral-600",
    highlight: "bg-neutral-950 text-white",
    accent: "bg-emerald-600 text-white"
  };
  return (
    <div className={`rounded-[1.35rem] p-5 ${toneStyles[tone]}`}>
      <div className="flex items-center gap-2 text-sm font-semibold opacity-70">
        {tone === "muted" && <Clock className="h-4 w-4" />}
        {tone === "highlight" && <TrendingUp className="h-4 w-4" />}
        {tone === "accent" && <Zap className="h-4 w-4" />}
        {label}
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

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

function parseImpactPercent(cards: Array<{ title: string; value: string }>): number {
  let maxPercent = 20;
  for (const card of cards) {
    const match = card.value.match(/(\d+)-?(\d+)?%?/);
    if (match) {
      const val = parseInt(match[2] || match[1], 10);
      if (val > maxPercent) maxPercent = val;
    }
  }
  return maxPercent;
}
