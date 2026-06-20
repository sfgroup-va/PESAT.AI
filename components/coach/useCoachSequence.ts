"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { COACH_FLOW, START_NODE, type FlowNodeId, type QuickReply } from "@/lib/diagnostic-flow";
import { initialDiagnosticState, type DiagnosticState } from "@/lib/diagnostic-state";

export type ChatItem =
  | { type: "bot"; text: string }
  | { type: "user"; label: string }
  | { type: "typing" }
  | { type: "insight"; text: string };

export function useCoachSequence({ onComplete }: { onComplete: (state: DiagnosticState) => void }) {
  const [currentNodeId, setCurrentNodeId] = useState<FlowNodeId>(START_NODE);
  const [diagnosticState, setDiagnosticState] = useState<DiagnosticState>(initialDiagnosticState);
  const [items, setItems] = useState<ChatItem[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isChoosing, setIsChoosing] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  const [statusLabel, setStatusLabel] = useState<string>(COACH_FLOW[START_NODE].statusLabel || "");

  const sequenceActive = useRef(false);

  const playNode = useCallback(
    async (nodeId: FlowNodeId) => {
      if (sequenceActive.current) return;
      sequenceActive.current = true;
      setIsChoosing(false);

      const node = COACH_FLOW[nodeId];
      setStatusLabel(node.statusLabel || "");

      // Add insights first so they appear before the next question.
      if (node.insights && node.insights.length > 0) {
        for (const insight of node.insights) {
          setInsights((prev) => {
            if (prev.includes(insight)) return prev;
            return [...prev.slice(-2), insight];
          });
          setItems((prev) => [...prev, { type: "insight", text: insight }]);
          await delay(400);
        }
      }

      for (const message of node.messages) {
        setIsTyping(true);
        setItems((prev) => [...prev, { type: "typing" }]);
        await delay(message.delayMs ?? 600);
        setItems((prev) => prev.filter((item) => item.type !== "typing"));
        setIsTyping(false);
        setItems((prev) => [...prev, { type: "bot", text: message.text }]);
        await delay(message.text.length * 18 + 200);
      }

      if (node.quickReplies && node.quickReplies.length > 0) {
        setIsChoosing(true);
      } else if (nodeId === "transition-to-result") {
        // Final node has no quick replies; trigger completion after a short pause.
        await delay(800);
        onComplete(diagnosticState);
      }

      sequenceActive.current = false;
    },
    [diagnosticState, onComplete]
  );

  const handleReply = useCallback(
    (reply: QuickReply) => {
      if (!isChoosing || isTyping) return;

      setItems((prev) => [...prev, { type: "user", label: reply.label }]);
      setIsChoosing(false);

      setDiagnosticState((prev) => ({ ...prev, ...reply.update }));
      setCurrentNodeId(reply.nextNode);
    },
    [isChoosing, isTyping]
  );

  useEffect(() => {
    if (items.length === 0) {
      const id = setTimeout(() => {
        void playNode(START_NODE);
      }, 100);
      return () => clearTimeout(id);
    }
  }, [items.length, playNode]);

  useEffect(() => {
    // When currentNodeId changes due to a user reply, play the next node.
    if (currentNodeId !== START_NODE) {
      const id = setTimeout(() => {
        void playNode(currentNodeId);
      }, 100);
      return () => clearTimeout(id);
    }
  }, [currentNodeId, playNode]);

  return {
    items,
    insights,
    statusLabel,
    isChoosing,
    currentNode: COACH_FLOW[currentNodeId],
    handleReply
  };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
