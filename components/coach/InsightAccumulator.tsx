"use client";

import { Check, Sparkles } from "lucide-react";
import { INSIGHT_SLOTS } from "@/lib/diagnostic-flow";
import type { InsightMap } from "./useCoachSequence";

/**
 * Panel persistent yang menunjukkan insight sedang terakumulasi sepanjang sesi.
 *
 * Tujuan UX: user merasa "sistem sedang memproses saya", bukan "mengisi form".
 * Panel ini TIDAK scroll lewat — tetap di viewport, slot terisi satu per satu.
 *
 * Detail premium:
 * - Progress bar gradient di atas yang terisi seiring jawaban user
 * - Accent ring (gradient border) saat lengkap — momen "pola terbaca 100%"
 * - Badge "baru" muncul via CSS animation saat slot pertama kali terisi
 */
export function InsightAccumulator({ insights }: { insights: InsightMap }) {
  const filledCount = INSIGHT_SLOTS.filter((slot) => insights[slot.id]).length;
  const isComplete = filledCount === INSIGHT_SLOTS.length;
  const percent = Math.round((filledCount / INSIGHT_SLOTS.length) * 100);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-white/90 p-3.5 shadow-sm backdrop-blur transition-all duration-500 ${
        isComplete
          ? "border-violet-300 shadow-violet-100"
          : "border-violet-100"
      }`}
    >
      {/* Progress bar gradient di atas */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-neutral-100">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-violet-600">
          <Sparkles className="h-3.5 w-3.5" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">
            {isComplete ? "Pola terbaca 100%" : "Yang mulai saya lihat"}
          </p>
        </div>
        <span className="text-[10px] font-semibold tabular-nums text-neutral-400">
          {isComplete ? `${percent}%` : `${filledCount}/${INSIGHT_SLOTS.length}`}
        </span>
      </div>

      {/* Slot list */}
      <ul className="mt-2.5 space-y-1.5">
        {INSIGHT_SLOTS.map((slot) => {
          const value = insights[slot.id];
          const isFilled = Boolean(value);

          return (
            <li
              key={slot.id}
              className={`flex items-start gap-2 transition-all duration-300 ${
                isFilled ? "opacity-100" : "opacity-40"
              }`}
            >
              <span
                className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                  isFilled
                    ? "bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-sm shadow-violet-200"
                    : "border border-neutral-300 bg-white"
                }`}
              >
                {isFilled ? <Check className="h-2.5 w-2.5" strokeWidth={3.5} /> : null}
              </span>
              <div className="min-w-0 flex-1">
                {isFilled ? (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                      {slot.label}
                    </span>
                    <span
                      className="rounded-full bg-violet-100 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-violet-600"
                      style={{ animation: "pesat-fresh-badge 2.2s ease-out forwards" }}
                    >
                      baru
                    </span>
                    <p className="w-full text-[12.5px] font-medium leading-[1.4] text-neutral-800">{value}</p>
                  </div>
                ) : (
                  <p className="text-[12.5px] leading-[1.4] text-neutral-400">{slot.label}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Keyframes untuk badge "baru": fade-in cepat, stay, lalu fade-out permanen. */}
      <style>{`
        @keyframes pesat-fresh-badge {
          0%   { opacity: 0; transform: scale(0.85); }
          12%  { opacity: 1; transform: scale(1); }
          82%  { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.9); }
        }
      `}</style>
    </div>
  );
}
