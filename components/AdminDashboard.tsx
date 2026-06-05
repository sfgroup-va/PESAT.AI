"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Summary = {
  sessions: { total: number; completed: number; discoveryRequested: number };
  discoveryRequests: number;
  rates: { completionRate: number; discoveryRate: number };
  clicks: { total: number; byCta: Array<{ cta: string; count: number }> };
  funnel: Array<{ screen: string; count: number }>;
  dropOff: Array<{ screen: string; count: number; previous: number; lost: number; conversionRate: number; dropOffRate: number }>;
};

type Health = {
  ready: boolean;
  blockers: string[];
};

export function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/health")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data) setHealth(data as Health);
      })
      .catch(() => undefined);
  }, []);

  async function loadSummary(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const healthResponse = await fetch("/api/health");
    if (healthResponse.ok) {
      setHealth((await healthResponse.json()) as Health);
    }
    const response = await fetch("/api/admin/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    if (!response.ok) {
      setError("Password salah, Supabase belum siap, atau data belum tersedia.");
      return;
    }
    setSummary((await response.json()) as Summary);
  }

  return (
    <main className="min-h-screen bg-white px-5 py-8 text-neutral-950">
      <section className="mx-auto max-w-5xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Admin</p>
        <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">Pesat.AI funnel</h1>
        <form onSubmit={loadSummary} className="mt-8 flex max-w-xl gap-3">
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="min-h-12 flex-1 rounded-full border border-neutral-200 px-5 outline-none focus:border-neutral-900" placeholder="Admin password" />
          <button className="min-h-12 rounded-full bg-neutral-950 px-6 font-semibold text-white">Buka</button>
        </form>
        {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}
        {health ? (
          <div className="mt-5 rounded-[1.35rem] border border-amber-200 bg-amber-50 p-5 text-sm font-semibold leading-6 text-amber-900">
            {health.ready ? (
              <p>Production ready. Semua env wajib sudah terpasang.</p>
            ) : (
              <>
                <p className="mb-2">Production belum lengkap:</p>
                <ul className="list-disc space-y-1 pl-5">
                  {health.blockers.map((blocker) => (
                    <li key={blocker}>{blocker}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ) : null}
        {summary ? (
          <div className="mt-8 grid gap-5">
            <div className="grid gap-3 sm:grid-cols-4">
              <Metric label="Sessions" value={summary.sessions.total} />
              <Metric label="Completed" value={summary.sessions.completed} />
              <Metric label="Discovery Flag" value={summary.sessions.discoveryRequested} />
              <Metric label="Discovery Calls" value={summary.discoveryRequests} />
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              <Metric label="Completion Rate" value={`${summary.rates.completionRate}%`} />
              <Metric label="Discovery Rate" value={`${summary.rates.discoveryRate}%`} />
              <Metric label="Largest Drop-off" value={largestDropOff(summary.dropOff)} />
              <Metric label="Clicks" value={summary.clicks.total} />
            </div>
            <div className="h-80 rounded-[1.35rem] border border-neutral-200 p-5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.funnel}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="screen" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#111111" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="overflow-hidden rounded-[1.35rem] border border-neutral-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 text-neutral-500">
                  <tr>
                    <th className="px-4 py-3">Screen</th>
                    <th className="px-4 py-3">Views</th>
                    <th className="px-4 py-3">Conversion</th>
                    <th className="px-4 py-3">Drop-off</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.dropOff.map((row) => (
                    <tr key={row.screen} className="border-t border-neutral-100">
                      <td className="px-4 py-3 font-semibold">{row.screen}</td>
                      <td className="px-4 py-3">{row.count}</td>
                      <td className="px-4 py-3">{row.conversionRate}%</td>
                      <td className="px-4 py-3">{row.dropOffRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="overflow-hidden rounded-[1.35rem] border border-neutral-200">
              <div className="border-b border-neutral-100 bg-neutral-50 px-4 py-3">
                <h2 className="text-sm font-semibold text-neutral-500">Click Events</h2>
              </div>
              {summary.clicks.byCta.length ? (
                <table className="w-full text-left text-sm">
                  <thead className="bg-white text-neutral-500">
                    <tr>
                      <th className="px-4 py-3">CTA</th>
                      <th className="px-4 py-3">Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.clicks.byCta.map((row) => (
                      <tr key={row.cta} className="border-t border-neutral-100">
                        <td className="px-4 py-3 font-semibold">{row.cta}</td>
                        <td className="px-4 py-3">{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="px-4 py-5 text-sm font-semibold text-neutral-500">Belum ada click event.</p>
              )}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-[1.35rem] border border-neutral-200 p-5">
      <p className="text-sm font-semibold text-neutral-500">{label}</p>
      <p className="mt-2 text-4xl font-semibold">{value}</p>
    </div>
  );
}

function largestDropOff(rows: Summary["dropOff"]) {
  const largest = rows.reduce((current, row) => (row.lost > current.lost ? row : current), rows[0] || { screen: "-", lost: 0, dropOffRate: 0 });
  return largest.screen === "-" ? "-" : `${largest.screen} (${largest.dropOffRate}%)`;
}
