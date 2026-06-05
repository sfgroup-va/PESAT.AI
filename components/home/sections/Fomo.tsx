"use client";

import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";
import { RevealOnScroll } from "@/components/home/RevealOnScroll";
import { frontierCases, industryProof, jetDigitalProof, visuals } from "@/components/home/data";

export function Fomo({ onStartWizard }: { onStartWizard?: () => void }) {
  const ticker = [...jetDigitalProof, ...industryProof, ...jetDigitalProof, ...industryProof];

  return (
    <section id="fomo" className="premium-section scroll-mt-20 py-18 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <RevealOnScroll>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="fx-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">Kenapa sekarang</p>
              <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-5xl">
                Bisnis Anda jadi <span className="text-shimmer">dinosaurus</span> tanpa AI.
              </h2>
            </div>
            <p className="text-base leading-8 text-foreground-muted sm:text-lg">
              Sementara kompetitor pakai AI untuk hemat ratusan juta dan gandakan omzet, cara lama makin mahal tiap bulan. Angka di bawah ini bukan hype, semuanya bersumber.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {frontierCases.map((item, index) => (
            <RevealOnScroll key={item.title} delay={index * 90}>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`fx-sheen sd${(index % 4) + 1} tilt-card group glass-panel flex h-full flex-col rounded-[1.5rem] p-6 transition hover:-translate-y-1 hover:border-accent`}
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent/10 text-xs font-bold tabular-nums text-accent">
                    0{index + 1}
                  </span>
                  <ExternalLink className="h-4 w-4 text-foreground-subtle transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>
                <h3 className="mt-6 text-xl font-semibold leading-[1.18] tracking-[-0.02em] text-foreground">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-foreground-muted">{item.detail}</p>
                <p className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  Sumber: Perplexity
                  <ExternalLink className="h-3.5 w-3.5" />
                </p>
              </a>
            </RevealOnScroll>
          ))}
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <RevealOnScroll>
            <div className="relative overflow-hidden rounded-[2rem] border border-border-base bg-neutral-950 p-3 shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
              <Image
                src={visuals.revenueCommand.src}
                alt={visuals.revenueCommand.alt}
                width={visuals.revenueCommand.width}
                height={visuals.revenueCommand.height}
                sizes="(max-width: 1024px) 100vw, 52vw"
                className="motion-image-reveal aspect-[3/2] w-full rounded-[1.45rem] object-cover"
              />
              <div className="pointer-events-none absolute inset-x-6 bottom-6 rounded-2xl border border-white/12 bg-neutral-950/74 p-4 text-white backdrop-blur-xl">
                <p className="text-sm text-white/60">Mini-session output</p>
                <p className="mt-1 text-xl font-semibold">Prioritas solusi + estimasi impact + next MVP</p>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={160}>
            <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Risiko menunda</p>
              <h3 className="mt-4 text-2xl font-semibold leading-[1.12] tracking-[-0.02em] text-foreground sm:text-3xl">
                Setiap bulan Anda menunda AI, Anda:
              </h3>
              <div className="mt-7 grid gap-3">
                {[
                  "Membiarkan kompetitor merebut pelanggan yang seharusnya milik Anda.",
                  "Menunda penghematan yang bisa setara 1–2 karyawan penuh waktu.",
                  "Kehilangan momentum, sementara “bisnis satu orang” baru lahir dengan bantuan AI."
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-border-base bg-surface-elevated p-4">
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-red-500 shadow-[0_0_0_6px_rgba(239,68,68,0.12)]" />
                    <span className="text-sm font-medium leading-6 text-foreground-muted">{item}</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => onStartWizard?.()}
                className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-surface transition hover:-translate-y-0.5"
              >
                Lihat apa yang bisa Anda pecat dari proses, bukan dari manusia
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </RevealOnScroll>
        </div>

        <div className="mt-14 overflow-hidden border-y border-border-base py-5">
          <div className="motion-ticker flex w-max gap-4">
            {ticker.map((item, index) => (
              <span key={`${item.label}-${index}`} className="rounded-full border border-border-base bg-surface-elevated px-5 py-2 text-sm font-medium tabular-nums text-foreground-muted">
                {item.value} {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Fomo;
