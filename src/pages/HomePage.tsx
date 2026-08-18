import { todayYmd } from '../lib/date'
import { TodayCard } from '../components/TodayCard'
import { TournamentPreview } from '../components/TournamentPreview'
import { UpdatedAt } from '../components/UpdatedAt'
import { useSchedule } from '../schedule/context'
import { getTodayOrNextSessions, getUpcomingTournaments } from '../schedule/helpers'

export function HomePage() {
  const { schedule, status } = useSchedule()
  const today = todayYmd()
  const slot = getTodayOrNextSessions(schedule.events, today)
  const tournaments = getUpcomingTournaments(schedule.events, today, 2)

  if (status === 'loading') {
    return <p className="text-sm text-muted">일정을 불러오는 중…</p>
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <UpdatedAt iso={schedule.updatedAt} />
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <TodayCard slot={slot} />
        </div>
        <div className="lg:col-span-5">
          <TournamentPreview events={tournaments} />
        </div>
      </div>
    </div>
  )
}
