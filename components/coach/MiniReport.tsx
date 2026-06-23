"use client";

import { useEffect, useState } from "react";
import { Lightbulb, Search, Target, TrendingUp } from "lucide-react";
import type { GeneratedResult } from "@/lib/types";

/**
 * Mini report 4-kartu yang ter-reveal satu per satu (stagger).
 * Momen "hasil coaching", bukan "hasil submit".
 */
export function MiniReport({ result }: { result: GeneratedResult }) {
  const [visibleCards, setVisibleCards] = useState(0);

  useEffect(() => {
    if (visibleCards < 4) {
      const id = setTimeout(() => setVisibleCards((v) => v + 1), 650);
      return () => clearTimeout(id);
    }
  }, [visibleCards]);

  const cards = [
    {
      icon: <Search className="h-[18px] w-[18px]" />,
      label: "Diagnosis utama",
      text: result.tldr || `${result.headline}. ${result.subheadline}`,
      accent: "from-indigo-500 to-violet-500"
    },
    {
      icon: <Lightbulb className="h-[18px] w-[18px]" />,
      label: "Akar masalah",
      text: result.diagnosis || result.rootCause?.text || "Ada kebocoran pola operasional yang membuat biaya terasa berat tanpa perbaikan yang jelas.",
      accent: "from-violet-500 to-fuchsia-500"
    },
    {
      icon: <Target className="h-[18px] w-[18px]" />,
      label: "Solusi prioritas",
      text: result.solutionsText.slice(0, 3).join(" ") || "AI workflow assistant, daily summary & alert, otomatisasi admin ringan.",
      accent: "from-fuchsia-500 to-pink-500"
    },
    {
      icon: <TrendingUp className="h-[18px] w-[18px]" />,
      label: "Kenapa ini cocok",
      text: result.promise?.statement || result.firstStep || "Anda tidak butuh proyek besar dulu. Anda butuh sistem yang membuat bisnis lebih ringan, lebih terlihat, dan tidak terlalu bergantung pada energi pribadi owner.",
      accent: "from-emerald-500 to-green-500"
    }
  ];

  return (
    <div className="space-y-3">
      {cards.map((card, index) => (
        <div
          key={card.label}
          className={`rounded-[1.4rem] border border-violet-100 bg-white p-5 shadow-sm transition-all duration-500 ${
            index < visibleCards ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${card.accent} text-white shadow-sm`}>
              {card.icon}
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400">{card.label}</p>
          </div>
          <p className="mt-3 text-[15px] leading-[1.65] text-neutral-800">{card.text}</p>
        </div>
      ))}
    </div>
  );
}
