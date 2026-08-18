import type { EventType } from '../schedule/types'
import { EVENT_TYPE_LABEL } from '../schedule/helpers'

const styles: Record<EventType, string> = {
  jeongmo: 'bg-peach text-brand',
  wufl: 'bg-navy/10 text-navy',
  sufa: 'bg-orange-100 text-tourney',
}

export function TypeBadge({ type }: { type: EventType }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${styles[type]}`}>
      {EVENT_TYPE_LABEL[type]}
    </span>
  )
}
