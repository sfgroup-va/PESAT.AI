"use client";

import { Sparkles } from "lucide-react";

/**
 * Indikator coach sedang mengetik. Memakai avatar yang sama dengan CoachMessage
 * supaya transisinya mulus. Tiga dot berirama, bukan bounce heboh.
 */
export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5">
      <div className="mb-1 shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-md shadow-violet-200">
          <Sparkles className="h-4 w-4" />
        </div>
      </div>
      <div className="flex items-center gap-1.5 rounded-[1.4rem] rounded-bl-md border border-violet-100/80 bg-white px-5 py-4 shadow-[0_2px_20px_-8px_rgba(99,102,241,0.25)]">
        <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400" style={{ animationDelay: "0ms", animationDuration: "1s" }} />
        <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400" style={{ animationDelay: "150ms", animationDuration: "1s" }} />
        <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400" style={{ animationDelay: "300ms", animationDuration: "1s" }} />
      </div>
    </div>
  );
}
