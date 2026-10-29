"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Copy,
  Check
} from "lucide-react";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { useCoach } from "@/components/coach/CoachProvider";
import {
  GLOSSARY_CATEGORIES,
  getRelatedTerms,
  type GlossaryTerm
} from "@/lib/glossary-data";

function getContextualCta(term: GlossaryTerm) {
  if (term.slug.includes("bottleneck")) {
    return {
      tag: "Audit Titik Macet Keputusan",
      title: "Seberapa Parah Titik Macet di Bisnis Anda?",
      desc: "Ketahui persis di mana alur keputusan terhambat dan berapa jam kerja yang bisa dihemat lewat automasi alur kerja. Uji lewat Mini Session 5 menit."
    };
  }
  if (term.slug.includes("geo") || term.slug.includes("dra") || term.slug.includes("brand")) {
    return {
      tag: "Strategi AI Search & Reputasi Digital",
      title: "Ingin Brand Anda Direkomendasikan AI Search?",
      desc: "Cari tahu apakah bisnis Anda sudah memiliki Digital Reputation Asset untuk dikutip oleh ChatGPT dan Perplexity. Konsultasikan arah solusi bersama tim kami."
    };
  }
  if (term.slug.includes("roi") || term.slug.includes("cost") || term.slug.includes("token")) {
    return {
      tag: "Kalkulasi Balik Modal AI",
      title: "Hitung Potensi Hemat Biaya & ROI Operasional",
      desc: "Jangan investasikan software sebelum tahu angka balik modalnya. Mini Session Pesat.AI memetakan penghematan biaya riil untuk alur kerja bisnis Anda."
    };
  }
  if (term.slug.includes("agent") || term.slug.includes("workflow") || term.slug.includes("zero-touch")) {
    return {
      tag: "Otomasi Alur Kerja Teruji",
      title: "Siap Mengeliminasi Kerjaan Manual Berulang?",
      desc: "Mulai dari alur kerja paling menyita waktu: rekonsiliasi faktur, follow up WhatsApp, atau routing data. Dapatkan blueprint rekomendasi dalam 5 menit."
    };
  }
  if (term.slug.includes("forecast") || term.slug.includes("demand") || term.slug.includes("predict")) {
    return {
      tag: "Prediksi Kas & Stok Akurat",
      title: "Stop Tebak-Tebak Arus Kas & Kebutuhan Stok",
      desc: "Lihat tren sebelum krisis likuiditas datang. Diagnosis kesiapan data operasional Anda dan temukan sistem prediksi terbaik lewat Mini Session gratis."
    };
  }
  return {
    tag: "Pesat.AI Menyelesaikan Ini",
    title: `Ingin Menerapkan Solusi ${term.shortName} di Bisnis Anda?`,
    desc: "Ketahui di mana biaya operasional bocor dan bagaimana AI praktis memangkas beban kerja tim hingga 70%. Sesi interaktif AI Business Coach 5 menit, tanpa kartu kredit."
  };
}

