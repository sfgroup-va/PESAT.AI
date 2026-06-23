"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { COACH_FLOW, START_NODE, type FlowNodeId, type InsightSlotId, type QuickReply } from "@/lib/diagnostic-flow";
import { sanitizeWordLimitedText } from "@/lib/validation";
import { initialDiagnosticState, type DiagnosticState } from "@/lib/diagnostic-state";

export type ChatItem =
  | { type: "bot"; text: string }
  | { type: "user"; label: string }
  | { type: "typing" };

export type InsightMap = Partial<Record<InsightSlotId, string>>;

export function useCoachSequence({ onComplete }: { onComplete: (state: DiagnosticState) => void }) {
  const [currentNodeId, setCurrentNodeId] = useState<FlowNodeId>(START_NODE);
  const [diagnosticState, setDiagnosticState] = useState<DiagnosticState>(initialDiagnosticState);
  const [items, setItems] = useState<ChatItem[]>([]);
  const [insights, setInsights] = useState<InsightMap>({});
  const [isTyping, setIsTyping] = useState(false);
  const [isChoosing, setIsChoosing] = useState(false);
  const [statusLabel, setStatusLabel] = useState<string>(COACH_FLOW[START_NODE].statusLabel || "");

  const sequenceActive = useRef(false);

  // Ref untuk membaca state terbaru di dalam callback tanpa re-create.
  const diagnosticStateRef = useRef(diagnosticState);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    diagnosticStateRef.current = diagnosticState;
  }, [diagnosticState]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const playMessage = useCallback(async (text: string, delayMs = 600) => {
    setIsTyping(true);
    setItems((prev) => [...prev, { type: "typing" }]);
    await delay(delayMs);
    setItems((prev) => prev.filter((item) => item.type !== "typing"));
    setIsTyping(false);
    setItems((prev) => [...prev, { type: "bot", text }]);
    // Waktu baca kasar: karakter × 18ms + baseline 400ms, maksimal 4 detik.
    await delay(Math.min(text.length * 18 + 400, 4000));
  }, []);

  const playNode = useCallback(
    async (nodeId: FlowNodeId, state: DiagnosticState) => {
      if (sequenceActive.current) return;
      sequenceActive.current = true;
      setIsChoosing(false);

      const node = COACH_FLOW[nodeId];
      setStatusLabel(node.statusLabel || "");

      // Pesan dinamis dirakit dari state (mis. rangkuman Round 4).
      if (node.dynamicMessages) {
        for (const fn of node.dynamicMessages) {
          await playMessage(fn(state), 1000);
        }
      }

      for (const message of node.messages) {
        await playMessage(message.text, message.delayMs ?? 600);
      }

      if (node.quickReplies && node.quickReplies.length > 0) {
        setIsChoosing(true);
      } else if (nodeId === "transition-to-result") {
        // Final node has no quick replies; trigger completion after a short pause.
        await delay(800);
        onCompleteRef.current(state);
      }

      sequenceActive.current = false;
    },
    [playMessage]
  );

  const advanceToNode = useCallback(
    (nextNode: FlowNodeId, state: DiagnosticState) => {
      // Jeda singkat antara reaction dan pertanyaan berikutnya supaya reaksi
      // sempat "berdenting" sebelum AI bertanya lagi.
      setTimeout(() => {
        void playNode(nextNode, state);
      }, 500);
    },
    [playNode]
  );

  const applyReply = useCallback(
    (reply: QuickReply, userLabel: string, state: DiagnosticState) => {
      setItems((prev) => [...prev, { type: "user", label: userLabel }]);
      setIsChoosing(false);

      // Akumulasi insight ke slot yang sesuai (panel persistent).
      if (reply.insightSlot && reply.insightValue) {
        setInsights((prev) => ({ ...prev, [reply.insightSlot as InsightSlotId]: reply.insightValue }));
      }

      // State diupdate dulu supaya dynamicMessages di node berikutnya
      // (mis. rangkuman Round 4) bisa baca state terbaru.
      const nextState: DiagnosticState = { ...state, ...reply.update };
      setDiagnosticState(nextState);
      setCurrentNodeId(reply.nextNode);

      // Reaksi AI = momen "iya juga ya". Diputar sebagai bot message,
      // LALU node berikutnya dijadwalkan setelah reaksi selesai.
      const reaction = reply.reaction;
      const runReaction = async () => {
        if (reaction) {
          await delay(300); // jeda setelah bubble user muncul
          await playMessage(reaction, 700);
        }
        advanceToNode(reply.nextNode, nextState);
      };
      void runReaction();
    },
    [advanceToNode, playMessage]
  );

  const handleReply = useCallback(
    (reply: QuickReply) => {
      if (!isChoosing || isTyping) return;
      applyReply(reply, reply.label, diagnosticStateRef.current);
    },
    [isChoosing, isTyping, applyReply]
  );

  const handleFreeText = useCallback(
    (reply: QuickReply, text: string) => {
      if (!isChoosing || isTyping) return;

      const cleaned = sanitizeWordLimitedText(text, 80, 500).trim();
      if (!cleaned) return;

      const current = diagnosticStateRef.current;
      applyReply(
        { ...reply, update: { ...reply.update, freeTextNotes: [...current.freeTextNotes, cleaned] } },
        cleaned,
        current
      );
    },
    [isChoosing, isTyping, applyReply]
  );

  useEffect(() => {
    if (items.length === 0) {
      const id = setTimeout(() => {
        void playNode(START_NODE, diagnosticStateRef.current);
      }, 100);
      return () => clearTimeout(id);
    }
  }, [items.length, playNode]);

  return {
    items,
    insights,
    statusLabel,
    isChoosing,
    currentNode: COACH_FLOW[currentNodeId],
    diagnosticState,
    handleReply,
    handleFreeText
  };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
