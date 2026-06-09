"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BarChart3, Check, Download, ExternalLink, Loader2, X } from "lucide-react";
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
import { CHALLENGE_LABELS, TRANSITION_FACTS } from "@/lib/solutions";
import { hasUsableWhatsAppNumber } from "@/lib/validation";
import { DEFAULT_LANDING_CONFIG, type LandingConfig } from "@/lib/landing";
import type { AdoptionId, ChallengeId, ContactData, DetailId, GeneratedResult, ImpactId, WizardAnswers } from "@/lib/types";

const detailOptions: Record<ChallengeId, Array<{ id: DetailId; label: string }>> = {
  revenue: [
    { id: "follow_up", label: "Follow-up lead lambat" },
    { id: "repeat_order", label: "Repeat order belum rapi" },
    { id: "pricing", label: "Harga sulit dioptimalkan" },
    { id: "lead_quality", label: "Lead banyak tapi kualitas campur" }
  ],
  cost: [
    { id: "admin_cost", label: "Admin terlalu banyak manual" },
    { id: "manual_docs", label: "Dokumen perlu input ulang" },
    { id: "invoice_ap", label: "Invoice/AP makan waktu" },
    { id: "process_waste", label: "Bottleneck proses tidak terlihat" }
  ],
  fraud: [
    { id: "transaction_anomaly", label: "Transaksi aneh terlambat terlihat" },
    { id: "data_leak", label: "Akses/data sulit diawasi" },
    { id: "approval_gap", label: "Approval rawan dilewati" }
  ],
  cash_stock: [
    { id: "cashflow_blind", label: "Cashflow sulit diprediksi" },
    { id: "stockout", label: "Stok habis mendadak" },
    { id: "overstock", label: "Modal tertahan di stok" }
  ],
  reporting: [
    { id: "slow_reports", label: "Laporan telat selesai" },
    { id: "no_bi", label: "Belum ada BI dashboard" },
    { id: "manual_meetings", label: "Meeting banyak tanpa action jelas" }
  ],
  brand_trust: [
    { id: "google_visibility", label: "Sulit unggul di Google" },
    { id: "ai_search", label: "Belum siap muncul di AI search" },
    { id: "review_sentiment", label: "Review dan sentimen tidak terbaca" }
  ]
};

const impactOptions: Array<{ id: ImpactId; label: string; note: string }> = [
  { id: "revenue", label: "Revenue", note: "Naikkan omzet atau repeat order" },
  { id: "hours", label: "Waktu", note: "Hemat jam kerja tim" },
  { id: "risk", label: "Risiko", note: "Kurangi fraud dan blind spot" },
  { id: "cash", label: "Kas/Stok", note: "Prediksi lebih cepat" },
  { id: "trust", label: "Trust", note: "Lebih dipercaya di Google dan AI" }
];

const adoptionOptions: Array<{ id: AdoptionId; label: string; note: string }> = [
  { id: "dfy", label: "DFY", note: "Pesat.AI yang setup dan jalankan" },
  { id: "diy", label: "DIY", note: "Tim internal butuh blueprint" },
  { id: "hybrid", label: "Kombinasi", note: "Pesat.AI bantu setup, tim ikut jalan" },
  { id: "starting", label: "Baru mulai AI", note: "Butuh use case pertama yang jelas" }
];

