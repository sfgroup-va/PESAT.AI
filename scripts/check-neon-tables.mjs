// Read-only check: confirm the Pesat.AI tables exist in the Neon database.
// Reads DATABASE_URL from the environment or .env.local. Never prints the connection string.

import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

const root = process.cwd();

function loadEnvLocal() {
  if (process.env.DATABASE_URL) return;
  const envPath = path.join(root, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (!match) continue;
    const key = match[1];
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

if (!process.env.DATABASE_URL) {
  console.log(JSON.stringify({ ok: false, reason: "DATABASE_URL belum diset di .env.local — tidak bisa verifikasi dari sini." }, null, 2));
  process.exit(0);
}

const expected = ["sessions", "events", "discovery_requests", "landing_pages"];
const sql = neon(process.env.DATABASE_URL);

try {
  const rows = await sql.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
  );
  const found = rows.map((r) => r.table_name);
  const missing = expected.filter((t) => !found.includes(t));
  console.log(JSON.stringify({ ok: missing.length === 0, expected, present: expected.filter((t) => found.includes(t)), missing, allPublicTables: found }, null, 2));
  process.exit(missing.length === 0 ? 0 : 1);
} catch (err) {
  console.log(JSON.stringify({ ok: false, error: String(err) }, null, 2));
  process.exit(1);
}
