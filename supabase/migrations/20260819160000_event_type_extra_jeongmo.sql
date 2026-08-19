alter table public.club_events
  drop constraint if exists club_events_type_check;

alter table public.club_events
  add constraint club_events_type_check
  check (type in ('jeongmo', 'extra_jeongmo', 'wufl', 'sufa'));
