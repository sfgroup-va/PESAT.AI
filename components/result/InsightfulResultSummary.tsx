"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { GeneratedResult } from "@/lib/types";

type InsightfulResultSummaryProps = {
  result: GeneratedResult;
  eyebrow?: string;
  headingLevel?: 1 | 2;
};

export function InsightfulResultSummary({ result, eyebrow = "Hasil Mini Session Pesat.AI", headingLevel = 2 }: InsightfulResultSummaryProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const impactCards = Array.isArray(result.impactCards) ? result.impactCards : [];
  const chart = Array.isArray(result.chart) ? result.chart : [];
  const insightStats = Array.isArray(result.insightStats) ? result.insightStats : [];
  const focusRows = Array.isArray(result.focusRows) ? result.focusRows : [];
  const beforeAfterText = Array.isArray(result.beforeAfterText) ? result.beforeAfterText.slice(0, 2) : [];
  const measuredBy = Array.isArray(result.promise?.measuredBy) ? result.promise.measuredBy : [];
  const solutionsText = Array.isArray(result.solutionsText) ? result.solutionsText : [];
  const plan = Array.isArray(result.plan) ? result.plan : [];
  const userSignals = Array.isArray(result.userSignals) ? result.userSignals : [];

  return (
    <>
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">{eyebrow}</p>
      <Heading className="text-3xl font-semibold leading-tight tracking-normal text-neutral-950 sm:text-5xl">{result.headline}</Heading>
      <p className="mt-5 max-w-4xl text-lg leading-8 text-neutral-600">{result.subheadline}</p>

      {result.diagnosis ? (
        <div className="mt-8 rounded-[1.35rem] border border-neutral-200 bg-neutral-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Diagnosa inti</p>
          <p className="mt-3 text-lg font-medium leading-8 text-neutral-900">{result.diagnosis}</p>
          {result.rootCause?.text ? (
            <div className="mt-4 border-l-2 border-neutral-900 pl-4">
              <p className="text-base leading-7 text-neutral-700">{result.rootCause.text}</p>
              <p className="mt-2 text-xs font-semibold text-neutral-400">Sumber: {result.rootCause.source}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      {userSignals.length ? (
        <div className="mt-8 rounded-[1.35rem] border border-neutral-200 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Sinyal bisnis yang tertangkap</p>
          <p className="mt-2 text-sm leading-6 text-neutral-500">Angka yang Anda sebutkan dipakai sebagai anchor supaya analisis tidak jatuh ke insight generik.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {userSignals.map((signal) => (
              <span key={signal} className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-800">
                {signal}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {insightStats.length ? (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {insightStats.map((stat) => (
            <div key={stat.label} className="rounded-[1.35rem] border border-neutral-200 bg-white p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-400">{stat.label}</p>
              <p className="mt-3 text-3xl font-semibold text-neutral-950">{stat.value}</p>
              <p className="mt-3 text-sm leading-6 text-neutral-500">{stat.description}</p>
            </div>
          ))}
        </div>
      ) : null}

      {impactCards.length ? (
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {impactCards.map((card) => (
            <div key={card.title} className="rounded-[1.35rem] border border-neutral-200 p-5">
              <p className="text-sm font-semibold text-neutral-500">{card.title}</p>
              <p className="mt-2 text-3xl font-semibold text-neutral-950">{card.value}</p>
              <p className="mt-3 text-sm leading-6 text-neutral-500">{card.description}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 xl:grid-cols-[1.35fr_0.9fr]">
        <div className="rounded-[1.35rem] border border-neutral-200 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Bagan dinamis</p>
              <h3 className="mt-2 text-2xl font-semibold text-neutral-950">Peta peluang perbaikan awal</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                Skor 0-100 ini adalah pembacaan awal dari mini session, untuk menunjukkan area mana yang paling cepat memberi dampak jika diprioritaskan lebih dulu.
              </p>
            </div>
            <span className="inline-flex w-fit rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-700">Skor mini session 0-100</span>
          </div>

          <div className="mt-5 h-72 rounded-[1.1rem] bg-neutral-50 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart} barGap={10}>
                <CartesianGrid stroke="#e5e5e5" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#525252" }} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip
                  formatter={(value, name) => [`${value}/100`, name === "before" ? "Kondisi saat ini" : "Potensi setelah implementasi"]}
                  contentStyle={{ borderRadius: "18px", borderColor: "#e5e5e5" }}
                />
                <Bar dataKey="before" name="before" fill="#d4d4d4" radius={[10, 10, 0, 0]} />
                <Bar dataKey="after" name="after" fill="#111111" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[1.35rem] border border-neutral-200 bg-neutral-50 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Apa yang dibaca di bagan ini</p>
          <h3 className="mt-2 text-2xl font-semibold text-neutral-950">Metrik yang perlu diawasi</h3>
          <p className="mt-3 text-sm leading-6 text-neutral-500">
            Ini area ukur yang dipakai supaya pembahasan discovery call nanti langsung masuk ke angka dan ritme operasional yang relevan.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {measuredBy.map((metric) => (
              <span key={metric} className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-800">
                {metric}
              </span>
            ))}
          </div>
          {impactCards.slice(0, 2).length ? (
            <div className="mt-5 space-y-3">
              {impactCards.slice(0, 2).map((card) => (
                <div key={card.title} className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">{card.title}</p>
                  <p className="mt-1 text-lg font-semibold text-neutral-950">{card.value}</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-500">{card.description}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {focusRows.length ? (
        <div className="mt-8 rounded-[1.35rem] border border-neutral-200 p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Kolom fokus</p>
              <h3 className="mt-2 text-2xl font-semibold text-neutral-950">Area yang paling layak dibereskan lebih dulu</h3>
            </div>
            <span className="inline-flex w-fit rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-700">{focusRows.length} area prioritas</span>
          </div>

          <div className="mt-5 overflow-hidden rounded-[1.2rem] border border-neutral-200">
            <div className="hidden grid-cols-[0.8fr_1.35fr_1fr_1.25fr] gap-4 bg-neutral-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400 md:grid">
              <div>Area</div>
              <div>Gejala yang terbaca</div>
              <div>KPI yang perlu dijaga</div>
              <div>Intervensi awal</div>
            </div>
            <div className="divide-y divide-neutral-200">
              {focusRows.map((row) => (
                <div key={`${row.area}-${row.metric}`} className="grid gap-4 px-5 py-5 md:grid-cols-[0.8fr_1.35fr_1fr_1.25fr]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400 md:hidden">Area</p>
                    <p className="text-base font-semibold text-neutral-950">{row.area}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400 md:hidden">Gejala yang terbaca</p>
                    <p className="text-sm leading-6 text-neutral-700">{row.symptom}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400 md:hidden">KPI yang perlu dijaga</p>
                    <p className="text-sm font-medium leading-6 text-neutral-900">{row.metric}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400 md:hidden">Intervensi awal</p>
                    <p className="text-sm leading-6 text-neutral-700">{row.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {beforeAfterText.length === 2 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {beforeAfterText.map((text, index) => (
            <div key={`${index}-${text}`} className="rounded-[1.35rem] bg-neutral-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">{index === 0 ? "Kondisi saat ini" : "Setelah pilot Pesat.AI"}</p>
              <p className="mt-3 text-base font-medium leading-7 text-neutral-800">{text}</p>
            </div>
          ))}
        </div>
      ) : null}

      {result.promise?.statement ? (
        <div className="mt-8 rounded-[1.35rem] bg-neutral-950 p-6 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Janji terukur</p>
          <p className="mt-3 text-xl font-semibold leading-8">{result.promise.statement}</p>
          {measuredBy.length ? (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Diukur lewat</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {measuredBy.map((metric) => (
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

      {result.firstStep ? (
        <div className="mt-8 rounded-[1.35rem] border border-neutral-200 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Langkah pertama yang paling masuk akal</p>
          <p className="mt-3 text-lg font-medium leading-8 text-neutral-900">{result.firstStep}</p>
        </div>
      ) : null}

      {result.costOfInaction ? (
        <div className="mt-8 rounded-[1.35rem] border border-neutral-200 border-l-4 border-l-neutral-900 bg-neutral-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Biaya jika dibiarkan</p>
          <p className="mt-3 text-base font-medium leading-7 text-neutral-800">{result.costOfInaction}</p>
        </div>
      ) : null}

      {result.uniqueMechanism ? (
        <div className="mt-8 rounded-[1.35rem] bg-neutral-950 p-6 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Kenapa pendekatan ini relevan</p>
          <p className="mt-3 text-xl font-semibold leading-8">{result.uniqueMechanism}</p>
        </div>
      ) : null}

      {solutionsText.length ? (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-neutral-950">Solusi yang paling relevan</h3>
          <div className="mt-4 grid gap-3">
            {solutionsText.map((solution) => (
              <div key={solution} className="rounded-[1.35rem] border border-neutral-200 p-5 text-base leading-7 text-neutral-700">
                {solution}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {plan.length ? (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-neutral-950">Rencana aksi</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-500">Tiga fase agar perbaikan terjadi bertahap dan tetap bisa diukur, bukan ditumpuk sekaligus.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {plan.map((phase) => (
              <div key={phase.title} className="flex flex-col rounded-[1.35rem] border border-neutral-200 p-5">
                <p className="text-base font-semibold text-neutral-950">{phase.title}</p>
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
    </>
  );
}
