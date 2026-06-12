-- Update event screen check constraint to support the redesigned Mini Session flow.
-- Safe to run on existing databases; uses IF EXISTS to avoid errors if the constraint
-- has already been updated or does not exist.

alter table public.events drop constraint if exists events_screen_check;

alter table public.events add constraint events_screen_check
  check (
    screen is null
    or screen in ('hero', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'review', 'loading', 'result', 'leadGate', 'admin')
  );
