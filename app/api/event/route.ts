import { NextResponse } from "next/server";
import { getDb, missingDbMessage } from "@/lib/db";
import { sanitizeEventPayload, validateEventPayload } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.json().catch(() => null);
  const body = sanitizeEventPayload(rawBody);
  const validation = validateEventPayload(body);

  if (!validation.ok) {
    return NextResponse.json({ error: "Invalid event payload", missing: validation.missing }, { status: 400 });
  }

  const sql = getDb();

  if (!sql) {
    return NextResponse.json({ persisted: false, warning: missingDbMessage() });
  }

  try {
    await sql`
      INSERT INTO events (session_id, type, screen, metadata)
      VALUES (${body.sessionId || null}, ${body.type}, ${body.screen || null},
              ${JSON.stringify(body.metadata || {})}::jsonb)
    `;
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }

  return NextResponse.json({ persisted: true });
}
