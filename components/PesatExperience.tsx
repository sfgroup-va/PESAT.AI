"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BarChart3, Check, Download, ExternalLink, Loader2, X, Sparkles, TrendingUp, Shield, Clock, Zap, Search, AlertTriangle, TrendingDown, Brain } from "lucide-react";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { CtaBand } from "@/components/home/CtaBand";
import { Hero } from "@/components/home/sections/Hero";
import { Fomo } from "@/components/home/sections/Fomo";
import { Pillars } from "@/components/home/sections/Pillars";
import { HowItWorks } from "@/components/home/sections/HowItWorks";
import { WhyPesat } from "@/components/home/sections/WhyPesat";
import { Pricing } from "@/components/home/sections/Pricing";
import { CaseStudies } from "@/components/home/sections/CaseStudies";
import { Testimonial } from "@/components/home/sections/Testimonial";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { CHALLENGE_LABELS, TRANSITION_FACTS, QUALITY_QUESTIONS, DETAIL_TO_CHALLENGE, FRICTION_SOURCES, LOADING_INSIGHTS } from "@/lib/solutions";
import { hasUsableWhatsAppNumber } from "@/lib/validation";
import { DEFAULT_LANDING_CONFIG, type LandingConfig } from "@/lib/landing";
import type { AdoptionId, ChallengeId, ContactData, DetailId, GeneratedResult, ImpactId, FrictionSourceId, WizardAnswers } from "@/lib/types";

const initialAnswers: WizardAnswers = {
  mainChallenges: [],
  detailChallenges: [],
  impactLevel: "",
  frictionSource: "",
  adoptionStyle: ""
};

type Step = "hero" | "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "review" | "loading" | "result" | "leadGate";

const STEP_ORDER: Step[] = ["hero", "q1", "q2", "q3", "q4", "q5", "q6", "review", "loading", "result", "leadGate"];

const STEP_PROGRESS: Record<Step, number> = {
  hero: 0,
  q1: 12,
  q2: 25,
  q3: 38,
  q4: 50,
  q5: 62,
  q6: 75,
  review: 85,
  loading: 90,
  result: 100,
  leadGate: 100
};

const DETAIL_NOTE_WORD_LIMIT = 1000;
const DISCOVERY_SHORT_ANSWER_WORD_LIMIT = 120;

type DiscoveryContextKey = "priorityFocus" | "discoveryGoal";
type DiscoveryContextAnswers = Record<DiscoveryContextKey, string>;

const initialDiscoveryContext: DiscoveryContextAnswers = {
  priorityFocus: "",
  discoveryGoal: ""
};

const OPTIONAL_DISCOVERY_QUESTIONS: Array<{
  id: DiscoveryContextKey;
  label: string;
  helper: string;
  placeholder: string;
  rows: number;
}> = [
  {
    id: "priorityFocus",
    label: "2. Bagian mana yang paling ingin Anda benahi lebih dulu?",
    helper: "Opsional, cukup jawaban singkat agar tim tahu prioritas Anda.",
    placeholder: "Contoh: Saya ingin stok dan pencatatan penjualan rapi dulu karena sering selisih.",
    rows: 3
  },
  {
    id: "discoveryGoal",
    label: "3. Kalau lanjut discovery call, apa yang paling ingin Anda pahami atau putuskan?",
    helper: "Opsional, misalnya tools yang cocok, estimasi biaya, atau urutan implementasi.",
    placeholder: "Contoh: Saya ingin tahu tools yang cocok, kisaran biaya, dan langkah implementasi paling realistis.",
    rows: 3
  }
];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function useLoadingSequence(insights: typeof LOADING_INSIGHTS, onComplete: () => void) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!insights.length) {
      onComplete();
      return;
    }
    let cancelled = false;

    const run = async () => {
      for (let i = 0; i < insights.length; i++) {
        if (cancelled) return;
        setActiveIndex(i);
        setIsVisible(true);
        await wait(insights[i].durationMs);

        if (i < insights.length - 1) {
          setIsVisible(false);
          await wait(600);
        }
      }
      if (!cancelled) onComplete();
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [insights, onComplete]);

  return { activeInsight: insights[activeIndex], isVisible };
}

