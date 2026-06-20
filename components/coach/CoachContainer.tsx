"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useCoachSequence } from "./useCoachSequence";
import { CoachMessage } from "./CoachMessage";
import { UserMessage } from "./UserMessage";
import { QuickReplyGrid } from "./QuickReplyGrid";
import { TypingIndicator } from "./TypingIndicator";
import { InsightRail } from "./InsightRail";
import { AnalysisStatus } from "./AnalysisStatus";
import type { DiagnosticState } from "@/lib/diagnostic-state";

export function CoachContainer({ onClose, onFinish }: { onClose: () => void; onFinish: (state: DiagnosticState) => void }) {
  const { items, insights, statusLabel, isChoosing, currentNode, handleReply } = useCoachSequence({
    onComplete: onFinish
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [items, insights, isChoosing]);

  const showQuickReplies = isChoosing && currentNode.quickReplies && currentNode.quickReplies.length > 0;

  return (
    <section className="fixed inset-0 z-30 flex flex-col bg-neutral-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 bg-white px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white">
            <span className="text-sm font-bold">P</span>
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-900">Pesat.AI Business Coach</p>
            <p className="text-xs text-neutral-500">AI Diagnostic Session</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-full border border-neutral-200 text-neutral-600 transition hover:bg-neutral-100"
          aria-label="Tutup"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Status */}
      <AnalysisStatus label={statusLabel} />

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6">
        <div className="mx-auto max-w-2xl space-y-5">
          {items.map((item, index) => {
            if (item.type === "bot") {
              return <CoachMessage key={`bot-${index}`} text={item.text} />;
            }
            if (item.type === "user") {
              return <UserMessage key={`user-${index}`} label={item.label} />;
            }
            if (item.type === "typing") {
              return <TypingIndicator key={`typing-${index}`} />;
            }
            if (item.type === "insight") {
              return <InsightRail key={`insight-${index}`} insights={[item.text]} />;
            }
            return null;
          })}

          {!showQuickReplies && !isChoosing && items.length > 0 && items[items.length - 1]?.type !== "typing" ? (
            <div className="flex justify-center py-4">
              <span className="text-sm text-neutral-400">Sedang menyusun hasil...</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Input / Quick Replies */}
      {showQuickReplies ? (
        <div className="border-t border-neutral-100 bg-white px-5 py-5">
          <div className="mx-auto max-w-2xl">
            <QuickReplyGrid replies={currentNode.quickReplies!} onSelect={handleReply} disabled={!isChoosing} />
          </div>
        </div>
      ) : (
        <div className="border-t border-neutral-100 bg-white px-5 py-4">
          <div className="mx-auto max-w-2xl">
            <p className="text-center text-sm text-neutral-400">Coach sedang mengetik...</p>
          </div>
        </div>
      )}
    </section>
  );
}
