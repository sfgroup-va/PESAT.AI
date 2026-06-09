import { NextResponse } from "next/server";
import { generateResultChatReply } from "@/lib/result-chat";
import { sanitizeResultChatPayload, validateResultChatPayload } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as unknown;

  if (!body) {
    return NextResponse.json({ error: "Invalid result chat payload" }, { status: 400 });
  }

  const payload = sanitizeResultChatPayload(body);
  const validation = validateResultChatPayload(payload);

  if (!validation.ok) {
    return NextResponse.json({ error: "Pertanyaan follow-up belum valid.", missing: validation.missing }, { status: 400 });
  }

  const reply = await generateResultChatReply({
    question: payload.question,
    history: payload.history,
    context: payload.context
  });

  return NextResponse.json(reply);
}
