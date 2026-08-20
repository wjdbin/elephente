import { Link } from 'react-router-dom'
import type { ClubEvent } from '../schedule/types'
import { formatShortDate } from '../lib/date'
import { TypeBadge } from './TypeBadge'
import { getEventPreview } from '../schedule/helpers'

export function TournamentPreview({ events }: { events: ClubEvent[] }) {
  return (
    <section className="h-full">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base font-bold text-ink sm:text-lg">다가오는 경기·대회</h2>
        <Link to="/tournaments" className="text-sm font-semibold text-brand">
          더보기
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="rounded-2xl border border-line bg-white px-4 py-5 text-sm text-muted">
          다가오는 경기·대회 일정이 없어요
        </p>
      ) : (
        <ul className="space-y-2">
          {events.map((event) => {
            const preview = getEventPreview(event)
            return (
              <li key={event.id}>
                <Link
                  to={`/events/${event.id}`}
                  className="flex items-start gap-3 rounded-2xl border border-line bg-white px-4 py-3 sm:px-5 sm:py-4"
                >
                  <span className="w-10 shrink-0 pt-0.5 text-sm font-semibold text-ink sm:w-12 sm:text-base">
                    {formatShortDate(event.date)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <TypeBadge type={event.type} />
                    <span className="mt-1 block truncate font-medium text-ink">{preview.primary}</span>
                    <span className="block truncate text-sm text-muted">{preview.secondary}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
