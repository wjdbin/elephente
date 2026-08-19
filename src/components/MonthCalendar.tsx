import type { ClubEvent } from '../schedule/types'
import type { MonthCell } from '../schedule/helpers'
import { EVENT_TYPE_LABEL, EVENT_TYPE_TEXT, getCalendarCompactLabel, getCalendarPreview } from '../schedule/helpers'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

type Props = {
  cells: MonthCell[]
  eventsByDate: Map<string, ClubEvent[]>
  selectedYmd: string | null
  todayYmd: string
  onSelect: (ymd: string) => void
}

export function MonthCalendar({ cells, eventsByDate, selectedYmd, todayYmd, onSelect }: Props) {
  return (
    <div className="relative isolate">
      <img
        src="/logo.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[58%] w-[min(72%,20rem)] -translate-x-1/2 -translate-y-1/2 select-none opacity-[0.1] sm:w-[min(58%,24rem)] sm:opacity-[0.12]"
      />

      <div>
        <div className="grid grid-cols-7 text-center text-[11px] font-medium text-muted sm:text-sm">
        {WEEKDAYS.map((label) => (
          <div key={label} className="py-1.5 sm:py-2">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px sm:gap-1">
        {cells.map((cell, index) => {
          if (!cell.ymd) {
            return <div key={`empty-${index}`} className="h-20 sm:h-24 lg:h-28" />
          }

          const dayEvents = eventsByDate.get(cell.ymd) ?? []
          const isSelected = selectedYmd === cell.ymd
          const isToday = cell.ymd === todayYmd

          return (
            <button
              key={cell.ymd}
              type="button"
              onClick={() => onSelect(cell.ymd!)}
              className={`flex h-20 flex-col items-stretch rounded-lg px-px pt-0.5 sm:h-24 sm:rounded-xl sm:px-1 sm:pt-2 lg:h-28 ${
                isSelected ? 'bg-brand text-white' : 'text-ink'
              }`}
            >
              <span
                className={`mx-auto flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold sm:h-7 sm:w-7 sm:text-base ${
                  isToday
                    ? isSelected
                      ? 'bg-white text-brand'
                      : 'bg-brand text-white'
                    : ''
                }`}
              >
                {cell.day}
              </span>
              <span className="mt-0.5 min-w-0 flex-1 space-y-px overflow-hidden px-px text-center sm:mt-1 sm:space-y-0.5 sm:px-0.5">
                {dayEvents.length >= 2 ? (
                  <>
                    {dayEvents.slice(0, 2).map((event) => {
                      const tone = isSelected ? 'text-white/90' : EVENT_TYPE_TEXT[event.type]
                      return (
                        <span
                          key={event.id}
                          className={`block truncate text-[8px] font-semibold leading-tight sm:text-[10px] lg:text-xs ${tone}`}
                        >
                          {getCalendarCompactLabel(event)}
                        </span>
                      )
                    })}
                    {dayEvents.length > 2 ? (
                      <span className={`block text-[8px] sm:text-[10px] ${isSelected ? 'text-white/80' : 'text-muted'}`}>
                        +{dayEvents.length - 2}
                      </span>
                    ) : null}
                  </>
                ) : (
                  dayEvents.slice(0, 1).map((event) => {
                    const preview = getCalendarPreview(event)
                    const tone = isSelected ? 'text-white/90' : EVENT_TYPE_TEXT[event.type]
                    return (
                      <span key={event.id} className="block">
                        <span className={`block truncate text-[8px] font-semibold leading-tight sm:text-[10px] lg:text-xs ${tone}`}>
                          {EVENT_TYPE_LABEL[event.type]}
                        </span>
                        <span className={`block truncate text-[8px] leading-tight sm:text-[10px] lg:text-xs ${tone}`}>
                          {preview.time}
                        </span>
                        {preview.opponent ? (
                          <span className={`block truncate text-[8px] leading-tight sm:text-[10px] lg:text-xs ${tone}`}>
                            {preview.opponent}
                          </span>
                        ) : null}
                      </span>
                    )
                  })
                )}
              </span>
            </button>
          )
        })}
        </div>
      </div>
    </div>
  )
}
