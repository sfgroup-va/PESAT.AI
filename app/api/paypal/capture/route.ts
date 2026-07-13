import { NextResponse } from "next/server";
import { loadDepositConfig, updateDepositTransaction } from "@/lib/deposit-server";
import { capturePayPalOrder } from "@/lib/paypal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { orderID?: string } | null;
  const orderID = typeof body?.orderID === "string" ? body.orderID.trim() : "";
  if (!orderID) {
    return NextResponse.json({ error: "orderID is required." }, { status: 400 });
  }

  const config = await loadDepositConfig();
  if (!config.ok) {
    return NextResponse.json({ error: config.message }, { status: config.status });
  }

  const paypalClientId = config.data.paypalClientId || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
  const paypalSecret = process.env.PAYPAL_SECRET || "";
  if (!paypalClientId || !paypalSecret) {
    return NextResponse.json({ error: "PayPal credentials are not configured." }, { status: 503 });
  }

  const captureResult = await capturePayPalOrder(paypalClientId, paypalSecret, orderID);
  if (!captureResult.ok) {
    await updateDepositTransaction(orderID, {
      status: "FAILED",
      rawData: { error: captureResult.message }
    });
    return NextResponse.json({ error: captureResult.message }, { status: captureResult.status });
  }

  const capture = captureResult.capture;
  const payerEmail = capture.payer?.email_address || null;

  await updateDepositTransaction(orderID, {
    status: "CAPTURED",
    payerEmail,
    rawData: capture
  });

  return NextResponse.json({
    success: true,
    orderID: capture.id,
    status: capture.status,
    payerEmail
  });
}