export function PesatExperience({ landing }: { landing?: LandingConfig } = {}) {
  const cfg = landing ?? DEFAULT_LANDING_CONFIG;
  const [step, setStep] = useState<Step>("hero");
  const [sessionId, setSessionId] = useState<string>("");
  const [answers, setAnswers] = useState<WizardAnswers>(initialAnswers);
  const [contact, setContact] = useState<ContactData>({});
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detailNote, setDetailNote] = useState("");
  const [discoveryContext, setDiscoveryContext] = useState<DiscoveryContextAnswers>(initialDiscoveryContext);
  const [resultError, setResultError] = useState("");
  const [discoveryError, setDiscoveryError] = useState("");
  const [discoveryNotice, setDiscoveryNotice] = useState("");
  const [transitionFact, setTransitionFact] = useState<{ text: string; source: string } | null>(null);

  const detailNoteWordCount = useMemo(() => countWords(detailNote), [detailNote]);

  const primaryChallenge = answers.mainChallenges[0] || "revenue";
  const fact = TRANSITION_FACTS[primaryChallenge];

  const track = useCallback(
    async (type: "screen_view" | "click", screen: Step, metadata?: Record<string, unknown>, sessionIdOverride?: string) => {
      await fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionIdOverride || sessionId, type, screen, metadata })
      }).catch(() => undefined);
    },
    [sessionId]
  );

  useEffect(() => {
    if (step !== "hero") {
      void track("screen_view", step);
    }
  }, [step, track]);

  // Contact is only required for the lead gate discovery submission, not for generating the result.
  const canSubmitDiscovery = Boolean(contact.name && contact.name.trim()) && hasUsableWhatsAppNumber(contact.wa || "");

  async function saveSession(nextAnswers = answers, nextContact = contact, completed = false) {
    const activeSessionId = sessionId || crypto.randomUUID();
    if (!sessionId) setSessionId(activeSessionId);

    const response = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: activeSessionId, answers: nextAnswers, contact: nextContact, completed })
    }).catch(() => null);
    const data = response ? ((await response.json().catch(() => ({}))) as { sessionId?: string }) : {};
    return data.sessionId || activeSessionId;
  }

  async function startWizard() {
    const activeSessionId = await saveSession();
    await track("click", "hero", { cta: "Buktikan Sendiri dalam 5 Menit" }, activeSessionId);
    setStep("q1");
  }

  function selectChallenge(id: ChallengeId) {
    setAnswers((current) => ({
      ...current,
      mainChallenges: current.mainChallenges[0] === id ? [] : [id],
      detailChallenges: []
    }));
  }

  function selectDetail(id: DetailId) {
    setAnswers((current) => ({
      ...current,
      detailChallenges: current.detailChallenges[0] === id ? [] : [id]
    }));
  }

  function selectFrictionSource(id: FrictionSourceId) {
    setAnswers((current) => ({
      ...current,
      frictionSource: current.frictionSource === id ? "" : id
    }));
  }

  function advanceWithFact(currentStep: Step, nextStep: Step) {
    const isFirstTransition = currentStep === "q1";
    setTransitionFact({ text: isFirstTransition ? fact.first : fact.second, source: fact.source });
    setTimeout(() => {
      setTransitionFact(null);
      setStep(nextStep);
    }, 2400);
  }

  function handleDetailNoteChange(value: string) {
    const normalized = value.replace(/\r\n/g, "\n");
    const trimmed = trimToWordLimit(normalized, DETAIL_NOTE_WORD_LIMIT);
    setDetailNote(trimmed);
  }

  function handleDiscoveryContextChange(key: DiscoveryContextKey, value: string) {
    setDiscoveryContext((current) => ({ ...current, [key]: trimToWordLimit(value.replace(/\r\n/g, "\n"), DISCOVERY_SHORT_ANSWER_WORD_LIMIT) }));
  }

  async function generateResult() {
    setIsLoading(true);
    setResultError("");
    const nextAnswers = { ...answers, detailNote };
    try {
      const activeSessionId = await saveSession(nextAnswers, contact, true);
      const response = await fetch("/api/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: activeSessionId, answers: nextAnswers, contact })
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
      setStep("result");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Hasil belum bisa dibuat.";
      setResultError(`${message} Silakan coba lagi.`);
      void track("click", "loading", { error: "result_generation_failed", message });
    } finally {
      setIsLoading(false);
    }
  }

  async function saveResultDetailNote(note: string) {
    if (!result && !sessionId) return;
    await saveSession({ ...answers, detailNote: note }, contact, Boolean(result));
  }

  async function downloadPdf() {
    const node = document.getElementById("result-panel");
    if (!node) return;
    const canvas = await html2canvas(node, { backgroundColor: "#ffffff", scale: 2 });
    const image = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(image, "PNG", 0, 0, width, Math.min(height, pdf.internal.pageSize.getHeight()));
    pdf.save(`pesat-ai-result-${result?.sessionId || "session"}.pdf`);
  }

  async function copyResultLink(activeResult: GeneratedResult) {
    const shareUrl = `${window.location.origin}/result/${activeResult.sessionId}`;
    if (activeResult.persisted) {
      await navigator.clipboard.writeText(shareUrl);
      await track("click", "result", { cta: "Copy Link" }, activeResult.sessionId);
    }
  }

  async function submitDiscovery(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmitDiscovery) {
      setDiscoveryError("Mohon isi Nama Anda dan Nomor WhatsApp yang valid untuk melanjutkan.");
      return;
    }
    setIsLoading(true);
    setDiscoveryError("");
    setDiscoveryNotice("");
    const form = new FormData(event.currentTarget);
    const combinedMessage = buildDiscoveryContextMessage(detailNote, discoveryContext);
    const payload = {
      sessionId: result?.sessionId || sessionId,
      companyName: String(form.get("companyName") || contact.companyName || ""),
      name: String(form.get("name") || contact.name || ""),
      wa: String(form.get("wa") || contact.wa || ""),
      budgetContext: String(form.get("budgetContext") || ""),
      message: combinedMessage,
      summary: result?.headline
    };
    try {
      const response = await fetch("/api/discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await response.json().catch(() => ({}))) as { whatsappUrl?: string; error?: string; persisted?: boolean };
      if (!response.ok || !data.whatsappUrl) {
        throw new Error(data.error || "Discovery call belum bisa diproses.");
      }
      if (!data.persisted) {
        setDiscoveryNotice("Discovery request belum tersimpan ke DB karena Supabase belum tersambung. WhatsApp tetap dibuka.");
      }
      await track("click", "leadGate", { cta: "Submit Discovery Call", persisted: Boolean(data.persisted) }, result?.sessionId || sessionId);
      window.location.href = data.whatsappUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Discovery call belum bisa diproses.";
      setDiscoveryError(`${message} Periksa data dan coba lagi.`);
      void track("click", "leadGate", { error: "discovery_request_failed", message }, result?.sessionId || sessionId);
    } finally {
      setIsLoading(false);
    }
  }

  const scheduleDiscovery = () => {
    void track("click", "hero", { cta: "schedule_discovery" });
    void startWizard();
  };

  function goToReview() {
    setStep("review");
  }

  function startLoadingSequence() {
    setStep("loading");
  }

  const progress = STEP_PROGRESS[step];

  return (
    <main className="min-h-screen bg-surface text-foreground">
      {step === "hero" ? (
        <>
          <Header onStartWizard={startWizard} />
          <Hero onStartWizard={startWizard} onScheduleDiscovery={scheduleDiscovery} overrides={cfg.overrides} />
          {cfg.sections.fomo ? <Fomo onStartWizard={startWizard} /> : null}
          {cfg.sections.pillars ? <Pillars onStartWizard={startWizard} /> : null}
          {cfg.sections.howItWorks ? <HowItWorks onStartWizard={startWizard} /> : null}
          {cfg.sections.ctaLight ? <CtaBand variant="light" onStartWizard={startWizard} /> : null}
          {cfg.sections.whyPesat ? <WhyPesat /> : null}
          {cfg.sections.caseStudies ? <CaseStudies /> : null}
          {cfg.sections.testimonial ? <Testimonial /> : null}
          {cfg.sections.pricing ? <Pricing onStartWizard={startWizard} /> : null}
          {cfg.sections.ctaDark ? <CtaBand variant="dark" showSecondary onStartWizard={startWizard} onScheduleDiscovery={scheduleDiscovery} /> : null}
          <Footer onStartWizard={startWizard} />
        </>
      ) : (
        <section className="fixed inset-0 z-20 overflow-y-auto bg-surface">
          <div className={`mx-auto flex min-h-screen w-full flex-col px-5 py-5 sm:px-8 ${step === "result" ? "max-w-5xl" : "max-w-3xl"}`}>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => (step === "q1" ? setStep("hero") : setStep(previousStep(step)))}
                className="grid h-11 w-11 place-items-center rounded-full border border-neutral-200 text-neutral-900 transition hover:bg-neutral-50"
                aria-label="Kembali"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="text-sm font-semibold text-neutral-500">Pesat.AI Mini Session</div>
              <button onClick={() => setStep("hero")} className="grid h-11 w-11 place-items-center rounded-full border border-neutral-200 text-neutral-900 transition hover:bg-neutral-50" aria-label="Tutup">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full rounded-full bg-neutral-950 transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
            </div>

            {/* Transition Fact Overlay */}
            {transitionFact && (
              <div className="flex flex-1 flex-col items-center justify-center pb-8 text-center">
                <div className="mb-8 inline-flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-neutral-950 text-white">
                  <Sparkles className="h-8 w-8" />
                </div>
                <p className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Insight singkat</p>
                <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-normal text-neutral-950 sm:text-4xl">{transitionFact.text}</h2>
                <p className="mt-6 text-sm font-medium text-neutral-500">Sumber: {transitionFact.source}</p>
                <div className="mt-8 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-2 w-2 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>
            )}

            {!transitionFact && (
              <>
                {/* Q1: Main Challenge */}
                {step === "q1" && (
                  <QualityQuestionShell eyebrow={QUALITY_QUESTIONS[0].eyebrow} title={QUALITY_QUESTIONS[0].title} note={QUALITY_QUESTIONS[0].note}>
                    <div className="grid gap-3">
                      {QUALITY_QUESTIONS[0].options.map((option) => (
                        <QualityChoiceButton
                          key={option.id}
                          active={answers.mainChallenges[0] === option.id}
                          onClick={() => selectChallenge(option.id as ChallengeId)}
                          label={option.label}
                          note={option.note}
                          emoji={option.emoji}
                        />
                      ))}
                    </div>
                    <PrimaryAction disabled={!answers.mainChallenges[0]} onClick={() => advanceWithFact("q1", "q2")} label="Lanjut" />
                  </QualityQuestionShell>
                )}

                {/* Q2: Detail Challenge */}
                {step === "q2" && (
                  <QualityQuestionShell eyebrow={QUALITY_QUESTIONS[1].eyebrow} title={QUALITY_QUESTIONS[1].title} note={QUALITY_QUESTIONS[1].note}>
                    <div className="grid gap-3">
                      {QUALITY_QUESTIONS[1].options
                        .filter((option) => DETAIL_TO_CHALLENGE[option.id as DetailId] === answers.mainChallenges[0])
                        .map((option) => (
                          <QualityChoiceButton
                            key={option.id}
                            active={answers.detailChallenges[0] === option.id}
                            onClick={() => selectDetail(option.id as DetailId)}
                            label={option.label}
                            note={option.note}
                            emoji={option.emoji}
                          />
                        ))}
                    </div>
                    <PrimaryAction disabled={!answers.detailChallenges[0]} onClick={() => advanceWithFact("q2", "q3")} label="Lanjut" />
                  </QualityQuestionShell>
                )}

                {/* Q3: Impact Level */}
                {step === "q3" && (
                  <QualityQuestionShell eyebrow={QUALITY_QUESTIONS[2].eyebrow} title={QUALITY_QUESTIONS[2].title} note={QUALITY_QUESTIONS[2].note}>
                    <div className="grid gap-3">
                      {QUALITY_QUESTIONS[2].options.map((option) => (
                        <QualityChoiceButton
                          key={option.id}
                          active={answers.impactLevel === option.id}
                          onClick={() => setAnswers({ ...answers, impactLevel: option.id as ImpactId })}
                          label={option.label}
                          note={option.note}
                          emoji={option.emoji}
                        />
                      ))}
                    </div>
                    <PrimaryAction disabled={!answers.impactLevel} onClick={() => setStep("q4")} label="Lanjut" />
                  </QualityQuestionShell>
                )}

                {/* Q4: Friction Source */}
                {step === "q4" && (
                  <QualityQuestionShell eyebrow={QUALITY_QUESTIONS[3].eyebrow} title={QUALITY_QUESTIONS[3].title} note={QUALITY_QUESTIONS[3].note}>
                    <div className="grid gap-3">
                      {Object.entries(FRICTION_SOURCES).map(([id, source]) => (
                        <QualityChoiceButton
                          key={id}
                          active={answers.frictionSource === id}
                          onClick={() => selectFrictionSource(id as FrictionSourceId)}
                          label={source.label}
                          note={source.note}
                          emoji={frictionEmoji(id as FrictionSourceId)}
                        />
                      ))}
                    </div>
                    <PrimaryAction disabled={!answers.frictionSource} onClick={() => setStep("q5")} label="Lanjut" />
                  </QualityQuestionShell>
                )}

                {/* Q5: Adoption Style */}
                {step === "q5" && (
                  <QualityQuestionShell eyebrow={QUALITY_QUESTIONS[4].eyebrow} title={QUALITY_QUESTIONS[4].title} note={QUALITY_QUESTIONS[4].note}>
                    <div className="grid gap-3">
                      {QUALITY_QUESTIONS[4].options.map((option) => (
                        <QualityChoiceButton
                          key={option.id}
                          active={answers.adoptionStyle === option.id}
                          onClick={() => setAnswers({ ...answers, adoptionStyle: option.id as AdoptionId })}
                          label={option.label}
                          note={option.note}
                          emoji={option.emoji}
                        />
                      ))}
                    </div>
                    <PrimaryAction disabled={!answers.adoptionStyle} onClick={() => setStep("q6")} label="Lanjut" />
                  </QualityQuestionShell>
                )}

                {/* Q6: Optional Detail Note */}
                {step === "q6" && (
                  <QualityQuestionShell eyebrow={QUALITY_QUESTIONS[5].eyebrow} title={QUALITY_QUESTIONS[5].title} note={QUALITY_QUESTIONS[5].note}>
                    <label className="block">
                      <textarea
                        value={detailNote}
                        onChange={(event) => handleDetailNoteChange(event.target.value)}
                        rows={5}
                        className="w-full rounded-[1.35rem] border border-neutral-200 px-5 py-4 outline-none transition focus:border-neutral-900"
                        placeholder="Contoh: tim kami masih input data manual dari WhatsApp ke spreadsheet setiap hari, sales sering telat follow-up lead, dan laporan mingguan baru jadi hari Selasa padahal meeting direksi hari Senin pagi..."
                      />
                      <div className="mt-2 flex items-center justify-between gap-4 text-xs text-neutral-400">
                        <span>Semakin spesifik, semakin tajam diagnosis dan rekomendasi yang kami susun.</span>
                        <span>{detailNoteWordCount}/{DETAIL_NOTE_WORD_LIMIT} kata</span>
                      </div>
                    </label>
                    <PrimaryAction onClick={goToReview} label="Lanjut ke Review" />
                  </QualityQuestionShell>
                )}

                {/* Review */}
                {step === "review" && (
                  <QualityQuestionShell eyebrow="07 / Review" title="Cek sebentar. Apakah ini sudah pas?">
                    <ReviewRow label="Situasi terberat" value={CHALLENGE_LABELS[answers.mainChallenges[0] || "revenue"]} onEdit={() => setStep("q1")} />
                    <ReviewRow
                      label="Titik bocor terbesar"
                      value={QUALITY_QUESTIONS[1].options.find((o) => o.id === answers.detailChallenges[0])?.label || "-"}
                      onEdit={() => setStep("q2")}
                    />
                    <ReviewRow label="Intensitas masalah" value={QUALITY_QUESTIONS[2].options.find((o) => o.id === answers.impactLevel)?.label || "-"} onEdit={() => setStep("q3")} />
                    <ReviewRow label="Sumber gesekan terbesar" value={answers.frictionSource ? FRICTION_SOURCES[answers.frictionSource].label : "-"} onEdit={() => setStep("q4")} />
                    <ReviewRow label="Cara kerja sama" value={QUALITY_QUESTIONS[4].options.find((o) => o.id === answers.adoptionStyle)?.label || "-"} onEdit={() => setStep("q5")} />
                    <ReviewRow label="Konteks tambahan" value={detailNote ? `${detailNote.slice(0, 60)}${detailNote.length > 60 ? "..." : ""}` : "-"} onEdit={() => setStep("q6")} />
                    <PrimaryAction onClick={startLoadingSequence} label="Sudah Pas — Susun Diagnosis" />
                  </QualityQuestionShell>
                )}

                {/* Loading Sequence */}
                {step === "loading" && (
                  <>
                    <LoadingSequence onComplete={generateResult} />
                    {resultError ? (
                      <p className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-center text-sm font-semibold leading-6 text-red-700">
                        {resultError}
                      </p>
                    ) : null}
                  </>
                )}

                {/* Result */}
                {step === "result" && result && (
                  <div className="pb-10">
                    <ResultPanel
                      result={result}
                      detailNote={detailNote}
                      detailNoteWordCount={detailNoteWordCount}
                      discoveryContext={discoveryContext}
                      setDetailNote={setDetailNote}
                      onDiscoveryContextChange={handleDiscoveryContextChange}
                      onDetailNoteBlur={saveResultDetailNote}
                      onShare={() => copyResultLink(result)}
                      onPdf={async () => {
                        await track("click", "result", { cta: "Export PDF" }, result.sessionId);
                        await downloadPdf();
                      }}
                      onDiscovery={async () => {
                        await saveResultDetailNote(detailNote);
                        void track("click", "result", { cta: "Discovery Call" }, result.sessionId);
                        setStep("leadGate");
                      }}
                    />
                  </div>
                )}

                {/* Lead Gate */}
                {step === "leadGate" && result && (
                  <QualityQuestionShell eyebrow="11 / Simpan Laporan Lengkap" title="Dapatkan PDF + roadmap + strategy call 30 menit">
                    <div className="mb-6 rounded-[1.35rem] border border-neutral-200 bg-neutral-50 p-5">
                      <p className="text-sm font-semibold text-neutral-500">Nilai yang Anda dapatkan:</p>
                      <ul className="mt-3 space-y-2 text-sm font-medium text-neutral-700">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-600" /> PDF laporan lengkap (10-12 halaman)
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-600" /> Implementation roadmap 90 hari
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-600" /> 30 menit strategy call dengan tim operasional Pesat.AI
                        </li>
                      </ul>
                    </div>
                    <form onSubmit={submitDiscovery} className="grid gap-4">
                      <ContactFields contact={contact} setContact={setContact} />
                      <input
                        name="budgetContext"
                        className="rounded-3xl border border-neutral-200 px-5 py-4 outline-none transition focus:border-neutral-900"
                        placeholder="Konteks budget atau target bisnis"
                      />
                      <PrimaryAction type="submit" label={isLoading ? "Menyimpan..." : "Kirim Laporan & Jadwalkan Strategy Call"} loading={isLoading} disabled={isLoading} />
                      {!canSubmitDiscovery ? <p className="text-xs text-neutral-400">Isi Nama Anda dan Nomor WhatsApp yang valid untuk melanjutkan.</p> : null}
                      {discoveryError ? <p className="text-sm font-semibold leading-6 text-red-700">{discoveryError}</p> : null}
                      {discoveryNotice ? <p className="text-sm font-semibold text-amber-700">{discoveryNotice}</p> : null}
                    </form>
                  </QualityQuestionShell>
                )}
              </>
            )}
          </div>
        </section>
      )}
    </main>
  );
}

