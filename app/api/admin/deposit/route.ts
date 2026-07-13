import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { loadDepositConfigAdmin, updateDepositConfig } from "@/lib/deposit-server";
import { sanitizeDepositPageInput } from "@/lib/deposit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await loadDepositConfigAdmin();
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
  return NextResponse.json(result.data);
}

export async function PUT(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as unknown;
  const input = sanitizeDepositPageInput(body);
  if (!input) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }
  const result = await updateDepositConfig(input);
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
  return NextResponse.json(result.data);
}
