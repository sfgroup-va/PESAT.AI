import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const migration = fs.readFileSync(path.join(root, "supabase", "schema.sql"), "utf8").toLowerCase();

function has(text) {
  assert.ok(migration.includes(text.toLowerCase()), `Missing schema text: ${text}`);
}

for (const table of ["public.sessions", "public.events", "public.discovery_requests", "public.prompt_learning_events"]) {
  has(`create table if not exists ${table}`);
  has(`alter table ${table} enable row level security`);
}

for (const column of ["id uuid primary key", "answers jsonb", "contact jsonb", "result jsonb", "completed boolean", "discovery_requested boolean", "created_at timestamptz", "updated_at timestamptz"]) {
  has(column);
}

for (const column of ["session_id uuid references public.sessions(id)", "type text not null check", "screen text check", "metadata jsonb", "created_at timestamptz"]) {
  has(column);
}

for (const column of ["company_name text", "name text not null", "wa text not null check", "employee_count text", "yearly_revenue text", "budget_context text", "message text"]) {
  has(column);
}

for (const column of ["source_type text not null check", "source_ref text not null", "recommendation jsonb", "snapshot jsonb", "created_at timestamptz"]) {
  has(column);
}

for (const screen of ["'hero'", "'q1'", "'q2'", "'q3'", "'q4'", "'q5'", "'q6'", "'review'", "'loading'", "'result'", "'leadGate'", "'admin'"]) {
  has(screen);
}

has("type in ('screen_view', 'click')");
has("source_type in ('session_result', 'discovery_request')");
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
  "discovery_requests_created_at_idx",
  "prompt_learning_events_session_id_idx",
  "prompt_learning_events_created_at_idx"
]) {
  has(`create index if not exists ${indexName}`);
}

console.log(JSON.stringify({ ok: true, checked: "supabase-schema", tables: 4, indexes: 11 }, null, 2));
