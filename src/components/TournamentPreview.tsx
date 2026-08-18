import { Link } from 'react-router-dom'
import type { ClubEvent } from '../types/schedule'
import { formatShortDate } from '../lib/date'

export function TournamentPreview({ events }: { events: ClubEvent[] }) {
  return (
    <section className="h-full">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base font-bold text-ink sm:text-lg">다가오는 대회</h2>
        <Link to="/tournaments" className="text-sm font-semibold text-brand">
          더보기
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="rounded-2xl border border-line bg-white px-4 py-5 text-sm text-muted">
          다가오는 대회가 없어요
        </p>
      ) : (
        <ul className="space-y-2">
          {events.map((event) => (
            <li key={event.id}>
              <Link
                to={`/events/${event.id}`}
                className="flex items-baseline gap-3 rounded-2xl border border-line bg-white px-4 py-3 sm:px-5 sm:py-4"
              >
                <span className="w-10 shrink-0 text-sm font-semibold text-tourney sm:w-12 sm:text-base">
                  {formatShortDate(event.date)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-ink">{event.title}</span>
                  <span className="block truncate text-sm text-muted">{event.place}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
