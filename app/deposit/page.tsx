import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadDepositConfig } from "@/lib/deposit-server";
import { formatDepositAmount, toPublicDepositConfig } from "@/lib/deposit";
import { PayPalDepositButtons } from "@/components/deposit/PayPalDepositButtons";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const result = await loadDepositConfig();
  if (!result.ok) {
    return { title: "Deposit | Pesat.AI" };
  }
  return {
    title: result.data.title,
    robots: { index: false, follow: true }
  };
}

export default async function DepositPage() {
  const result = await loadDepositConfig();
  if (!result.ok) {
    notFound();
  }

  const config = toPublicDepositConfig(result.data);
  const clientId = config.paypalClientId || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

  return (
    <main className="min-h-screen bg-neutral-50 px-5 py-12 text-neutral-950">
      <section className="mx-auto max-w-xl text-center">
        <h1 className="text-3xl font-semibold leading-tight">{config.title}</h1>
        <p className="mt-3 text-neutral-600">{config.subtitle}</p>

        <div className="mt-8 rounded-[1.35rem] border border-neutral-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">Jumlah deposit</p>
          <p className="mt-2 text-5xl font-semibold text-emerald-600">{formatDepositAmount(config.amount)}</p>

          <div className="mt-8">
            <PayPalDepositButtons clientId={clientId} />
          </div>
        </div>
      </section>
    </main>
  );
}
