import { NextResponse } from "next/server";
import { getDb, missingDbMessage } from "@/lib/db";

export const runtime = "nodejs";

type ResultRow = {
  id: string;
  result: unknown;
  completed: boolean;
  updated_at: string;
};

export async function GET(_request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const cleanSessionId = sessionId.trim().slice(0, 80);
  if (!cleanSessionId) {
    return NextResponse.json({ error: "Invalid session id" }, { status: 400 });
  }

  const sql = getDb();

  if (!sql) {
    return NextResponse.json({ error: missingDbMessage() }, { status: 503 });
  }

  let rows: ResultRow[];
  try {
    rows = (await sql`
      SELECT id, result, completed, updated_at
      FROM sessions
      WHERE id = ${cleanSessionId}::uuid
      LIMIT 1
    `) as unknown as ResultRow[];
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }

  const data = rows[0];
  if (!data) {
    return NextResponse.json({ error: "Result not found" }, { status: 404 });
  }

  if (!data.completed || !data.result) {
    return NextResponse.json({ error: "Result not ready" }, { status: 409 });
  }

  return NextResponse.json(data.result);
}
