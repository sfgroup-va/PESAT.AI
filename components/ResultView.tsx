"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { InsightfulResultSummary } from "@/components/result/InsightfulResultSummary";
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
        <InsightfulResultSummary result={result} eyebrow="Pesat.AI result" headingLevel={1} />
      </article>
    </main>
  );
}
