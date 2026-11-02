"use client";

import { MessageSquareWarning, UsersRound, Clock, TrendingUp, Database } from "lucide-react";
import { RevealOnScroll } from "@/components/home/RevealOnScroll";

const painPoints = [
  {
    icon: MessageSquareWarning,
    text: "Leads masuk tapi telat difollow up"
  },
  {
    icon: UsersRound,
    text: "Customer chat numpuk"
  },
  {
    icon: Clock,
    text: "Admin repetitive makan waktu"
  },
  {
    icon: TrendingUp,
    text: "Operasional makin mahal"
  },
  {
    icon: Database,
    text: "Data & workflow berantakan"
  }
];

export function PainPointsOffer() {
  return (
    <section className="relative overflow-hidden bg-surface py-20 sm:py-28 lg:py-32">
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <RevealOnScroll>
          <div className="mx-auto max-w-3xl text-center">
            <p className="fx-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">Pain Point</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-5xl">
              Masih Kerja Manual untuk Hal yang Bisa Diautomasi?
            </h2>
          </div>
        </RevealOnScroll>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {painPoints.map((item, index) => {
            const Icon = item.icon;
            return (
              <RevealOnScroll key={item.text} delay={index * 80}>
                <div className="glass-panel tilt-card flex h-full items-start gap-4 rounded-[1.75rem] border border-border-base bg-surface-elevated p-6 transition hover:-translate-y-1 hover:border-accent">
                  <span className="fx-float grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent">
                    <Icon className="h-6 w-6" />
                  </span>
                  <p className="pt-2.5 text-base font-semibold leading-snug text-foreground sm:text-lg">{item.text}</p>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>

        <RevealOnScroll delay={200}>
          <div className="mt-14 rounded-[1.75rem] border border-accent/20 bg-accent/5 px-6 py-8 text-center sm:px-10 sm:py-10">
            <p className="text-lg font-semibold leading-relaxed text-foreground sm:text-2xl">
              AI bukan buat ganti bisnis Anda. AI bantu bisnis jalan lebih efisien.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export default PainPointsOffer;
