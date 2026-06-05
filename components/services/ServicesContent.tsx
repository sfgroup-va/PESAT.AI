"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronRight,
  Clock,
  Coins,
  Lightbulb,
  MessageCircle,
  Search,
  Sparkles,
  Target,
  X
} from "lucide-react";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { MobileFx } from "@/components/home/MobileFx";
import { RevealOnScroll } from "@/components/home/RevealOnScroll";
import {
  serviceCategories,
  services,
  type Complexity,
  type ServiceCategoryId,
  type ServiceItem
} from "@/components/home/services-data";

type Tint = "emerald" | "sky" | "violet" | "amber" | "rose" | "fuchsia";

const TINT: Record<Tint, { tile: string; badge: string; chipActive: string; hover: string; text: string; soft: string }> = {
  emerald: { tile: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400", badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", chipActive: "border-emerald-500 bg-emerald-500 text-white", hover: "hover:border-emerald-500/50", text: "text-emerald-600 dark:text-emerald-400", soft: "border-emerald-500/20 bg-emerald-500/5" },
  sky: { tile: "bg-sky-500/12 text-sky-600 dark:text-sky-400", badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400", chipActive: "border-sky-500 bg-sky-500 text-white", hover: "hover:border-sky-500/50", text: "text-sky-600 dark:text-sky-400", soft: "border-sky-500/20 bg-sky-500/5" },
  violet: { tile: "bg-violet-500/12 text-violet-600 dark:text-violet-400", badge: "bg-violet-500/10 text-violet-600 dark:text-violet-400", chipActive: "border-violet-500 bg-violet-500 text-white", hover: "hover:border-violet-500/50", text: "text-violet-600 dark:text-violet-400", soft: "border-violet-500/20 bg-violet-500/5" },
  amber: { tile: "bg-amber-500/14 text-amber-600 dark:text-amber-400", badge: "bg-amber-500/12 text-amber-600 dark:text-amber-400", chipActive: "border-amber-500 bg-amber-500 text-white", hover: "hover:border-amber-500/50", text: "text-amber-600 dark:text-amber-400", soft: "border-amber-500/20 bg-amber-500/5" },
  rose: { tile: "bg-rose-500/12 text-rose-600 dark:text-rose-400", badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400", chipActive: "border-rose-500 bg-rose-500 text-white", hover: "hover:border-rose-500/50", text: "text-rose-600 dark:text-rose-400", soft: "border-rose-500/20 bg-rose-500/5" },
  fuchsia: { tile: "bg-fuchsia-500/12 text-fuchsia-600 dark:text-fuchsia-400", badge: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400", chipActive: "border-fuchsia-500 bg-fuchsia-500 text-white", hover: "hover:border-fuchsia-500/50", text: "text-fuchsia-600 dark:text-fuchsia-400", soft: "border-fuchsia-500/20 bg-fuchsia-500/5" }
};

const COMPLEXITY: Record<Complexity, { label: string; timeframe: string; cost: string; risk: string }> = {
  quick: { label: "Quick win", timeframe: "± 3–7 hari", cost: "Paket ringan / add-on", risk: "Rendah — cepat dipakai" },
  standard: { label: "Standar", timeframe: "± 1–3 minggu", cost: "Setara paket DIY (≈ USD 500+)", risk: "Terkelola — mulai scope kecil" },
  advanced: { label: "Advanced", timeframe: "± 3–8 minggu", cost: "Custom DFY (sesuai scope)", risk: "Terkelola — MVP & validasi dulu" }
};

const WA_BASE = "https://wa.me/6281290401240?text=";

function waLink(text: string) {
  return WA_BASE + encodeURIComponent(text);
}

export function ServicesContent() {
  const [active, setActive] = useState<ServiceCategoryId | "all">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ServiceItem | null>(null);

  const goHome = () => {
    window.location.href = "/";
  };

  // Lock scroll + ESC to close while modal open
  useEffect(() => {
    if (!selected) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  const q = query.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      services.filter((s) => {
        const matchCat = active === "all" || s.category === active;
        const matchQuery = !q || s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q);
        return matchCat && matchQuery;
      }),
    [active, q]
  );

  const countFor = (id: ServiceCategoryId) => services.filter((s) => s.category === id).length;
  const visibleCategories = serviceCategories.filter((c) => filtered.some((s) => s.category === c.id));

  const selectCat = (id: ServiceCategoryId | "all") => {
    setActive(id);
    if (typeof document !== "undefined") {
      document.getElementById("services-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const tintOf = (id: ServiceCategoryId): Tint => serviceCategories.find((c) => c.id === id)!.tint;
  const labelOf = (id: ServiceCategoryId) => serviceCategories.find((c) => c.id === id)!.label;

  return (
    <main className="bg-surface text-foreground">
      <Header onStartWizard={goHome} />

      {/* ===== Hero ===== */}
      <section className="relative isolate overflow-hidden bg-surface pt-28 pb-12 sm:pt-32 lg:pt-36 lg:pb-16">
        <MobileFx />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.5] dark:opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 25%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 25%, transparent 80%)"
          }}
        />
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <RevealOnScroll>
            <span className="inline-flex items-center gap-2 rounded-full border border-border-base bg-surface-elevated/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground-muted backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Katalog Layanan
            </span>
          </RevealOnScroll>
          <RevealOnScroll delay={80}>
            <h1 className="mt-6 max-w-4xl text-balance text-[clamp(2.2rem,7vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
              AI untuk setiap bagian <span className="text-shimmer">bisnis Anda</span>.
            </h1>
          </RevealOnScroll>
          <RevealOnScroll delay={150}>
            <p className="mt-5 max-w-2xl text-balance text-base leading-8 text-foreground-muted sm:text-lg">
              Pilih kategori, klik layanannya, lihat contoh nyata, hasil, dan biayanya. Semua dibuat supaya gampang dimengerti — tanpa istilah ribet.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={210}>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                onClick={goHome}
                className="motion-cta-shimmer fx-ring group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-surface shadow-[0_18px_50px_-16px_rgba(15,23,42,0.5)] transition hover:-translate-y-0.5"
              >
                <Sparkles className="h-5 w-5" />
                Buktikan Sendiri dalam 5 Menit
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </button>
              {/* Search */}
              <div className="flex w-full items-center gap-3 rounded-full border border-border-base bg-surface-elevated px-5 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus-within:border-border-strong sm:max-w-sm">
                <Search className="h-5 w-5 shrink-0 text-foreground-subtle" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari layanan…"
                  className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-foreground-subtle"
                  aria-label="Cari layanan"
                />
                {query ? (
                  <button onClick={() => setQuery("")} aria-label="Hapus pencarian" className="shrink-0 text-foreground-subtle transition hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                ) : null}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ===== Sticky category filter ===== */}
      <div className="sticky top-16 z-30 border-y border-border-base bg-surface/85 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              onClick={() => selectCat("all")}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                active === "all" ? "border-foreground bg-foreground text-surface" : "border-border-base bg-surface-elevated text-foreground-muted hover:border-border-strong"
              }`}
            >
              Semua
              <span className={`tabular-nums ${active === "all" ? "text-surface/70" : "text-foreground-subtle"}`}>{services.length}</span>
            </button>
            {serviceCategories.map((cat) => {
              const isActive = active === cat.id;
              const tint = TINT[cat.tint];
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => selectCat(cat.id)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    isActive ? tint.chipActive : `border-border-base bg-surface-elevated text-foreground-muted ${tint.hover}`
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {cat.label}
                  <span className={`tabular-nums ${isActive ? "text-white/75" : "text-foreground-subtle"}`}>{countFor(cat.id)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== Grid ===== */}
      <section id="services-grid" className="relative scroll-mt-28 overflow-hidden bg-surface py-14 sm:py-20">
        <MobileFx />
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          {visibleCategories.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg font-semibold text-foreground">Tidak ada layanan yang cocok.</p>
              <p className="mt-2 text-sm text-foreground-muted">Coba kata kunci lain atau pilih kategori “Semua”.</p>
              <button onClick={() => { setQuery(""); setActive("all"); }} className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-surface">
                Reset filter
              </button>
            </div>
          ) : (
            <div className="grid gap-14">
              {visibleCategories.map((cat) => {
                const tint = TINT[cat.tint];
                const CatIcon = cat.icon;
                const items = filtered.filter((s) => s.category === cat.id);
                return (
                  <div key={cat.id} id={cat.id} className="scroll-mt-32">
                    <RevealOnScroll>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                          <span className={`fx-float grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tint.tile}`}>
                            <CatIcon className="h-6 w-6" />
                          </span>
                          <div>
                            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-foreground sm:text-3xl">{cat.label}</h2>
                            <p className="mt-1 max-w-xl text-sm leading-6 text-foreground-muted">{cat.blurb}</p>
                          </div>
                        </div>
                        <span className={`inline-flex w-max items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${tint.badge}`}>
                          {items.length} layanan
                        </span>
                      </div>
                    </RevealOnScroll>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map((s, index) => {
                        const Icon = s.icon;
                        return (
                          <RevealOnScroll key={s.id} delay={(index % 3) * 70}>
                            <button
                              type="button"
                              onClick={() => setSelected(s)}
                              className={`fx-sheen sd${(index % 4) + 1} group flex h-full w-full flex-col rounded-2xl border border-border-base bg-surface-elevated p-5 text-left transition hover:-translate-y-1 ${tint.hover}`}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tint.tile} transition group-hover:scale-105`}>
                                  <Icon className="h-5 w-5" />
                                </span>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${tint.badge}`}>
                                  {s.impact}
                                </span>
                              </div>
                              <h3 className="mt-4 text-lg font-semibold leading-snug tracking-[-0.01em] text-foreground">{s.name}</h3>
                              <p className="mt-2 flex-1 text-sm leading-6 text-foreground-muted">{s.desc}</p>
                              <span className={`mt-4 inline-flex items-center gap-1 text-xs font-semibold ${tint.text}`}>
                                Lihat detail
                                <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                              </span>
                            </button>
                          </RevealOnScroll>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative overflow-hidden bg-neutral-950 py-20 text-white sm:py-28">
        <MobileFx />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.25),transparent_30rem)]" />
        <div className="relative z-10 mx-auto max-w-3xl px-5 text-center sm:px-8">
          <RevealOnScroll>
            <h2 className="text-balance text-3xl font-semibold leading-[1.08] sm:text-5xl">
              Tidak yakin mulai dari <span className="text-shimmer">mana</span>?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-white/72 sm:text-lg">
              Jalankan mini-session 5 menit. Sistem memetakan layanan mana yang paling cepat memberi impact untuk bisnis Anda — gratis, tanpa signup.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={140}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button onClick={goHome} className="motion-cta-shimmer fx-glow inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-white px-7 text-base font-semibold text-neutral-950 transition hover:-translate-y-0.5">
                <Sparkles className="h-5 w-5" />
                Buktikan Sendiri dalam 5 Menit
                <ArrowRight className="h-5 w-5" />
              </button>
              <a href={waLink("Halo Pesat.AI, saya mau tanya layanan AI")} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/22 bg-white/8 px-7 text-base font-semibold text-white backdrop-blur-xl transition hover:bg-white/14">
                <MessageCircle className="h-5 w-5" />
                Tanya via WhatsApp
              </a>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <Footer onStartWizard={goHome} />

      {/* ===== Detail Modal ===== */}
      {selected ? (
        <ServiceModal service={selected} tint={TINT[tintOf(selected.category)]} categoryLabel={labelOf(selected.category)} onClose={() => setSelected(null)} goHome={goHome} />
      ) : null}
    </main>
  );
}

function ServiceModal({
  service,
  tint,
  categoryLabel,
  onClose,
  goHome
}: {
  service: ServiceItem;
  tint: (typeof TINT)[Tint];
  categoryLabel: string;
  onClose: () => void;
  goHome: () => void;
}) {
  const Icon = service.icon;
  const meta = COMPLEXITY[service.detail.complexity];

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={service.name}>
      <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-t-[1.75rem] border border-border-base bg-surface p-6 shadow-[0_-20px_60px_rgba(15,23,42,0.25)] animate-fade-in-up sm:max-w-lg sm:rounded-[1.75rem] sm:p-7">
        {/* Close */}
        <button onClick={onClose} aria-label="Tutup" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-border-base bg-surface-elevated text-foreground-muted transition hover:text-foreground">
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 pr-10">
          <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${tint.tile}`}>
            <Icon className="h-7 w-7" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-semibold uppercase tracking-[0.14em] ${tint.text}`}>{categoryLabel}</span>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tint.badge}`}>{service.impact}</span>
            </div>
            <h3 className="mt-1.5 text-xl font-semibold leading-tight tracking-[-0.02em] text-foreground">{service.name}</h3>
          </div>
        </div>

        <p className="mt-4 text-sm leading-7 text-foreground-muted">{service.desc}</p>

        {/* Analogy */}
        <div className={`mt-5 flex gap-3 rounded-2xl border p-4 ${tint.soft}`}>
          <Lightbulb className={`mt-0.5 h-5 w-5 shrink-0 ${tint.text}`} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground-subtle">Analoginya</p>
            <p className="mt-1 text-sm leading-6 text-foreground">{service.detail.analogy}</p>
          </div>
        </div>

        {/* Example */}
        <div className="mt-4 flex gap-3 rounded-2xl border border-border-base bg-surface-elevated p-4">
          <Target className="mt-0.5 h-5 w-5 shrink-0 text-foreground-subtle" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground-subtle">Contoh nyata</p>
            <p className="mt-1 text-sm leading-6 text-foreground">{service.detail.example}</p>
          </div>
        </div>

        {/* Before / After */}
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-foreground-subtle">Before → After</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
              <X className="h-3.5 w-3.5" /> Sebelum
            </p>
            <p className="mt-2 text-sm leading-6 text-foreground-muted">{service.detail.before}</p>
          </div>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Check className="h-3.5 w-3.5" /> Sesudah
            </p>
            <p className="mt-2 text-sm leading-6 text-foreground">{service.detail.after}</p>
          </div>
        </div>

        {/* Logistics: timeframe / cost / risk */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border-base bg-surface-elevated p-4">
            <Clock className="h-5 w-5 text-foreground-subtle" />
            <p className="mt-2 text-xs text-foreground-subtle">Perkiraan waktu</p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">{meta.timeframe}</p>
          </div>
          <div className="rounded-2xl border border-border-base bg-surface-elevated p-4">
            <Coins className="h-5 w-5 text-foreground-subtle" />
            <p className="mt-2 text-xs text-foreground-subtle">Estimasi biaya</p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">{meta.cost}</p>
          </div>
          <div className="rounded-2xl border border-border-base bg-surface-elevated p-4">
            <AlertTriangle className="h-5 w-5 text-foreground-subtle" />
            <p className="mt-2 text-xs text-foreground-subtle">Risiko</p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">{meta.risk}</p>
          </div>
        </div>

        {/* Confirm note */}
        <p className="mt-4 rounded-xl border border-amber-500/25 bg-amber-500/8 px-4 py-3 text-xs leading-5 text-amber-700 dark:text-amber-300">
          *Estimasi waktu, biaya, dan scope di atas hanya gambaran awal. <strong>Mohon konfirmasi & pastikan ke account manager</strong> untuk angka final sesuai kondisi bisnis Anda.
        </p>

        {/* CTA — reel/shimmer style seperti homepage */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button onClick={goHome} className="motion-cta-shimmer fx-ring group inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-surface transition hover:-translate-y-0.5">
            <Sparkles className="h-5 w-5" />
            Buktikan Sendiri (5 menit)
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </button>
          <a
            href={waLink(`Halo Pesat.AI, saya tertarik dengan layanan "${service.name}". Boleh dibantu detail & estimasinya?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border-base bg-surface-elevated px-6 py-3.5 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-border-strong"
          >
            <MessageCircle className="h-5 w-5" />
            Tanya Account Manager
          </a>
        </div>
      </div>
    </div>
  );
}

export default ServicesContent;
