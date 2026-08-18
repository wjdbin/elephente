alter table public.club_events
  drop constraint if exists club_events_type_check;

update public.club_events
set type = case type
  when 'training' then 'jeongmo'
  when 'match' then 'wufl'
  when 'tournament' then 'sufa'
  else type
end;

alter table public.club_events
  add constraint club_events_type_check
  check (type in ('jeongmo', 'wufl', 'sufa'));