function LoadingSequence({ onComplete }: { onComplete: () => void }) {
  // Deterministic first-four selection keeps the component pure and avoids impure Math.random during render.
  const insights = useMemo(() => LOADING_INSIGHTS.slice(0, 4), []);
  const { activeInsight, isVisible } = useLoadingSequence(insights, onComplete);

  if (!activeInsight) return null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center pb-8 text-center">
      <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full border-2 border-neutral-200">
        <div className="h-16 w-16 animate-spin rounded-full border-2 border-neutral-950 border-t-transparent" />
      </div>

      <p className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Analisis konsultan sedang berjalan</p>

      <div className="min-h-[180px] max-w-2xl transition-opacity duration-500" style={{ opacity: isVisible ? 1 : 0 }}>
        <h2 className="text-3xl font-semibold leading-tight tracking-normal text-neutral-950 sm:text-4xl">{activeInsight.text}</h2>
        <p className="mt-6 text-sm font-medium text-neutral-500">Sumber: {activeInsight.source}</p>
      </div>

      <div className="mt-10 flex gap-2">
        {insights.map((_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === insights.indexOf(activeInsight) ? "w-8 bg-neutral-950" : "w-2 bg-neutral-300"}`} />
        ))}
      </div>
    </div>
  );
}

function frictionEmoji(id: FrictionSourceId): string {
  const map: Record<FrictionSourceId, string> = {
    duplicate_data: "🔄",
    manual_reports: "📑",
    delayed_response: "⏳",
    human_error: "⚠️",
    approval_bottleneck: "🚧",
    knowledge_silo: "🧠"
  };
  return map[id];
}

function countWords(value: string): number {
  const words = value.trim().match(/\S+/g);
  return words ? words.length : 0;
}

function trimToWordLimit(value: string, maxWords: number): string {
  const normalized = value.replace(/\r\n/g, "\n");
  const matches = normalized.match(/\S+/g);
  if (!matches || matches.length <= maxWords) return normalized;

  let wordCount = 0;
  let lastAllowedIndex = 0;
  const matcher = /\S+/g;
  let match: RegExpExecArray | null;

  while ((match = matcher.exec(normalized)) !== null) {
    wordCount += 1;
    if (wordCount > maxWords) break;
    lastAllowedIndex = match.index + match[0].length;
  }

  return normalized.slice(0, lastAllowedIndex).trimEnd();
}

function buildDiscoveryContextMessage(detailNote: string, discoveryContext: DiscoveryContextAnswers): string {
  const blocks = [
    detailNote.trim() ? `1. Tantangan detail\n${detailNote.trim()}` : "",
    discoveryContext.priorityFocus.trim() ? `2. Prioritas yang ingin dibenahi lebih dulu\n${discoveryContext.priorityFocus.trim()}` : "",
    discoveryContext.discoveryGoal.trim() ? `3. Yang ingin dipahami atau diputuskan saat discovery call\n${discoveryContext.discoveryGoal.trim()}` : ""
  ].filter(Boolean);

  return blocks.join("\n\n");
}

function previousStep(current: Step): Step {
  const idx = STEP_ORDER.indexOf(current);
  return STEP_ORDER[Math.max(0, idx - 1)];
}

function QualityQuestionShell({ eyebrow, title, note, children }: { eyebrow: string; title: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col justify-center pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">{eyebrow}</p>
      <h2 className="mb-4 text-3xl font-semibold leading-tight tracking-normal text-neutral-950 sm:text-5xl">{title}</h2>
      {note ? <p className="mb-8 text-base font-medium leading-7 text-neutral-500">{note}</p> : <div className="mb-6" />}
      {children}
    </div>
  );
}

function QualityChoiceButton({ active, onClick, label, note, emoji }: { active: boolean; onClick: () => void; label: string; note?: string; emoji?: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex min-h-16 items-center gap-4 rounded-[1.35rem] border px-5 py-4 text-left transition-all duration-200 ${
        active
          ? "border-neutral-950 bg-neutral-950 text-white shadow-lg shadow-neutral-900/10"
          : "border-neutral-200 bg-white text-neutral-950 hover:border-neutral-400 hover:shadow-md"
      }`}
    >
      {emoji ? <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-xl">{emoji}</span> : null}
      <span className="flex-1">
        <span className="block text-base font-semibold">{label}</span>
        {note ? <span className={`mt-1 block text-sm ${active ? "text-neutral-300" : "text-neutral-500"}`}>{note}</span> : null}
      </span>
      {active ? <Check className="h-5 w-5 shrink-0" /> : <span className="h-5 w-5 shrink-0 rounded-full border border-neutral-300" />}
    </button>
  );
}

function PrimaryAction({ label, onClick, disabled, loading, type = "button" }: { label: string; onClick?: () => void; disabled?: boolean; loading?: boolean; type?: "button" | "submit" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="mt-8 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 text-base font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-neutral-300"
    >
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
      {label}
      {!loading ? <ArrowRight className="h-5 w-5" /> : null}
    </button>
  );
}

function ReviewRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="mb-3 flex items-center justify-between rounded-[1.35rem] border border-neutral-200 px-5 py-4 transition hover:border-neutral-300">
      <div>
        <p className="text-sm font-semibold text-neutral-500">{label}</p>
        <p className="mt-1 text-base font-semibold text-neutral-950">{value}</p>
      </div>
      <button onClick={onEdit} className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold transition hover:bg-neutral-50">
        Ubah
      </button>
    </div>
  );
}

