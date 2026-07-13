"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { formatDepositAmount, sanitizeDepositPage, type DepositPageConfig, type DepositTransaction } from "@/lib/deposit";

const PW_KEY = "pesat-admin-pw";

function centsToDollars(cents: number): string {
  return (cents / 100).toFixed(2);
}

function dollarsToCents(value: string): number | null {
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed) || parsed <= 0) return null;
  return Math.round(parsed * 100);
}

export function DepositEditor() {
  const [password, setPassword] = useState<string | null>(null);
  const [config, setConfig] = useState<DepositPageConfig | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [transactions, setTransactions] = useState<DepositTransaction[]>([]);
  const [showTransactions, setShowTransactions] = useState(false);

  // Form mirrors config while editing.
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [paypalClientId, setPaypalClientId] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    // Read persisted admin password on mount (client-only; must run in an effect for SSR safety).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPassword(sessionStorage.getItem(PW_KEY));
  }, []);

  const load = useCallback(async (pw: string) => {
    const response = await fetch("/api/admin/deposit", { headers: { "x-admin-password": pw } });
    if (!response.ok) {
      setError(response.status === 401 ? "Sesi admin habis. Kembali ke admin dan masukkan password lagi." : "Gagal memuat konfigurasi deposit.");
      return;
    }
    const data = (await response.json()) as unknown;
    const cfg = sanitizeDepositPage(data);
    setConfig(cfg);
    setTitle(cfg.title);
    setSubtitle(cfg.subtitle);
    setAmount(centsToDollars(cfg.amount));
    setPaypalEmail(cfg.paypalEmail);
    setPaypalClientId(cfg.paypalClientId);
    setIsPublished(cfg.isPublished);
    setError("");
  }, []);

  const loadTransactions = useCallback(async (pw: string) => {
    const response = await fetch("/api/admin/deposit/transactions", { headers: { "x-admin-password": pw } });
    if (!response.ok) return;
    const data = (await response.json()) as { transactions: DepositTransaction[] };
    setTransactions(data.transactions);
  }, []);

  useEffect(() => {
    // loadPages only setState after an awaited fetch — intended data-load-on-auth pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (password) void load(password);
  }, [password, load]);

  async function save() {
    if (!password) return;
    const amountCents = dollarsToCents(amount);
    if (amountCents === null) {
      setError("Jumlah deposit tidak valid.");
      return;
    }
    setSaving(true);
    setError("");
    setSaved(false);
    const response = await fetch("/api/admin/deposit", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({
        title,
        subtitle,
        amount: amountCents,
        paypalEmail,
        paypalClientId,
        isPublished
      })
    });
    setSaving(false);
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error || "Gagal menyimpan.");
      return;
    }
    const data = (await response.json()) as unknown;
    const cfg = sanitizeDepositPage(data);
    setConfig(cfg);
    setTitle(cfg.title);
    setSubtitle(cfg.subtitle);
    setAmount(centsToDollars(cfg.amount));
    setPaypalEmail(cfg.paypalEmail);
    setPaypalClientId(cfg.paypalClientId);
    setIsPublished(cfg.isPublished);
    setSaved(true);
  }

  async function togglePublish() {
    if (!password) return;
    setPublishing(true);
    setError("");
    const response = await fetch("/api/admin/deposit/publish", {
      method: "POST",
      headers: { "x-admin-password": password }
    });
    setPublishing(false);
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error || "Gagal mengubah status publikasi.");
      return;
    }
    const data = (await response.json()) as unknown;
    const cfg = sanitizeDepositPage(data);
    setConfig(cfg);
    setIsPublished(cfg.isPublished);
    setSaved(false);
  }

  if (password === null) {
    return (
      <main className="min-h-screen bg-white px-5 py-10 text-neutral-950">
        <section className="mx-auto max-w-xl">
          <p className="text-lg font-semibold">Sesi admin tidak ditemukan.</p>
          <Link href="/admin" className="mt-4 inline-flex rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white">
            ← Kembali & masukkan password
          </Link>
        </section>
      </main>
    );
  }

  const livePreviewUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/deposit`;

  return (
    <main className="min-h-screen bg-neutral-50 px-5 py-8 text-neutral-950">
      <section className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Admin</p>
            <h1 className="text-3xl font-semibold">Deposit Page</h1>
          </div>
          <div className="flex gap-2">
            <a href="/deposit" target="_blank" rel="noreferrer" className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold">
              👁 Preview
            </a>
            <Link href="/admin" className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold">
              ← Dashboard
            </Link>
          </div>
        </div>

        {error ? <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}

        {config ? (
          <div className="grid gap-6">
            <div className="rounded-[1.35rem] border border-neutral-200 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Status Publikasi</h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    Saat ini: <span className={config.isPublished ? "text-emerald-600" : "text-amber-600"}>{config.isPublished ? "Published" : "Unpublished"}</span>
                  </p>
                </div>
                <button onClick={togglePublish} disabled={publishing} className="min-h-11 rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white disabled:bg-neutral-300">
                  {publishing ? "Memproses..." : config.isPublished ? "Unpublish" : "Publish"}
                </button>
              </div>
              <p className="mt-3 text-xs leading-5 text-neutral-500">
                Tombol PayPal hanya muncul saat status <b>Published</b>. Jika Unpublished, pengunjung akan melihat 404.
              </p>
            </div>

            <div className="rounded-[1.35rem] border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold">Konten & Pembayaran</h2>
              <div className="mt-4 grid gap-4">
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-neutral-500">Judul</span>
                  <input value={title} onChange={(event) => { setTitle(event.target.value); setSaved(false); }} className="min-h-12 w-full rounded-2xl border border-neutral-200 px-4 outline-none focus:border-neutral-900" placeholder="Deposit untuk Memulai" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-neutral-500">Subjudul</span>
                  <input value={subtitle} onChange={(event) => { setSubtitle(event.target.value); setSaved(false); }} className="min-h-12 w-full rounded-2xl border border-neutral-200 px-4 outline-none focus:border-neutral-900" placeholder="Lengkapi deposit..." />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-neutral-500">Jumlah (USD)</span>
                  <input type="number" step="0.01" min="0.01" value={amount} onChange={(event) => { setAmount(event.target.value); setSaved(false); }} className="min-h-12 w-full rounded-2xl border border-neutral-200 px-4 outline-none focus:border-neutral-900" placeholder="500.00" />
                  <p className="mt-1 text-xs text-neutral-500">Tersimpan sebagai {formatDepositAmount((config.amount))}</p>
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-neutral-500">PayPal Email (payee)</span>
                  <input type="email" value={paypalEmail} onChange={(event) => { setPaypalEmail(event.target.value); setSaved(false); }} className="min-h-12 w-full rounded-2xl border border-neutral-200 px-4 outline-none focus:border-neutral-900" placeholder="seller@example.com" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-neutral-500">PayPal Client ID</span>
                  <input value={paypalClientId} onChange={(event) => { setPaypalClientId(event.target.value); setSaved(false); }} className="min-h-12 w-full rounded-2xl border border-neutral-200 px-4 font-mono text-sm outline-none focus:border-neutral-900" placeholder="Abc..." />
                  <p className="mt-1 text-xs text-neutral-500">Kosongkan untuk memakai fallback dari NEXT_PUBLIC_PAYPAL_CLIENT_ID.</p>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={save} disabled={saving} className="min-h-12 rounded-full bg-neutral-950 px-8 font-semibold text-white disabled:bg-neutral-300">
                {saving ? "Menyimpan..." : "Simpan perubahan"}
              </button>
              {saved ? <span className="text-sm font-semibold text-green-600">✓ Tersimpan</span> : null}
            </div>

            <div className="rounded-[1.35rem] border border-neutral-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Riwayat Transaksi</h2>
                <button
                  onClick={() => {
                    setShowTransactions((show) => !show);
                    if (!showTransactions && password) void loadTransactions(password);
                  }}
                  className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold"
                >
                  {showTransactions ? "Sembunyikan" : "Tampilkan"}
                </button>
              </div>
              {showTransactions ? (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200 text-left text-neutral-500">
                        <th className="pb-2 font-semibold">Order ID</th>
                        <th className="pb-2 font-semibold">Jumlah</th>
                        <th className="pb-2 font-semibold">Status</th>
                        <th className="pb-2 font-semibold">Waktu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length === 0 ? (
                        <tr>
                          <td className="py-4 text-neutral-500" colSpan={4}>Belum ada transaksi.</td>
                        </tr>
                      ) : (
                        transactions.map((tx) => (
                          <tr key={tx.paypalOrderId || tx.id} className="border-b border-neutral-100">
                            <td className="py-2 font-mono">{tx.paypalOrderId || "-"}</td>
                            <td className="py-2">{formatDepositAmount(tx.amount)}</td>
                            <td className="py-2">
                              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${tx.status === "CAPTURED" ? "bg-emerald-100 text-emerald-700" : tx.status === "FAILED" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                                {tx.status}
                              </span>
                            </td>
                            <td className="py-2 text-neutral-500">{tx.createdAt ? new Date(tx.createdAt).toLocaleString("id-ID") : "-"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>

            <p className="text-xs text-neutral-500">
              URL publik: <a href={livePreviewUrl} target="_blank" rel="noreferrer" className="text-emerald-600 underline">{livePreviewUrl}</a>
            </p>
          </div>
        ) : (
          !error ? <p className="text-sm text-neutral-500">Memuat...</p> : null
        )}
      </section>
    </main>
  );
}
