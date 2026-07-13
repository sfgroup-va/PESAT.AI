import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Deposit Berhasil | Pesat.AI",
  robots: { index: false, follow: true }
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ order_id?: string }>;
};

export default async function DepositThankYouPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const orderId = params.order_id;

  return (
    <main className="min-h-screen bg-neutral-50 px-5 py-12 text-neutral-950">
      <section className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
          ✓
        </div>
        <h1 className="text-3xl font-semibold leading-tight">Deposit Berhasil Diterima</h1>
        <p className="mt-3 text-neutral-600">
          Terima kasih. Tim Pesat.AI akan menghubungi Anda dalam 1×24 jam untuk konfirmasi dan jadwal sesi.
        </p>

        {orderId ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <span className="font-semibold">ID Referensi:</span> {orderId}
          </div>
        ) : null}

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center rounded-full bg-neutral-950 px-8 font-semibold text-white"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </section>
    </main>
  );
}
