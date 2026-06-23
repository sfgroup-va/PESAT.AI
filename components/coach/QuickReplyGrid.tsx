"use client";

import type { QuickReply } from "@/lib/diagnostic-flow";
import { ChevronRight } from "lucide-react";

/**
 * Grid pilihan jawaban dalam bentuk "pill cards" besar dengan tap target full-width.
 *
 * Tujuan UX: terasa seperti memilih insight, bukan mengisi form radio.
 * Setiap kartu punya emoji, label, dan chevron yang bergerak saat hover.
 * Hover state berlapis (border + bg + chevron + shadow) memberi kesan responsif & premium.
 */
export function QuickReplyGrid({ replies, onSelect, disabled }: { replies: QuickReply[]; onSelect: (reply: QuickReply) => void; disabled?: boolean }) {
  return (
    <div className="grid gap-2.5">
      {replies.map((reply, index) => (
        <button
          key={reply.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(reply)}
          style={{ animationDelay: `${index * 70}ms` }}
          className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-400 hover:bg-violet-50/50 hover:shadow-md hover:shadow-violet-100 active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:border-neutral-200 disabled:hover:bg-white disabled:hover:shadow-sm animate-fade-in-up"
        >
          {/* Sheen halus saat hover */}
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

          {reply.emoji ? (
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-50 text-lg transition-colors duration-200 group-hover:bg-white group-hover:shadow-sm">
              {reply.emoji}
            </span>
          ) : null}

          <span className="relative flex-1 text-[14.5px] font-medium leading-[1.4] text-neutral-800">{reply.label}</span>

          <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:bg-violet-500 group-hover:text-white">
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
          </span>
        </button>
      ))}
    </div>
  );
}
