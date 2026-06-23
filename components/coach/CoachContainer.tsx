"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useCoachSequence, type ChatItem } from "./useCoachSequence";
import { CoachMessage } from "./CoachMessage";
import { UserMessage } from "./UserMessage";
import { QuickReplyGrid } from "./QuickReplyGrid";
import { TypingIndicator } from "./TypingIndicator";
import { InsightAccumulator } from "./InsightAccumulator";
import { AnalysisStatus } from "./AnalysisStatus";
import { MiniReport } from "./MiniReport";
import { StickyConversionBar } from "./StickyConversionBar";
import { ChatInput } from "./ChatInput";
import { useFocusTrap } from "./useFocusTrap";
import { toWizardAnswers, type DiagnosticState } from "@/lib/diagnostic-state";
import { saveSession } from "@/lib/session";
import { hasUsableWhatsAppNumber } from "@/lib/validation";
import type { ContactData, GeneratedResult } from "@/lib/types";
import type { QuickReply } from "@/lib/diagnostic-flow";

const LEAD_FIELDS: Array<{ key: keyof ContactData; label: string; placeholder: string; validate?: (value: string) => boolean }> = [
  { key: "companyName", label: "Nama perusahaan Anda?", placeholder: "Contoh: PT Sukses Sejahtera" },
  { key: "name", label: "Nama Anda?", placeholder: "Contoh: Andi Wijaya" },
  { key: "wa", label: "Nomor WhatsApp Anda?", placeholder: "Contoh: 08123456789", validate: hasUsableWhatsAppNumber },
  { key: "employeeCount", label: "Berapa jumlah karyawan?", placeholder: "Contoh: 15 orang" },
  { key: "yearlyRevenue", label: "Omzet per tahun kira-kira berapa?", placeholder: "Contoh: 1-5 Miliar" }
];

