"use client";

import Image from "next/image";
import { ArrowRight, Bot, Check, Compass, Wrench } from "lucide-react";
import { RevealOnScroll } from "@/components/home/RevealOnScroll";
import { MobileFx } from "@/components/home/MobileFx";
import { visuals } from "@/components/home/data";

const steps = [
  {
    icon: Compass,
    title: "Buktikan sendiri",
    time: "5 menit",
    body: "Jawab beberapa pertanyaan tentang revenue, biaya, fraud, cashflow, reporting, dan trust. Sistem langsung memilih jalur solusi yang paling relevan.",
    bullets: ["Tanpa signup", "Tanpa kartu kredit", "Output bisa dibagikan"]
  },
  {
    icon: Bot,
    title: "Discovery + Demo MVP",
    time: "Gratis",
    body: "Tim Pesat.AI mengubah masalah prioritas menjadi demo kecil: bot, workflow, dashboard, atau AI assistant yang bisa dilihat dan diuji.",
    bullets: ["Bentuk nyata", "Scope kecil dulu", "Risiko investasi lebih rendah"]
  },
  {
    icon: Wrench,
    title: "Implementasi DFY atau DIY",
    time: "Bertahap",
    body: "Jika MVP masuk akal, lanjut ke implementasi Done For You, course internal, atau hybrid. Fokusnya penggunaan, bukan sekadar setup.",
    bullets: ["Custom app", "Training tim", "Support implementasi"]
  }
];

export function HowItWorks({ onStartWizard }: { onStartWizard?: () => void }) {
  return (
    <section id="how-it-works" className="relative scroll-mt-20 overflow-hidden bg-surface py-20 sm:py-28 lg:py-32">
      <div className="fx-grid-pan absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)", backgroundSize: "56px 56px", color: "var(--fg)" }} />
      <MobileFx />
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <RevealOnScroll>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="fx-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">How it works</p>
              <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-5xl">
                Dari masalah operasional ke AI yang benar-benar <span className="text-shimmer">dipakai</span>.
              </h2>
            </div>
            <p className="text-base leading-8 text-foreground-muted sm:text-lg">
              Flow dibuat seperti CRO funnel: cepat membuktikan pain, memberi visual MVP, lalu mengarahkan ke paket yang paling masuk akal.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div className="grid gap-5">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <RevealOnScroll key={step.title} delay={index * 110}>
                  <article className={`fx-sheen sd${(index % 4) + 1} group glass-panel relative overflow-hidden rounded-[1.75rem] p-6 transition hover:-translate-y-1 hover:border-accent`}>
                    <div className="absolute left-8 top-16 bottom-0 hidden w-px bg-gradient-to-b from-accent via-border-base to-transparent sm:block" />
                    <div className="relative flex gap-5">
                      <div className="fx-float grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-accent text-accent-fg shadow-[0_18px_42px_rgba(99,102,241,0.28)]">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-2xl font-semibold text-foreground">{step.title}</h3>
                          <span className="rounded-full border border-border-base bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-foreground-subtle">{step.time}</span>
                        </div>
                        <p className="mt-3 text-base leading-7 text-foreground-muted">{step.body}</p>
                        <ul className="mt-5 grid gap-2 sm:grid-cols-3">
                          {step.bullets.map((item) => (
                            <li key={item} className="flex items-center gap-2 text-sm font-medium text-foreground-muted">
                              <Check className="h-4 w-4 text-accent" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </article>
                </RevealOnScroll>
              );
            })}
          </div>

          <RevealOnScroll delay={180}>
            <div className="sticky top-6 grid gap-5 self-start">
              <div className="relative overflow-hidden rounded-[2rem] border border-border-base bg-neutral-950 p-3 shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
                <Image
                  src={visuals.automationWorkflow.src}
                  alt={visuals.automationWorkflow.alt}
                  width={visuals.automationWorkflow.width}
                  height={visuals.automationWorkflow.height}
                  sizes="(max-width: 1024px) 100vw, 52vw"
                  className="aspect-[3/2] w-full rounded-[1.45rem] object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="glass-panel rounded-[1.5rem] p-5">
                  <p className="text-sm text-foreground-subtle">Output</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">Blueprint + MVP</p>
                </div>
                <button
                  type="button"
                  onClick={() => onStartWizard?.()}
                  className="rounded-[1.5rem] bg-foreground p-5 text-left text-surface transition hover:-translate-y-1"
                >
                  <span className="text-sm opacity-70">Start now</span>
                  <span className="mt-2 flex items-center gap-2 text-lg font-semibold">
                    Mulai 5 menit <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
