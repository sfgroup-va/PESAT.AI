"use client";

import { CalendarClock } from "lucide-react";

/**
 * CTA "Bahas Temuan Ini 20 Menit" — terasa sebagai kelanjutan coaching, bukan sales.
 * Gradient premium dengan glow halus + tombol dengan hover lift.
 */
export function StickyConversionBar({ onClick }: { onClick: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-5 text-white shadow-lg shadow-violet-200">
      {/* Dekorasi glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-fuchsia-300/20 blur-2xl" />

      <div className="relative">
        <div className="flex items-start gap-2">
          <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-violet-200" />
          <p className="text-[13.5px] font-medium leading-[1.5] text-violet-50">
            Kalau mau, saya bisa bantu pecah insight ini menjadi langkah yang benar-benar bisa dijalankan.
          </p>
        </div>

        <button
          type="button"
          onClick={onClick}
          className="group mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-center text-[15px] font-bold text-violet-700 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
        >
          Bahas Temuan Ini 20 Menit
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>

        <p className="mt-2.5 text-center text-[11px] leading-[1.4] text-violet-200">
          Kami bantu validasi titik bocor, pilih quick win paling realistis, dan susun langkah pertama.
        </p>
      </div>
    </div>
  );
}
