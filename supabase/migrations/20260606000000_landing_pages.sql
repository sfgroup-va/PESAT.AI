-- Landing page CMS: custom pages cloned from the homepage master template.
-- The homepage itself is the read-only master and is NOT stored here.

create table if not exists public.landing_pages (
  slug text primary key,
  title text not null,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.landing_pages enable row level security;

create index if not exists landing_pages_created_at_idx on public.landing_pages (created_at desc);

create or replace function public.landing_pages_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists landing_pages_set_updated_at on public.landing_pages;
create trigger landing_pages_set_updated_at
before update on public.landing_pages
for each row execute function public.landing_pages_set_updated_at();
