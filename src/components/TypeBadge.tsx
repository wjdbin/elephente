import type { EventType } from '../types/schedule'
import { EVENT_TYPE_LABEL } from '../lib/schedule'

const styles: Record<EventType, string> = {
  training: 'bg-peach text-brand',
  match: 'bg-navy/10 text-navy',
  tournament: 'bg-orange-100 text-tourney',
}

export function TypeBadge({ type }: { type: EventType }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${styles[type]}`}>
      {EVENT_TYPE_LABEL[type]}
    </span>
  )
}