const initialAnswers: WizardAnswers = {
  mainChallenges: [],
  detailChallenges: [],
  impactLevel: "",
  adoptionStyle: ""
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

const DISCOVERY_PREP_BY_CHALLENGE: Record<ChallengeId, { title: string; items: string[] }> = {
  revenue: {
    title: "Data yang sebaiknya Anda siapkan",
    items: [
      "Jumlah lead atau chat masuk per hari/minggu, terutama dari WhatsApp dan channel utama Anda.",
      "Catatan follow-up: berapa yang cepat ditangani, berapa yang sering telat atau hilang.",
      "Data repeat order, closing rate, atau produk yang paling sering ditanyakan pelanggan."
    ]
  },
  cost: {
    title: "Data yang sebaiknya Anda siapkan",
    items: [
      "Daftar pekerjaan manual yang paling sering berulang dan memakan waktu tim.",
      "Contoh dokumen, invoice, atau proses admin yang paling sering diinput ulang.",
      "Estimasi jam kerja, error, atau bottleneck yang paling sering membuat biaya membengkak."
    ]
  },
  fraud: {
    title: "Data yang sebaiknya Anda siapkan",
    items: [
      "Contoh transaksi atau aktivitas yang pernah terasa janggal, meski belum terbukti fraud.",
      "Alur approval, akses user, atau titik proses yang paling rawan lolos tanpa kontrol.",
      "Riwayat insiden, komplain, atau kerugian yang pernah muncul karena blind spot pengawasan."
    ]
  },
  cash_stock: {
    title: "Data yang sebaiknya Anda siapkan",
    items: [
      "Data stok masuk-keluar dan produk yang paling sering stockout atau overstock.",
      "Catatan penjualan harian/mingguan dan pola permintaan yang terasa naik-turun.",
      "Arus kas masuk-keluar, piutang, serta momen ketika kas sering terasa ketat."
    ]
  },
  reporting: {
    title: "Data yang sebaiknya Anda siapkan",
    items: [
      "Laporan apa saja yang rutin dibuat dan bagian mana yang paling lama disusun.",
      "Sumber data utama yang dipakai tim, termasuk file, spreadsheet, atau sistem yang terpisah.",
      "Keputusan apa yang sering tertunda karena data belum siap atau belum rapi."
    ]
  },
  brand_trust: {
    title: "Data yang sebaiknya Anda siapkan",
    items: [
      "Keyword, layanan, atau brand term yang paling penting untuk ditemukan calon pelanggan.",
      "Review pelanggan, testimoni, dan pertanyaan yang paling sering muncul tentang bisnis Anda.",
      "Profil bisnis, listing, atau kanal digital yang saat ini paling memengaruhi trust calon pembeli."
    ]
  }
};

const ADOPTION_MODE_SUMMARY: Record<AdoptionId, { label: string; note: string }> = {
  dfy: {
    label: "Mode DFY",
    note: "Fokuskan discovery call pada data, target, dan prioritas bisnis. Tim Pesat.AI yang akan menyiapkan implementasi awalnya."
  },
  diy: {
    label: "Mode DIY",
    note: "Selain data bisnis, siapkan juga siapa dari tim internal yang akan jadi PIC agar blueprint dan eksekusinya langsung nyambung."
  },
  hybrid: {
    label: "Mode Hybrid",
    note: "Yang paling berguna adalah kombinasi data operasional dan kesiapan tim, karena setup awal dibantu tetapi transisi tetap perlu rapi."
  },
  starting: {
    label: "Baru Mulai AI",
    note: "Tidak perlu menyiapkan semuanya sekaligus. Cukup fokus pada satu proses yang paling sering bocor atau paling mudah diukur dulu."
  }
};

type Step = "hero" | "s1" | "fact1" | "s2" | "fact2" | "s3" | "s4" | "s5" | "s6" | "s7" | "s8";

export function PesatExperience({ landing }: { landing?: LandingConfig } = {}) {
  const cfg = landing ?? DEFAULT_LANDING_CONFIG;
  const [step, setStep] = useState<Step>("hero");
  const [sessionId, setSessionId] = useState<string>("");
  const [answers, setAnswers] = useState<WizardAnswers>(initialAnswers);
  const [contact, setContact] = useState<ContactData>({});
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailNote, setDetailNote] = useState("");
  const [discoveryContext, setDiscoveryContext] = useState<DiscoveryContextAnswers>(initialDiscoveryContext);
  const [resultError, setResultError] = useState("");
  const [discoveryError, setDiscoveryError] = useState("");
  const [discoveryNotice, setDiscoveryNotice] = useState("");

  const primaryChallenge = answers.mainChallenges[0] || "revenue";
  const fact = TRANSITION_FACTS[primaryChallenge];
  const detailNoteWordCount = useMemo(() => countWords(detailNote), [detailNote]);

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

  const selectedDetails = useMemo(() => {
    const clusters = answers.mainChallenges.length ? answers.mainChallenges : ["revenue" as ChallengeId];
    return clusters.flatMap((cluster) => detailOptions[cluster]);
  }, [answers.mainChallenges]);

  // Name + a usable WhatsApp number are required before generating the result.
  const canGenerate = Boolean(contact.name && contact.name.trim()) && hasUsableWhatsAppNumber(contact.wa || "");

  function handleDetailNoteChange(value: string) {
    setDetailNote(trimToWordLimit(value, DETAIL_NOTE_WORD_LIMIT));
  }

  function handleDiscoveryContextChange(key: DiscoveryContextKey, value: string) {
    setDiscoveryContext((current) => ({
      ...current,
      [key]: trimToWordLimit(value, DISCOVERY_SHORT_ANSWER_WORD_LIMIT)
    }));
  }

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
    setStep("s1");
  }

  function toggleChallenge(id: ChallengeId) {
    setAnswers((current) => {
      const exists = current.mainChallenges.includes(id);
      const mainChallenges = exists ? current.mainChallenges.filter((item) => item !== id) : [...current.mainChallenges, id].slice(0, 2);
      return { ...current, mainChallenges, detailChallenges: [] };
    });
  }

  function toggleDetail(id: DetailId) {
    setAnswers((current) => ({
      ...current,
      detailChallenges: current.detailChallenges.includes(id) ? current.detailChallenges.filter((item) => item !== id) : [...current.detailChallenges, id]
    }));
  }

  async function generateResult() {
    if (!canGenerate) {
      setResultError("Mohon isi Nama Anda dan Nomor WhatsApp yang valid agar hasil bisa disusun.");
      return;
    }
    setLoading(true);
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
      setStep("s7");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Hasil belum bisa dibuat.";
      setResultError(`${message} Silakan coba lagi.`);
      void track("click", "s6", { error: "result_generation_failed", message });
    } finally {
      setLoading(false);
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
      await track("click", "s7", { cta: "Copy Link" }, activeResult.sessionId);
    }
  }

  async function submitDiscovery(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setDiscoveryError("");
    setDiscoveryNotice("");
    const form = new FormData(event.currentTarget);
    const payload = {
      sessionId: result?.sessionId || sessionId,
      companyName: String(form.get("companyName") || contact.companyName || ""),
      name: String(form.get("name") || contact.name || ""),
      wa: String(form.get("wa") || contact.wa || ""),
      budgetContext: String(form.get("budgetContext") || ""),
      message: buildDiscoveryContextMessage(detailNote, discoveryContext),
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
      await track("click", "s8", { cta: "Submit Discovery Call", persisted: Boolean(data.persisted) }, result?.sessionId || sessionId);
      window.location.href = data.whatsappUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Discovery call belum bisa diproses.";
      setDiscoveryError(`${message} Periksa data dan coba lagi.`);
      void track("click", "s8", { error: "discovery_request_failed", message }, result?.sessionId || sessionId);
    } finally {
      setLoading(false);
    }
  }

  const scheduleDiscovery = () => {
    void track("click", "hero", { cta: "schedule_discovery" });
    void startWizard();
  };

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
          <div className={`mx-auto flex min-h-screen w-full flex-col px-5 py-5 sm:px-8 ${step === "s7" ? "max-w-5xl" : "max-w-3xl"}`}>
            <div className="mb-8 flex items-center justify-between">
              <button
                onClick={() => (step === "s1" ? setStep("hero") : setStep(previousStep(step)))}
                className="grid h-11 w-11 place-items-center rounded-full border border-neutral-200 text-neutral-900"
                aria-label="Kembali"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="text-sm font-semibold text-neutral-500">Pesat.AI Mini Session</div>
              <button onClick={() => setStep("hero")} className="grid h-11 w-11 place-items-center rounded-full border border-neutral-200 text-neutral-900" aria-label="Tutup">
                <X className="h-5 w-5" />
              </button>
            </div>

            {step === "s1" && (
              <QuestionShell eyebrow="01 / Tantangan terbesar" title="Apa tantangan terbesar bisnis Anda sekarang?" note="Pilih maksimal 2 agar rekomendasi tetap fokus.">
                <div className="grid gap-3">
                  {(Object.entries(CHALLENGE_LABELS) as Array<[ChallengeId, string]>).map(([id, label]) => (
                    <ChoiceButton key={id} active={answers.mainChallenges.includes(id)} onClick={() => toggleChallenge(id)} label={label} />
                  ))}
                </div>
                <PrimaryAction disabled={answers.mainChallenges.length === 0} onClick={() => saveSession().then(() => setStep("fact1"))} label="Lanjut" />
              </QuestionShell>
            )}

            {step === "fact1" && <FactScreen fact={fact.first} source={fact.source} onNext={() => setStep("s2")} />}

            {step === "s2" && (
              <QuestionShell eyebrow="02 / Detail tantangan" title="Bagian mana yang paling terasa sekarang?" note="Pilih semua yang relevan.">
                <div className="grid gap-3">
                  {selectedDetails.map((item) => (
                    <ChoiceButton key={item.id} active={answers.detailChallenges.includes(item.id)} onClick={() => toggleDetail(item.id)} label={item.label} />
                  ))}
                </div>
                <PrimaryAction disabled={answers.detailChallenges.length === 0} onClick={() => saveSession().then(() => setStep("fact2"))} label="Lanjut" />
              </QuestionShell>
            )}

            {step === "fact2" && <FactScreen fact={fact.second} source={fact.source} onNext={() => setStep("s3")} />}

            {step === "s3" && (
              <QuestionShell eyebrow="03 / Skala dampak" title="Dampak apa yang paling ingin Anda lihat dulu?">
                <div className="grid gap-3">
                  {impactOptions.map((item) => (
                    <ChoiceButton key={item.id} active={answers.impactLevel === item.id} onClick={() => setAnswers({ ...answers, impactLevel: item.id })} label={item.label} note={item.note} />
                  ))}
                </div>
                <PrimaryAction disabled={!answers.impactLevel} onClick={() => saveSession().then(() => setStep("s4"))} label="Lanjut" />
              </QuestionShell>
            )}

            {step === "s4" && (
              <QuestionShell eyebrow="04 / Preferensi adopsi" title="Cara adopsi AI seperti apa yang paling cocok?">
                <div className="grid gap-3">
                  {adoptionOptions.map((item) => (
                    <ChoiceButton key={item.id} active={answers.adoptionStyle === item.id} onClick={() => setAnswers({ ...answers, adoptionStyle: item.id })} label={item.label} note={item.note} />
                  ))}
                </div>
                <PrimaryAction disabled={!answers.adoptionStyle} onClick={() => saveSession().then(() => setStep("s5"))} label="Review jawaban" />
              </QuestionShell>
            )}

            {step === "s5" && (
              <QuestionShell eyebrow="05 / Review" title="Cek sebentar. Apakah ini sudah pas?">
                <ReviewRow label="Tantangan" value={answers.mainChallenges.map((id) => CHALLENGE_LABELS[id]).join(", ")} onEdit={() => setStep("s1")} />
                <ReviewRow label="Detail" value={`${answers.detailChallenges.length} area dipilih`} onEdit={() => setStep("s2")} />
                <ReviewRow label="Dampak" value={impactOptions.find((item) => item.id === answers.impactLevel)?.label || "-"} onEdit={() => setStep("s3")} />
                <ReviewRow label="Adopsi" value={adoptionOptions.find((item) => item.id === answers.adoptionStyle)?.label || "-"} onEdit={() => setStep("s4")} />
                <PrimaryAction onClick={() => setStep("s6")} label="Sudah Pas" />
              </QuestionShell>
            )}

            {step === "s6" && (
              <QuestionShell
                eyebrow="06 / Data Anda"
                title="Ke mana hasil & rencana ini kami kirim?"
                note="Nama dan WhatsApp wajib agar kami bisa menyusun hasil dan mengirim rincian rencananya ke Anda."
              >
                <ContactFields contact={contact} setContact={setContact} />
                <label className="mt-4 block">
                  <span className="mb-2 block text-sm font-semibold text-neutral-500">Ceritakan tantangan Anda (opsional, tapi membuat hasil jauh lebih spesifik)</span>
                  <textarea
                    value={detailNote}
                    onChange={(event) => handleDetailNoteChange(event.target.value)}
                    rows={4}
                    className="w-full rounded-[1.35rem] border border-neutral-200 px-5 py-4 outline-none focus:border-neutral-900"
                    placeholder="Contoh: penjualan banyak lewat WhatsApp, tapi follow-up sering telat dan pelanggan lama jarang beli lagi..."
                  />
                  <div className="mt-2 flex items-center justify-between gap-4 text-xs text-neutral-400">
                    <span>Semakin detail konteks Anda, semakin spesifik hasil dan rencana yang kami susun.</span>
                    <span>{detailNoteWordCount}/{DETAIL_NOTE_WORD_LIMIT} kata</span>
                  </div>
                </label>
                <PrimaryAction
                  onClick={generateResult}
                  label={loading ? "Menyusun hasil & rencana..." : "Susun Hasil & Rencana Saya"}
                  disabled={loading || !canGenerate}
                  loading={loading}
                />
                {!canGenerate ? <p className="mt-3 text-xs text-neutral-400">Isi Nama Anda dan Nomor WhatsApp yang valid untuk melanjutkan.</p> : null}
                {resultError ? <p className="mt-4 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold leading-6 text-red-700">{resultError}</p> : null}
              </QuestionShell>
            )}

            {step === "s7" && result && (
              <div className="pb-10">
                <ResultPanel
                  answers={answers}
                  result={result}
                  detailNote={detailNote}
                  detailNoteWordCount={detailNoteWordCount}
                  discoveryContext={discoveryContext}
                  setDetailNote={setDetailNote}
                  onDiscoveryContextChange={handleDiscoveryContextChange}
                  onDetailNoteBlur={saveResultDetailNote}
                  onShare={() => copyResultLink(result)}
                  onPdf={async () => {
                    await track("click", "s7", { cta: "Export PDF" }, result.sessionId);
                    await downloadPdf();
                  }}
                  onDiscovery={async () => {
                    await saveResultDetailNote(detailNote);
                    void track("click", "s7", { cta: "Discovery Call" }, result.sessionId);
                    setStep("s8");
                  }}
                />
              </div>
            )}

            {step === "s8" && result && (
              <QuestionShell eyebrow="08 / Discovery call" title="Diskusikan solusi khusus untuk bisnis dan budget Anda.">
                <form onSubmit={submitDiscovery} className="grid gap-4">
                  <ContactFields contact={contact} setContact={setContact} />
                  <input name="budgetContext" className="rounded-3xl border border-neutral-200 px-5 py-4 outline-none focus:border-neutral-900" placeholder="Konteks budget atau target bisnis" />
                  <PrimaryAction type="submit" label={loading ? "Menyimpan..." : "Ya, Saya Mau Discovery Call"} loading={loading} disabled={loading} />
                  {discoveryError ? <p className="text-sm font-semibold leading-6 text-red-700">{discoveryError}</p> : null}
                  {discoveryNotice ? <p className="text-sm font-semibold text-amber-700">{discoveryNotice}</p> : null}
                </form>
              </QuestionShell>
            )}
          </div>
        </section>
      )}
    </main>
  );
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

