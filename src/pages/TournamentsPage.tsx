import { Link } from 'react-router-dom'
import { formatLongDate, todayYmd } from '../lib/date'
import { TypeBadge } from '../components/TypeBadge'
import { useSchedule } from '../schedule/context'
import { getEventPreview, getUpcomingTournaments } from '../schedule/helpers'

export function TournamentsPage() {
  const { schedule, status } = useSchedule()
  const tournaments = getUpcomingTournaments(schedule.events, todayYmd())

  if (status === 'loading') {
    return <p className="text-sm text-muted">일정을 불러오는 중…</p>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-ink sm:text-lg">다가오는 경기·대회</h2>
      {tournaments.length === 0 ? (
        <p className="rounded-2xl border border-line bg-white px-4 py-5 text-sm text-muted">
          다가오는 경기·대회 일정이 없어요
        </p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2 sm:gap-3">
          {tournaments.map((event) => {
            const preview = getEventPreview(event)
            return (
              <li key={event.id}>
                <Link
                  to={`/events/${event.id}`}
                  className="block h-full rounded-2xl border border-line bg-white px-4 py-3 sm:px-5 sm:py-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-ink">{formatLongDate(event.date)}</p>
                    <TypeBadge type={event.type} />
                  </div>
                  <p className="mt-2 font-medium text-ink">{preview.primary}</p>
                  <p className="mt-0.5 text-sm text-muted">{preview.secondary}</p>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
