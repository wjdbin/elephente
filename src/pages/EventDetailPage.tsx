import { Link, useNavigate, useParams } from 'react-router-dom'
import { formatLongDate, formatTimeRange } from '../lib/date'
import { TypeBadge } from '../components/TypeBadge'
import { useSchedule } from '../schedule/context'
import { EVENT_TYPE_LABEL, getEventById } from '../schedule/helpers'

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

      <TypeBadge type={event.type} />

      <div>
        <p className="text-sm text-muted">{EVENT_TYPE_LABEL[event.type]}</p>
        <h2 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">{event.title}</h2>
      </div>

      <dl className="grid gap-4 rounded-3xl border border-line bg-white px-5 py-5 sm:grid-cols-3 sm:px-6 sm:py-6">
        <div>
          <dt className="text-xs font-medium text-muted">날짜</dt>
          <dd className="mt-1 text-lg font-semibold text-ink">{formatLongDate(event.date)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-muted">시간</dt>
          <dd className="mt-1 text-lg font-semibold text-ink">
            {formatTimeRange(event.startTime, event.endTime)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-muted">장소</dt>
          <dd className="mt-1 text-lg font-semibold text-ink">{event.place}</dd>
        </div>
        {event.note ? (
          <div className="sm:col-span-3">
            <dt className="text-xs font-medium text-muted">메모</dt>
            <dd className="mt-1 text-sm leading-relaxed text-ink">{event.note}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  )
}
