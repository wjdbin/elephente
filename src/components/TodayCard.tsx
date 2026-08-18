import { Link } from 'react-router-dom'
import type { TodayOrNext } from '../schedule/helpers'
import { EVENT_TYPE_LABEL } from '../schedule/helpers'
import { formatCardDate, formatTimeRange } from '../lib/date'

export function TodayCard({ slot }: { slot: TodayOrNext | null }) {
  if (!slot) {
    return (
      <section className="rounded-3xl bg-brand px-5 py-8 text-white shadow-lg sm:px-8 sm:py-10">
        <p className="text-sm font-medium text-white/80">오늘 · 다음</p>
        <p className="mt-4 text-2xl font-bold leading-snug sm:text-3xl">예정된 훈련·경기가 없어요</p>
      </section>
    )
  }

  const heading =
    slot.kind === 'today'
      ? slot.events.length === 1
        ? `오늘 ${EVENT_TYPE_LABEL[slot.events[0].type]}`
        : '오늘 일정'
      : slot.events.length === 1
        ? `다음 ${EVENT_TYPE_LABEL[slot.events[0].type]}`
        : '다음 일정'

  return (
    <section className="h-full rounded-3xl bg-brand px-5 py-6 text-white shadow-lg sm:px-8 sm:py-8">
      <p className="text-sm font-medium text-white/90 sm:text-base">{heading}</p>
      <p className="mt-1 text-sm text-white/70 sm:text-base">{formatCardDate(slot.date)}</p>

      <ul className="mt-5 space-y-5 sm:mt-8 sm:space-y-6">
        {slot.events.map((event) => (
          <li key={event.id}>
            {slot.events.length > 1 && (
              <p className="mb-1 text-sm font-medium text-white/80">{EVENT_TYPE_LABEL[event.type]}</p>
            )}
            <p className="text-[2rem] font-bold leading-none tracking-tight sm:text-5xl">
              {formatTimeRange(event.startTime, event.endTime)}
            </p>
            <p className="mt-2 text-2xl font-semibold sm:mt-3 sm:text-3xl">{event.place}</p>
          </li>
        ))}
      </ul>

      <Link
        to={`/events/${slot.events[0].id}`}
        className="mt-6 inline-flex text-sm font-semibold text-white/95 underline underline-offset-4 sm:mt-8 sm:text-base"
      >
        자세히
      </Link>
    </section>
  )
}