function ContactFields({ contact, setContact, optional = false }: { contact: ContactData; setContact: (contact: ContactData) => void; optional?: boolean }) {
  return (
    <div className="grid gap-3">
      <input
        name="companyName"
        value={contact.companyName || ""}
        onChange={(event) => setContact({ ...contact, companyName: event.target.value })}
        className="rounded-3xl border border-neutral-200 px-5 py-4 outline-none transition focus:border-neutral-900"
        placeholder="Nama perusahaan (opsional)"
      />
      <input
        name="name"
        value={contact.name || ""}
        required={!optional}
        onChange={(event) => setContact({ ...contact, name: event.target.value })}
        className="rounded-3xl border border-neutral-200 px-5 py-4 outline-none transition focus:border-neutral-900"
        placeholder={`Nama Anda${optional ? " (opsional)" : ""}`}
      />
      <input
        name="wa"
        value={contact.wa || ""}
        required={!optional}
        onChange={(event) => setContact({ ...contact, wa: event.target.value })}
        className="rounded-3xl border border-neutral-200 px-5 py-4 outline-none transition focus:border-neutral-900"
        placeholder={`Nomor WhatsApp${optional ? " (opsional)" : ""}`}
      />
      {optional ? (
        <label className="flex items-center gap-3 rounded-3xl border border-neutral-200 px-5 py-4 text-sm font-semibold text-neutral-700">
          <input type="checkbox" checked={Boolean(contact.followUpAllowed)} onChange={(event) => setContact({ ...contact, followUpAllowed: event.target.checked })} />
          boleh follow up
        </label>
      ) : null}
    </div>
  );
}

