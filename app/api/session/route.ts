import { NextResponse } from "next/server";
import { getDb, missingDbMessage } from "@/lib/db";
import { sanitizeAnswers, sanitizeContact } from "@/lib/validation";
import type { ContactData, WizardAnswers } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    sessionId?: string;
    answers?: Partial<WizardAnswers>;
    contact?: ContactData;
    completed?: boolean;
    discoveryRequested?: boolean;
  } | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid session payload" }, { status: 400 });
  }

  const sessionId = body.sessionId || crypto.randomUUID();
  const answers = sanitizeAnswers(body.answers || {});
  const contact = sanitizeContact(body.contact || {});
  const sql = getDb();

  if (!sql) {
    return NextResponse.json({ sessionId, persisted: false, warning: missingDbMessage() });
  }

  try {
    await sql`
      INSERT INTO sessions (id, answers, contact, completed, discovery_requested, updated_at)
      VALUES (${sessionId}::uuid, ${JSON.stringify(answers)}::jsonb, ${JSON.stringify(contact)}::jsonb,
              ${Boolean(body.completed)}, ${Boolean(body.discoveryRequested)}, NOW())
      ON CONFLICT (id) DO UPDATE SET
        answers = EXCLUDED.answers,
        contact = EXCLUDED.contact,
        completed = EXCLUDED.completed,
        discovery_requested = EXCLUDED.discovery_requested,
        updated_at = NOW()
    `;
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }

  return NextResponse.json({ sessionId, persisted: true });
}
