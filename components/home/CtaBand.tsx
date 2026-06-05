"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { RevealOnScroll } from "@/components/home/RevealOnScroll";
import { rollingValueProps } from "@/components/home/data";

export function CtaBand({
  variant = "light",
  showSecondary = false,
  onStartWizard,
  onScheduleDiscovery
}: {
  variant?: "light" | "dark";
  showSecondary?: boolean;
  onStartWizard?: () => void;
  onScheduleDiscovery?: () => void;
}) {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLineIndex((value) => (value + 1) % rollingValueProps.length);
    }, 2600);
    return () => window.clearInterval(timer);
  }, []);

  const dark = variant === "dark";

  return (
    <section
      className={`relative overflow-hidden py-20 sm:py-24 ${dark ? "bg-neutral-950 text-white" : "premium-section"}`}
    >
      {dark ? (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.22),transparent_30rem)]" />
          <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        </>
      ) : null}

      <div className="relative z-10 mx-auto max-w-4xl px-5 text-center sm:px-8">
        <RevealOnScroll>
          <p className={`text-sm font-medium ${dark ? "text-white/60" : "text-foreground-muted"}`}>
            Kami bantu bisnis Anda untuk
          </p>
          <h2 className="mx-auto mt-3 min-h-[2.2em] max-w-3xl text-balance text-[1.9rem] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-5xl sm:leading-[1.04]">
            <span
              key={lineIndex}
              className={`inline-block animate-[heroFadeIn_500ms_cubic-bezier(0.22,1,0.36,1)] bg-clip-text text-transparent ${
                dark
                  ? "bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300"
                  : "bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600"
              }`}
            >
              {rollingValueProps[lineIndex]}
            </span>
          </h2>
          <p className={`mt-5 text-lg font-semibold tracking-tight ${dark ? "text-white" : "text-foreground"}`}>
            Garansi performa. Bukan sekadar presentasi.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={140}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => onStartWizard?.()}
              className={`motion-cta-shimmer group inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full px-7 text-base font-semibold transition hover:-translate-y-0.5 sm:w-auto ${
                dark
                  ? "bg-white text-neutral-950 shadow-[0_18px_50px_-16px_rgba(255,255,255,0.4)]"
                  : "bg-foreground text-surface shadow-[0_18px_50px_-16px_rgba(15,23,42,0.5)]"
              }`}
            >
              <Sparkles className="h-5 w-5" />
              Buktikan Sendiri dalam 5 Menit
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </button>
            {showSecondary ? (
              <button
                onClick={() => onScheduleDiscovery?.()}
                className={`inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full border px-7 text-base font-semibold transition hover:-translate-y-0.5 sm:w-auto ${
                  dark
                    ? "border-white/22 bg-white/8 text-white backdrop-blur-xl hover:bg-white/14"
                    : "border-border-base bg-surface-elevated text-foreground hover:border-border-strong"
                }`}
              >
                <Calendar className="h-5 w-5" />
                Jadwalkan Discovery
              </button>
            ) : null}
          </div>
          <p className={`mt-5 text-sm ${dark ? "text-white/50" : "text-foreground-subtle"}`}>
            Gratis, tanpa signup, tanpa kartu kredit.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export default CtaBand;
