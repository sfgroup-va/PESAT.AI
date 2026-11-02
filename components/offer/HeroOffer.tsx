"use client";

import Image from "next/image";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { RevealOnScroll } from "@/components/home/RevealOnScroll";
import { visuals } from "@/components/home/data";

const trustItems = [
  "Diliput Kompas TV",
  "Founder JetDigitalPro",
  "100+ workflow AI",
  "Trusted by brands/agencies"
];

const WHATSAPP_URL = "https://wa.me/6281290401240";

export function HeroOffer() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-surface text-foreground"
    >
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
      <div className="motion-aurora pointer-events-none absolute -top-28 left-1/2 h-[440px] w-[440px] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl dark:bg-accent/25" />
      <div className="motion-aurora-slow pointer-events-none absolute top-[22%] -left-24 h-[320px] w-[320px] rounded-full bg-fuchsia-400/20 blur-3xl dark:bg-fuchsia-500/20" />
      <div className="motion-aurora pointer-events-none absolute -bottom-24 -right-16 h-[360px] w-[360px] rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-500/20" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 pb-8 pt-28 sm:px-8 sm:pt-36 lg:px-10 lg:pb-12 lg:pt-32">
        <div className="grid flex-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="flex min-w-0 flex-1 flex-col justify-center lg:block lg:max-w-2xl">
            <RevealOnScroll>
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-border-base bg-surface-elevated/80 px-4 py-2 text-xs font-medium text-foreground-muted shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-sm sm:text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                AI Automation untuk Bisnis Indonesia
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={80}>
              <h1 className="mt-6 text-balance font-semibold leading-[1.04] tracking-[-0.04em] text-foreground text-[clamp(2.4rem,8.5vw,3.5rem)] sm:leading-[1.03]">
                AI Automation untuk Hemat Biaya Operasional &amp; Naikkan{" "}
                <span className="text-aurora">Revenue</span> Bisnis
              </h1>
            </RevealOnScroll>

            <RevealOnScroll delay={160}>
              <p className="mt-5 max-w-xl text-balance text-base leading-7 text-foreground-muted sm:text-lg sm:leading-8">
                Dari chatbot, sales follow-up, sampai workflow operasional Pesat.ai bantu bisnis
                bekerja lebih efisien tanpa tambah banyak admin.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={240}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#discovery"
                  className="motion-cta-shimmer fx-ring group inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-foreground px-7 text-base font-semibold text-surface shadow-[0_18px_50px_-16px_rgba(15,23,42,0.5)] transition hover:-translate-y-0.5 hover:scale-[1.01] sm:w-auto"
                >
                  <MessageCircle className="h-5 w-5" />
                  Jadwalkan Discovery Gratis
                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                </a>
                <a
                  href="#discovery"
                  className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full border border-border-base bg-surface-elevated/80 px-7 text-base font-semibold text-foreground backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-border-strong sm:w-auto"
                >
                  Cek Potensi AI Bisnis Anda
                </a>
              </div>
              <p className="mt-4 text-sm text-foreground-subtle">Gratis, tanpa signup, tanpa kartu kredit.</p>
            </RevealOnScroll>

            <RevealOnScroll delay={320}>
              <div className="mt-9 grid grid-cols-2 gap-3 border-t border-border-base pt-7 sm:grid-cols-4">
                {trustItems.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span className="text-xs font-semibold leading-4 text-foreground sm:text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>

          <RevealOnScroll delay={220} className="hidden lg:block">
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
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

export default HeroOffer;
