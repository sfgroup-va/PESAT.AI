import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const env = {
    openai: Boolean(process.env.OPENAI_API_KEY),
    openaiModel: process.env.OPENAI_MODEL || "gpt-5.5",
    database: Boolean(process.env.DATABASE_URL),
    adminPassword: Boolean(process.env.ADMIN_PASSWORD),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://pesat.ai"
  };
  const blockers = [
    !env.openai ? "OPENAI_API_KEY belum terpasang; hasil memakai fallback deterministic." : "",
    !env.database ? "DATABASE_URL belum terpasang; data tidak bisa dipersist." : "",
    !env.adminPassword ? "ADMIN_PASSWORD belum terpasang; /admin tidak bisa dibuka." : ""
  ].filter(Boolean);

  return NextResponse.json({
    ok: true,
    app: "pesat-ai-homepage",
    ready: blockers.length === 0,
    env,
    blockers,
    notes: [
      "If openai is false, result generation uses deterministic fallback copy.",
      "If database is false, sessions/events/discovery are not persisted.",
      "Database: Neon PostgreSQL (ap-southeast-1 Singapore)."
    ]
  });
}
