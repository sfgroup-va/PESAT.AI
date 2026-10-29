"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Sparkles, ArrowRight, ArrowUpRight, BookOpen, Layers } from "lucide-react";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { useCoach } from "@/components/coach/CoachProvider";
import {
  GLOSSARY_CATEGORIES,
  GLOSSARY_TERMS,
  getAlphabeticalGroups,
  type GlossaryTerm
} from "@/lib/glossary-data";

export function GlossaryHubView() {
  const { openCoach } = useCoach();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter((term) => {
      const matchSearch =
        searchQuery.trim() === "" ||
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.leadDefinition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.shortName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat = selectedCategory === "all" || term.categoryId === selectedCategory;

      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCategory]);

  const groups = useMemo(() => {
    return getAlphabeticalGroups(filteredTerms);
  }, [filteredTerms]);

  const allLetters = useMemo(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), []);
  const activeLetters = useMemo(() => {
    return new Set(groups.map((g) => g.letter));
  }, [groups]);

  // Featured "Mulai Dari Sini"
  const featuredTerms: GlossaryTerm[] = useMemo(() => {
    return GLOSSARY_TERMS.filter((t) =>
      [
        "ai-agent",
        "geo-generative-engine-optimization",
        "rag-retrieval-augmented-generation",
        "workflow-automation",
        "decision-bottleneck",
        "diagnostic-mini-session"
      ].includes(t.slug)
    );
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-[#070710] dark:text-slate-100">
      {/* Official Sticky Site Header */}
      <Header onStartWizard={openCoach} />

      {/* Main Container */}
      <main className="mx-auto max-w-5xl px-4 pt-24 pb-14 sm:px-6 sm:pt-28 sm:pb-20">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Beranda
          </Link>
          <span>/</span>
          <span className="font-medium text-slate-800 dark:text-slate-200">Glosarium</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/70 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Referensi Praktis B2B AI & Otomasi</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
            Glosarium AI & Otomasi Bisnis
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
            Definisi lugas, bebas jargon rumit, dan berorientasi hasil operasional. Ditulis khusus untuk pemilik bisnis,
            direktur operasional, dan manajer yang ingin mengeliminasi pekerjaan repetitif dan memvalidasi ROI kecerdasan buatan.
          </p>
        </div>

        {/* Start-Here / Featured Box */}
        <div className="mb-12 rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50/80 to-amber-100/30 p-6 dark:border-amber-500/20 dark:from-amber-950/20 dark:to-transparent">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
            <Sparkles className="h-4 w-4" />
            <span>Mulai Dari Sini (Paling Sering Digunakan di Lapangan)</span>
          </div>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
            4 konsep fundamental yang paling sering mengubah operasional perusahaan klien Pesat.AI:
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {featuredTerms.map((term) => (
              <Link
                key={term.slug}
                href={`/glossary/${term.slug}`}
                className="group flex flex-col justify-between rounded-xl border border-amber-200/70 bg-white p-4 shadow-sm transition hover:border-indigo-500 hover:shadow-md dark:border-white/10 dark:bg-slate-900/80"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                      {term.term}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {term.leadDefinition.replace(/\*\*/g, "")}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                  <span>Baca panduan lengkap</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500 dark:text-slate-400">{term.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari istilah, teknologi, atau konsep (contoh: RAG, Agent, Bottleneck, Token)..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-slate-900 dark:text-white"
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Layers className="h-3.5 w-3.5" />
              <span>Pilar:</span>
            </span>
            <button
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                selectedCategory === "all"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
              }`}
            >
              Semua ({GLOSSARY_TERMS.length})
            </button>
            {GLOSSARY_CATEGORIES.map((cat) => {
              const count = GLOSSARY_TERMS.filter((t) => t.categoryId === cat.id).length;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    isSelected
                      ? "bg-indigo-600 text-white dark:bg-indigo-500"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Sticky A–Z Quick Nav */}
        <div className="sticky top-16 z-30 mb-8 border-y border-slate-200/90 bg-slate-50/95 py-2.5 backdrop-blur-md dark:border-white/10 dark:bg-[#070710]/95">
          <div className="flex flex-wrap items-center gap-1 overflow-x-auto text-xs font-bold">
            <span className="mr-2 text-slate-400 dark:text-slate-500">Lompat ke:</span>
            {allLetters.map((letter) => {
              const hasTerms = activeLetters.has(letter);
              return hasTerms ? (
                <a
                  key={letter}
                  href={`#letter-${letter}`}
                  className="grid h-7 w-7 place-items-center rounded-md border border-slate-200 bg-white text-indigo-600 shadow-sm transition hover:border-indigo-500 hover:bg-indigo-50 dark:border-white/10 dark:bg-slate-900 dark:text-indigo-400 dark:hover:border-indigo-400 dark:hover:bg-indigo-950/50"
                >
                  {letter}
                </a>
              ) : (
                <span
                  key={letter}
                  className="grid h-7 w-7 place-items-center text-slate-300 dark:text-slate-700"
                >
                  {letter}
                </span>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredTerms.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-white/10">
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
              Tidak ditemukan istilah yang cocok dengan pencarian Anda
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Coba gunakan kata kunci umum lain atau reset filter pilar.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
            >
              Reset Pencarian
            </button>
          </div>
        )}

        {/* A–Z Grouped Listings */}
        <div className="space-y-12">
          {groups.map((group) => (
            <section key={group.letter} id={`letter-${group.letter}`} className="scroll-mt-28">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-2 dark:border-white/10">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 font-display text-base font-bold text-white shadow-sm dark:bg-indigo-500">
                  {group.letter}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {group.terms.length} Istilah
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {group.terms.map((term) => (
                  <Link
                    key={term.slug}
                    href={`/glossary/${term.slug}`}
                    className="group flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm transition hover:border-indigo-500 hover:shadow-md dark:border-white/10 dark:bg-slate-900/60 dark:hover:border-indigo-400"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                          {term.term}
                        </h2>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                          {term.readTime}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                        {term.leadDefinition.replace(/\*\*/g, "")}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] dark:border-white/5">
                      <span className="text-slate-400">
                        {GLOSSARY_CATEGORIES.find((c) => c.id === term.categoryId)?.name}
                      </span>
                      <span className="font-semibold text-indigo-600 group-hover:underline dark:text-indigo-400">
                        Baca selengkapnya →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Bottom Conversion Band */}
        <div className="mt-16 rounded-3xl border border-indigo-200/90 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 p-8 text-white shadow-xl dark:border-white/10 sm:p-10">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-300">
              Solusi Teruji untuk Bisnis Anda
            </span>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              Bingung Mulai Otomasi dari Mana?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-indigo-200/90 sm:text-base">
              Anda tidak butuh sistem raksasa yang mahal. Mulai dari mengenali titik bocor dan macetnya operasional harian.
              Coba Mini Session diagnostik Pesat.AI selama 5 menit—gratis dan langsung dapat rangkuman rekomendasi tindakan nyata.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={openCoach}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 shadow-md transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                <span>Buktikan Sendiri dalam 5 Menit</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="https://wa.me/6281290401240"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 transition hover:text-white"
              >
                <span>Diskusi Solusi via WhatsApp</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Official Site Footer */}
      <Footer onStartWizard={openCoach} />
    </div>
  );
}
