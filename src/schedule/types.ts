export const EVENT_TYPES = ['jeongmo', 'wufl', 'sufa'] as const

export type EventType = (typeof EVENT_TYPES)[number]

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
