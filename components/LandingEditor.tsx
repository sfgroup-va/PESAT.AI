"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { LANDING_SECTIONS, LANDING_TEXT_SLOTS, sanitizeLandingConfig, type LandingConfig, type LandingOverrides, type LandingSectionKey } from "@/lib/landing";

const PW_KEY = "pesat-admin-pw";

export function LandingEditor({ slug }: { slug: string }) {
  const [password, setPassword] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [config, setConfig] = useState<LandingConfig | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Read persisted admin password on mount (client-only; must run in an effect for SSR safety).
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setPassword(sessionStorage.getItem(PW_KEY));
  }, []);

  const load = useCallback(
    async (pw: string) => {
      const response = await fetch(`/api/admin/landing/${slug}`, { headers: { "x-admin-password": pw } });
      if (!response.ok) {
        setError(response.status === 401 ? "Sesi admin habis. Kembali ke daftar dan masukkan password lagi." : "Halaman tidak ditemukan atau DB belum siap.");
        return;
      }
      const data = (await response.json()) as { title: string; config: LandingConfig };
      setError("");
      setTitle(data.title);
      setConfig(sanitizeLandingConfig(data.config));
    },
    [slug]
  );

  useEffect(() => {
    // load only setState after an awaited fetch — intended data-load pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (password) void load(password);
  }, [password, load]);

  function toggleSection(key: LandingSectionKey) {
    setConfig((current) => (current ? { ...current, sections: { ...current.sections, [key]: !current.sections[key] } } : current));
    setSaved(false);
  }

  function setOverride(key: keyof LandingOverrides, value: string) {
    setConfig((current) => (current ? { ...current, overrides: { ...current.overrides, [key]: value } } : current));
    setSaved(false);
  }

  function setPixel(key: "googleId" | "metaId", value: string) {
    setConfig((current) => (current ? { ...current, pixels: { ...current.pixels, [key]: value } } : current));
    setSaved(false);
  }

  async function save() {
    if (!config || !password) return;
    setSaving(true);
    setError("");
    setSaved(false);
    const response = await fetch(`/api/admin/landing/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ title, config })
    });
    setSaving(false);
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error || "Gagal menyimpan.");
      return;
    }
    const data = (await response.json()) as { config: LandingConfig };
    setConfig(sanitizeLandingConfig(data.config));
    setSaved(true);
  }

  if (password === null) {
    return (
      <main className="min-h-screen bg-white px-5 py-10 text-neutral-950">
        <section className="mx-auto max-w-xl">
          <p className="text-lg font-semibold">Sesi admin tidak ditemukan.</p>
          <Link href="/admin/landing" className="mt-4 inline-flex rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white">← Kembali & masukkan password</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-5 py-8 text-neutral-950">
      <section className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Edit landing</p>
            <h1 className="font-mono text-3xl font-semibold">/{slug}</h1>
          </div>
          <div className="flex gap-2">
            <a href={`/${slug}`} target="_blank" rel="noreferrer" className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold">👁 Preview</a>
            <Link href="/admin/landing" className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold">← Daftar</Link>
          </div>
        </div>

        {error ? <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}

        {config ? (
          <div className="grid gap-6">
            <div className="rounded-[1.35rem] border border-neutral-200 bg-white p-6">
              <label className="block text-sm font-semibold text-neutral-500">Judul halaman (untuk tab browser & SEO)</label>
              <input value={title} onChange={(event) => { setTitle(event.target.value); setSaved(false); }} className="mt-2 min-h-12 w-full rounded-2xl border border-neutral-200 px-4 outline-none focus:border-neutral-900" placeholder="Judul halaman" />
            </div>

            <div className="rounded-[1.35rem] border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold">Section yang ditampilkan</h2>
              <p className="mt-1 text-sm text-neutral-500">Matikan section yang tidak diperlukan untuk halaman ini.</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {LANDING_SECTIONS.map((section) => (
                  <label key={section.key} className="flex items-center gap-3 rounded-2xl border border-neutral-200 px-4 py-3 text-sm font-semibold">
                    <input type="checkbox" checked={config.sections[section.key]} onChange={() => toggleSection(section.key)} className="h-4 w-4" />
                    {section.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold">Teks hero</h2>
              <p className="mt-1 text-sm text-neutral-500">Kosongkan untuk memakai teks default dari master.</p>
              <div className="mt-4 grid gap-4">
                {LANDING_TEXT_SLOTS.map((slot) => (
                  <label key={slot.key} className="block">
                    <span className="mb-1 block text-sm font-semibold text-neutral-500">{slot.label}</span>
                    <input value={config.overrides[slot.key] || ""} onChange={(event) => setOverride(slot.key, event.target.value)} className="min-h-12 w-full rounded-2xl border border-neutral-200 px-4 outline-none focus:border-neutral-900" placeholder={slot.placeholder} />
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold">Tracking pixel</h2>
              <p className="mt-1 text-sm text-neutral-500">Hanya ID dengan format valid yang disimpan (anti-injeksi).</p>
              <div className="mt-4 grid gap-4">
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-neutral-500">Google (GA4 / Ads / GTM)</span>
                  <input value={config.pixels.googleId || ""} onChange={(event) => setPixel("googleId", event.target.value)} className="min-h-12 w-full rounded-2xl border border-neutral-200 px-4 font-mono text-sm outline-none focus:border-neutral-900" placeholder="G-XXXXXXXXXX / AW-XXXXXXXXX / GTM-XXXXXXX" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-neutral-500">Meta (Facebook) Pixel ID</span>
                  <input value={config.pixels.metaId || ""} onChange={(event) => setPixel("metaId", event.target.value)} className="min-h-12 w-full rounded-2xl border border-neutral-200 px-4 font-mono text-sm outline-none focus:border-neutral-900" placeholder="1234567890123456" />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={save} disabled={saving} className="min-h-12 rounded-full bg-neutral-950 px-8 font-semibold text-white disabled:bg-neutral-300">{saving ? "Menyimpan..." : "Simpan perubahan"}</button>
              {saved ? <span className="text-sm font-semibold text-green-600">✓ Tersimpan</span> : null}
            </div>
          </div>
        ) : (
          !error ? <p className="text-sm text-neutral-500">Memuat...</p> : null
        )}
      </section>
    </main>
  );
}
