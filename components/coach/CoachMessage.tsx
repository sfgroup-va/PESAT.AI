"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

// Kata kunci bisnis yang di-highlight agar coach terasa tajam & membaca.
// Di-bold ringan (bukan warna mencolok) supaya tetap premium.
const KEYWORDS = [
  "bocor", "bocoran", "kebocoran", "berulang", "bottleneck", "macet",
  "owner", "telat", "terlambat", "visibilitas", "biaya", "margin",
  "energi", "alur", "keputusan", "antrean", "manual", "cecer",
  "quick win", "titik hemat", "titik macet", "proyek besar",
  "berdampak tercepat", "membaca pola", "mempersempit", "menguji"
];

function highlightKeywords(text: string) {
  // Escape regex special chars dari keyword.
  const escaped = KEYWORDS.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(pattern);

  return parts.map((part, i) => {
    if (KEYWORDS.some((k) => k.toLowerCase() === part.toLowerCase())) {
      return (
        <strong key={i} className="font-semibold text-neutral-950">
          {part}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function CoachMessage({ text, typewriter = true }: { text: string; typewriter?: boolean }) {
  // Inisialisasi state sesuai mode: non-typewriter langsung tampilkan semua.
  const [displayedLength, setDisplayedLength] = useState(() => (typewriter ? 0 : text.length));

  useEffect(() => {
    if (!typewriter) return;

    let index = 0;
    // Kecepatan adaptif: teks panjang agak lebih cepat biar nggak nyebelin.
    const stepMs = text.length > 180 ? 12 : 18;
    const interval = setInterval(() => {
      index += 1;
      setDisplayedLength(index);
      if (index >= text.length) clearInterval(interval);
    }, stepMs);
    return () => clearInterval(interval);
  }, [text, typewriter]);

  const visibleText = text.slice(0, displayedLength);
  const isTyping = typewriter && displayedLength < text.length;

  return (
    <div className="flex max-w-[92%] items-end gap-2.5 sm:max-w-[85%] animate-fade-in-up">
      {/* Avatar coach */}
      <div className="relative mb-1 shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-md shadow-violet-200">
          <Sparkles className="h-4 w-4" />
        </div>
        {/* Titik online premium */}
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
      </div>

      {/* Bubble */}
      <div className="relative rounded-[1.4rem] rounded-bl-md border border-violet-100/80 bg-white px-5 py-3.5 shadow-[0_2px_20px_-8px_rgba(99,102,241,0.25)]">
        <p className="whitespace-pre-wrap text-[15px] leading-[1.65] text-neutral-800">
          {typewriter ? highlightKeywords(visibleText) : highlightKeywords(text)}
          {isTyping ? (
            <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[2px] animate-pulse bg-violet-400 align-middle" />
          ) : null}
        </p>
      </div>
    </div>
  );
}
