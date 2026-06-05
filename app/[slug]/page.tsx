import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { sanitizeLandingConfig, type LandingConfig } from "@/lib/landing";
import { PesatExperience } from "@/components/PesatExperience";
import { PixelInjector } from "@/components/PixelInjector";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LandingData = { title: string; config: LandingConfig };

async function loadLanding(slug: string): Promise<LandingData | null> {
  const sql = getDb();
  if (!sql) return null;
  try {
    const rows = (await sql`SELECT title, config FROM landing_pages WHERE slug = ${slug} LIMIT 1`) as unknown as Array<{ title: string; config: unknown }>;
    const row = rows[0];
    if (!row) return null;
    return { title: row.title, config: sanitizeLandingConfig(row.config) };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await loadLanding(slug);
  if (!page) return {};
  // Landing variants are noindexed to avoid duplicate-content with the homepage.
  return { title: page.title, robots: { index: false, follow: true } };
}

export default async function LandingSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await loadLanding(slug);
  if (!page) notFound();
  return (
    <>
      <PixelInjector googleId={page.config.pixels.googleId} metaId={page.config.pixels.metaId} />
      <PesatExperience landing={page.config} />
    </>
  );
}
