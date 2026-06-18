import { neon } from "@neondatabase/serverless";

export type NeonSql = ReturnType<typeof neon>;

export function getDb(): NeonSql | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}

export function missingDbMessage() {
  return "DATABASE_URL belum terpasang. Set DATABASE_URL di environment server.";
}

const OTHER_CONTEXT_KEYS = [
  "mainChallengeOther",
  "detailChallengeOther",
  "impactLevelOther",
  "frictionSourceOther",
  "adoptionStyleOther",
  "detailNumericOther",
  "frictionChannelOther",
  "currentStackOther"
];

export async function getRecentOtherExamples(sql: NeonSql | null, limit = 5): Promise<string[]> {
  if (!sql) return [];
  try {
    const rows = (await sql`
      select answers->'contextAnswers' as ctx
      from sessions
      where answers->'contextAnswers' ?| ${OTHER_CONTEXT_KEYS}
      order by updated_at desc
      limit ${limit}
    `) as Array<{ ctx?: Record<string, string> | null }>;
    const examples: string[] = [];
    for (const row of rows) {
      const ctx = row.ctx || {};
      for (const key of OTHER_CONTEXT_KEYS) {
        const value = ctx[key];
        if (typeof value === "string" && value.trim()) {
          examples.push(`${key}: ${value.trim()}`);
        }
      }
    }
    return examples.slice(0, limit * 2);
  } catch {
    return [];
  }
}
