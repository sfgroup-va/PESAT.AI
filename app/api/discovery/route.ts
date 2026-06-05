import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
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
    return NextResponse.json({ error: "Nama perusahaan, nama, dan WA valid wajib diisi.", missing: validation.missing }, { status: 400 });
  }

  const sql = getDb();
  let persisted = false;
  if (sql) {
    try {
      await sql`
        INSERT INTO discovery_requests (session_id, company_name, name, wa, budget_context, message)
        VALUES (${body.sessionId || null}, ${body.companyName}, ${body.name}, ${body.wa},
                ${body.budgetContext || null}, ${body.message || null})
      `;

      if (body.sessionId) {
        await sql`
          UPDATE sessions SET discovery_requested = true, updated_at = NOW()
          WHERE id = ${body.sessionId}::uuid
        `;
      }

      persisted = true;
    } catch (err: unknown) {
      return NextResponse.json({ error: String(err) }, { status: 500 });
    }
  }

  const text = [
    "Halo Pesat.AI, saya mau discovery call.",
    `Perusahaan: ${body.companyName}`,
    `Nama: ${body.name}`,
    `WA: ${body.wa}`,
    body.budgetContext ? `Budget/konteks: ${body.budgetContext}` : "",
    body.summary ? `Ringkasan mini session: ${body.summary}` : "",
    body.message ? `Catatan: ${body.message}` : ""
  ]
    .filter(Boolean)
    .join("\n");

  return NextResponse.json({
    persisted,
    whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
  });
}
