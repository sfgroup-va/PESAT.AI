"use client";

import { RevealOnScroll } from "@/components/home/RevealOnScroll";

export function FeaturedIn({ content }: { content?: Record<string, string> }) {
  const c = content ?? {};
  const eyebrow = c.eyebrow || "Telah diliput oleh";

  return (
    <section className="relative overflow-hidden border-y border-border-base bg-surface-subtle/60 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <RevealOnScroll>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10 lg:gap-14">
            {/* Label */}
            <p className="shrink-0 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground-subtle sm:text-left">
              {eyebrow}
            </p>

            {/* Logos row */}
            <div className="flex w-full flex-wrap items-center justify-center gap-8 sm:w-auto sm:gap-10 lg:gap-12">
              {/* BeritaSatu */}
              <a
                href="https://www.beritasatu.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group opacity-60 transition hover:opacity-100"
                aria-label="BeritaSatu"
              >
                <img
                  src="/images/logos/beritasatu-mono.png"
                  alt="BeritaSatu"
                  className="h-6 w-auto object-contain sm:h-7"
                  loading="lazy"
                />
              </a>

              {/* Divider */}
              <span className="hidden h-6 w-px bg-border-strong sm:block" />

              {/* Media Indonesia */}
              <a
                href="https://www.mediaindonesia.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group opacity-60 transition hover:opacity-100"
                aria-label="Media Indonesia"
              >
                <img
                  src="/images/logos/media-indonesia-mono.png"
                  alt="Media Indonesia"
                  className="h-6 w-auto object-contain sm:h-7"
                  loading="lazy"
                />
              </a>

              {/* Divider */}
              <span className="hidden h-6 w-px bg-border-strong sm:block" />

              {/* Liputan6 */}
              <a
                href="https://www.liputan6.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group opacity-60 transition hover:opacity-100"
                aria-label="Liputan6"
              >
                <img
                  src="/images/logos/liputan6-mono.png"
                  alt="Liputan6"
                  className="h-6 w-auto object-contain sm:h-7"
                  loading="lazy"
                />
              </a>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export default FeaturedIn;
