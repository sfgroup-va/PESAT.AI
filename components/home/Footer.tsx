"use client";

import { ArrowUpRight, Zap } from "lucide-react";
import { navLinks } from "@/components/home/data";

const solutionLinks = [
  { label: "Revenue Engine", href: "#pillars" },
  { label: "Cost Killer & Ops", href: "#pillars" },
  { label: "Predictive & Forecasting", href: "#pillars" },
  { label: "Brand Trust & GEO", href: "#pillars" }
];

const companyLinks = [
  { label: "Founder", href: "#founder" },
  { label: "JetDigitalPro", href: "https://jetdigitalpro.com/" },
  { label: "Jasa-SEO.id", href: "https://jasa-seo.id/" },
  { label: "GCRIndex", href: "https://gcrindex.com/" }
];

const WHATSAPP = "https://wa.me/6281290401240";

export function Footer({ onStartWizard }: { onStartWizard?: () => void }) {
  return (
    <footer className="border-t border-border-base bg-surface-subtle">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white">
                <Zap className="h-5 w-5 fill-white" />
              </span>
              <span className="text-base font-semibold tracking-tight text-foreground">
                Pesat<span className="text-foreground-subtle">.AI</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-7 text-foreground-muted">
              AI Revenue System untuk bisnis Indonesia. Ubah masalah jadi solusi AI yang nyata, terukur, dan terpakai.
            </p>
            <button
              onClick={() => onStartWizard?.()}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-surface transition hover:-translate-y-0.5"
            >
              Buktikan Sendiri dalam 5 Menit
            </button>
          </div>

          <FooterCol title="Navigasi" links={navLinks} />
          <FooterCol title="Solusi" links={solutionLinks} />
          <FooterCol title="Perusahaan" links={companyLinks} />
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border-base pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-foreground-subtle">© 2026 Pesat.AI. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-foreground-muted">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 transition hover:text-foreground">
              WhatsApp <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a href="#pricing" className="transition hover:text-foreground">Harga</a>
            <a href="#founder" className="transition hover:text-foreground">Tentang</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground-subtle">{title}</p>
      <ul className="mt-4 grid gap-3">
        {links.map((link) => {
          const external = link.href.startsWith("http");
          return (
            <li key={`${title}-${link.label}`}>
              <a
                href={link.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-1 text-sm text-foreground-muted transition hover:text-foreground"
              >
                {link.label}
                {external ? <ArrowUpRight className="h-3.5 w-3.5" /> : null}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Footer;
