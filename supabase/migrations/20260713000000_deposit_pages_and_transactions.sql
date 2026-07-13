create extension if not exists pgcrypto;

create table if not exists public.deposit_pages (
  id text primary key default 'default',
  title text not null default 'Deposit untuk Memulai',
  subtitle text not null default 'Lengkapi deposit $500 untuk memulai sesi bersama Pesat AI.',
  amount integer not null default 50000,  -- cents, $500.00
  paypal_email text not null default '',
  paypal_client_id text not null default '',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.deposit_transactions (
  id uuid primary key default gen_random_uuid(),
  paypal_order_id text not null unique,
  payer_email text,
  amount integer not null,
  currency text not null default 'USD',
  status text not null default 'CREATED',  -- CREATED | CAPTURED | FAILED
  raw_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Seed the default deposit page config.
insert into public.deposit_pages (id, title, subtitle, amount, paypal_email, paypal_client_id, is_published)
values ('default', 'Deposit untuk Memulai', 'Lengkapi deposit $500 untuk memulai sesi bersama Pesat AI.', 50000, 'y3s@gmx.com', '', true)
on conflict (id) do nothing;

-- Auto-update timestamps.
drop trigger if exists deposit_pages_set_updated_at on public.deposit_pages;
create trigger deposit_pages_set_updated_at
  before update on public.deposit_pages
  for each row
  execute function public.set_updated_at();

drop trigger if exists deposit_transactions_set_updated_at on public.deposit_transactions;
create trigger deposit_transactions_set_updated_at
  before update on public.deposit_transactions
  for each row
  execute function public.set_updated_at();

-- Row-level security: app writes via service role only.
alter table public.deposit_pages enable row level security;
alter table public.deposit_transactions enable row level security;

-- Admin users may query transaction history quickly.
create index if not exists deposit_transactions_status_idx on public.deposit_transactions(status);
create index if not exists deposit_transactions_created_at_idx on public.deposit_transactions(created_at desc);
