"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  Clock,
  TrendingUp,
  Zap,
  Shield,
  Sparkles,
  TrendingDown,
  Search,
  AlertTriangle,
  Brain,
  ArrowRight,
  BarChart3,
  Lightbulb,
  Target,
} from "lucide-react";
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
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-violet-500">Pesat.AI result</p>
          <h1 className="text-4xl font-semibold leading-tight">{error}</h1>
          <Link
            href="/"
            className="mt-8 inline-flex min-h-12 items-center rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-6 text-sm font-semibold text-white"
          >
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
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
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
  const isRevenueCluster = result.efficiencyMetrics.some(
    (m) => m.label.toLowerCase().includes("lead") || m.label.toLowerCase().includes("revenue")
  );
  const hiddenCostTotal = result.hiddenCosts.reduce((sum, cost) => sum + cost.monthlyEstimate, 0);

  return (
    <main className="min-h-screen bg-white px-5 py-8 text-neutral-950">
      <article className="mx-auto max-w-5xl">
        {/* ─── Attention ─── */}
        <section className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-500">Pesat.AI result</p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">{result.headline}</h1>
          <p className="text-lg leading-8 text-neutral-600">{result.subheadline}</p>

          <TldrCard
            headline={result.headline}
            subheadline={result.subheadline}
            tldr={result.tldr}
            impactPercent={impactPercent}
            projectedCostSaving={projectedCostSaving}
            isRevenueCluster={isRevenueCluster}
          />

          {/* Executive Summary: Before → After → Savings/Lift */}
          {isRevenueCluster ? (
            <div className="grid gap-3 sm:grid-cols-3">
              <BeforeAfterCard label="Sekarang" value={`Rp ${formatRupiah(monthlyRevenue)}`} tone="muted" />
              <BeforeAfterCard label="Setelah AI" value={`Rp ${formatRupiah(monthlyRevenue + projectedGain)}`} tone="highlight" />
              <BeforeAfterCard label="Potensi naik" value={`+${impactPercent}%`} tone="accent" />
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              <BeforeAfterCard label="Biaya sekarang" value={`Rp ${formatRupiah(monthlyCost)}`} tone="muted" />
              <BeforeAfterCard label="Biaya setelah AI" value={`Rp ${formatRupiah(monthlyCost - projectedCostSaving)}`} tone="highlight" />
              <BeforeAfterCard label="Hemat per bulan" value={`Rp ${formatRupiah(projectedCostSaving)}`} tone="accent" />
            </div>
          )}

          {/* Efficiency Metrics */}
          {result.efficiencyMetrics.length ? (
            <div>
              <h2 className="text-2xl font-semibold">Angka before vs after</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-500">Perbandingan metrik kunci setelah AI diterapkan.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {result.efficiencyMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-[1.35rem] border border-violet-100 bg-white p-5 shadow-sm">
                    <p className="text-sm font-semibold text-violet-600">{metric.label}</p>
                    <div className="mt-3 flex items-end justify-between">
                      <div>
                        <p className="text-xs text-neutral-400">Before</p>
                        <p className="text-lg font-semibold">{metric.before}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-violet-300" />
                      <div className="text-right">
                        <p className="text-xs text-neutral-400">After AI</p>
                        <p className="text-lg font-semibold text-violet-600">{metric.after}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-violet-700">{metric.impact}</p>
                    <p className="mt-1 text-xs leading-5 text-neutral-500">{metric.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Before vs After Visual */}
          {result.beforeAfterMetrics.length ? (
            <div className="rounded-[1.35rem] border border-violet-100 bg-violet-50/30 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-500">Before vs After</p>
              <div className="mt-5 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.beforeAfterMetrics} layout="vertical" margin={{ left: 24 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ddd6fe" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="label" type="category" width={120} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="beforeValue" name="Before" fill="#c4b5fd" radius={[0, 8, 8, 0]} />
                    <Bar dataKey="afterValue" name="After AI" fill="#7c3aed" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : null}

          {/* Impact Comparison Chart — purple container */}
          <div className="rounded-[1.35rem] border border-violet-100 bg-violet-50/30 p-1">
            <div className="overflow-hidden rounded-[1.25rem] [&>*]:mt-0">
              <ImpactComparisonChart result={result} />
            </div>
          </div>
        </section>

        {/* ─── Interest ─── */}
        <section className="mt-12 space-y-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
              <Search className="h-4 w-4" />
            </div>
            <h2 className="text-2xl font-semibold">Ini masalah utamanya</h2>
          </div>

          {result.diagnosis ? (
            <div className="rounded-[1.35rem] border border-violet-100 bg-violet-50/40 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-500">Diagnosa</p>
              <p className="mt-3 text-lg font-medium leading-8 text-neutral-900">{result.diagnosis}</p>
              {result.rootCause?.text ? (
                <div className="mt-4 border-l-2 border-violet-400 pl-4">
                  <p className="text-base leading-7 text-neutral-700">{result.rootCause.text}</p>
                  <p className="mt-2 text-xs font-semibold text-violet-400">Sumber: {result.rootCause.source}</p>
                </div>
              ) : null}
            </div>
          ) : null}

          {result.hiddenCosts.length ? (
            <div className="rounded-[1.35rem] border border-violet-100 bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-500">Ini biaya tersembunyi</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {result.hiddenCosts.map((cost) => (
                  <div key={cost.id} className="rounded-[1.25rem] bg-violet-50/70 p-5">
                    <p className="text-base font-semibold text-neutral-900">{cost.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-violet-700">
                      Rp {formatRupiah(cost.monthlyEstimate)}/bulan
                    </p>
                    <p className="mt-2 text-sm leading-6 text-neutral-500">{cost.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-[1.25rem] bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-5 text-white">
                <p className="text-sm text-violet-100">Total biaya tersembunyi</p>
                <p className="mt-1 text-3xl font-semibold">Rp {formatRupiah(hiddenCostTotal)}/bulan</p>
              </div>
            </div>
          ) : null}

          {result.costOfInaction ? (
            <div className="rounded-[1.35rem] border border-violet-100 border-l-4 border-l-violet-500 bg-violet-50/40 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-500">Jika dibiarkan</p>
              <p className="mt-3 text-base font-medium leading-7 text-neutral-800">{result.costOfInaction}</p>
            </div>
          ) : null}

          {result.userSignals?.length ? (
            <div className="rounded-[1.35rem] border border-violet-100 bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-500">Sinyal dari bisnis Anda</p>
              <p className="mt-2 text-sm leading-6 text-neutral-500">Angka yang Anda sebutkan jadi dasar analisis ini.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {result.userSignals.map((signal) => (
                  <span key={signal} className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        {/* ─── Desire ─── */}
        <section className="mt-12 space-y-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
              <Lightbulb className="h-4 w-4" />
            </div>
            <h2 className="text-2xl font-semibold">Ini rekomendasi utama</h2>
          </div>

          {/* Solution Cards */}
          <div>
            <p className="text-sm leading-6 text-neutral-500">Diurutkan berdasarkan kecocokan dengan profil bisnis Anda.</p>
            <div className="mt-4 grid gap-3">
              {result.solutionCards?.map((card, index) => (
                <div
                  key={card.name}
                  className="group relative overflow-hidden rounded-[1.35rem] border border-violet-100 bg-white p-5 transition-all duration-300 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-lg font-bold text-white">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold">{card.name}</h3>
                        <ImpactBadge badge={card.impactBadge} />
                        <ConfidenceBadge score={card.confidenceScore} />
                        {card.effortLevel ? <EffortBadge level={card.effortLevel} /> : null}
                      </div>
                      <p className="mt-1 text-sm leading-6 text-neutral-600">{card.description}</p>

                      {card.capabilities?.length ? (
                        <div className="mt-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-violet-400">Kemampuan</p>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {card.capabilities.map((cap) => (
                              <span key={cap} className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                                {cap}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {card.integrations?.length ? (
                        <div className="mt-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-violet-400">Integrasi umum</p>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {card.integrations.map((integration) => (
                              <span key={integration} className="rounded-full border border-violet-100 px-3 py-1 text-xs font-medium text-violet-600">
                                {integration}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {card.prerequisites?.length ? (
                        <div className="mt-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-violet-400">Perlu disiapkan</p>
                          <ul className="mt-1 list-inside list-disc text-xs leading-5 text-neutral-500">
                            {card.prerequisites.map((pre) => (
                              <li key={pre}>{pre}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {card.caseStudy ? (
                        <div className="mt-3 rounded-[1rem] bg-violet-50 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-violet-400">Contoh kasus</p>
                          <p className="mt-1 text-sm leading-5 text-neutral-700">
                            <span className="font-semibold">{card.caseStudy.clientType}</span> — {card.caseStudy.outcome} ({" "}
                            {card.caseStudy.timeframe})
                          </p>
                        </div>
                      ) : null}

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-neutral-500">
                        <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-violet-700">
                          <Clock className="h-3 w-3" />
                          Setup: {card.setupTime}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-violet-700">
                          <Shield className="h-3 w-3" />
                          {card.proofBasis}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )) ??
                result.solutionsText.map((solution) => (
                  <div key={solution} className="rounded-[1.35rem] border border-violet-100 p-5 leading-7 text-neutral-700">
                    {solution}
                  </div>
                ))}
            </div>
          </div>

          {/* Findings */}
          {result.findings.length ? (
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                  <Search className="h-4 w-4" />
                </div>
                <h2 className="text-2xl font-semibold">Ini yang kami temukan</h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-neutral-500">Insight spesifik berbasis jawaban Anda.</p>
              <div className="mt-4 grid gap-4">
                {result.findings.map((finding, index) => (
                  <div key={finding.title} className="rounded-[1.35rem] border border-violet-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-lg font-bold text-white">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold">{finding.title}</h3>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FindingBlock icon={<Search className="h-4 w-4" />} title="Temuan" text={finding.finding} />
                      <FindingBlock icon={<AlertTriangle className="h-4 w-4" />} title="Dampak" text={finding.impact} />
                      <FindingBlock icon={<TrendingDown className="h-4 w-4" />} title="Risiko" text={finding.risk} />
                      <FindingBlock icon={<Brain className="h-4 w-4" />} title="Solusi Terukur" text={finding.solution} />
                    </div>
                    <div className="mt-4 rounded-[1rem] bg-violet-50 p-4">
                      <p className="text-sm font-semibold text-violet-800">📈 Potensi Hasil</p>
                      <p className="mt-1 text-sm leading-6 text-violet-700">{finding.potential}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Impact Cards */}
          {result.impactCards.length ? (
            <div>
              <h2 className="text-2xl font-semibold">Ini dampak yang bisa didapat</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {result.impactCards.map((card) => (
                  <div key={card.title} className="rounded-[1.35rem] border border-violet-100 bg-white p-5 shadow-sm">
                    <p className="text-sm font-semibold text-violet-600">{card.title}</p>
                    <p className="mt-2 text-3xl font-semibold text-violet-700">{card.value}</p>
                    <p className="mt-3 text-sm leading-6 text-neutral-500">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Promise */}
          {result.promise?.statement ? (
            <div className="rounded-[1.35rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-200">Janji hasil</p>
              <p className="mt-3 text-xl font-semibold leading-8">{result.promise.statement}</p>
              {result.promise.measuredBy?.length ? (
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-200">Diukur lewat</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.promise.measuredBy.map((metric) => (
                      <span key={metric} className="rounded-full border border-violet-400 px-3 py-1 text-sm text-white">
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              {result.promise.disclaimer ? <p className="mt-5 text-xs leading-6 text-violet-200">{result.promise.disclaimer}</p> : null}
            </div>
          ) : null}

          {/* First Step */}
          {result.firstStep ? (
            <div className="rounded-[1.35rem] border border-violet-100 bg-violet-50/40 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-500">Langkah pertama</p>
              <p className="mt-3 text-lg font-medium leading-8 text-neutral-900">{result.firstStep}</p>
            </div>
          ) : null}

          {/* Before / After Text */}
          {result.beforeAfterText.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {result.beforeAfterText.map((text, index) => (
                <div key={text} className="rounded-[1.35rem] bg-violet-50/40 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-500">
                    {index === 0 ? "Before" : "After AI"}
                  </p>
                  <p className="mt-3 text-base font-medium leading-7 text-neutral-800">{text}</p>
                </div>
              ))}
            </div>
          ) : null}

          {/* Action Plan */}
          {result.plan?.length ? (
            <div>
              <h2 className="text-2xl font-semibold">Rencana aksi</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-500">Tiga fase agar perbaikan bertahap dan terukur.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {result.plan.map((phase) => (
                  <div key={phase.title} className="flex flex-col rounded-[1.35rem] border border-violet-100 bg-white p-5 shadow-sm">
                    <p className="text-base font-semibold text-violet-700">{phase.title}</p>
                    <span className="mt-2 inline-flex w-fit rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                      {phase.timeframe}
                    </span>
                    <p className="mt-3 text-sm leading-6 text-neutral-700">{phase.focus}</p>
                    {phase.solutions.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {phase.solutions.map((name) => (
                          <span key={name} className="rounded-full border border-violet-100 px-3 py-1 text-xs text-violet-600">
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
        </section>

        {/* ─── Action ─── */}
        <section className="mt-12 space-y-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
              <Target className="h-4 w-4" />
            </div>
            <h2 className="text-2xl font-semibold">Cek potensi di bisnis Anda</h2>
          </div>

          {/* ROI Calculator */}
          <div className="rounded-[1.35rem] border border-violet-100 bg-gradient-to-br from-white to-violet-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-500">Kalkulator ROI</p>
            <p className="mt-2 text-sm leading-6 text-neutral-500">Geser untuk melihat estimasi impact.</p>
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
                className="w-full accent-violet-600"
              />
              <div className="mt-2 flex justify-between text-sm font-semibold text-neutral-600">
                <span>Rp 10jt</span>
                <span className="text-lg text-violet-700">Rp {formatRupiah(isRevenueCluster ? monthlyRevenue : monthlyCost)}</span>
                <span>Rp 5M</span>
              </div>
            </div>
            <div className="mt-5 rounded-[1.35rem] bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-5 text-white">
              <p className="text-sm text-violet-100">
                {isRevenueCluster ? "Potensi tambahan per tahun" : "Potensi penghematan per tahun"}
              </p>
              <p className="mt-1 text-3xl font-semibold">Rp {formatRupiah(isRevenueCluster ? annualGain : annualCostSaving)}</p>
              <p className="mt-2 text-xs text-violet-200">Estimasi berbasis benchmark industri. Angka final setelah discovery.</p>
            </div>
          </div>

          {/* Sticky CTA */}
          <div className="sticky bottom-4 rounded-[1.35rem] border border-violet-100 bg-white p-4 shadow-lg shadow-violet-100 sm:p-5">
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <div>
                <p className="text-sm font-semibold text-violet-600">Mau simpan laporan lengkap ini?</p>
                <p className="text-base font-semibold text-neutral-950">Dapatkan PDF + roadmap 90 hari + strategy call 30 menit.</p>
              </div>
              <Link
                href="/"
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-6 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto"
              >
                <BarChart3 className="h-4 w-4" />
                Mulai Lagi & Simpan Laporan
              </Link>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}

function TldrCard({
  headline,
  subheadline,
  tldr,
  impactPercent,
  projectedCostSaving,
  isRevenueCluster,
}: {
  headline: string;
  subheadline: string;
  tldr?: string;
  impactPercent: number;
  projectedCostSaving: number;
  isRevenueCluster: boolean;
}) {
  return (
    <div className="rounded-[1.35rem] bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 p-[2px]">
      <div className="rounded-[1.3rem] bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-500">TL;DR</p>
            <p className="text-lg font-medium leading-8 text-neutral-800">
              {tldr || `${headline}. ${subheadline}`}
            </p>
          </div>
          <div className="shrink-0 rounded-[1.25rem] bg-violet-50 px-5 py-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-500">Potensi utama</p>
            <p className="mt-1 text-3xl font-semibold text-violet-700">
              {isRevenueCluster ? `+${impactPercent}%` : `Rp ${formatRupiah(projectedCostSaving)}/bulan`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FindingBlock({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-[1rem] bg-violet-50/70 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-violet-700">
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
    muted: "bg-violet-50 text-violet-800 border border-violet-100",
    highlight: "bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white",
    accent: "bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white",
  };
  return (
    <div className={`rounded-[1.35rem] p-5 ${toneStyles[tone]}`}>
      <div className={`flex items-center gap-2 text-sm font-semibold ${tone === "muted" ? "text-violet-400" : "text-white/80"}`}>
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
    "quick-win": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
    "high-impact": "bg-violet-50 text-violet-700 border-violet-200",
    strategic: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  const labels: Record<string, string> = {
    "quick-win": "⚡ Quick Win",
    "high-impact": "🎯 High Impact",
    strategic: "🧭 Strategic",
  };
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[badge] || styles["high-impact"]}`}>
      {labels[badge] || badge}
    </span>
  );
}

function ConfidenceBadge({ score }: { score: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
      <Sparkles className="h-3 w-3" />
      {score}% match
    </span>
  );
}

function EffortBadge({ level }: { level: "low" | "medium" | "high" }) {
  const labels = { low: "Low effort", medium: "Medium effort", high: "High effort" };
  const colors = {
    low: "bg-violet-50 text-violet-700 border-violet-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    high: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colors[level]}`}>{labels[level]}</span>;
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
