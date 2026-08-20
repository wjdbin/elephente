export const EVENT_TYPES = ['jeongmo', 'extra_jeongmo', 'kickkitaka', 'sufa', 'friendly', 'other_tournament'] as const

export type EventType = (typeof EVENT_TYPES)[number]

export const JEONGMO_TYPES = ['jeongmo', 'extra_jeongmo'] as const satisfies readonly EventType[]
export const MATCH_TYPES = ['kickkitaka', 'sufa', 'friendly', 'other_tournament'] as const satisfies readonly EventType[]

export function isJeongmoType(type: EventType): boolean {
  return type === 'jeongmo' || type === 'extra_jeongmo'
}

export function isMatchType(type: EventType): boolean {
  return (MATCH_TYPES as readonly string[]).includes(type)
}

export function requiresOpponent(type: EventType): boolean {
  return type === 'kickkitaka' || type === 'friendly'
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
