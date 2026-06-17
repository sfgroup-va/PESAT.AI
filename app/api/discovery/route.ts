import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { storePromptLearningEvent } from "@/lib/prompt-learning";
import { sanitizeDiscoveryPayload, validateDiscoveryPayload } from "@/lib/validation";

export const runtime = "nodejs";

const WHATSAPP_NUMBER = "6281290401240";

export async function POST(request: Request) {
  const rawBody = await request.json().catch(() => null);
  if (!rawBody) {
    return NextResponse.json({ error: "Invalid discovery payload" }, { status: 400 });
  }

  const body = sanitizeDiscoveryPayload(rawBody);
  const validation = validateDiscoveryPayload(body);

  if (!validation.ok) {
    return NextResponse.json({ error: "Nama dan WA valid wajib diisi.", missing: validation.missing }, { status: 400 });
  }

  const sql = getDb();
  let persisted = false;
  let discoveryRequestId = "";
  if (sql) {
    try {
      const inserted = await sql`
        INSERT INTO discovery_requests (session_id, company_name, name, wa, employee_count, yearly_revenue, budget_context, message)
        VALUES (${body.sessionId || null}, ${body.companyName || null}, ${body.name}, ${body.wa},
                ${body.employeeCount || null}, ${body.yearlyRevenue || null}, ${body.budgetContext || null}, ${body.message || null})
        RETURNING id
      `;

      if (body.sessionId) {
        await sql`
          UPDATE sessions SET discovery_requested = true, updated_at = NOW()
          WHERE id = ${body.sessionId}::uuid
        `;
      }

      discoveryRequestId = String((inserted as Array<{ id?: string | number }>)[0]?.id || "");
      persisted = true;
    } catch (err: unknown) {
      return NextResponse.json({ error: String(err) }, { status: 500 });
    }
  }

  const text = [
    "Halo Pesat.AI, saya mau discovery call.",
    body.companyName ? `Perusahaan: ${body.companyName}` : "",
    `Nama: ${body.name}`,
    `WA: ${body.wa}`,
    body.employeeCount ? `Jumlah karyawan: ${body.employeeCount}` : "",
    body.yearlyRevenue ? `Yearly revenue: ${body.yearlyRevenue}` : "",
    body.budgetContext ? `Budget/konteks: ${body.budgetContext}` : "",
    body.summary ? `Ringkasan mini session: ${body.summary}` : "",
    body.message ? `Konteks tambahan:\n${body.message}` : ""
  ]
    .filter(Boolean)
    .join("\n");

  if (persisted) {
    await storePromptLearningEvent({
      sessionId: body.sessionId || null,
      sourceRef: discoveryRequestId || body.sessionId || crypto.randomUUID(),
      sourceType: "discovery_request",
      snapshot: body
    }).catch(() => undefined);
  }

  return NextResponse.json({
    persisted,
    whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
  });
}
