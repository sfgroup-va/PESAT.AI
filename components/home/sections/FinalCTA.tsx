"use client";

import Image from "next/image";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { RevealOnScroll } from "@/components/home/RevealOnScroll";
import { MobileFx } from "@/components/home/MobileFx";
import { visuals } from "@/components/home/data";

export function FinalCTA({
  onStartWizard,
  onScheduleDiscovery
}: {
  onStartWizard?: () => void;
  onScheduleDiscovery?: () => void;
}) {
  return (
    <section className="relative min-h-[78svh] overflow-hidden bg-neutral-950 py-24 text-white sm:py-32">
      <Image
        src={visuals.heroDashboard.src}
        alt={visuals.heroDashboard.alt}
        width={visuals.heroDashboard.width}
        height={visuals.heroDashboard.height}
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover opacity-34"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(99,102,241,0.2),transparent_28rem),linear-gradient(180deg,rgba(10,10,10,0.68),rgba(10,10,10,0.96))]" />
      <MobileFx />

      <div className="relative z-10 mx-auto grid min-h-[58svh] max-w-6xl content-center px-5 text-center sm:px-8">
        <RevealOnScroll>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-300">Final check</p>
          <h2 className="mx-auto mt-5 max-w-4xl text-balance text-[2rem] font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
            AI tidak perlu terasa rumit sebelum Anda melihat <span className="text-shimmer">peluangnya</span>.
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={150}>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-xl">
            Mulai dari mini-session gratis. Dalam 5 menit, Anda tahu pekerjaan lama mana yang paling pantas diganti dengan sistem.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={270}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => onStartWizard?.()}
              className="motion-cta-shimmer fx-ring inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-white px-7 text-base font-semibold text-neutral-950 shadow-[0_24px_70px_rgba(255,255,255,0.2)] transition hover:-translate-y-0.5"
            >
              <Sparkles className="h-5 w-5" />
              Buktikan Sendiri dalam 5 Menit
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => onScheduleDiscovery?.()}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/22 bg-white/8 px-7 text-base font-semibold text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/14"
            >
              <Calendar className="h-5 w-5" />
              Jadwalkan Discovery
            </button>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={380}>
          <p className="mt-8 text-sm text-white/46">Gratis. Tanpa signup. Tanpa kartu kredit. Hasil bisa dibagikan.</p>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export default FinalCTA;
