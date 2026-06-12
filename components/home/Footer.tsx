"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
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
    <footer className="border-t border-white/10 bg-[#0a0a14]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/images/Pesat.AI logo.png"
              alt="Pesat.AI"
              width={500}
              height={422}
              className="h-12 w-auto object-contain"
            />
            <p className="mt-4 max-w-xs text-sm leading-7 text-white/60">
              AI Revenue System untuk bisnis Indonesia. Ubah masalah jadi solusi AI yang nyata, terukur, dan terpakai.
            </p>
            <button
              onClick={() => onStartWizard?.()}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0a0a14] transition hover:-translate-y-0.5"
            >
              Buktikan Sendiri dalam 5 Menit
            </button>
          </div>

          <FooterCol title="Navigasi" links={navLinks} />
          <FooterCol title="Solusi" links={solutionLinks} />
          <FooterCol title="Perusahaan" links={companyLinks} />
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/40">© 2026 Pesat.AI. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-white/60">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 transition hover:text-white">
              WhatsApp <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a href="#pricing" className="transition hover:text-white">Harga</a>
            <a href="#founder" className="transition hover:text-white">Tentang</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">{title}</p>
      <ul className="mt-4 grid gap-3">
        {links.map((link) => {
          const external = link.href.startsWith("http");
          return (
            <li key={`${title}-${link.label}`}>
              <a
                href={link.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-1 text-sm text-white/60 transition hover:text-white"
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
