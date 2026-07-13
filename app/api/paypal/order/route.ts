import { NextResponse } from "next/server";
import { loadDepositConfig, insertDepositTransaction } from "@/lib/deposit-server";
import { createPayPalOrder } from "@/lib/paypal";
import { centsToPayPalValue } from "@/lib/deposit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const config = await loadDepositConfig();
  if (!config.ok) {
    return NextResponse.json({ error: config.message }, { status: config.status });
  }

  const paypalClientId = config.data.paypalClientId || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
  const paypalSecret = process.env.PAYPAL_SECRET || "";
  if (!paypalClientId || !paypalSecret) {
    return NextResponse.json({ error: "PayPal credentials are not configured." }, { status: 503 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pesat.ai";
  const orderResult = await createPayPalOrder(paypalClientId, paypalSecret, {
    amount: centsToPayPalValue(config.data.amount),
    currency: "USD",
    description: config.data.title,
    payeeEmail: config.data.paypalEmail || undefined,
    brandName: "Pesat.AI",
    returnUrl: `${siteUrl}/deposit/thank-you`,
    cancelUrl: `${siteUrl}/deposit`
  });

  if (!orderResult.ok) {
    return NextResponse.json({ error: orderResult.message }, { status: orderResult.status });
  }

  await insertDepositTransaction({
    paypalOrderId: orderResult.order.id,
    amount: config.data.amount,
    currency: "USD",
    status: "CREATED",
    rawData: orderResult.order
  });

  return NextResponse.json({ orderID: orderResult.order.id });
}
