export type EventType = 'training' | 'match' | 'tournament'

export type ClubEvent = {
  id: string
  type: EventType
  title: string
  /** YYYY-MM-DD (Asia/Seoul) */
  date: string
  /** HH:mm */
  startTime?: string
  /** HH:mm */
  endTime?: string
  place: string
  note?: string
}

export type ScheduleData = {
  /** ISO 8601, 담당자가 고친 시각 */
  updatedAt: string
  events: ClubEvent[]
}
