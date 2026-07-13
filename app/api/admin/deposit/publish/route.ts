import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { toggleDepositPublished } from "@/lib/deposit-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await toggleDepositPublished();
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
  return NextResponse.json(result.data);
}
