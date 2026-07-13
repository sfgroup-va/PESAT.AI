import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { listDepositTransactions } from "@/lib/deposit-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await listDepositTransactions();
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
  return NextResponse.json({ transactions: result.data });
}
