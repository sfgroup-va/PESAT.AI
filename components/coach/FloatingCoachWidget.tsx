"use client";

import { useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { useCoach } from "./CoachProvider";
import { CoachContainer } from "./CoachContainer";

/**
 * Widget coach global (Zendesk/Intercom-style).
 *
 * - Launcher bubble di pojok kanan bawah saat panel tertutup.
 * - Saat dibuka: backdrop overlay + <CoachContainer> muncul DI ATAS halaman saat ini.
 * - Homepage/layar tetap mounted di belakang (tidak unmount).
 * - Body scroll di-lock saat panel terbuka.
 */
export function FloatingCoachWidget() {
  const { isOpen, hasInteracted, sessionKey, openCoach, closeCoach } = useCoach();

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  return (
    <>
      {/* Launcher bubble */}
      {!isOpen ? (
        <button
          type="button"
          onClick={openCoach}
          aria-label="Buka AI Business Coach"
          className="group fixed bottom-5 right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-2xl shadow-violet-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-violet-500/40"
        >
          {!hasInteracted ? (
            <span className="pointer-events-none absolute inset-0 rounded-full">
              <span className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-violet-400/40" />
            </span>
          ) : null}
          <MessageCircle className="relative h-6 w-6" strokeWidth={2} />
        </button>
      ) : null}

      {/* Overlay panel */}
      {isOpen ? (
        <>
          <div
            className="fixed inset-0 z-[70] bg-neutral-950/40 backdrop-blur-sm animate-fade-in sm:bg-neutral-950/20 sm:backdrop-blur-[1px]"
            onClick={closeCoach}
            aria-hidden
          />

          <div className="fixed inset-0 z-[70] flex items-stretch justify-end p-0 sm:inset-auto sm:right-4 sm:top-4 sm:block sm:h-[calc(100vh-2rem)] sm:w-[420px] sm:p-0">
            <div className="flex h-full w-full animate-scale-in overflow-hidden bg-neutral-50 sm:rounded-[2rem] sm:border sm:border-neutral-200 sm:shadow-2xl sm:shadow-neutral-900/10">
              <CoachContainer key={sessionKey} onClose={closeCoach} />
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
