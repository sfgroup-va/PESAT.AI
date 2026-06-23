"use client";

import type { QuickReply } from "@/lib/diagnostic-flow";

/**
 * Pilihan jawaban dalam bentuk chip pill (Zendesk-style).
 *
 * Tujuan UX: terasa seperti pilihan cepat di chat, bukan form radio.
 */
export function QuickReplyGrid({ replies, onSelect, disabled }: { replies: QuickReply[]; onSelect: (reply: QuickReply) => void; disabled?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {replies.map((reply, index) => (
        <button
          key={reply.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(reply)}
          style={{ animationDelay: `${index * 50}ms` }}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-left text-sm font-medium leading-5 text-neutral-700 shadow-sm transition-all duration-200 hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-neutral-200 disabled:hover:bg-white disabled:hover:text-neutral-700 disabled:hover:shadow-sm animate-fade-in-up"
        >
          {reply.emoji ? <span className="text-base">{reply.emoji}</span> : null}
          <span>{reply.label}</span>
        </button>
      ))}
    </div>
  );
}
