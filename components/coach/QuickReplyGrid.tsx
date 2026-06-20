"use client";

import type { QuickReply } from "@/lib/diagnostic-flow";

export function QuickReplyGrid({ replies, onSelect, disabled }: { replies: QuickReply[]; onSelect: (reply: QuickReply) => void; disabled?: boolean }) {
  return (
    <div className="grid gap-2.5">
      {replies.map((reply) => (
        <button
          key={reply.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(reply)}
          className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-left transition hover:border-violet-400 hover:shadow-md disabled:opacity-50"
        >
          {reply.emoji ? <span className="text-xl">{reply.emoji}</span> : null}
          <span className="flex-1 text-base font-semibold leading-6 text-neutral-900">{reply.label}</span>
        </button>
      ))}
    </div>
  );
}
