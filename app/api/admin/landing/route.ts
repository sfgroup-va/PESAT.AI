import { NextResponse } from "next/server";
import { getDb, missingDbMessage } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-auth";
import { DEFAULT_LANDING_CONFIG, isValidSlug, sanitizeLandingConfig, type LandingPage } from "@/lib/landing";

export const runtime = "nodejs";

type Row = { slug: string; title: string; config: unknown; created_at: string; updated_at: string };

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ error: missingDbMessage() }, { status: 503 });
  }
  try {
    const rows = (await sql`
      SELECT slug, title, config, created_at, updated_at
      FROM landing_pages
      ORDER BY created_at DESC
    `) as unknown as Row[];
    const pages: LandingPage[] = rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      config: sanitizeLandingConfig(row.config),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
    return NextResponse.json({ pages });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as { slug?: string; title?: string; config?: unknown } | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  const title = typeof body.title === "string" && body.title.trim() ? body.title.trim().slice(0, 120) : slug;
  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: "Slug tidak valid atau dipakai sistem. Gunakan huruf kecil, angka, dan tanda hubung." }, { status: 400 });
  }
  const config = body.config ? sanitizeLandingConfig(body.config) : DEFAULT_LANDING_CONFIG;

  const sql = getDb();
  if (!sql) {
    return NextResponse.json({ error: missingDbMessage() }, { status: 503 });
  }
  try {
    const existing = (await sql`SELECT slug FROM landing_pages WHERE slug = ${slug} LIMIT 1`) as unknown as Array<{ slug: string }>;
    if (existing[0]) {
      return NextResponse.json({ error: "Slug sudah dipakai." }, { status: 409 });
    }
    await sql`
      INSERT INTO landing_pages (slug, title, config)
      VALUES (${slug}, ${title}, ${JSON.stringify(config)}::jsonb)
    `;
    return NextResponse.json({ slug, title, config });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
