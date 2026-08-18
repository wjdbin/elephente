import { Link } from 'react-router-dom'
import { formatLongDate, formatTimeRange, todayYmd } from '../lib/date'
import { useSchedule } from '../schedule/context'
import { getUpcomingTournaments } from '../schedule/helpers'

export function TournamentsPage() {
  const { schedule, status } = useSchedule()
  const tournaments = getUpcomingTournaments(schedule.events, todayYmd())

  if (status === 'loading') {
    return <p className="text-sm text-muted">일정을 불러오는 중…</p>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-ink sm:text-lg">다가오는 대회</h2>
      {tournaments.length === 0 ? (
        <p className="rounded-2xl border border-line bg-white px-4 py-5 text-sm text-muted">
          다가오는 대회가 없어요
        </p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2 sm:gap-3">
          {tournaments.map((event) => (
            <li key={event.id}>
              <Link
                to={`/events/${event.id}`}
                className="block h-full rounded-2xl border border-line bg-white px-4 py-3 sm:px-5 sm:py-4"
              >
                <p className="text-sm font-semibold text-tourney">{formatLongDate(event.date)}</p>
                <p className="mt-1 font-medium text-ink">{event.title}</p>
                <p className="mt-0.5 text-sm text-muted">
                  {formatTimeRange(event.startTime, event.endTime)} · {event.place}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
