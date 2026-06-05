import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const migration = fs.readFileSync(path.join(root, "supabase", "migrations", "20260530000000_pesat_ai_core.sql"), "utf8").toLowerCase();

function has(text) {
  assert.ok(migration.includes(text.toLowerCase()), `Missing schema text: ${text}`);
}

for (const table of ["public.sessions", "public.events", "public.discovery_requests"]) {
  has(`create table if not exists ${table}`);
  has(`alter table ${table} enable row level security`);
}

for (const column of ["id uuid primary key", "answers jsonb", "contact jsonb", "result jsonb", "completed boolean", "discovery_requested boolean", "created_at timestamptz", "updated_at timestamptz"]) {
  has(column);
}

for (const column of ["session_id uuid references public.sessions(id)", "type text not null check", "screen text check", "metadata jsonb", "created_at timestamptz"]) {
  has(column);
}

for (const column of ["company_name text not null", "name text not null", "wa text not null check", "budget_context text", "message text"]) {
  has(column);
}

for (const screen of ["'hero'", "'s1'", "'fact1'", "'s2'", "'fact2'", "'s3'", "'s4'", "'s5'", "'s6'", "'s7'", "'s8'", "'result'", "'admin'"]) {
  has(screen);
}

has("type in ('screen_view', 'click')");
has("regexp_replace(wa");
has("between 9 and 16");
has("create or replace function public.set_updated_at()");
has("create trigger sessions_set_updated_at");

for (const indexName of [
  "events_session_id_idx",
  "events_screen_type_idx",
  "events_created_at_idx",
  "sessions_completed_idx",
  "sessions_discovery_requested_idx",
  "sessions_created_at_idx",
  "sessions_updated_at_idx",
  "discovery_requests_session_id_idx",
  "discovery_requests_created_at_idx"
]) {
  has(`create index if not exists ${indexName}`);
}

console.log(JSON.stringify({ ok: true, checked: "supabase-schema", tables: 3, indexes: 9 }, null, 2));
