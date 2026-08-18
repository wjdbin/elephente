import type { ClubEvent, EventType } from './types'
import { daysInMonth, toYmd, weekdaySun0 } from '../lib/date'

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  training: '훈련',
  match: '경기',
  tournament: '대회',
}

function byTimeThenTitle(a: ClubEvent, b: ClubEvent): number {
  const time = (a.startTime ?? '99:99').localeCompare(b.startTime ?? '99:99')
  if (time !== 0) return time
  return a.title.localeCompare(b.title, 'ko')
}

export function getEventById(events: ClubEvent[], id: string): ClubEvent | undefined {
  return events.find((event) => event.id === id)
}

export function getEventsOnDate(events: ClubEvent[], ymd: string): ClubEvent[] {
  return events.filter((event) => event.date === ymd).sort(byTimeThenTitle)
}

export type TodayOrNext = {
  kind: 'today' | 'next'
  date: string
  events: ClubEvent[]
}

export function getTodayOrNextSessions(events: ClubEvent[], today: string): TodayOrNext | null {
  const sessions = events
    .filter((event) => event.type === 'training' || event.type === 'match')
    .sort((a, b) => a.date.localeCompare(b.date) || byTimeThenTitle(a, b))

  const todayEvents = sessions.filter((event) => event.date === today)
  if (todayEvents.length > 0) {
    return { kind: 'today', date: today, events: todayEvents }
  }

  const next = sessions.find((event) => event.date > today)
  if (!next) return null

  return {
    kind: 'next',
    date: next.date,
    events: sessions.filter((event) => event.date === next.date),
  }
}

export function getUpcomingTournaments(
  events: ClubEvent[],
  today: string,
  limit?: number,
): ClubEvent[] {
  const upcoming = events
    .filter((event) => event.type === 'tournament' && event.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || byTimeThenTitle(a, b))

  return limit === undefined ? upcoming : upcoming.slice(0, limit)
}

export type MonthCell = {
  ymd: string | null
  day: number | null
}

export function getMonthCells(year: number, month: number): MonthCell[] {
  const firstYmd = toYmd(year, month, 1)
  const leading = weekdaySun0(firstYmd)
  const totalDays = daysInMonth(year, month)
  const cells: MonthCell[] = []

  for (let i = 0; i < leading; i += 1) {
    cells.push({ ymd: null, day: null })
  }

  for (let day = 1; day <= totalDays; day += 1) {
    cells.push({ ymd: toYmd(year, month, day), day })
  }

  while (cells.length % 7 !== 0) {
    cells.push({ ymd: null, day: null })
  }

  return cells
}
