import type { ClubEvent } from '../schedule/types'
import type { MonthCell } from '../schedule/helpers'
import { EVENT_TYPE_TEXT, getEventPreview } from '../schedule/helpers'

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
            return <div key={`empty-${index}`} className="h-[4.75rem] sm:h-24 lg:h-28" />
          }

          const dayEvents = eventsByDate.get(cell.ymd) ?? []
          const isSelected = selectedYmd === cell.ymd
          const isToday = cell.ymd === todayYmd

          return (
            <button
              key={cell.ymd}
              type="button"
              onClick={() => onSelect(cell.ymd!)}
              className={`flex h-[4.75rem] flex-col items-stretch rounded-lg px-px pt-0.5 sm:h-24 sm:rounded-xl sm:px-1 sm:pt-2 lg:h-28 ${
                isSelected ? 'bg-brand text-white' : isToday ? 'bg-peach text-navy' : 'text-ink'
              }`}
            >
              <span className="text-center text-xs font-semibold sm:text-base">{cell.day}</span>
              <span className="mt-0.5 min-w-0 flex-1 space-y-px overflow-hidden px-px sm:mt-1 sm:space-y-0.5 sm:px-0.5">
                {dayEvents.slice(0, 1).map((event) => {
                  const preview = getEventPreview(event, true)
                  const tone = isSelected ? 'text-white/90' : EVENT_TYPE_TEXT[event.type]
                  return (
                    <span key={event.id} className="block text-left">
                      <span className={`block truncate text-[8px] leading-tight sm:text-[10px] lg:text-xs ${tone}`}>
                        {preview.primary}
                      </span>
                      <span className={`block truncate text-[8px] leading-tight sm:text-[10px] lg:text-xs ${tone}`}>
                        {preview.secondary}
                      </span>
                    </span>
                  )
                })}
                {dayEvents.length > 1 ? (
                  <span className={`block text-[8px] sm:text-[10px] ${isSelected ? 'text-white/80' : 'text-muted'}`}>
                    +{dayEvents.length - 1}
                  </span>
                ) : null}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