function previousStep(step: Step): Step {
  const order: Step[] = ["hero", "s1", "fact1", "s2", "fact2", "s3", "s4", "s5", "s6", "s7", "s8"];
  return order[Math.max(0, order.indexOf(step) - 1)];
}

function QuestionShell({ eyebrow, title, note, children }: { eyebrow: string; title: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col justify-center pb-8">
      <div className="mb-6 w-fit rounded-full border border-border-base bg-surface-elevated/90 px-4 py-2 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.45)] backdrop-blur-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground-muted">{eyebrow}</p>
      </div>
      <h2 className="mb-4 max-w-4xl text-balance text-4xl font-semibold leading-tight tracking-normal text-foreground sm:text-6xl">{title}</h2>
      {note ? <p className="mb-8 max-w-2xl text-base font-medium leading-7 text-foreground-muted">{note}</p> : <div className="mb-6" />}
      {children}
    </div>
  );
}

function ChoiceButton({ active, onClick, label, note }: { active: boolean; onClick: () => void; label: string; note?: string }) {
  return (
    <button onClick={onClick} className={`flex min-h-16 items-center justify-between rounded-[1.35rem] border px-5 py-4 text-left transition ${active ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-200 bg-white text-neutral-950 hover:border-neutral-400"}`}>
      <span>
        <span className="block text-base font-semibold capitalize">{label}</span>
        {note ? <span className={`mt-1 block text-sm ${active ? "text-neutral-300" : "text-neutral-500"}`}>{note}</span> : null}
      </span>
      {active ? <Check className="h-5 w-5 shrink-0" /> : <span className="h-5 w-5 shrink-0 rounded-full border border-neutral-300" />}
    </button>
  );
}

