import { Link } from 'react-router-dom'
import type { ClubEvent } from '../schedule/types'
import { getEventPreview } from '../schedule/helpers'
import { TypeBadge } from './TypeBadge'

export function EventRow({ event }: { event: ClubEvent }) {
  const preview = getEventPreview(event)

  return (
    <Link
      to={`/events/${event.id}`}
      className="flex items-start gap-3 rounded-2xl border border-line bg-white px-4 py-3"
    >
      <TypeBadge type={event.type} />
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-ink">{preview.primary}</span>
        <span className="mt-0.5 block text-sm text-muted">{preview.secondary}</span>
      </span>
    </Link>
  )
}
