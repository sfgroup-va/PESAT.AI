"use client";

import { useState } from "react";
import { ArrowRight, Calendar } from "lucide-react";
import { RevealOnScroll } from "@/components/home/RevealOnScroll";

const WHATSAPP_NUMBER = "6281290401240";

const challengeOptions = [
  "Follow up leads",
  "Customer service",
  "Operasional/admin",
  "Marketing",
  "Reporting/data",
  "AI chatbot",
  "Lainnya"
];

function buildWhatsAppUrl(data: { name: string; email: string; phone: string; challenge: string }) {
  const lines = [
    "Halo tim Pesat.ai,",
    "Saya tertarik dengan AI Automation untuk bisnis saya.",
    "",
    `Nama: ${data.name}`,
    `Email: ${data.email}`,
    `No. HP: ${data.phone}`,
    `Kendala utama: ${data.challenge}`,
    "",
    "Boleh dibantu untuk discovery call?"
  ];
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export function DiscoveryFormOffer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    challenge: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = buildWhatsAppUrl(formData);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="discovery" className="relative overflow-hidden bg-surface-subtle py-20 sm:py-28 lg:py-32">
      <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-8 lg:px-10">
        <RevealOnScroll>
          <div className="text-center">
            <p className="fx-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">Closing</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-5xl">
              Lihat Bagian Bisnis Mana yang Bisa Dihemat dengan AI
            </h2>
            <p className="mt-5 text-base leading-8 text-foreground-muted sm:text-lg">
              Gratis discovery 15 menit bersama tim Pesat.ai
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={150}>
          <div className="mt-12 rounded-[1.75rem] border border-border-base bg-surface-elevated p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-10">
            <form onSubmit={handleSubmit} className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label htmlFor="offer-name" className="text-sm font-semibold text-foreground">
                      Nama
                    </label>
                    <input
                      id="offer-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="min-h-12 rounded-2xl border border-border-base bg-surface px-4 text-foreground outline-none transition focus:border-accent"
                      placeholder="Nama lengkap"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="offer-email" className="text-sm font-semibold text-foreground">
                      Email
                    </label>
                    <input
                      id="offer-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="min-h-12 rounded-2xl border border-border-base bg-surface px-4 text-foreground outline-none transition focus:border-accent"
                      placeholder="email@perusahaan.com"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="offer-phone" className="text-sm font-semibold text-foreground">
                    No. Handphone
                  </label>
                  <input
                    id="offer-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="min-h-12 rounded-2xl border border-border-base bg-surface px-4 text-foreground outline-none transition focus:border-accent"
                    placeholder="08xx xxxx xxxx"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="offer-challenge" className="text-sm font-semibold text-foreground">
                    Kendala Utama
                  </label>
                  <select
                    id="offer-challenge"
                    required
                    value={formData.challenge}
                    onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                    className="min-h-12 rounded-2xl border border-border-base bg-surface px-4 text-foreground outline-none transition focus:border-accent"
                  >
                    <option value="" disabled>
                      Pilih kendala utama
                    </option>
                    {challengeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="motion-cta-shimmer fx-ring group mt-2 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-foreground px-7 text-base font-semibold text-surface shadow-[0_18px_50px_-16px_rgba(15,23,42,0.5)] transition hover:-translate-y-0.5 sm:w-auto"
                >
                  <Calendar className="h-5 w-5" />
                  Jadwalkan Discovery Gratis via WhatsApp
                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                </button>
              </form>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export default DiscoveryFormOffer;
