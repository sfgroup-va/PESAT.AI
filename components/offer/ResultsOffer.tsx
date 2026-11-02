"use client";

import Image from "next/image";
import { ShoppingBag, Megaphone, Factory, type LucideIcon } from "lucide-react";
import { RevealOnScroll } from "@/components/home/RevealOnScroll";
import { visuals } from "@/components/home/data";

type ResultCase = {
  tag: string;
  icon: LucideIcon;
  title: string;
  metrics: string[];
  image: keyof typeof visuals;
};

const cases: ResultCase[] = [
  {
    tag: "Retail Brand",
    icon: ShoppingBag,
    title: "Retail Brand",
    metrics: ["Response speed naik 4x", "Admin berkurang 60%", "Repeat order meningkat"],
    image: "discoverySession"
  },
  {
    tag: "Agency",
    icon: Megaphone,
    title: "Agency",
    metrics: ["Follow up otomatis", "CPL turun", "Leads lebih cepat closing"],
    image: "revenueCommand"
  },
  {
    tag: "Manufacturing",
    icon: Factory,
    title: "Manufacturing",
    metrics: ["Dashboard otomatis", "Monitoring lebih rapi", "Hemat jam operasional"],
    image: "automationWorkflow"
  }
];

export function ResultsOffer() {
  return (
    <section className="relative overflow-hidden bg-surface py-20 sm:py-28 lg:py-32">
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <RevealOnScroll>
          <div className="mx-auto max-w-3xl text-center">
            <p className="fx-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">Hasil / Portfolio</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-5xl">
              AI yang Dipakai untuk Bisnis Nyata
            </h2>
          </div>
        </RevealOnScroll>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {cases.map((item, index) => {
            const Icon = item.icon;
            const visual = visuals[item.image];
            return (
              <RevealOnScroll key={item.title} delay={index * 100}>
                <article className={`fx-sheen sd${(index % 4) + 1} group glass-panel overflow-hidden rounded-[1.75rem] transition hover:-translate-y-1 hover:border-accent`}>
                  <div className="relative">
                    <Image
                      src={visual.src}
                      alt={visual.alt}
                      width={visual.width}
                      height={visual.height}
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="aspect-[3/2] w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                    />
                    <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/18 bg-neutral-950/68 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-xl">
                      <Icon className="h-3.5 w-3.5" />
                      {item.tag}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold leading-tight tracking-[-0.02em] text-foreground">
                      {item.title}
                    </h3>
                    <ul className="mt-4 grid gap-2">
                      {item.metrics.map((metric) => (
                        <li key={metric} className="flex items-center gap-2 text-sm font-medium text-foreground-muted">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          {metric}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ResultsOffer;
