"use client";

import { Bot, Workflow, LineChart, type LucideIcon } from "lucide-react";
import { RevealOnScroll } from "@/components/home/RevealOnScroll";

type UseCase = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const useCases: UseCase[] = [
  {
    icon: Bot,
    title: "AI Sales Assistant",
    body: "Balas & follow-up leads otomatis 24/7"
  },
  {
    icon: Workflow,
    title: "AI Ops Automation",
    body: "Otomasi invoice, laporan, dan kerja admin repetitive"
  },
  {
    icon: LineChart,
    title: "AI Forecasting",
    body: "Prediksi cashflow & demand lebih akurat"
  }
];

const concreteResults = [
  "Hemat 100 jam kerja/bulan",
  "Response lebih cepat",
  "Leads tidak bocor"
];

export function SolutionsOffer() {
  return (
    <section className="relative overflow-hidden bg-surface-subtle py-20 sm:py-28 lg:py-32">
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <RevealOnScroll>
          <div className="mx-auto max-w-3xl text-center">
            <p className="fx-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">Solusi</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-5xl">
              3 Use Case AI Paling Gampang Dipahami
            </h2>
          </div>
        </RevealOnScroll>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {useCases.map((item, index) => {
            const Icon = item.icon;
            return (
              <RevealOnScroll key={item.title} delay={index * 100}>
                <article className="fx-sheen sd1 tilt-card group flex h-full flex-col rounded-[1.75rem] border border-border-base bg-surface-elevated p-7 transition hover:-translate-y-1 hover:border-accent">
                  <span className="fx-float grid h-14 w-14 place-items-center rounded-2xl bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-accent-fg">
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-6 text-2xl font-semibold leading-tight tracking-[-0.02em] text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-foreground-muted">{item.body}</p>
                </article>
              </RevealOnScroll>
            );
          })}
        </div>

        <RevealOnScroll delay={200}>
          <div className="mt-12 rounded-[1.5rem] border border-border-base bg-surface-elevated px-6 py-6 sm:px-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Hasil konkret</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {concreteResults.map((result) => (
                <span
                  key={result}
                  className="inline-flex items-center gap-2 rounded-full border border-border-base bg-surface px-4 py-2 text-sm font-semibold text-foreground"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {result}
                </span>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export default SolutionsOffer;
