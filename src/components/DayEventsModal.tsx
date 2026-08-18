import { useEffect } from 'react'
import type { ClubEvent } from '../schedule/types'
import { formatLongDate } from '../lib/date'
import { EventDetails } from './EventDetails'

type Props = {
  ymd: string
  events: ClubEvent[]
  onClose: () => void
}

export function DayEventsModal({ ymd, events, onClose }: Props) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-navy/40"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="day-events-title"
        className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white px-5 py-5 shadow-xl sm:rounded-3xl sm:px-6 sm:py-6"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id="day-events-title" className="text-base font-bold text-ink sm:text-lg">
            {formatLongDate(ymd)}
          </h2>
          <button type="button" onClick={onClose} className="text-sm font-semibold text-muted hover:text-brand">
            닫기
          </button>
        </div>

        {events.length === 0 ? (
          <p className="py-6 text-sm text-muted">이 날 일정이 없어요</p>
        ) : (
          <ul className="space-y-6">
            {events.map((event) => (
              <li key={event.id} className="border-t border-line pt-5 first:border-t-0 first:pt-0">
                <EventDetails event={event} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
