import type { ClubEvent, EventType } from './types'
import { EVENT_TYPES } from './types'
import { daysInMonth, formatFromTo, toYmd, weekdaySun0 } from '../lib/date'

const LEGACY_EVENT_TYPE: Record<string, EventType> = {
  training: 'jeongmo',
  match: 'wufl',
  tournament: 'sufa',
}

export function normalizeEventType(type: string): EventType {
  if ((EVENT_TYPES as readonly string[]).includes(type)) return type as EventType
  return LEGACY_EVENT_TYPE[type] ?? 'jeongmo'
}

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  jeongmo: '정모',
  wufl: 'WUFL',
  sufa: 'SUFA',
}

export const EVENT_TYPE_TEXT: Record<EventType, string> = {
  jeongmo: 'text-brand',
  wufl: 'text-navy',
  sufa: 'text-tourney',
}

function compactClock(time: string): string {
  const [hours, minutes] = time.split(':')
  if (!hours) return time
  return minutes === '00' ? String(Number(hours)) : `${Number(hours)}:${minutes}`
}

function formatCompactRange(startTime?: string, endTime?: string): string {
  if (startTime && endTime) return `${compactClock(startTime)}–${compactClock(endTime)}`
  if (startTime) return compactClock(startTime)
  if (endTime) return compactClock(endTime)
  return '시간 미정'
}

function opponentFromTitle(title: string): string | undefined {
  const matched = title.match(/vs\s+(.+)$/i)
  const value = matched?.[1]?.trim()
  return value || undefined
}

export function getOpponent(event: ClubEvent): string | undefined {
  return event.opponent?.trim() || opponentFromTitle(event.title)
}

export function defaultEventTitle(event: Pick<ClubEvent, 'type' | 'title' | 'opponent'>): string {
  const title = event.title.trim()
  if (title) return title
  if (event.type === 'jeongmo') return '정모'
  const opponent = event.opponent?.trim()
  const label = EVENT_TYPE_LABEL[event.type]
  return opponent ? `${label} vs ${opponent}` : label
}

export type EventPreview = {
  primary: string
  secondary: string
}

/** 달력 칸용. 시간·상대만. 장소는 상세에서. */
export function getCalendarPreview(event: ClubEvent): { time: string; opponent?: string } {
  const time = formatCompactRange(event.startTime, event.endTime)
  if (event.type === 'jeongmo') return { time }
  const opponent = getOpponent(event)
  return { time, opponent: opponent ? `vs ${opponent}` : undefined }
}

/** 목록용. 정모는 시간·장소, WUFL/SUFA는 상대·장소. */
export function getEventPreview(event: ClubEvent, compact = false): EventPreview {
  if (event.type === 'jeongmo') {
    return {
      primary: compact ? formatCompactRange(event.startTime, event.endTime) : formatFromTo(event.startTime, event.endTime),
      secondary: event.place,
    }
  }

  const opponent = getOpponent(event)
  return {
    primary: opponent ? `vs ${opponent}` : event.title,
    secondary: event.place,
  }
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
    .filter((event) => event.type === 'jeongmo' || event.type === 'wufl')
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
    .filter((event) => (event.type === 'wufl' || event.type === 'sufa') && event.date >= today)
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
