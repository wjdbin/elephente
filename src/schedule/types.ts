export type EventType = 'training' | 'match' | 'tournament'

export type ClubEvent = {
  id: string
  type: EventType
  title: string
  date: string
  startTime?: string
  endTime?: string
  place: string
  note?: string
}

export type ScheduleData = {
  updatedAt: string
  events: ClubEvent[]
}
