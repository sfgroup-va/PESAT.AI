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
