import { supabase } from '../lib/supabase'
import type { ClubEvent, ScheduleData } from './types'

type EventRow = {
  id: string
  type: ClubEvent['type']
  title: string
  event_date: string
  start_time: string | null
  end_time: string | null
  place: string
  note: string | null
}

function toEvent(row: EventRow): ClubEvent {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    date: row.event_date,
    startTime: row.start_time ?? undefined,
    endTime: row.end_time ?? undefined,
    place: row.place,
    note: row.note ?? undefined,
  }
}

export async function fetchRemoteSchedule(): Promise<ScheduleData> {
  if (!supabase) throw new Error('supabase is not configured')

  const [eventsResult, metaResult] = await Promise.all([
    supabase
      .from('club_events')
      .select('*')
      .order('event_date', { ascending: true })
      .order('start_time', { ascending: true }),
    supabase.from('club_meta').select('updated_at').eq('id', 1).maybeSingle(),
  ])

  if (eventsResult.error) throw eventsResult.error
  if (metaResult.error) throw metaResult.error

  return {
    updatedAt: metaResult.data?.updated_at ?? new Date().toISOString(),
    events: (eventsResult.data as EventRow[]).map(toEvent),
  }
}

export async function checkAdminPin(pin: string): Promise<boolean> {
  if (!supabase) return false
  const { data, error } = await supabase.rpc('admin_check_pin', { pin })
  if (error) throw error
  return Boolean(data)
}

export async function upsertEvent(pin: string, event: ClubEvent): Promise<void> {
  if (!supabase) throw new Error('supabase is not configured')
  const { error } = await supabase.rpc('admin_upsert_event', {
    pin,
    event: {
      id: event.id,
      type: event.type,
      title: event.title,
      date: event.date,
      startTime: event.startTime ?? '',
      endTime: event.endTime ?? '',
      place: event.place,
      note: event.note ?? '',
    },
  })
  if (error) throw error
}

export async function deleteEvent(pin: string, id: string): Promise<void> {
  if (!supabase) throw new Error('supabase is not configured')
  const { error } = await supabase.rpc('admin_delete_event', { pin, event_id: id })
  if (error) throw error
}
