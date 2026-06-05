"use client";

import Image from "next/image";
import { ArrowUpRight, Search, Workflow, type LucideIcon } from "lucide-react";
import { RevealOnScroll } from "@/components/home/RevealOnScroll";
import { MobileFx } from "@/components/home/MobileFx";
import { jetDigitalProof, visuals } from "@/components/home/data";

type CaseItem = {
  tag: string;
  title: string;
  body: string;
  metric: string;
  source: string;
  sourceUrl: string;
  image: keyof typeof visuals;
  icon: LucideIcon;
};

const cases: CaseItem[] = [
  {
    tag: "Revenue operations",
    title: "Cari bottleneck yang paling cepat mengubah omzet.",
    body: "Pesat.AI memetakan follow-up, repeat order, pricing, dan lead quality menjadi prioritas solusi. Outputnya bukan daftar tool, tapi urutan implementasi.",
    metric: "Sales + automation map",
    source: "Pesat.AI rule engine",
    sourceUrl: "#how-it-works",
    image: "discoverySession",
    icon: Workflow
  },
  {
    tag: "AI search visibility",
    title: "Trust digital harus siap untuk Google dan AI answer engine.",
    body: "JetDigitalPro menunjukkan arah kerja Human + AI Assisted untuk konten, authority, dan human oversight. Pesat.AI membawa pola itu ke AI adoption bisnis.",
    metric: jetDigitalProof[2].value,
    source: "JetDigitalPro",
    sourceUrl: "https://jetdigitalpro.com/",
    image: "aiSearch",
    icon: Search
  }
];

export function CaseStudies() {
  return (
    <section className="relative overflow-hidden bg-surface py-20 sm:py-28 lg:py-32">
      <MobileFx />
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <RevealOnScroll>
          <div className="mx-auto max-w-3xl text-center">
            <p className="fx-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">Use-case proof</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-5xl">
              Contoh arah solusi tanpa membuat <span className="text-shimmer">klaim palsu</span>.
            </h2>
            <p className="mt-5 text-base leading-8 text-foreground-muted sm:text-lg">
              Bagian ini sengaja memisahkan benchmark, data publik JetDigitalPro, dan mekanisme Pesat.AI agar funnel tetap kredibel.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {cases.map((item, index) => {
            const Icon = item.icon;
            const visual = visuals[item.image];
            return (
              <RevealOnScroll key={item.title} delay={index * 130}>
                <article className={`fx-sheen sd${(index % 4) + 1} group glass-panel overflow-hidden rounded-[2rem] transition hover:-translate-y-1 hover:border-accent`}>
                  <div className="relative">
                    <Image
                      src={visual.src}
                      alt={visual.alt}
                      width={visual.width}
                      height={visual.height}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="aspect-[3/2] w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                    />
                    <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/18 bg-neutral-950/68 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-xl">
                      <Icon className="h-4 w-4" />
                      {item.tag}
                    </div>
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <span className="inline-flex w-max items-center rounded-full bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent sm:order-2 sm:shrink-0 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm">
                        {item.metric}
                      </span>
                      <h3 className="text-balance text-2xl font-semibold leading-tight tracking-[-0.02em] text-foreground sm:order-1 sm:text-3xl">
                        {item.title}
                      </h3>
                    </div>
                    <p className="mt-5 text-base leading-8 text-foreground-muted">{item.body}</p>
                    <a
                      href={item.sourceUrl}
                      target={item.sourceUrl.startsWith("#") ? undefined : "_blank"}
                      rel={item.sourceUrl.startsWith("#") ? undefined : "noopener noreferrer"}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground-muted transition hover:text-accent"
                    >
                      Sumber: {item.source}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
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

export default CaseStudies;
