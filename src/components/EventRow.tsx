import { Link } from 'react-router-dom'
import type { ClubEvent } from '../types/schedule'
import { formatTimeRange } from '../lib/date'
import { TypeBadge } from './TypeBadge'

export function EventRow({ event }: { event: ClubEvent }) {
  return (
    <Link
      to={`/events/${event.id}`}
      className="flex items-start gap-3 rounded-2xl border border-line bg-white px-4 py-3"
    >
      <TypeBadge type={event.type} />
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-ink">{event.title}</span>
        <span className="mt-0.5 block text-sm text-muted">
          {formatTimeRange(event.startTime, event.endTime)} · {event.place}
        </span>
      </span>
    </Link>
  )
}
