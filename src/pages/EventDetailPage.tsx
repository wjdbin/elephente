import { Link, useNavigate, useParams } from 'react-router-dom'
import { EventDetails } from '../components/EventDetails'
import { useSchedule } from '../schedule/context'
import { getEventById } from '../schedule/helpers'

export function EventDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { schedule, status } = useSchedule()
  const event = id ? getEventById(schedule.events, id) : undefined

  if (status === 'loading') {
    return <p className="text-sm text-muted">일정을 불러오는 중…</p>
  }

  if (!event) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <p className="text-base font-bold text-ink">일정을 찾을 수 없어요</p>
        <Link to="/" className="text-sm font-semibold text-brand">
          오늘로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5">
      <button
        type="button"
        onClick={() => {
          if (window.history.length > 1) navigate(-1)
          else navigate('/')
        }}
        className="text-sm font-semibold text-brand"
      >
        ← 뒤로
      </button>

      <div className="rounded-3xl border border-line bg-white px-5 py-5 sm:px-6 sm:py-6">
        <EventDetails event={event} />
      </div>
    </div>
  )
}
