"use client";

import Image from "next/image";
import { ExternalLink, Quote, Star } from "lucide-react";
import { RevealOnScroll } from "@/components/home/RevealOnScroll";
import { founderHighlights, nellProfile, testimonials, visuals } from "@/components/home/data";

export function Testimonial() {
  return (
    <section id="founder" className="premium-section scroll-mt-20 py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <RevealOnScroll>
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <p className="fx-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">Founder proof</p>
              <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-5xl">
                Pesat.AI dipimpin founder yang <span className="text-shimmer">dipercaya</span> brand &amp; agency.
              </h2>
            </div>
            <p className="text-base leading-8 text-foreground-muted sm:text-lg">
              Nell VH — praktisi AI & digital business berpengalaman internasional. Pesat.AI membawa playbook yang sama ke bisnis Anda: kombinasi AI, GEO, dan DRA&trade; yang sudah teruji menghasilkan.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-14 grid gap-6 lg:grid-cols-[400px_1fr]">
          <RevealOnScroll>
            <aside className="glass-panel overflow-hidden rounded-[2rem]">
              <Image
                src={visuals.nell.src}
                alt={visuals.nell.alt}
                width={visuals.nell.width}
                height={visuals.nell.height}
                sizes="(max-width: 1024px) 100vw, 400px"
                className="aspect-square w-full object-cover"
              />
              <div className="p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">{nellProfile.role}</p>
                <h3 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-foreground">{nellProfile.name}</h3>
                <p className="mt-4 text-sm leading-7 text-foreground-muted">{nellProfile.bio}</p>
                <p className="mt-4 rounded-2xl border border-border-base bg-surface p-4 text-sm font-semibold leading-6 text-foreground">{nellProfile.method}</p>
                <a href="https://jetdigitalpro.com/" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  Source: JetDigitalPro
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </aside>
          </RevealOnScroll>

          <div className="grid gap-5">
            <RevealOnScroll delay={110}>
              <div className="grid gap-4 sm:grid-cols-3">
                {founderHighlights.map((item) => (
                  <a
                    key={item.title}
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group glass-panel flex h-full flex-col rounded-[1.5rem] p-5 transition hover:-translate-y-1 hover:border-accent"
                  >
                    <p className="text-base font-semibold tracking-[-0.01em] text-foreground">{item.title}</p>
                    <p className="mt-2 flex-1 text-xs leading-5 text-foreground-muted">{item.detail}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                      {item.source}
                      <ExternalLink className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </a>
                ))}
              </div>
            </RevealOnScroll>

            <div className="grid gap-4 md:grid-cols-2">
              {testimonials.map((item, index) => (
                <RevealOnScroll key={item.name} delay={index * 70}>
                  <article className={`fx-sheen sd${(index % 4) + 1} glass-panel h-full rounded-[1.5rem] p-5 transition hover:-translate-y-1 hover:border-accent`}>
                    <div className="flex items-start justify-between gap-4">
                      <Quote className="h-6 w-6 text-accent" />
                      <div className="flex gap-1 text-amber-400">
                        {Array.from({ length: 5 }).map((_, star) => (
                          <Star key={star} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-foreground">{item.headline}</h3>
                    <p className="mt-3 text-sm leading-7 text-foreground-muted">&ldquo;{item.excerpt}&rdquo;</p>
                    <div className="mt-5 flex items-center gap-3 border-t border-border-base pt-4">
                      {item.avatar ? (
                        <Image
                          src={item.avatar}
                          alt={item.name}
                          width={44}
                          height={44}
                          sizes="44px"
                          className="h-11 w-11 shrink-0 rounded-full border border-border-base object-cover"
                        />
                      ) : (
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent/12 text-sm font-semibold text-accent">
                          {item.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                        <p className="mt-0.5 truncate text-xs leading-5 text-foreground-subtle">{item.role}</p>
                      </div>
                    </div>
                  </article>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonial;
