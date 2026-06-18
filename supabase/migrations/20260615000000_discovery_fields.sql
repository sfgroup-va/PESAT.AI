-- Add employee count and yearly revenue to discovery requests
alter table public.discovery_requests
  add column if not exists employee_count text not null default '',
  add column if not exists yearly_revenue text not null default '';

-- Backfill existing rows with sensible defaults if needed
update public.discovery_requests
  set employee_count = coalesce(nullif(employee_count, ''), 'Tidak diisi'),
      yearly_revenue = coalesce(nullif(yearly_revenue, ''), 'Tidak diisi')
  where employee_count = '' or yearly_revenue = '';
