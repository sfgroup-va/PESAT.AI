import type { ContactData, WizardAnswers } from "./types";

export async function saveSession(
  sessionId: string | undefined,
  answers: WizardAnswers,
  contact: ContactData,
  completed = false
): Promise<string> {
  const activeSessionId = sessionId || crypto.randomUUID();
  const response = await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId: activeSessionId, answers, contact, completed })
  }).catch(() => null);
  const data = response ? ((await response.json().catch(() => ({}))) as { sessionId?: string }) : {};
  return data.sessionId || activeSessionId;
}
