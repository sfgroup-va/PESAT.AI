import { NextResponse } from "next/server";
import { calculateImpactRanges, selectSolutions } from "@/lib/rule-engine";
import { generateResultCopy } from "@/lib/openai-result";
import { getDb } from "@/lib/db";
import { sanitizeAnswers, sanitizeContact, validateCompleteAnswers } from "@/lib/validation";
import type { ContactData, WizardAnswers } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    sessionId?: string;
    answers: WizardAnswers;
    contact?: ContactData;
  } | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid result payload" }, { status: 400 });
  }

  const sessionId = body.sessionId || crypto.randomUUID();
  const answers = sanitizeAnswers(body.answers);
  const contact = sanitizeContact(body.contact || {});
  const validation = validateCompleteAnswers(answers);
  if (!validation.ok) {
    return NextResponse.json({ error: "Jawaban mini session belum lengkap.", missing: validation.missing }, { status: 400 });
  }
  const solutions = selectSolutions(answers);
  const impactRanges = calculateImpactRanges(answers);
  const result = await generateResultCopy(sessionId, answers, solutions, impactRanges);
  const sql = getDb();
  let persisted = false;

  if (sql) {
    try {
      await sql`
        INSERT INTO sessions (id, answers, contact, result, completed, updated_at)
        VALUES (${sessionId}::uuid, ${JSON.stringify(answers)}::jsonb, ${JSON.stringify(contact)}::jsonb,
                ${JSON.stringify(result)}::jsonb, true, NOW())
        ON CONFLICT (id) DO UPDATE SET
          answers = EXCLUDED.answers,
          contact = EXCLUDED.contact,
          result = EXCLUDED.result,
          completed = true,
          updated_at = NOW()
      `;
      persisted = true;
    } catch (err: unknown) {
      return NextResponse.json({ error: String(err) }, { status: 500 });
    }
  }

  return NextResponse.json({ ...result, persisted });
}
