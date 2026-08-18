alter table public.club_events
  add column if not exists opponent text;

update public.club_events
set opponent = trim(substring(title from 'vs\s+(.+)$'))
where type in ('wufl', 'sufa')
  and opponent is null
  and title ~* 'vs\s+\S';

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
    id, type, title, event_date, start_time, end_time, place, opponent, note, sort_order
  )
  values (
    coalesce(nullif(event->>'id', ''), gen_random_uuid()::text),
    event->>'type',
    event->>'title',
    (event->>'date')::date,
    nullif(event->>'startTime', ''),
    nullif(event->>'endTime', ''),
    event->>'place',
    nullif(event->>'opponent', ''),
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
    opponent = excluded.opponent,
    note = excluded.note,
    sort_order = excluded.sort_order;

  update public.club_meta set updated_at = now() where id = 1;
end;
$$;
