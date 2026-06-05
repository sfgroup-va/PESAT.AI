import { NextResponse } from "next/server";
import { buildAdminSummary } from "@/lib/admin-summary";
import { getDb, missingDbMessage } from "@/lib/db";

export const runtime = "nodejs";

async function buildSummary(password: string | null) {
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ error: missingDbMessage() }, { status: 503 });
  }

  try {
    const [sessions, events, discovery] = await Promise.all([
      sql`SELECT id, completed, discovery_requested, created_at FROM sessions`,
      sql`SELECT screen, type, metadata, created_at FROM events WHERE type IN ('screen_view', 'click')`,
      sql`SELECT id, created_at FROM discovery_requests`
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(buildAdminSummary((sessions as unknown as any[]) || [], (events as unknown as any[]) || [], (discovery as unknown as any[]) || []));
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return buildSummary(request.headers.get("x-admin-password"));
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  return buildSummary(body?.password || request.headers.get("x-admin-password"));
}