export function CoachContainer({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<"chat" | "generating" | "report" | "leadGate" | "submitting" | "done">("chat");
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [resultError, setResultError] = useState("");
  const [extraItems, setExtraItems] = useState<ChatItem[]>([]);
  const [pendingFreeText, setPendingFreeText] = useState<QuickReply | null>(null);
  const [contact, setContact] = useState<ContactData>({
    companyName: "",
    name: "",
    wa: "",
    followUpAllowed: true,
    employeeCount: "",
    yearlyRevenue: ""
  });
  const [leadStep, setLeadStep] = useState(0);
  const [leadError, setLeadError] = useState("");
  const [discoveryUrl, setDiscoveryUrl] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const finalStateRef = useRef<DiagnosticState | null>(null);

  const generateResult = useCallback(async (state: DiagnosticState) => {
    setResultError("");
    try {
      const answers = toWizardAnswers(state);
      const activeSessionId = await saveSession(sessionIdRef.current, answers, contact, false);
      sessionIdRef.current = activeSessionId;
      const response = await fetch("/api/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: activeSessionId, answers, contact })
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Hasil belum bisa dibuat.");
      }
      const data = (await response.json()) as GeneratedResult;
      if (!data.headline || !Array.isArray(data.impactCards) || !Array.isArray(data.solutionsText)) {
        throw new Error("Format hasil belum valid.");
      }
      setResult(data);
      setPhase("report");
      void track("screen_view", { subScreen: "report", sessionId: sessionIdRef.current });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Hasil belum bisa dibuat.";
      setResultError(message);
      setPhase("report");
      void track("click", { action: "result_error", message, sessionId: sessionIdRef.current });
    }
  }, [contact]);

  const { items, insights, statusLabel, isChoosing, currentNode, handleReply, handleFreeText } = useCoachSequence({
    onComplete: (state) => {
      finalStateRef.current = state;
      setPhase("generating");
      void track("click", { action: "diagnosis_complete", sessionId: sessionIdRef.current });
      void generateResult(state);
    }
  });

  useFocusTrap(containerRef, true, onClose);

  useEffect(() => {
    void track("screen_view", { subScreen: "coach_open", sessionId: sessionIdRef.current });
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [items, isChoosing, extraItems, phase]);

  useEffect(() => {
    if (phase === "leadGate" && leadStep < LEAD_FIELDS.length) {
      const field = LEAD_FIELDS[leadStep];
      const id = setTimeout(() => {
        setExtraItems((prev) => [...prev, { type: "bot", text: field.label }]);
      }, 500);
      return () => clearTimeout(id);
    }
  }, [phase, leadStep]);

  useEffect(() => {
    if (inputRef.current) {
      const id = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [pendingFreeText, leadStep, phase]);

  useEffect(() => {
    if (containerRef.current) {
      const id = setTimeout(() => {
        const focusable = containerRef.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex=\"-1\"])"
        );
        const first = focusable?.[0];
        if (first && document.activeElement !== inputRef.current) {
          first.focus();
        }
      }, 100);
      return () => clearTimeout(id);
    }
  }, []);

  async function track(type: "screen_view" | "click", metadata?: Record<string, unknown>) {
    try {
      await fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          screen: "coach",
          sessionId: sessionIdRef.current,
          metadata: metadata || {}
        })
      });
    } catch {
      // Tracking failures should never break the session.
    }
  }

  function handleSelect(reply: QuickReply) {
    if (reply.freeText) {
      setPendingFreeText(reply);
      void track("click", { action: "free_text_open", step: currentNode.id, replyId: reply.id, sessionId: sessionIdRef.current });
      return;
    }
    void track("click", { action: "quick_reply", step: currentNode.id, replyId: reply.id, sessionId: sessionIdRef.current });
    handleReply(reply);
  }

  function handleFreeTextSubmit(text: string) {
    if (!pendingFreeText) return;
    void track("click", { action: "free_text_submit", step: currentNode.id, replyId: pendingFreeText.id, sessionId: sessionIdRef.current });
    handleFreeText(pendingFreeText, text);
    setPendingFreeText(null);
  }

  function startLeadGate() {
    void track("click", { action: "open_lead_gate", sessionId: sessionIdRef.current });
    setPhase("leadGate");
    setExtraItems((prev) => [
      ...prev,
      { type: "bot", text: "Baik. Saya butuh beberapa data singkat supaya tim kami bisa menyiapkan bahan pembahasan yang tepat." }
    ]);
  }

  async function persistContact(contactToUse: ContactData) {
    if (!finalStateRef.current) return;
    try {
      await saveSession(sessionIdRef.current, toWizardAnswers(finalStateRef.current), contactToUse, true);
    } catch {
      // Best-effort contact persistence.
    }
  }

  function handleLeadInput(value: string) {
    if (phase !== "leadGate") return;
    const field = LEAD_FIELDS[leadStep];
    const trimmed = value.trim();

    if (field.validate && !field.validate(trimmed)) {
      setLeadError("Silakan isi dengan format yang valid.");
      return;
    }

    setLeadError("");
    const updatedContact = { ...contact, [field.key]: trimmed } as ContactData;
    setContact(updatedContact);
    setExtraItems((prev) => [...prev, { type: "user", label: trimmed }]);

    if (leadStep + 1 < LEAD_FIELDS.length) {
      setLeadStep((s) => s + 1);
    } else {
      setLeadStep((s) => s + 1);
      setTimeout(() => {
        setExtraItems((prev) => [
          ...prev,
          { type: "bot", text: "Terima kasih. Saya akan arahkan Anda ke WhatsApp tim Pesat.AI untuk jadwal pembahasan 20 menit." }
        ]);
        void persistContact(updatedContact);
        void submitDiscovery(updatedContact);
      }, 600);
    }
  }

  async function submitDiscovery(contactToUse: ContactData) {
    setPhase("submitting");
    try {
      const payload = {
        sessionId: sessionIdRef.current,
        companyName: contactToUse.companyName,
        name: contactToUse.name,
        wa: contactToUse.wa,
        employeeCount: contactToUse.employeeCount,
        yearlyRevenue: contactToUse.yearlyRevenue,
        budgetContext: "",
        message: "",
        summary: result?.headline || ""
      };
      const response = await fetch("/api/discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await response.json().catch(() => ({}))) as { whatsappUrl?: string; error?: string };
      if (!response.ok || !data.whatsappUrl) {
        throw new Error(data.error || "Discovery call belum bisa diproses.");
      }
      setDiscoveryUrl(data.whatsappUrl);
      setPhase("done");
      void track("click", { action: "discovery_submitted", persisted: data.whatsappUrl ? true : false, sessionId: sessionIdRef.current });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Discovery call belum bisa diproses.";
      setLeadError(message);
      setPhase("leadGate");
      void track("click", { action: "discovery_error", message, sessionId: sessionIdRef.current });
    }
  }

  function handleRetry() {
    if (!finalStateRef.current) return;
    setPhase("generating");
    void track("click", { action: "retry_result", sessionId: sessionIdRef.current });
    void generateResult(finalStateRef.current);
  }

  function handleClose() {
    void track("click", { action: "close_coach", phase, sessionId: sessionIdRef.current });
    onClose();
  }

  const showQuickReplies = phase === "chat" && isChoosing && !pendingFreeText && currentNode.quickReplies && currentNode.quickReplies.length > 0;
  const allItems = [...items, ...extraItems];
  const currentStatus = phase === "generating" ? "Menyusun hasil diagnosis" : statusLabel;

  return (
    <section
      ref={containerRef}
      className="relative flex h-full w-full flex-col overflow-hidden bg-neutral-50"
    >
      {/* Header */}
      <div className="relative flex items-center justify-between border-b border-neutral-100 bg-white px-5 py-4 sm:rounded-t-[2rem]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-md shadow-violet-200">
              <span className="text-base font-bold">P</span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-neutral-900">Pesat.AI Business Coach</p>
            <p className="flex items-center gap-1 text-[11px] text-neutral-500">
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              Sesi Diagnostik AI
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleClose}
            className="grid h-9 w-9 place-items-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Tutup"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      {/* Status */}
      <AnalysisStatus key={currentStatus} label={currentStatus} />

      {/* Messages */}
      <div ref={scrollRef} className="coach-scroll flex-1 overflow-y-auto px-5 py-6">
        <div className="space-y-4">
          {allItems.map((item, index) => {
            if (item.type === "bot") {
              return <CoachMessage key={`bot-${index}`} text={item.text} />;
            }
            if (item.type === "user") {
              return <UserMessage key={`user-${index}`} label={item.label} />;
            }
            if (item.type === "typing") {
              return <TypingIndicator key={`typing-${index}`} />;
            }
            return null;
          })}

          {phase === "generating" && (
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-md shadow-violet-200">
                <span className="relative flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-full w-full rounded-full bg-white" />
                </span>
              </div>
              <span className="text-sm font-medium text-neutral-500">Sedang menyusun hasil...</span>
            </div>
          )}

          {phase === "report" && result && (
            <>
              <CoachMessage text="Oke, saya sudah cukup paham polanya. Ini yang saya lihat dari bisnis Anda." />
              <MiniReport result={result} />
              <StickyConversionBar onClick={startLeadGate} />
            </>
          )}

          {resultError && phase === "report" && !result && (
            <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-center">
              <p className="text-sm font-semibold text-red-700">{resultError}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-800 transition hover:bg-red-200"
              >
                Coba lagi
              </button>
            </div>
          )}

          {phase === "done" && discoveryUrl && (
            <div className="rounded-[1.4rem] border border-violet-100 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 text-white shadow-md shadow-emerald-200">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-base font-bold text-neutral-900">Siap dibahas!</p>
              <p className="mt-1 text-sm text-neutral-500">Klik di bawah untuk lanjut ke WhatsApp tim Pesat.AI.</p>
              <a
                href={discoveryUrl}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-5 py-3.5 text-center text-base font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Buka WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Insight accumulator — persistent, hanya muncul saat phase chat & ≥1 slot terisi.
          Inilah yang membuat user merasa "sistem sedang memproses saya". */}
      {phase === "chat" && Object.keys(insights).length > 0 ? (
        <div className="border-t border-neutral-100/80 bg-white/40 px-5 pb-2 pt-3 backdrop-blur-sm">
          <InsightAccumulator insights={insights} />
        </div>
      ) : null}

      {/* Input / Quick Replies */}
      <div className="bg-white px-5 py-4 sm:rounded-b-[2rem]">
        {showQuickReplies ? (
          <QuickReplyGrid replies={currentNode.quickReplies!} onSelect={handleSelect} disabled={!isChoosing} />
        ) : pendingFreeText ? (
          <div className="space-y-2">
            <ChatInput
              ref={inputRef}
              placeholder={pendingFreeText.freeTextPlaceholder || "Jelaskan singkat..."}
              onSend={handleFreeTextSubmit}
              submitLabel="Lanjut"
            />
            <p className="text-center text-[11px] text-neutral-400">Tekan Lanjut setelah menulis jawaban Anda.</p>
          </div>
        ) : phase === "leadGate" && leadStep < LEAD_FIELDS.length ? (
          <div className="space-y-2">
            <ChatInput
              ref={inputRef}
              placeholder={LEAD_FIELDS[leadStep].placeholder}
              onSend={handleLeadInput}
            />
            {leadError ? <p className="text-xs text-red-600">{leadError}</p> : null}
          </div>
        ) : (
          <p className="text-center text-sm text-neutral-400">
            {phase === "submitting" ? "Menyimpan jadwal..." : "Coach sedang mengetik..."}
          </p>
        )}
      </div>
    </section>
  );
}
