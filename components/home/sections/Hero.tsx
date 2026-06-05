"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, BadgeCheck, ChevronDown, Sparkles } from "lucide-react";
import { RevealOnScroll } from "@/components/home/RevealOnScroll";
import { authorityBadges, rollingValueProps, visuals } from "@/components/home/data";

export function Hero({
  onStartWizard,
  onScheduleDiscovery
}: {
  onStartWizard?: () => void;
  onScheduleDiscovery?: () => void;
}) {
  const spotRef = useRef<HTMLDivElement | null>(null);

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = spotRef.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    el.style.setProperty("--sx", `${e.clientX - r.left}px`);
    el.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };

  return (
    <section
      id="top"
      onMouseMove={handleMove}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-surface text-foreground"
    >
      {/* ===== Animated background (visible on mobile + desktop) ===== */}
      {/* Subliminal grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5] dark:opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 24%, black 20%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 24%, black 20%, transparent 78%)"
        }}
      />
      {/* Aurora orbs — drifting motion */}
      <div className="motion-aurora pointer-events-none absolute -top-28 left-1/2 h-[440px] w-[440px] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl dark:bg-accent/25" />
      <div className="motion-aurora-slow pointer-events-none absolute top-[22%] -left-24 h-[320px] w-[320px] rounded-full bg-fuchsia-400/20 blur-3xl dark:bg-fuchsia-500/20" />
      <div className="motion-aurora pointer-events-none absolute -bottom-24 -right-16 h-[360px] w-[360px] rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-500/20" />
      {/* Twinkling particle field — mobile wow layer */}
      <div className="fx-twinkle-field pointer-events-none lg:hidden" />
      {/* Cursor-tracked spotlight (desktop only) */}
      <div
        ref={spotRef}
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          background:
            "radial-gradient(420px circle at var(--sx, 70%) var(--sy, 30%), color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%)",
          transition: "background 120ms ease-out"
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 pb-8 pt-20 sm:px-8 sm:pt-28 lg:px-10 lg:pb-12 lg:pt-24">
        <div className="grid flex-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          {/* LEFT — on mobile this column fills the viewport and centers vertically */}
          <div className="flex min-w-0 flex-1 flex-col justify-center lg:block lg:max-w-2xl">
            <RevealOnScroll>
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-border-base bg-surface-elevated/80 px-4 py-2 text-xs font-medium text-foreground-muted shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-sm sm:text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                AI Revenue System untuk Bisnis Indonesia
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={80}>
              <h1 className="mt-6 text-balance font-semibold leading-[1.04] tracking-[-0.04em] text-foreground text-[clamp(2.4rem,8.5vw,3.5rem)] sm:leading-[1.03]">
                Kalau Anda tidak pecat pekerjaan lama,{" "}
                <span className="text-aurora">AI</span> akan pecat bisnis Anda.
              </h1>
            </RevealOnScroll>

            <RevealOnScroll delay={160}>
              <p className="mt-5 max-w-xl text-balance text-base leading-7 text-foreground-muted sm:text-lg sm:leading-8">
                Satu orang kini bisa bangun bisnis jutaan dolar dengan AI. Masih puas dengan cara lama?
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={240}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={() => onStartWizard?.()}
                  className="motion-cta-shimmer fx-ring group inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-foreground px-7 text-base font-semibold text-surface shadow-[0_18px_50px_-16px_rgba(15,23,42,0.5)] transition hover:-translate-y-0.5 hover:scale-[1.01] sm:w-auto"
                >
                  <Sparkles className="h-5 w-5" />
                  Buktikan Sendiri dalam 5 Menit
                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => onScheduleDiscovery?.()}
                  className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full border border-border-base bg-surface-elevated/80 px-7 text-base font-semibold text-foreground backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-border-strong sm:w-auto"
                >
                  Jadwalkan Discovery
                </button>
              </div>
              <p className="mt-4 text-sm text-foreground-subtle">Gratis, tanpa signup, tanpa kartu kredit.</p>
            </RevealOnScroll>

            {/* Mobile-only motion strip — keeps the fold alive without adding scroll content */}
            <div className="mt-7 w-full min-w-0 max-w-full lg:hidden" aria-hidden>
              <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
                <div className="motion-ticker flex w-max items-center gap-2.5 whitespace-nowrap">
                  {[...rollingValueProps, ...rollingValueProps].map((prop, i) => (
                    <span
                      key={`${prop}-${i}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border-base bg-surface-elevated/70 px-3 py-1.5 text-xs font-medium text-foreground-muted backdrop-blur-sm"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {prop}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Authority strip — desktop / tablet only (kept off the mobile fold) */}
            <RevealOnScroll delay={320}>
              <div className="mt-9 hidden grid-cols-2 gap-3 border-t border-border-base pt-7 sm:grid sm:grid-cols-4">
                {authorityBadges.map((badge) => (
                  <div key={badge.label} className="flex flex-col gap-1">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold leading-5 text-foreground">
                      <BadgeCheck className="h-4 w-4 shrink-0 text-accent" />
                      {badge.label}
                    </span>
                    <span className="text-xs leading-4 text-foreground-subtle">{badge.sub}</span>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>

          {/* RIGHT — premium product visual (desktop only) */}
          <RevealOnScroll delay={220} className="hidden lg:block">
            <div className="grid gap-4">
              <div className="overflow-hidden rounded-[1.75rem] border border-border-base bg-surface-elevated p-2 shadow-soft">
                <div className="relative overflow-hidden rounded-[1.4rem] bg-neutral-950">
                  <Image
                    src={visuals.heroDashboard.src}
                    alt={visuals.heroDashboard.alt}
                    width={visuals.heroDashboard.width}
                    height={visuals.heroDashboard.height}
                    priority
                    sizes="(max-width: 1024px) 100vw, 460px"
                    className="motion-image-reveal aspect-[4/3] w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-2xl border border-white/12 bg-neutral-950/72 p-3 text-white backdrop-blur-xl">
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span>AI opportunity map</span>
                      <span className="text-emerald-300">live blueprint</span>
                    </div>
                    <div className="mt-3 space-y-2">
                      {["Sales follow-up", "Cashflow forecast", "Fraud guard"].map((item, index) => (
                        <div key={item} className="flex items-center gap-2">
                          <span className="w-24 text-[11px] text-white/55">{item}</span>
                          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                            <span
                              className="motion-dashboard-pulse block h-full rounded-full bg-gradient-to-r from-indigo-300 to-violet-300"
                              style={{ width: `${90 - index * 14}%`, animationDelay: `${index * 160}ms` }}
                            />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-[1.5rem] border border-border-base bg-surface-elevated p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <Image
                  src={visuals.nell.src}
                  alt={visuals.nell.alt}
                  width={visuals.nell.width}
                  height={visuals.nell.height}
                  sizes="56px"
                  className="h-14 w-14 rounded-2xl object-cover"
                />
                <div className="min-w-0">
                  <p className="text-xs text-foreground-subtle">Dipimpin founder</p>
                  <p className="truncate text-base font-semibold text-foreground">Nell VH</p>
                  <p className="truncate text-xs text-foreground-muted">Diliput Kompas TV · JetDigitalPro</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-lg font-semibold tabular-nums text-foreground">10K+</p>
                  <p className="text-[11px] text-foreground-subtle">Visitors</p>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      {/* Animated scroll cue — mobile only, anchored to the fold (no extra flow height) */}
      <a
        href="#fomo"
        aria-label="Scroll ke bawah"
        className="absolute inset-x-0 bottom-4 z-10 mx-auto flex w-max flex-col items-center text-foreground-subtle lg:hidden"
      >
        <span className="text-[11px] font-medium tracking-wide">Geser ke bawah</span>
        <ChevronDown className="motion-scroll-cue h-5 w-5" />
      </a>
    </section>
  );
}

export default Hero;
