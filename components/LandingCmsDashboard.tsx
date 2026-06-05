"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { DEFAULT_LANDING_CONFIG, isValidSlug, slugify, type LandingConfig, type LandingPage } from "@/lib/landing";

const PW_KEY = "pesat-admin-pw";

export function LandingCmsDashboard() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [error, setError] = useState("");
  const [dbMissing, setDbMissing] = useState(false);
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "";

  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [sourceConfig, setSourceConfig] = useState<LandingConfig | null>(null);
  const [createError, setCreateError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Restore persisted admin password on mount (client-only; must run in an effect for SSR safety).
    /* eslint-disable react-hooks/set-state-in-effect */
    const saved = sessionStorage.getItem(PW_KEY);
    if (saved) {
      setPassword(saved);
      setAuthed(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const loadPages = useCallback(async (pw: string) => {
    const response = await fetch("/api/admin/landing", { headers: { "x-admin-password": pw } });
    if (response.status === 401) {
      setError("Password salah.");
      setAuthed(false);
      sessionStorage.removeItem(PW_KEY);
      return;
    }
    if (response.status === 503) {
      setDbMissing(true);
      setPages([]);
      return;
    }
    if (!response.ok) {
      setError("Gagal memuat halaman.");
      return;
    }
    const data = (await response.json()) as { pages: LandingPage[] };
    setError("");
    setDbMissing(false);
    setPages(data.pages || []);
  }, []);

  useEffect(() => {
    // loadPages only setState after an awaited fetch — intended data-load-on-auth pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (authed && password) void loadPages(password);
  }, [authed, password, loadPages]);

  function authenticate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sessionStorage.setItem(PW_KEY, password);
    setAuthed(true);
  }

  function openCreateFromMaster() {
    setSourceConfig(null);
    setNewTitle("");
    setNewSlug("");
    setCreateError("");
    setShowCreate(true);
  }

  function openDuplicate(page: LandingPage) {
    setSourceConfig(page.config);
    setNewTitle(`${page.title} (copy)`);
    setNewSlug(slugify(`${page.slug}-copy`));
    setCreateError("");
    setShowCreate(true);
  }

  async function submitCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError("");
    const slug = slugify(newSlug || newTitle);
    if (!isValidSlug(slug)) {
      setCreateError("Slug tidak valid. Gunakan huruf kecil, angka, dan tanda hubung (tidak boleh: admin, api, services, result).");
      return;
    }
    setBusy(true);
    const response = await fetch("/api/admin/landing", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ slug, title: newTitle || slug, config: sourceConfig || DEFAULT_LANDING_CONFIG })
    });
    setBusy(false);
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setCreateError(data.error || "Gagal membuat halaman.");
      return;
    }
    setShowCreate(false);
    setNewTitle("");
    setNewSlug("");
    setSourceConfig(null);
    await loadPages(password);
  }

  async function deletePage(slug: string) {
    if (!window.confirm(`Hapus halaman /${slug}? Tindakan ini tidak bisa dibatalkan.`)) return;
    setBusy(true);
    await fetch(`/api/admin/landing/${slug}`, { method: "DELETE", headers: { "x-admin-password": password } });
    setBusy(false);
    await loadPages(password);
  }

  if (!authed) {
    return (
      <main className="min-h-screen bg-white px-5 py-8 text-neutral-950">
        <section className="mx-auto max-w-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">CMS</p>
          <h1 className="text-4xl font-semibold leading-tight">Landing Pages</h1>
          <form onSubmit={authenticate} className="mt-8 flex gap-3">
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="min-h-12 flex-1 rounded-full border border-neutral-200 px-5 outline-none focus:border-neutral-900" placeholder="Admin password" />
            <button className="min-h-12 rounded-full bg-neutral-950 px-6 font-semibold text-white">Buka</button>
          </form>
          {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-5 py-8 text-neutral-950">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-4xl font-semibold leading-tight">Landing Pages</h1>
          <Link href="/admin" className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold">← Admin</Link>
        </div>

        {dbMissing ? (
          <div className="mb-6 rounded-[1.35rem] border border-amber-200 bg-amber-50 p-5 text-sm font-semibold leading-6 text-amber-900">
            Database belum tersambung (DATABASE_URL belum diset), jadi halaman belum bisa disimpan. CMS akan aktif penuh setelah Supabase/DB terhubung.
          </div>
        ) : null}
        {error ? <p className="mb-4 text-sm font-semibold text-red-600">{error}</p> : null}

        <button onClick={openCreateFromMaster} className="mb-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 px-6 font-semibold text-white shadow-soft">
          + Buat Halaman Baru (Duplicate dari Master)
        </button>

        {showCreate ? (
          <form onSubmit={submitCreate} className="mb-8 grid max-w-2xl gap-3 rounded-[1.35rem] border border-neutral-200 bg-white p-6">
            <p className="text-sm font-semibold text-neutral-500">{sourceConfig ? "Duplicate halaman" : "Halaman baru dari master"}</p>
            <input value={newTitle} onChange={(event) => setNewTitle(event.target.value)} className="min-h-12 rounded-2xl border border-neutral-200 px-4 outline-none focus:border-neutral-900" placeholder="Judul halaman (mis. Promo Ramadan)" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-400">{origin}/</span>
              <input value={newSlug} onChange={(event) => setNewSlug(event.target.value)} className="min-h-12 flex-1 rounded-2xl border border-neutral-200 px-4 font-mono text-sm outline-none focus:border-neutral-900" placeholder="slug-halaman" />
            </div>
            {createError ? <p className="text-sm font-semibold text-red-600">{createError}</p> : null}
            <div className="flex gap-3">
              <button disabled={busy} className="min-h-11 rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white disabled:bg-neutral-300">{busy ? "Menyimpan..." : "Buat halaman"}</button>
              <button type="button" onClick={() => setShowCreate(false)} className="min-h-11 rounded-full border border-neutral-200 px-6 text-sm font-semibold">Batal</button>
            </div>
          </form>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Master (homepage) — read-only */}
          <article className="rounded-[1.35rem] border border-amber-200 bg-amber-50/60 p-6">
            <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-800">🔒 Master · Read-only</span>
            <p className="mt-3 font-mono text-xl font-semibold">/</p>
            <p className="mt-1 text-sm text-neutral-500">URL: <span className="text-green-700">{origin || "homepage"}</span></p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href="/" target="_blank" rel="noreferrer" className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold">👁 Preview</a>
              <button onClick={openCreateFromMaster} className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold">📄 Duplicate untuk Edit</button>
            </div>
            <p className="mt-4 rounded-2xl bg-amber-100/70 p-3 text-xs leading-5 text-amber-900">Homepage tidak bisa di-edit langsung. Klik <b>Duplicate</b> untuk buat versi baru yang bisa di-edit.</p>
          </article>

          {pages.map((page) => (
            <article key={page.slug} className="rounded-[1.35rem] border border-neutral-200 bg-white p-6">
              <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-700">Custom</span>
              <p className="mt-3 font-mono text-xl font-semibold">/{page.slug}</p>
              <p className="mt-1 truncate text-sm text-neutral-500">{page.title}</p>
              <p className="mt-1 text-sm text-neutral-500">URL: <span className="text-green-700">{origin}/{page.slug}</span></p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/admin/landing/${page.slug}`} className="rounded-full bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2 text-sm font-semibold text-white">✏ Edit</Link>
                <a href={`/${page.slug}`} target="_blank" rel="noreferrer" className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold">👁 Preview</a>
                <button onClick={() => openDuplicate(page)} className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold">📄 Duplicate</button>
              </div>
              <button onClick={() => deletePage(page.slug)} disabled={busy} className="mt-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 disabled:opacity-50">🗑 Delete</button>
            </article>
          ))}
        </div>

        {!dbMissing && pages.length === 0 ? (
          <p className="mt-6 text-sm text-neutral-500">Belum ada halaman custom. Klik tombol di atas untuk membuat dari master.</p>
        ) : null}
      </section>
    </main>
  );
}
