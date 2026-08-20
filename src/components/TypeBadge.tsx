import type { EventType } from '../schedule/types'
import { EVENT_TYPE_LABEL } from '../schedule/helpers'

const styles: Record<EventType, string> = {
  jeongmo: 'bg-peach text-brand',
  extra_jeongmo: 'bg-brand/15 text-brand',
  kickkitaka: 'bg-navy/10 text-navy',
  sufa: 'bg-orange-100 text-tourney',
  friendly: 'bg-friendly/10 text-friendly',
  other_tournament: 'bg-other/10 text-other',
}

export function TypeBadge({ type }: { type: EventType }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${styles[type]}`}>
      {EVENT_TYPE_LABEL[type]}
    </span>
  )
}
