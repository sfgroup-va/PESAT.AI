import { NextResponse } from "next/server";
import { loadDepositConfig } from "@/lib/deposit-server";
import { toPublicDepositConfig } from "@/lib/deposit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const result = await loadDepositConfig();
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
  return NextResponse.json(toPublicDepositConfig(result.data));
}