function PrimaryAction({ label, onClick, disabled, loading, type = "button" }: { label: string; onClick?: () => void; disabled?: boolean; loading?: boolean; type?: "button" | "submit" }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className="mt-8 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 text-base font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-neutral-300">
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
      {label}
      {!loading ? <ArrowRight className="h-5 w-5" /> : null}
    </button>
  );
}

function FactScreen({ fact, source, onNext }: { fact: string; source: string; onNext: () => void }) {
  return (
    <div className="flex flex-1 flex-col justify-center pb-8">
      <p className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Insight singkat</p>
      <h2 className="text-4xl font-semibold leading-tight tracking-normal text-neutral-950 sm:text-6xl">{fact}</h2>
      <p className="mt-6 text-sm font-medium text-neutral-500">Sumber: {source}</p>
      <PrimaryAction onClick={onNext} label="Lanjut" />
    </div>
  );
}

function ReviewRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="mb-3 flex items-center justify-between rounded-[1.35rem] border border-neutral-200 px-5 py-4">
      <div>
        <p className="text-sm font-semibold text-neutral-500">{label}</p>
        <p className="mt-1 text-base font-semibold text-neutral-950">{value}</p>
      </div>
      <button onClick={onEdit} className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold">
        Ubah
      </button>
    </div>
  );
}

