"use client";

import { ArrowRight, Check, Sparkles } from "lucide-react";
import { RevealOnScroll } from "@/components/home/RevealOnScroll";
import { MobileFx } from "@/components/home/MobileFx";

type Tier = {
  eyebrow: string;
  name: string;
  price: string;
  subprice?: string;
  description: string;
  bullets: string[];
  cta: string;
  featured?: boolean;
  onClickWizard?: boolean;
};

const tiers: Tier[] = [
  {
    eyebrow: "Newsletter",
    name: "AI Weekly Newsletter",
    price: "USD 100",
    subprice: "/bulan",
    description: "Insight, use case, dan checklist AI bisnis setiap minggu.",
    bullets: ["Curated insight", "Use case praktis", "Checklist dan template"],
    cta: "Subscribe"
  },
  {
    eyebrow: "Self-paced",
    name: "AI Course",
    price: "USD 300",
    subprice: "sekali bayar",
    description: "Kursus praktis untuk memahami dan memanfaatkan AI dalam bisnis.",
    bullets: ["Akses seumur hidup", "Update materi", "Community access"],
    cta: "Mulai Belajar",
    featured: true
  },
  {
    eyebrow: "Custom course",
    name: "AI DIY",
    price: "Mulai USD 500",
    description: "Panduan dan workshop yang disesuaikan dengan proses internal.",
    bullets: ["Custom curriculum", "Workshop tim", "30-day support"],
    cta: "Request Custom"
  },
  {
    eyebrow: "Done For You",
    name: "DFY Custom AI App",
    price: "Custom Quote",
    subprice: "mulai USD 300",
    description: "Pesat.AI merancang, membangun, dan mengintegrasikan solusi AI custom.",
    bullets: ["MVP demo gratis", "Implementasi end-to-end", "Pricing bertahap"],
    cta: "Buktikan Sendiri",
    featured: true,
    onClickWizard: true
  }
];

export function Pricing({ onStartWizard }: { onStartWizard?: () => void }) {
  return (
    <section id="pricing" className="relative scroll-mt-20 overflow-hidden bg-surface py-20 sm:py-28 lg:py-32">
      <MobileFx />
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <RevealOnScroll>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border-base bg-surface-elevated px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground-muted">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Pricing
            </span>
            <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-5xl">
              Mulai kecil. Naik saat hasilnya <span className="text-shimmer">terlihat</span>.
            </h2>
            <p className="mt-5 text-base leading-8 text-foreground-muted sm:text-lg">
              Struktur paket tetap ringan: belajar dulu, custom DIY, atau langsung bangun solusi DFY setelah MVP masuk akal.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {tiers.map((tier, index) => (
            <RevealOnScroll key={tier.name} delay={index * 90}>
              <article className={`fx-sheen sd${(index % 4) + 1} group flex h-full flex-col rounded-[1.75rem] border p-6 transition hover:-translate-y-1 ${tier.featured ? "fx-ring fx-glow border-accent bg-foreground text-surface" : "border-border-base bg-surface-elevated text-foreground"}`}>
                <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${tier.featured ? "text-surface/60" : "text-accent"}`}>{tier.eyebrow}</p>
                <h3 className="mt-3 text-2xl font-semibold">{tier.name}</h3>
                <div className="mt-6">
                  <p className="text-3xl font-semibold tabular-nums tracking-[-0.02em]">{tier.price}</p>
                  {tier.subprice ? <p className={`mt-1 text-sm ${tier.featured ? "text-surface/58" : "text-foreground-subtle"}`}>{tier.subprice}</p> : null}
                </div>
                <p className={`mt-5 text-sm leading-7 ${tier.featured ? "text-surface/70" : "text-foreground-muted"}`}>{tier.description}</p>
                <ul className="mt-6 grid gap-3">
                  {tier.bullets.map((item) => (
                    <li key={item} className={`flex items-start gap-3 text-sm ${tier.featured ? "text-surface/78" : "text-foreground-muted"}`}>
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${tier.featured ? "text-emerald-300" : "text-accent"}`} />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => {
                    if (tier.onClickWizard) onStartWizard?.();
                  }}
                  className={`mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition hover:-translate-y-0.5 ${tier.featured ? "bg-surface text-foreground" : "border border-border-base bg-surface text-foreground hover:border-border-strong"}`}
                >
                  {tier.cta}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </article>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={440}>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-7 text-foreground-subtle">
            Semua paket bisa di-upgrade kapan saja. Pembayaran dapat dibahas dalam IDR atau USD saat discovery.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export default Pricing;