export function GlossaryTermView({ term }: { term: GlossaryTerm }) {
  const { openCoach } = useCoach();
  const category = GLOSSARY_CATEGORIES.find((c) => c.id === term.categoryId);
  const relatedTerms = getRelatedTerms(term.relatedSlugs);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const cta = getContextualCta(term);

  useEffect(() => {
    const handleScroll = () => {
      const top = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? Math.min(1, top / max) : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopyDefinition = async () => {
    const plainText = term.leadDefinition.replace(/\*\*/g, "");
    try {
      await navigator.clipboard.writeText(`${term.shortName} — ${plainText} (Sumber: https://pesat.ai/glossary/${term.slug})`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-[#070710] dark:text-slate-100">
      {/* Official Sticky Site Header */}
      <Header onStartWizard={openCoach} />

      {/* Reading Progress Indicator */}
      <div className="fixed inset-x-0 top-[58px] z-40 h-0.5 bg-transparent pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-600 transition-all duration-150"
          style={{ width: `${Math.round(scrollProgress * 100)}%` }}
        />
      </div>

      {/* Main Content Article */}
      <main className="mx-auto max-w-3xl px-4 pt-24 pb-14 sm:px-6 sm:pt-28 sm:pb-20">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/glossary" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Glosarium
          </Link>
          {category && (
            <>
              <span>/</span>
              <span className="text-slate-600 dark:text-slate-300">{category.name}</span>
            </>
          )}
          <span>/</span>
          <span className="font-semibold text-slate-900 dark:text-white">{term.shortName}</span>
        </nav>

        {/* H1 Headline */}
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-[2.6rem] md:leading-tight">
          Apa Itu {term.shortName}?
        </h1>

        {/* Byline Trust Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-4 border-b border-slate-200 pb-5 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
              P
            </span>
            <span>Ditinjau oleh Tim Solusi Pesat.AI</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>Diperbarui {term.dateModified}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{term.readTime} waktu baca</span>
          </div>
        </div>

        {/* Lead Definition (Prominent Answer-First paragraph with Quick Copy) */}
        <div className="relative mt-6 rounded-2xl border-l-4 border-indigo-600 bg-white p-5 shadow-sm dark:border-indigo-500 dark:bg-slate-900/80 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <p
              className="text-base font-medium leading-relaxed text-slate-800 dark:text-slate-200 sm:text-lg"
              dangerouslySetInnerHTML={{
                __html: term.leadDefinition.replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-600 dark:text-indigo-400 font-bold">$1</strong>')
              }}
            />
            <button
              onClick={handleCopyDefinition}
              title="Salin definisi ke clipboard"
              aria-label="Salin definisi"
              className="inline-flex shrink-0 items-center self-start gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-indigo-300 hover:bg-white hover:text-indigo-600 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-500/50 dark:hover:text-white"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Salin Ringkasan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Key Takeaways Box */}
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-500/20 dark:bg-emerald-950/20 sm:p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Poin Kunci (Key Takeaways)</span>
          </div>
          <ul className="mt-3.5 space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {term.keyTakeaways.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="mt-0.5 font-bold text-emerald-600 dark:text-emerald-400">→</span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Deep Dive Prose Sections */}
        <article className="mt-10 space-y-10 text-slate-800 dark:text-slate-200">
          {/* Section: Cara Kerja */}
          <section>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Cara Kerja {term.shortName}
            </h2>
            <div className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300 sm:text-base space-y-4">
              <p>{term.howItWorks}</p>
            </div>
          </section>

          {/* Section: Dampak Bisnis & P&L */}
          <section>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Dampak Nyata pada P&amp;L dan Operasional Bisnis
            </h2>
            <div className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300 sm:text-base space-y-4">
              <p>{term.businessImpact}</p>
            </div>
          </section>

          {/* Section: Contoh Kasus Nyata di Indonesia */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/60 sm:p-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <BookOpen className="h-4 w-4" />
              <span>Contoh Penerapan Nyata di Lapangan</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300 sm:text-base">
              {term.realWorldExample}
            </p>
          </section>

          {/* Callout Box: What People Get Wrong */}
          <section className="rounded-2xl border border-purple-200 bg-purple-50/70 p-5 dark:border-purple-500/20 dark:bg-purple-950/20 sm:p-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-800 dark:text-purple-400">
              <AlertTriangle className="h-4 w-4" />
              <span>Kekeliruan Umum di Kalangan Pemilik Bisnis</span>
            </div>
            <p className="mt-2.5 text-sm italic leading-relaxed text-purple-950 dark:text-purple-200 sm:text-base">
              &ldquo;{term.whatPeopleGetWrong}&rdquo;
            </p>
          </section>

          {/* Optional Comparison Table */}
          {term.comparisonTable && (
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
              <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 dark:border-white/10 dark:bg-slate-800/50">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {term.comparisonTable.title}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 dark:border-white/10 dark:text-slate-400">
                      <th className="py-3 px-4 font-semibold">Parameter</th>
                      <th className="py-3 px-4 font-semibold text-indigo-600 dark:text-indigo-400">
                        {term.comparisonTable.col1Header}
                      </th>
                      <th className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        {term.comparisonTable.col2Header}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {term.comparisonTable.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                          {row.feature}
                        </td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                          {row.col1}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          {row.col2}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* FAQ Accordion Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                Pertanyaan yang Sering Diajukan (FAQ)
              </h2>
            </div>
            <div className="space-y-3 pt-2">
              {term.faqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition open:border-indigo-500/40 dark:border-white/10 dark:bg-slate-900/80"
                >
                  <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900 dark:text-white text-sm sm:text-base list-none">
                    <span>{faq.question}</span>
                    <span className="ml-2 text-indigo-600 transition group-open:rotate-180 dark:text-indigo-400">
                      ↓
                    </span>
                  </summary>
                  <div className="mt-3 border-t border-slate-100 pt-3 text-xs sm:text-sm leading-relaxed text-slate-600 dark:border-white/5 dark:text-slate-300">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Section: The Bottom Line */}
          <section className="rounded-2xl border border-slate-200/90 bg-slate-100/60 p-5 dark:border-white/10 dark:bg-white/[0.03] sm:p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Kesimpulan Praktis
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-800 dark:text-slate-200 sm:text-base">
              Memahami {term.shortName} bukan tentang mempelajari sintaks kode rumit, melainkan tentang
              mengenali di mana titik gesekan operasional perusahaan Anda bisa dialihkan ke sistem cerdas.
              Langkah awal terbaik adalah mengidentifikasi satu alur kerja yang paling banyak menyita jam kerja tim Anda setiap minggunya.
            </p>
          </section>
        </article>

        {/* Sources & Citations */}
        {term.sources.length > 0 && (
          <div className="mt-12 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
            <h4 className="font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Sumber &amp; Referensi Terpercaya
            </h4>
            <ol className="mt-3 space-y-2">
              {term.sources.map((s, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-slate-400">{idx + 1}.</span>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    <span>{s.title}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <span className="text-slate-400">({s.publisher})</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Product / CTA Conversion Box (Contextual Mini Session Hook) */}
        <div className="mt-12 rounded-2xl border border-amber-300/80 bg-gradient-to-br from-amber-50 to-orange-50/30 p-6 shadow-sm dark:border-amber-500/30 dark:from-amber-950/30 dark:to-transparent sm:p-8">
          <span className="inline-block rounded-full bg-amber-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
            {cta.tag}
          </span>
          <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
            {cta.title}
          </h3>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {cta.desc}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={openCoach}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow transition hover:bg-indigo-700"
            >
              <span>Uji Mini Session Sekarang</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="https://wa.me/6281290401240"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-700 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-white"
            >
              <span>Diskusi dengan Tim via WhatsApp</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Related Terms Internal Mesh Grid */}
        {relatedTerms.length > 0 && (
          <div className="mt-14 border-t border-slate-200 pt-8 dark:border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Istilah Terkait (Internal Knowledge Mesh)
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {relatedTerms.map((rt) => (
                <Link
                  key={rt.slug}
                  href={`/glossary/${rt.slug}`}
                  className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-500 hover:shadow-md dark:border-white/10 dark:bg-slate-900/60 dark:hover:border-indigo-400"
                >
                  <div>
                    <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                      {rt.term}
                    </span>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {rt.leadDefinition.replace(/\*\*/g, "")}
                    </p>
                  </div>
                  <span className="mt-3 text-[11px] font-semibold text-indigo-600 group-hover:underline dark:text-indigo-400">
                    Pelajari istilah ini →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Official Site Footer */}
      <Footer onStartWizard={openCoach} />
    </div>
  );
}