/* ─── Result Panel (redesigned report) ─── */

function ResultPanel({
  result,
  detailNote,
  detailNoteWordCount,
  discoveryContext,
  setDetailNote,
  onDiscoveryContextChange,
  onDetailNoteBlur,
  onShare,
  onPdf,
  onDiscovery
}: {
  result: GeneratedResult;
  detailNote: string;
  detailNoteWordCount: number;
  discoveryContext: DiscoveryContextAnswers;
  setDetailNote: (value: string) => void;
  onDiscoveryContextChange: (key: DiscoveryContextKey, value: string) => void;
  onDetailNoteBlur: (value: string) => void | Promise<void>;
  onShare: () => void | Promise<void>;
  onPdf: () => void | Promise<void>;
  onDiscovery: () => void | Promise<void>;
}) {
  const [monthlyRevenue, setMonthlyRevenue] = useState(500000000); // default 500jt
  const [monthlyCost, setMonthlyCost] = useState(80_000_000); // default 80jt
  const impactPercent = parseImpactPercent(result.impactCards);
  const isRevenueCluster = result.efficiencyMetrics.some((m) => m.label.toLowerCase().includes("lead") || m.label.toLowerCase().includes("revenue"));

  const projectedGain = Math.round(monthlyRevenue * (impactPercent / 100));
  const annualGain = projectedGain * 12;
  const projectedCostSaving = Math.round(monthlyCost * (impactPercent / 100));
  const annualCostSaving = projectedCostSaving * 12;

  const hiddenCostTotal = result.hiddenCosts.reduce((sum, cost) => sum + cost.monthlyEstimate, 0);

  return (
    <div>
      <div id="result-panel" className="rounded-[1.75rem] border border-neutral-200 bg-white p-5 shadow-soft sm:p-8">
        {/* Executive Summary Hero */}
        <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-neutral-500">
          <BarChart3 className="h-4 w-4" />
          Diagnosis Operasional Bisnis Anda
        </div>

        <h2 className="text-4xl font-semibold leading-tight tracking-normal text-neutral-950 sm:text-5xl">{result.headline}</h2>
        <p className="mt-5 text-lg leading-8 text-neutral-600">{result.subheadline}</p>

        {/* Before → After → Savings/Lift Cards */}
        {isRevenueCluster ? (
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <BeforeAfterCard label="Before" value={`Rp ${formatRupiah(monthlyRevenue)}`} icon={<Clock className="h-5 w-5" />} tone="muted" />
            <BeforeAfterCard label="After AI" value={`Rp ${formatRupiah(monthlyRevenue + projectedGain)}`} icon={<TrendingUp className="h-5 w-5" />} tone="highlight" />
            <BeforeAfterCard label="Potensi Pertumbuhan" value={`+${impactPercent}%`} icon={<Zap className="h-5 w-5" />} tone="accent" />
          </div>
        ) : (
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <BeforeAfterCard label="Biaya Sekarang" value={`Rp ${formatRupiah(monthlyCost)}`} icon={<Clock className="h-5 w-5" />} tone="muted" />
            <BeforeAfterCard label="Biaya Setelah AI" value={`Rp ${formatRupiah(monthlyCost - projectedCostSaving)}`} icon={<TrendingDown className="h-5 w-5" />} tone="highlight" />
            <BeforeAfterCard label="Potensi Penghematan" value={`Rp ${formatRupiah(projectedCostSaving)}/bulan`} icon={<Zap className="h-5 w-5" />} tone="accent" />
          </div>
        )}

        {/* Efficiency Metrics */}
        {result.efficiencyMetrics.length ? (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold">Efisiensi yang bisa diukur</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-500">Perbandingan Before vs After AI untuk metrik kunci bisnis Anda.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {result.efficiencyMetrics.map((metric) => (
                <div key={metric.label} className="rounded-[1.35rem] border border-neutral-200 p-5">
                  <p className="text-sm font-semibold text-neutral-500">{metric.label}</p>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-neutral-400">Before</p>
                      <p className="text-lg font-semibold text-neutral-950">{metric.before}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-neutral-300" />
                    <div className="text-right">
                      <p className="text-xs text-neutral-400">After AI</p>
                      <p className="text-lg font-semibold text-emerald-600">{metric.after}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-emerald-700">{metric.impact}</p>
                  <p className="mt-1 text-xs leading-5 text-neutral-500">{metric.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Diagnosis */}
        {result.diagnosis ? (
          <div className="mt-8 rounded-[1.35rem] border border-neutral-200 bg-neutral-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Diagnosa</p>
            <p className="mt-3 text-lg font-medium leading-8 text-neutral-900">{result.diagnosis}</p>
            {result.rootCause?.text ? (
              <div className="mt-4 border-l-2 border-neutral-900 pl-4">
                <p className="text-base leading-7 text-neutral-700">{result.rootCause.text}</p>
                <p className="mt-2 text-xs font-semibold text-neutral-400">Sumber: {result.rootCause.source}</p>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Hidden Cost Radar */}
        {result.hiddenCosts.length ? (
          <div className="mt-8 rounded-[1.35rem] border border-neutral-200 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Biaya Tersembunyi yang Sering Diabaikan</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {result.hiddenCosts.map((cost) => (
                <div key={cost.id} className="rounded-[1.25rem] bg-neutral-50 p-5">
                  <p className="text-base font-semibold text-neutral-950">{cost.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-neutral-950">Rp {formatRupiah(cost.monthlyEstimate)}/bulan</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-500">{cost.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-[1.25rem] bg-neutral-950 p-5 text-white">
              <p className="text-sm text-neutral-400">Total biaya tersembunyi yang teridentifikasi</p>
              <p className="mt-1 text-3xl font-semibold">Rp {formatRupiah(hiddenCostTotal)}/bulan</p>
            </div>
          </div>
        ) : null}

        {/* Before vs After Visual */}
        {result.beforeAfterMetrics.length ? (
          <div className="mt-8 rounded-[1.35rem] border border-neutral-200 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Before vs After</p>
            <div className="mt-5 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.beforeAfterMetrics} layout="vertical" margin={{ left: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="label" type="category" width={120} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="beforeValue" name="Before" fill="#d4d4d4" radius={[0, 8, 8, 0]} />
                  <Bar dataKey="afterValue" name="After AI" fill="#111111" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : null}

        {/* User Signals */}
        {result.userSignals?.length ? (
          <div className="mt-8 rounded-[1.35rem] border border-neutral-200 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Sinyal dari bisnis Anda</p>
            <p className="mt-2 text-sm leading-6 text-neutral-500">Angka yang Anda sebutkan, kami jadikan dasar agar analisis lebih konkret.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.userSignals.map((signal) => (
                <span key={signal} className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-800">
                  {signal}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {/* Finding Cards */}
        {result.findings.length ? (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold">Temuan Konsultan</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-500">Insight spesifik berbasis jawaban Anda.</p>
            <div className="mt-4 grid gap-4">
              {result.findings.map((finding, index) => (
                <div key={finding.title} className="rounded-[1.35rem] border border-neutral-200 p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-white text-lg font-bold">{index + 1}</div>
                    <h4 className="text-lg font-semibold text-neutral-950">{finding.title}</h4>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FindingBlock icon={<Search className="h-4 w-4" />} title="Temuan" text={finding.finding} />
                    <FindingBlock icon={<AlertTriangle className="h-4 w-4" />} title="Dampak" text={finding.impact} />
                    <FindingBlock icon={<TrendingDown className="h-4 w-4" />} title="Risiko" text={finding.risk} />
                    <FindingBlock icon={<Brain className="h-4 w-4" />} title="Solusi Terukur" text={finding.solution} />
                  </div>
                  <div className="mt-4 rounded-[1rem] bg-emerald-50 p-4">
                    <p className="text-sm font-semibold text-emerald-800">📈 Potensi Hasil</p>
                    <p className="mt-1 text-sm leading-6 text-emerald-700">{finding.potential}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Impact Cards */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {result.impactCards.map((card) => (
            <div key={card.title} className="rounded-[1.35rem] border border-neutral-200 p-5">
              <p className="text-sm font-semibold text-neutral-500">{card.title}</p>
              <p className="mt-2 text-3xl font-semibold text-neutral-950">{card.value}</p>
              <p className="mt-3 text-sm leading-6 text-neutral-500">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Legacy Bar Chart */}
        <div className="mt-8 h-64 rounded-[1.35rem] border border-neutral-200 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result.chart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="before" fill="#d4d4d4" radius={[8, 8, 0, 0]} />
              <Bar dataKey="after" fill="#111111" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Before / After Text */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {result.beforeAfterText.map((text, index) => (
            <div key={text} className="rounded-[1.35rem] bg-neutral-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">{index === 0 ? "Before" : "After"}</p>
              <p className="mt-3 text-base font-medium leading-7 text-neutral-800">{text}</p>
            </div>
          ))}
        </div>

        {/* ROI Calculator */}
        <div className="mt-8 rounded-[1.35rem] border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Kalkulator ROI</p>
          <p className="mt-2 text-sm leading-6 text-neutral-500">Geser untuk melihat potensi impact di bisnis Anda.</p>
          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-neutral-700">
              {isRevenueCluster ? "Omzet bulanan (Rp)" : "Biaya operasional manual/bulan (Rp)"}
            </label>
            <input
              type="range"
              min="10000000"
              max="5000000000"
              step="50000000"
              value={isRevenueCluster ? monthlyRevenue : monthlyCost}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (isRevenueCluster) setMonthlyRevenue(value);
                else setMonthlyCost(value);
              }}
              className="w-full accent-neutral-950"
            />
            <div className="mt-2 flex justify-between text-sm font-semibold text-neutral-600">
              <span>Rp 10jt</span>
              <span className="text-lg text-neutral-950">Rp {formatRupiah(isRevenueCluster ? monthlyRevenue : monthlyCost)}</span>
              <span>Rp 5M</span>
            </div>
          </div>
          <div className="mt-5 rounded-[1.35rem] bg-neutral-950 p-5 text-white">
            <p className="text-sm text-neutral-400">{isRevenueCluster ? "Potensi tambahan per tahun" : "Potensi penghematan per tahun"}</p>
            <p className="mt-1 text-3xl font-semibold">Rp {formatRupiah(isRevenueCluster ? annualGain : annualCostSaving)}</p>
            <p className="mt-2 text-xs text-neutral-500">Estimasi berbasis benchmark industri. Angka final setelah discovery.</p>
          </div>
        </div>

        {/* Solusi Terukur (formerly Janji Terukur) */}
        {result.promise?.statement ? (
          <div className="mt-8 rounded-[1.35rem] bg-neutral-950 p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Solusi Terukur</p>
            <p className="mt-3 text-xl font-semibold leading-8">{result.promise.statement}</p>
            {result.promise.measuredBy?.length ? (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Diukur lewat</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.promise.measuredBy.map((metric) => (
                    <span key={metric} className="rounded-full border border-neutral-700 px-3 py-1 text-sm text-neutral-200">
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {result.promise.disclaimer ? <p className="mt-5 text-xs leading-6 text-neutral-400">{result.promise.disclaimer}</p> : null}
          </div>
        ) : null}

        {/* First Step */}
        {result.firstStep ? (
          <div className="mt-8 rounded-[1.35rem] border border-neutral-200 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Langkah pertama</p>
            <p className="mt-3 text-lg font-medium leading-8 text-neutral-900">{result.firstStep}</p>
          </div>
        ) : null}

        {/* Cost of Inaction */}
        {result.costOfInaction ? (
          <div className="mt-8 rounded-[1.35rem] border border-neutral-200 border-l-4 border-l-neutral-900 bg-neutral-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Jika dibiarkan</p>
            <p className="mt-3 text-base font-medium leading-7 text-neutral-800">{result.costOfInaction}</p>
          </div>
        ) : null}

        {/* Unique Mechanism */}
        <div className="mt-8 rounded-[1.35rem] bg-neutral-950 p-6 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Unique mechanism</p>
          <p className="mt-3 text-xl font-semibold leading-8">{result.uniqueMechanism}</p>
        </div>

        {/* Solution Cards with Proof Trail */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold">Solusi yang paling relevan</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-500">Diurutkan berdasarkan match dengan profil bisnis Anda.</p>
          <div className="mt-4 grid gap-3">
            {result.solutionCards?.map((card, index) => (
              <div
                key={card.name}
                className="group relative overflow-hidden rounded-[1.35rem] border border-neutral-200 bg-white p-5 transition-all duration-300 hover:border-neutral-300 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-lg font-bold text-white">{index + 1}</div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-lg font-semibold text-neutral-950">{card.name}</h4>
                      <ImpactBadge badge={card.impactBadge} />
                      <ConfidenceBadge score={card.confidenceScore} />
                    </div>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">{card.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-neutral-500">
                      <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1">
                        <Clock className="h-3 w-3" />
                        Setup: {card.setupTime}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                        <Shield className="h-3 w-3" />
                        {card.proofBasis}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )) ??
              result.solutionsText.map((solution) => (
                <div key={solution} className="rounded-[1.35rem] border border-neutral-200 p-5 text-base leading-7 text-neutral-700">
                  {solution}
                </div>
              ))}
          </div>
        </div>

        {/* Action Plan */}
        {result.plan?.length ? (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold">Rencana aksi</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-500">Tiga fase agar perbaikan terjadi bertahap dan terukur, bukan sekaligus.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {result.plan.map((phase) => (
                <div key={phase.title} className="flex flex-col rounded-[1.35rem] border border-neutral-200 p-5">
                  <p className="text-base font-semibold text-neutral-950">{phase.title}</p>
                  <span className="mt-2 inline-flex w-fit rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">{phase.timeframe}</span>
                  <p className="mt-3 text-sm leading-6 text-neutral-700">{phase.focus}</p>
                  {phase.solutions.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {phase.solutions.map((name) => (
                        <span key={name} className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600">
                          {name}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <p className="mt-3 text-sm font-medium leading-6 text-neutral-900">Hasil: {phase.outcome}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Phone Mockup */}
        <div className="mt-8 overflow-hidden rounded-[1.35rem] border border-neutral-200 bg-gradient-to-br from-white to-neutral-100 p-6">
          <div className="mx-auto max-w-sm rounded-[1.6rem] border border-neutral-300 bg-white p-4 shadow-soft">
            <div className="mb-4 h-2 w-20 rounded-full bg-neutral-200" />
            <div className="space-y-3">
              <div className="h-20 rounded-2xl bg-neutral-950" />
              <div className="h-4 w-4/5 rounded-full bg-neutral-200" />
              <div className="h-4 w-3/5 rounded-full bg-neutral-200" />
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="h-16 rounded-2xl bg-neutral-100" />
                <div className="h-16 rounded-2xl bg-neutral-100" />
                <div className="h-16 rounded-2xl bg-neutral-100" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-6 rounded-[1.35rem] border border-neutral-200 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Opsional sebelum discovery call</p>
            <h3 className="mt-1 text-2xl font-semibold leading-tight text-neutral-950">Bantu kami memahami konteks Anda lewat 3 pertanyaan singkat</h3>
          </div>
          <span className="inline-flex w-fit rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-500">Semua jawaban bersifat opsional</span>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-500">
          Jawaban di bawah ini akan ikut dikirim saat Anda lanjut ke discovery call, supaya tim Pesat.AI masuk dengan konteks yang lebih jelas dan tidak mengulang pertanyaan dasar.
        </p>

        <div className="mt-5 grid gap-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-neutral-700">1. Ceritakan tantangan Anda lebih detail</span>
            <textarea
              value={detailNote}
              onChange={(event) => setDetailNote(event.target.value)}
              onBlur={(event) => void onDetailNoteBlur(event.target.value)}
              rows={5}
              className="w-full rounded-[1.35rem] border border-neutral-200 px-5 py-4 outline-none transition focus:border-neutral-900"
              placeholder="Contoh: proses sales kami banyak lewat WhatsApp, tapi follow-up sering hilang dan pelanggan lama jarang beli lagi..."
            />
            <div className="mt-2 flex items-center justify-between gap-4 text-xs text-neutral-400">
              <span>Anda bisa cerita bebas soal proses, volume, bottleneck, atau kebiasaan operasional yang sekarang paling terasa.</span>
              <span>{detailNoteWordCount}/{DETAIL_NOTE_WORD_LIMIT} kata</span>
            </div>
          </label>

          {OPTIONAL_DISCOVERY_QUESTIONS.map((question) => (
            <label key={question.id} className="block">
              <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <span className="text-sm font-semibold text-neutral-700">{question.label}</span>
                <span className="text-xs text-neutral-400">{question.helper}</span>
              </div>
              <textarea
                value={discoveryContext[question.id]}
                onChange={(event) => onDiscoveryContextChange(question.id, event.target.value)}
                rows={question.rows}
                className="w-full rounded-[1.35rem] border border-neutral-200 px-5 py-4 outline-none transition focus:border-neutral-900"
                placeholder={question.placeholder}
              />
            </label>
          ))}
        </div>
      </section>

      {/* Actions */}
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <button
          onClick={() => void onShare()}
          disabled={!result.persisted}
          className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-neutral-200 px-5 text-sm font-semibold transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:border-neutral-100 disabled:text-neutral-300"
        >
          <ExternalLink className="h-4 w-4" />
          {result.persisted ? "Copy Link" : "Link aktif setelah DB tersambung"}
        </button>
        <button
          onClick={() => void onPdf()}
          className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-neutral-200 px-5 text-sm font-semibold transition hover:bg-neutral-50"
        >
          <Download className="h-4 w-4" />
          Export PDF
        </button>
        <button onClick={onDiscovery} className="min-h-12 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-black">
          Simpan Laporan & Jadwalkan Strategy Call
        </button>
      </div>
      {!result.persisted ? <p className="mt-3 text-xs text-neutral-400">Share link membutuhkan Supabase agar hasil bisa dibuka ulang.</p> : null}
      {result.llmFallback ? <p className="mt-3 text-xs text-neutral-400">Mode fallback aktif karena OpenAI belum tersedia atau gagal merespons.</p> : null}
    </div>
  );
}

function FindingBlock({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-[1rem] bg-neutral-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-700">
        {icon}
        {title}
      </div>
      <p className="text-sm leading-6 text-neutral-600">{text}</p>
    </div>
  );
}

/* ─── Helper Components ─── */

function BeforeAfterCard({ label, value, icon, tone }: { label: string; value: string; icon: React.ReactNode; tone: "muted" | "highlight" | "accent" }) {
  const toneStyles = {
    muted: "bg-neutral-100 text-neutral-600",
    highlight: "bg-neutral-950 text-white",
    accent: "bg-emerald-600 text-white"
  };
  return (
    <div className={`rounded-[1.35rem] p-5 ${toneStyles[tone]}`}>
      <div className="flex items-center gap-2 text-sm font-semibold opacity-70">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function ImpactBadge({ badge }: { badge: string }) {
  const styles: Record<string, string> = {
    "quick-win": "bg-amber-50 text-amber-700 border-amber-200",
    "high-impact": "bg-emerald-50 text-emerald-700 border-emerald-200",
    strategic: "bg-blue-50 text-blue-700 border-blue-200"
  };
  const labels: Record<string, string> = {
    "quick-win": "⚡ Quick Win",
    "high-impact": "🎯 High Impact",
    strategic: "🧭 Strategic"
  };
  return <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[badge] || styles["high-impact"]}`}>{labels[badge] || badge}</span>;
}

function ConfidenceBadge({ score }: { score: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-600">
      <Sparkles className="h-3 w-3" />
      {score}% match
    </span>
  );
}

/* ─── Utilities ─── */

function formatRupiah(value: number): string {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}M`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(0)}jt`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}rb`;
  return value.toString();
}

function parseImpactPercent(cards: Array<{ title: string; value: string }>): number {
  let maxPercent = 20;
  for (const card of cards) {
    const match = card.value.match(/(\d+)-?(\d+)?%?/);
    if (match) {
      const val = parseInt(match[2] || match[1], 10);
      if (val > maxPercent) maxPercent = val;
    }
  }
  return maxPercent;
}
