export const EVENT_TYPES = ['jeongmo', 'extra_jeongmo', 'wufl', 'sufa'] as const

export type EventType = (typeof EVENT_TYPES)[number]

export const JEONGMO_TYPES = ['jeongmo', 'extra_jeongmo'] as const satisfies readonly EventType[]
export const MATCH_TYPES = ['wufl', 'sufa'] as const satisfies readonly EventType[]

export function isJeongmoType(type: EventType): boolean {
  return type === 'jeongmo' || type === 'extra_jeongmo'
}

export function isMatchType(type: EventType): boolean {
  return type === 'wufl' || type === 'sufa'
}

export type ClubEvent = {
  id: string
  type: EventType
  title: string
  date: string
  startTime?: string
  endTime?: string
  place: string
  opponent?: string
  note?: string
}

export type ScheduleData = {
  updatedAt: string
  events: ClubEvent[]
}
