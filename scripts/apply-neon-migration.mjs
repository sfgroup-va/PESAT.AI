// Apply SQL migration files to a Neon Postgres database using DATABASE_URL.
// Usage:
//   node scripts/apply-neon-migration.mjs            (applies both core + landing migrations)
//   node scripts/apply-neon-migration.mjs <file.sql> [<file2.sql> ...]
//
// DATABASE_URL is read from the environment (set it in .env.local — gitignored —
// or export it before running). The connection string is NEVER printed.

import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

const root = process.cwd();

// Load DATABASE_URL from .env.local if not already in the environment.
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

// Split a SQL file into individual statements, respecting line/block comments,
// single-quoted strings, and dollar-quoted bodies ($$ ... $$ / $tag$ ... $tag$)
// so semicolons inside PL/pgSQL function bodies do not split statements.
function splitStatements(sql) {
  const statements = [];
  let current = "";
  let i = 0;
  const n = sql.length;
  let inLine = false;
  let inBlock = false;
  let inSingle = false;
  let dollarTag = null;

  while (i < n) {
    const ch = sql[i];
    const next = sql[i + 1];

    if (inLine) {
      current += ch;
      if (ch === "\n") inLine = false;
      i += 1;
      continue;
    }
    if (inBlock) {
      current += ch;
      if (ch === "*" && next === "/") { current += next; i += 2; inBlock = false; continue; }
      i += 1;
      continue;
    }
    if (inSingle) {
      current += ch;
      if (ch === "'") {
        if (next === "'") { current += next; i += 2; continue; }
        inSingle = false;
      }
      i += 1;
      continue;
    }
    if (dollarTag) {
      if (sql.startsWith(dollarTag, i)) { current += dollarTag; i += dollarTag.length; dollarTag = null; continue; }
      current += ch;
      i += 1;
      continue;
    }

    if (ch === "-" && next === "-") { inLine = true; current += ch; i += 1; continue; }
    if (ch === "/" && next === "*") { inBlock = true; current += ch + next; i += 2; continue; }
    if (ch === "'") { inSingle = true; current += ch; i += 1; continue; }
    if (ch === "$") {
      const tagMatch = /^\$[A-Za-z0-9_]*\$/.exec(sql.slice(i));
      if (tagMatch) { dollarTag = tagMatch[0]; current += dollarTag; i += dollarTag.length; continue; }
    }
    if (ch === ";") { statements.push(current.trim()); current = ""; i += 1; continue; }

    current += ch;
    i += 1;
  }
  if (current.trim()) statements.push(current.trim());
  return statements.filter((s) => s.length > 0);
}

loadEnvLocal();

if (!process.env.DATABASE_URL) {
  console.error(JSON.stringify({ ok: false, error: "DATABASE_URL belum diset. Tambahkan ke .env.local atau export dulu." }, null, 2));
  process.exit(1);
}

const files =
  process.argv.slice(2).length > 0
    ? process.argv.slice(2)
    : ["supabase/migrations/20260530000000_pesat_ai_core.sql", "supabase/migrations/20260606000000_landing_pages.sql"];

const sql = neon(process.env.DATABASE_URL);
const applied = [];

try {
  for (const file of files) {
    const full = path.join(root, file);
    if (!fs.existsSync(full)) {
      throw new Error(`File tidak ditemukan: ${file}`);
    }
    const statements = splitStatements(fs.readFileSync(full, "utf8"));
    for (const statement of statements) {
      await sql.query(statement);
    }
    applied.push({ file, statements: statements.length });
  }
  console.log(JSON.stringify({ ok: true, applied }, null, 2));
} catch (err) {
  console.error(JSON.stringify({ ok: false, applied, error: String(err) }, null, 2));
  process.exit(1);
}