function ContactFields({ contact, setContact, optional = false }: { contact: ContactData; setContact: (contact: ContactData) => void; optional?: boolean }) {
  return (
    <div className="grid gap-3">
      <input name="companyName" value={contact.companyName || ""} onChange={(event) => setContact({ ...contact, companyName: event.target.value })} className="rounded-3xl border border-neutral-200 px-5 py-4 outline-none focus:border-neutral-900" placeholder="Nama perusahaan (opsional)" />
      <input name="name" value={contact.name || ""} required={!optional} onChange={(event) => setContact({ ...contact, name: event.target.value })} className="rounded-3xl border border-neutral-200 px-5 py-4 outline-none focus:border-neutral-900" placeholder={`Nama Anda${optional ? " (opsional)" : ""}`} />
      <input name="wa" value={contact.wa || ""} required={!optional} onChange={(event) => setContact({ ...contact, wa: event.target.value })} className="rounded-3xl border border-neutral-200 px-5 py-4 outline-none focus:border-neutral-900" placeholder={`Nomor WhatsApp${optional ? " (opsional)" : ""}`} />
      {optional ? (
        <label className="flex items-center gap-3 rounded-3xl border border-neutral-200 px-5 py-4 text-sm font-semibold text-neutral-700">
          <input type="checkbox" checked={Boolean(contact.followUpAllowed)} onChange={(event) => setContact({ ...contact, followUpAllowed: event.target.checked })} />
          boleh follow up
        </label>
      ) : null}
    </div>
  );
}

