"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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
          <Link href="/" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white">
            Kembali ke mini session
          </Link>
        </section>
      </main>
    );
  }

  if (!result) {
    return <div className="mx-auto flex min-h-screen max-w-2xl items-center px-6 text-2xl font-semibold">Memuat hasil...</div>;
  }

  return (
    <main className="min-h-screen bg-white px-5 py-8 text-neutral-950">
      <article className="mx-auto max-w-5xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Pesat.AI result</p>
        <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">{result.headline}</h1>
        <p className="mt-5 text-lg leading-8 text-neutral-600">{result.subheadline}</p>
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
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {result.impactCards.map((card) => (
            <div key={card.title} className="rounded-[1.35rem] border border-neutral-200 p-5">
              <p className="text-sm font-semibold text-neutral-500">{card.title}</p>
              <p className="mt-2 text-3xl font-semibold">{card.value}</p>
              <p className="mt-3 text-sm leading-6 text-neutral-500">{card.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 h-64 rounded-[1.35rem] border border-neutral-200 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result.chart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="before" fill="#d4d4d4" radius={[8, 8, 0, 0]} />
              <Bar dataKey="after" fill="#111111" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {result.promise?.statement ? (
          <div className="mt-8 rounded-[1.35rem] bg-neutral-950 p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Janji terukur</p>
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
        {result.firstStep ? (
          <div className="mt-8 rounded-[1.35rem] border border-neutral-200 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Langkah pertama</p>
            <p className="mt-3 text-lg font-medium leading-8 text-neutral-900">{result.firstStep}</p>
          </div>
        ) : null}
        {result.costOfInaction ? (
          <div className="mt-8 rounded-[1.35rem] border border-neutral-200 border-l-4 border-l-neutral-900 bg-neutral-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Jika dibiarkan</p>
            <p className="mt-3 text-base font-medium leading-7 text-neutral-800">{result.costOfInaction}</p>
          </div>
        ) : null}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Solusi yang paling relevan</h2>
          <div className="mt-4 grid gap-3">
            {result.solutionsText.map((solution) => (
              <div key={solution} className="rounded-[1.35rem] border border-neutral-200 p-5 leading-7 text-neutral-700">
                {solution}
              </div>
            ))}
          </div>
        </div>
        {result.plan?.length ? (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold">Rencana aksi</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">Tiga fase agar perbaikan terjadi bertahap dan terukur, bukan sekaligus.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {result.plan.map((phase) => (
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
      </article>
    </main>
  );
}
