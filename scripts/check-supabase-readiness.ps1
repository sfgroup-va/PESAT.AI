param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectRef,
  [switch]$SkipLink
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($env:SUPABASE_ACCESS_TOKEN)) {
  throw "SUPABASE_ACCESS_TOKEN belum tersedia di environment shell ini."
}

if (-not (Test-Path -LiteralPath ".\supabase\migrations\20260530000000_pesat_ai_core.sql")) {
  throw "Migration file tidak ditemukan: .\supabase\migrations\20260530000000_pesat_ai_core.sql"
}

if (-not $SkipLink) {
  Write-Host "Linking workspace ke Supabase project $ProjectRef..." -ForegroundColor Cyan
  npx.cmd supabase link --project-ref $ProjectRef
}

$query = @"
with
expected_tables(table_name) as (
  values ('sessions'), ('events'), ('discovery_requests')
),
expected_columns(table_name, column_name, data_type) as (
  values
    ('sessions', 'id', 'uuid'),
    ('sessions', 'answers', 'jsonb'),
    ('sessions', 'contact', 'jsonb'),
    ('sessions', 'result', 'jsonb'),
    ('sessions', 'completed', 'boolean'),
    ('sessions', 'discovery_requested', 'boolean'),
    ('sessions', 'created_at', 'timestamp with time zone'),
    ('sessions', 'updated_at', 'timestamp with time zone'),
    ('events', 'id', 'bigint'),
    ('events', 'session_id', 'uuid'),
    ('events', 'type', 'text'),
    ('events', 'screen', 'text'),
    ('events', 'metadata', 'jsonb'),
    ('events', 'created_at', 'timestamp with time zone'),
    ('discovery_requests', 'id', 'bigint'),
    ('discovery_requests', 'session_id', 'uuid'),
    ('discovery_requests', 'company_name', 'text'),
    ('discovery_requests', 'name', 'text'),
    ('discovery_requests', 'wa', 'text'),
    ('discovery_requests', 'budget_context', 'text'),
    ('discovery_requests', 'message', 'text'),
    ('discovery_requests', 'created_at', 'timestamp with time zone')
),
expected_indexes(index_name) as (
  values
    ('events_session_id_idx'),
    ('events_screen_type_idx'),
    ('events_created_at_idx'),
    ('sessions_completed_idx'),
    ('sessions_discovery_requested_idx'),
    ('sessions_created_at_idx'),
    ('sessions_updated_at_idx'),
    ('discovery_requests_session_id_idx'),
    ('discovery_requests_created_at_idx')
),
table_status as (
  select e.table_name, (t.tablename is not null) as present
  from expected_tables e
  left join pg_catalog.pg_tables t
    on t.schemaname = 'public'
   and t.tablename = e.table_name
),
rls_status as (
  select e.table_name, coalesce(c.relrowsecurity, false) as enabled
  from expected_tables e
  left join pg_catalog.pg_class c
    on c.relname = e.table_name
  left join pg_catalog.pg_namespace n
    on n.oid = c.relnamespace
   and n.nspname = 'public'
),
column_status as (
  select
    e.table_name,
    e.column_name,
    e.data_type,
    (c.column_name is not null and c.data_type = e.data_type) as present
  from expected_columns e
  left join information_schema.columns c
    on c.table_schema = 'public'
   and c.table_name = e.table_name
   and c.column_name = e.column_name
),
index_status as (
  select e.index_name, (i.indexname is not null) as present
  from expected_indexes e
  left join pg_catalog.pg_indexes i
    on i.schemaname = 'public'
   and i.indexname = e.index_name
),
constraint_status as (
  select
    exists (
      select 1
      from pg_catalog.pg_constraint c
      where c.conrelid = to_regclass('public.events')
        and pg_catalog.pg_get_constraintdef(c.oid) like '%screen_view%'
        and pg_catalog.pg_get_constraintdef(c.oid) like '%click%'
    ) as event_type_constraint_present,
    exists (
      select 1
      from pg_catalog.pg_constraint c
      where c.conrelid = to_regclass('public.events')
        and pg_catalog.pg_get_constraintdef(c.oid) like '%fact1%'
        and pg_catalog.pg_get_constraintdef(c.oid) like '%admin%'
    ) as event_screen_constraint_present,
    exists (
      select 1
      from pg_catalog.pg_constraint c
      where c.conrelid = to_regclass('public.discovery_requests')
        and pg_catalog.pg_get_constraintdef(c.oid) like '%regexp_replace%'
        and pg_catalog.pg_get_constraintdef(c.oid) like '%16%'
    ) as wa_constraint_present
)
select jsonb_build_object(
  'tables', jsonb_build_object(
    'expected', 3,
    'present', (select count(*) from table_status where present),
    'missing', coalesce((select jsonb_agg(table_name order by table_name) from table_status where not present), '[]'::jsonb)
  ),
  'rls', jsonb_build_object(
    'expected', 3,
    'enabled', (select count(*) from rls_status where enabled),
    'missing', coalesce((select jsonb_agg(table_name order by table_name) from rls_status where not enabled), '[]'::jsonb)
  ),
  'columns', jsonb_build_object(
    'expected', 22,
    'present', (select count(*) from column_status where present),
    'missing', coalesce((select jsonb_agg(table_name || '.' || column_name || ':' || data_type order by table_name, column_name) from column_status where not present), '[]'::jsonb)
  ),
  'indexes', jsonb_build_object(
    'expected', 9,
    'present', (select count(*) from index_status where present),
    'missing', coalesce((select jsonb_agg(index_name order by index_name) from index_status where not present), '[]'::jsonb)
  ),
  'trigger', jsonb_build_object(
    'sessions_set_updated_at', exists (
      select 1
      from pg_catalog.pg_trigger
      where tgname = 'sessions_set_updated_at'
        and tgrelid = to_regclass('public.sessions')
        and not tgisinternal
    ),
    'set_updated_at_function', exists (
      select 1
      from pg_catalog.pg_proc p
      join pg_catalog.pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public'
        and p.proname = 'set_updated_at'
    )
  ),
  'constraints', (select row_to_json(constraint_status) from constraint_status)
) as readiness;
"@