function ResultPanel({
  answers,
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
  answers: WizardAnswers;
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
  const primaryChallenge = answers.mainChallenges[0] || "revenue";
  const prepGuide = DISCOVERY_PREP_BY_CHALLENGE[primaryChallenge];
  const adoptionSummary = ADOPTION_MODE_SUMMARY[answers.adoptionStyle || "starting"];
  const notePreview =
    detailNote.trim().length > 280 ? `${detailNote.trim().slice(0, 280).trimEnd()}...` : detailNote.trim();

  return (
    <div>
      <div id="result-panel" className="rounded-[1.75rem] border border-neutral-200 bg-white p-5 shadow-soft sm:p-8">
        <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-neutral-500">
          <BarChart3 className="h-4 w-4" />
          Hasil Mini Session Pesat.AI
        </div>
        <h2 className="text-4xl font-semibold leading-tight tracking-normal text-neutral-950 sm:text-6xl">{result.headline}</h2>
        <p className="mt-5 text-lg leading-8 text-neutral-600">{result.subheadline}</p>
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
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {result.impactCards.map((card) => (
            <div key={card.title} className="rounded-[1.35rem] border border-neutral-200 p-5">
              <p className="text-sm font-semibold text-neutral-500">{card.title}</p>
              <p className="mt-2 text-3xl font-semibold text-neutral-950">{card.value}</p>
              <p className="mt-3 text-sm leading-6 text-neutral-500">{card.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 h-64 rounded-[1.35rem] border border-neutral-200 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result.chart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="before" fill="#d4d4d4" radius={[8, 8, 0, 0]} />
              <Bar dataKey="after" fill="#111111" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {result.beforeAfterText.map((text, index) => (
            <div key={text} className="rounded-[1.35rem] bg-neutral-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">{index === 0 ? "Before" : "After"}</p>
              <p className="mt-3 text-base font-medium leading-7 text-neutral-800">{text}</p>
            </div>
          ))}
        </div>
        {result.promise?.statement ? (
          <div className="mt-8 rounded-[1.35rem] bg-neutral-950 p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Janji terukur</p>
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
        {result.firstStep ? (
          <div className="mt-8 rounded-[1.35rem] border border-neutral-200 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Langkah pertama</p>
            <p className="mt-3 text-lg font-medium leading-8 text-neutral-900">{result.firstStep}</p>
          </div>
        ) : null}
        {result.costOfInaction ? (
          <div className="mt-8 rounded-[1.35rem] border border-neutral-200 border-l-4 border-l-neutral-900 bg-neutral-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Jika dibiarkan</p>
            <p className="mt-3 text-base font-medium leading-7 text-neutral-800">{result.costOfInaction}</p>
          </div>
        ) : null}
        <div className="mt-8 rounded-[1.35rem] bg-neutral-950 p-6 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Unique mechanism</p>
          <p className="mt-3 text-xl font-semibold leading-8">{result.uniqueMechanism}</p>
        </div>
        <div className="mt-8">
          <h3 className="text-2xl font-semibold">Solusi yang paling relevan</h3>
          <div className="mt-4 grid gap-3">
            {result.solutionsText.map((solution) => (
              <div key={solution} className="rounded-[1.35rem] border border-neutral-200 p-5 text-base leading-7 text-neutral-700">
                {solution}
              </div>
            ))}
          </div>
        </div>
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
        <div className="mt-8 overflow-hidden rounded-[1.35rem] border border-neutral-200 bg-gradient-to-br from-white to-neutral-100 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Supaya langkah berikutnya tidak ngawang</p>
              <h3 className="mt-2 text-2xl font-semibold text-neutral-950">Siapkan 3 hal ini agar rekomendasi cepat jadi keputusan nyata</h3>
            </div>
            <span className="inline-flex w-fit rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700">{adoptionSummary.label}</span>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">{adoptionSummary.note}</p>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            <div className="rounded-[1.35rem] border border-neutral-200 bg-white p-5 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Prioritas pertama</p>
              <p className="mt-3 text-base font-semibold leading-7 text-neutral-950">{result.firstStep}</p>
              <p className="mt-3 text-sm leading-6 text-neutral-600">Mulai dari satu area yang paling dekat ke dampak bisnis agar tim tidak kewalahan dan hasil bisa cepat terlihat.</p>
            </div>
            <div className="rounded-[1.35rem] border border-neutral-200 bg-white p-5 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">{prepGuide.title}</p>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-neutral-700">
                {prepGuide.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-neutral-900" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[1.35rem] border border-neutral-200 bg-white p-5 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Angka yang nanti dicek</p>
              <p className="mt-3 text-sm leading-6 text-neutral-600">Ini yang dipakai untuk mengukur hasil agar keputusan Anda berbasis angka, bukan asumsi.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {result.promise.measuredBy.map((metric) => (
                  <span key={metric} className="rounded-full bg-neutral-100 px-3 py-2 text-sm font-semibold text-neutral-800">
                    {metric}
                  </span>
                ))}
              </div>
              <div className="mt-4 space-y-3">
                {result.impactCards.slice(0, 2).map((card) => (
                  <div key={card.title} className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">{card.title}</p>
                    <p className="mt-1 text-lg font-semibold text-neutral-950">{card.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {notePreview ? (
            <div className="mt-5 rounded-[1.35rem] border border-dashed border-neutral-300 bg-white/80 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Catatan Anda yang sudah tertangkap</p>
              <p className="mt-3 text-sm leading-7 text-neutral-700">{notePreview}</p>
            </div>
          ) : null}
        </div>
      </div>
      <section className="mt-6 rounded-[1.35rem] border border-border-base bg-surface-elevated p-5 text-foreground shadow-[0_24px_60px_-40px_rgba(15,23,42,0.55)] sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground-muted">Opsional sebelum discovery call</p>
            <h3 className="mt-1 text-2xl font-semibold leading-tight text-foreground">Bantu kami memahami konteks Anda lewat 3 pertanyaan singkat</h3>
          </div>
          <span className="inline-flex w-fit rounded-full border border-border-base bg-surface px-4 py-2 text-sm font-semibold text-foreground-muted">Semua jawaban bersifat opsional</span>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-foreground-muted">
          Jawaban di bawah ini akan ikut dikirim saat Anda lanjut ke discovery call, supaya tim Pesat.AI masuk dengan konteks yang lebih jelas dan tidak mengulang pertanyaan dasar.
        </p>

        <div className="mt-5 grid gap-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-foreground">1. Ceritakan tantangan Anda lebih detail</span>
            <textarea
              value={detailNote}
              onChange={(event) => setDetailNote(trimToWordLimit(event.target.value, DETAIL_NOTE_WORD_LIMIT))}
              onBlur={(event) => void onDetailNoteBlur(event.target.value)}
              rows={5}
              className="w-full rounded-[1.35rem] border border-border-base bg-surface px-5 py-4 text-foreground outline-none placeholder:text-foreground-subtle focus:border-border-strong"
              placeholder="Contoh: Saya menjual lele biasa sehari kurang lebih 500 kg - 1 ton. Saya masih butuh tools/software untuk pencatatan stok dan penjualan."
            />
            <div className="mt-2 flex items-center justify-between gap-4 text-xs text-foreground-subtle">
              <span>Anda bisa cerita bebas soal proses, volume, bottleneck, atau kebiasaan operasional yang sekarang paling terasa.</span>
              <span>{detailNoteWordCount}/{DETAIL_NOTE_WORD_LIMIT} kata</span>
            </div>
          </label>

          {OPTIONAL_DISCOVERY_QUESTIONS.map((question) => (
            <label key={question.id} className="block">
              <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <span className="text-sm font-semibold text-foreground">{question.label}</span>
                <span className="text-xs text-foreground-subtle">{question.helper}</span>
              </div>
              <textarea
                value={discoveryContext[question.id]}
                onChange={(event) => onDiscoveryContextChange(question.id, event.target.value)}
                rows={question.rows}
                className="w-full rounded-[1.35rem] border border-border-base bg-surface px-5 py-4 text-foreground outline-none placeholder:text-foreground-subtle focus:border-border-strong"
                placeholder={question.placeholder}
              />
            </label>
          ))}
        </div>
      </section>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <button
          onClick={() => void onShare()}
          disabled={!result.persisted}
          className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-neutral-200 px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:border-neutral-100 disabled:text-neutral-300"
        >
          <ExternalLink className="h-4 w-4" />
          {result.persisted ? "Copy Link" : "Link aktif setelah DB tersambung"}
        </button>
        <button onClick={() => void onPdf()} className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-neutral-200 px-5 text-sm font-semibold">
          <Download className="h-4 w-4" />
          Export PDF
        </button>
        <button onClick={onDiscovery} className="min-h-12 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white">
          Ya, Saya Mau Discovery Call
        </button>
      </div>
      {!result.persisted ? <p className="mt-3 text-xs text-neutral-400">Share link membutuhkan Supabase agar hasil bisa dibuka ulang.</p> : null}
      {result.llmFallback ? <p className="mt-3 text-xs text-neutral-400">Mode fallback aktif karena OpenAI belum tersedia atau gagal merespons.</p> : null}
    </div>
  );
}
