import { NextResponse } from "next/server";
import { getDb, missingDbMessage } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-auth";
import { sanitizeLandingConfig } from "@/lib/landing";

export const runtime = "nodejs";

type Row = { slug: string; title: string; config: unknown; created_at: string; updated_at: string };

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;
  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ error: missingDbMessage() }, { status: 503 });
  }
  try {
    const rows = (await sql`SELECT slug, title, config, created_at, updated_at FROM landing_pages WHERE slug = ${slug} LIMIT 1`) as unknown as Row[];
    const row = rows[0];
    if (!row) {
      return NextResponse.json({ error: "Halaman tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ slug: row.slug, title: row.title, config: sanitizeLandingConfig(row.config), createdAt: row.created_at, updatedAt: row.updated_at });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;
  const body = (await request.json().catch(() => null)) as { title?: string; config?: unknown } | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const title = typeof body.title === "string" && body.title.trim() ? body.title.trim().slice(0, 120) : null;
  const config = sanitizeLandingConfig(body.config);

  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ error: missingDbMessage() }, { status: 503 });
  }
  try {
    const rows = (await sql`
      UPDATE landing_pages
      SET title = COALESCE(${title}, title), config = ${JSON.stringify(config)}::jsonb
      WHERE slug = ${slug}
      RETURNING slug
    `) as unknown as Array<{ slug: string }>;
    if (!rows[0]) {
      return NextResponse.json({ error: "Halaman tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ slug, config });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;
  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ error: missingDbMessage() }, { status: 503 });
  }
  try {
    await sql`DELETE FROM landing_pages WHERE slug = ${slug}`;
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