Write-Host "Menjalankan query readiness read-only..." -ForegroundColor Cyan
$raw = & npx.cmd supabase db query --linked --output json $query 2>&1
if ($LASTEXITCODE -ne 0) {
  $message = ($raw | Out-String).Trim()
  throw "Supabase readiness query gagal: $message"
}

$jsonText = ($raw | Out-String).Trim()
$parsed = $jsonText | ConvertFrom-Json

function Get-ReadinessPayload {
  param([object]$Parsed)

  if ($Parsed -is [array]) {
    return $Parsed[0].readiness
  }

  if ($Parsed.PSObject.Properties.Name -contains "readiness") {
    return $Parsed.readiness
  }

  if ($Parsed.PSObject.Properties.Name -contains "data") {
    $data = @($Parsed.data)
    if ($data.Count -gt 0 -and ($data[0].PSObject.Properties.Name -contains "readiness")) {
      return $data[0].readiness
    }
  }

  if ($Parsed.PSObject.Properties.Name -contains "result") {
    $result = @($Parsed.result)
    if ($result.Count -gt 0 -and ($result[0].PSObject.Properties.Name -contains "readiness")) {
      return $result[0].readiness
    }
  }

  throw "Format output Supabase CLI tidak dikenali."
}

$readiness = Get-ReadinessPayload -Parsed $parsed
if ($readiness -is [string]) {
  $readiness = $readiness | ConvertFrom-Json
}

$blockers = @()
if ($readiness.tables.present -ne $readiness.tables.expected) { $blockers += "Missing tables: $($readiness.tables.missing -join ', ')" }
if ($readiness.rls.enabled -ne $readiness.rls.expected) { $blockers += "RLS belum aktif: $($readiness.rls.missing -join ', ')" }
if ($readiness.columns.present -ne $readiness.columns.expected) { $blockers += "Missing columns: $($readiness.columns.missing -join ', ')" }
if ($readiness.indexes.present -ne $readiness.indexes.expected) { $blockers += "Missing indexes: $($readiness.indexes.missing -join ', ')" }
if (-not $readiness.trigger.sessions_set_updated_at) { $blockers += "Trigger sessions_set_updated_at belum ada." }
if (-not $readiness.trigger.set_updated_at_function) { $blockers += "Function public.set_updated_at belum ada." }
if (-not $readiness.constraints.event_type_constraint_present) { $blockers += "Constraint event type belum sesuai." }
if (-not $readiness.constraints.event_screen_constraint_present) { $blockers += "Constraint event screen belum sesuai." }
if (-not $readiness.constraints.wa_constraint_present) { $blockers += "Constraint WhatsApp discovery belum sesuai." }

$result = [ordered]@{
  ok = ($blockers.Count -eq 0)
  projectRef = $ProjectRef
  linked = (-not $SkipLink)
  readiness = $readiness
  blockers = $blockers
}

$result | ConvertTo-Json -Depth 20

if ($blockers.Count -gt 0) {
  exit 1
}
