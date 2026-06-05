"use client";

import { ArrowRight, BadgeDollarSign, BrainCircuit, LineChart, ShieldCheck, Sparkles, Workflow, type LucideIcon } from "lucide-react";
import { RevealOnScroll } from "@/components/home/RevealOnScroll";
import { MobileFx } from "@/components/home/MobileFx";
import { solutionPillars } from "@/components/home/data";

const icons: Record<string, LucideIcon> = {
  revenue: BadgeDollarSign,
  cost: Workflow,
  predictive: LineChart,
  decision: BrainCircuit,
  security: ShieldCheck,
  "brand-trust": Sparkles
};

export function Pillars({ onStartWizard }: { onStartWizard?: () => void }) {
  return (
    <section id="pillars" className="relative scroll-mt-20 overflow-hidden bg-surface py-20 sm:py-28 lg:py-32">
      <div className="fx-grid-pan absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)", backgroundSize: "56px 56px", color: "var(--fg)" }} />
      <MobileFx />
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <RevealOnScroll>
          <div className="mx-auto max-w-3xl text-center">
            <p className="fx-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">6 Pilar Solusi</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-5xl">
              Enam pilar AI yang membuat bisnis naik <span className="text-shimmer">pesat</span>.
            </h2>
            <p className="mt-5 text-base leading-8 text-foreground-muted sm:text-lg">
              Dari menambah revenue sampai melindungi brand di AI search. Pilih pilar yang paling mendesak, sistem memetakan solusinya untuk Anda.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {solutionPillars.map((pillar, index) => {
            const Icon = icons[pillar.id] ?? Sparkles;
            return (
              <RevealOnScroll key={pillar.id} delay={index * 80}>
                <article className={`fx-sheen sd${(index % 4) + 1} tilt-card group flex h-full flex-col rounded-[1.75rem] border border-border-base bg-surface-elevated p-6 hover:-translate-y-1 hover:border-accent`}>
                  <div className="flex items-center justify-between">
                    <span className="fx-float grid h-12 w-12 place-items-center rounded-2xl bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-accent-fg">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-foreground-subtle">0{index + 1}</span>
                  </div>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-accent">{pillar.name}</p>
                  <h3 className="mt-2 text-2xl font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">{pillar.benefit}</h3>
                  <p className="mt-2 text-sm leading-6 text-foreground-muted">{pillar.focus}</p>
                  <ul className="mt-5 grid gap-2 border-t border-border-base pt-5">
                    {pillar.services.map((service) => (
                      <li key={service} className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {service}
                      </li>
                    ))}
                  </ul>
                </article>
              </RevealOnScroll>
            );
          })}
        </div>

        <RevealOnScroll delay={200}>
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => onStartWizard?.()}
              className="group inline-flex min-h-12 items-center gap-2 rounded-full border border-border-base bg-surface-elevated px-6 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-border-strong"
            >
              Lihat pilar mana yang paling cocok untuk bisnis Anda
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export default Pillars;
