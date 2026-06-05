"use client";

import Image from "next/image";
import { BarChart3, Brain, Globe, Layers, ShieldCheck, Target, type LucideIcon } from "lucide-react";
import { RevealOnScroll } from "@/components/home/RevealOnScroll";
import { visuals } from "@/components/home/data";

type Benefit = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const benefits: Benefit[] = [
  { icon: Target, title: "Mulai dari masalah paling mahal", body: "Prioritas ditentukan dari pain bisnis, bukan dari tool AI yang sedang ramai." },
  { icon: Layers, title: "MVP dulu, investasi bertahap", body: "Anda melihat bentuk kecil solusi sebelum masuk ke implementasi lebih besar." },
  { icon: Brain, title: "Rule engine + LLM copy", body: "Solusi dipilih dari katalog tetap, lalu AI membantu merangkai rekomendasi yang mudah dipahami." },
  { icon: BarChart3, title: "Output bisa dibawa ke meeting", body: "Hasil mini-session bisa dibagikan, diekspor, dan dipakai untuk diskusi internal." },
  { icon: ShieldCheck, title: "Tidak menjual klaim kosong", body: "Klaim proof dipisahkan antara data publik, benchmark industri, dan output Pesat.AI." },
  { icon: Globe, title: "Mulai dari sekitar Rp 6 juta", body: "Kurang lebih satu gaji UMR Jakarta, tapi Anda mendapat standar kerja internasional dan pengalaman bertahun-tahun di AI & digital growth." }
];

export function WhyPesat() {
  return (
    <section id="why-pesat" className="premium-section scroll-mt-20 py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <RevealOnScroll>
          <div className="mx-auto max-w-3xl text-center">
            <p className="fx-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">Why Pesat.AI</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-5xl">
              Terlihat <span className="text-shimmer">canggih</span>, tapi tetap pragmatis untuk bisnis Indonesia.
            </h2>
            <p className="mt-5 text-base leading-8 text-foreground-muted sm:text-lg">
              Desain sistemnya dibuat untuk owner, marketer, operator, dan tim kecil yang butuh AI terpakai, bukan eksperimen yang berhenti di demo.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <RevealOnScroll>
            <div className="relative overflow-hidden rounded-[2rem] border border-border-base bg-surface-elevated p-3 shadow-soft">
              <Image
                src={visuals.mobileAssistant.src}
                alt={visuals.mobileAssistant.alt}
                width={visuals.mobileAssistant.width}
                height={visuals.mobileAssistant.height}
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="aspect-[4/3] w-full rounded-[1.45rem] object-cover object-center"
              />
              <div className="absolute right-5 top-5 rounded-2xl border border-white/20 bg-neutral-950/72 px-4 py-3 text-white backdrop-blur-xl">
                <p className="text-xs text-white/60">Mobile-first</p>
                <p className="text-lg font-semibold">Owner-ready</p>
              </div>
            </div>
          </RevealOnScroll>

          <div className="grid gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <RevealOnScroll key={benefit.title} delay={index * 80}>
                  <article className={`fx-sheen sd${(index % 4) + 1} group glass-panel rounded-[1.5rem] p-5 transition hover:-translate-y-1 hover:border-accent`}>
                    <div className="flex gap-4">
                      <span className="fx-float grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-accent-fg">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{benefit.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-foreground-muted">{benefit.body}</p>
                      </div>
                    </div>
                  </article>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyPesat;
