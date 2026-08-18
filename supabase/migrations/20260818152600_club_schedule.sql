create extension if not exists pgcrypto;

create schema if not exists private;

create table private.admin_pin (
  id int primary key default 1 check (id = 1),
  pin_hash text not null
);

create table public.club_meta (
  id int primary key default 1 check (id = 1),
  updated_at timestamptz not null default now()
);

create table public.club_events (
  id text primary key,
  type text not null check (type in ('training', 'match', 'tournament')),
  title text not null,
  event_date date not null,
  start_time text,
  end_time text,
  place text not null,
  note text,
  sort_order int not null default 0
);

alter table public.club_meta enable row level security;
alter table public.club_events enable row level security;

create policy club_events_select on public.club_events
  for select to anon, authenticated using (true);

create policy club_meta_select on public.club_meta
  for select to anon, authenticated using (true);

create or replace function private.verify_pin(pin text)
returns boolean
language plpgsql
security definer
set search_path = private, extensions, public
as $$
declare
  stored text;
begin
  select pin_hash into stored from private.admin_pin where id = 1;
  if stored is null then
    return false;
  end if;
  return stored = crypt(pin, stored);
end;
$$;

create or replace function public.admin_check_pin(pin text)
returns boolean
language sql
security definer
set search_path = private
as $$
  select private.verify_pin(pin);
$$;

create or replace function public.admin_upsert_event(pin text, event jsonb)
returns void
language plpgsql
security definer
set search_path = public, private
as $$
begin
  if not private.verify_pin(pin) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  insert into public.club_events as e (
    id, type, title, event_date, start_time, end_time, place, note, sort_order
  )
  values (
    coalesce(nullif(event->>'id', ''), gen_random_uuid()::text),
    event->>'type',
    event->>'title',
    (event->>'date')::date,
    nullif(event->>'startTime', ''),
    nullif(event->>'endTime', ''),
    event->>'place',
    nullif(event->>'note', ''),
    coalesce((event->>'sortOrder')::int, 0)
  )
  on conflict (id) do update set
    type = excluded.type,
    title = excluded.title,
    event_date = excluded.event_date,
    start_time = excluded.start_time,
    end_time = excluded.end_time,
    place = excluded.place,
    note = excluded.note,
    sort_order = excluded.sort_order;

  update public.club_meta set updated_at = now() where id = 1;
end;
$$;

create or replace function public.admin_delete_event(pin text, event_id text)
returns void
language plpgsql
security definer
set search_path = public, private
as $$
begin
  if not private.verify_pin(pin) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  delete from public.club_events where id = event_id;
  update public.club_meta set updated_at = now() where id = 1;
end;
$$;

revoke all on function public.admin_check_pin(text) from public;
revoke all on function public.admin_upsert_event(text, jsonb) from public;
revoke all on function public.admin_delete_event(text, text) from public;

grant execute on function public.admin_check_pin(text) to anon, authenticated;
grant execute on function public.admin_upsert_event(text, jsonb) to anon, authenticated;
grant execute on function public.admin_delete_event(text, text) to anon, authenticated;

insert into private.admin_pin (id, pin_hash)
values (1, crypt('elephente', gen_salt('bf')))
on conflict (id) do nothing;

insert into public.club_meta (id, updated_at)
values (1, timestamptz '2026-08-18 14:30:00+09')
on conflict (id) do nothing;
