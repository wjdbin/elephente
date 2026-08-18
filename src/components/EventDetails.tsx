import type { ClubEvent } from '../schedule/types'
import { formatArriveBy, formatFromTo, formatLongDate } from '../lib/date'
import { getOpponent } from '../schedule/helpers'
import { TypeBadge } from './TypeBadge'

export function EventDetails({ event }: { event: ClubEvent }) {
  const opponent = getOpponent(event)
  const isMatch = event.type === 'wufl' || event.type === 'sufa'
  const arriveBy = isMatch ? formatArriveBy(event.startTime) : undefined

  return (
    <div className="space-y-4">
      <TypeBadge type={event.type} />

      {isMatch && opponent ? (
        <h3 className="text-xl font-bold text-ink sm:text-2xl">vs {opponent}</h3>
      ) : null}

      <dl className="grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-medium text-muted">날짜</dt>
          <dd className="mt-1 text-base font-semibold text-ink sm:text-lg">{formatLongDate(event.date)}</dd>
        </div>
        {event.type === 'jeongmo' || event.startTime || event.endTime ? (
          <div>
            <dt className="text-xs font-medium text-muted">시간</dt>
            <dd className="mt-1 text-base font-semibold text-ink sm:text-lg">
              {formatFromTo(event.startTime, event.endTime)}
            </dd>
          </div>
        ) : null}
        <div>
          <dt className="text-xs font-medium text-muted">장소</dt>
          <dd className="mt-1 text-base font-semibold text-ink sm:text-lg">{event.place}</dd>
        </div>
        {isMatch ? (
          <div>
            <dt className="text-xs font-medium text-muted">상대</dt>
            <dd className="mt-1 text-base font-semibold text-ink sm:text-lg">{opponent ?? '미정'}</dd>
          </div>
        ) : null}
        {arriveBy ? (
          <div className="sm:col-span-3 rounded-2xl bg-peach px-4 py-3">
            <dt className="text-xs font-medium text-brand">도착</dt>
            <dd className="mt-1 text-base font-semibold text-ink sm:text-lg">{arriveBy}</dd>
            <p className="mt-0.5 text-xs text-muted">경기 시작 1시간 30분 전</p>
          </div>
        ) : null}
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
