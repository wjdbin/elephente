import type { ClubEvent } from '../types/schedule'
import type { MonthCell } from '../lib/schedule'
import { EVENT_TYPE_LABEL } from '../lib/schedule'

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
      <div className="grid grid-cols-7 text-center text-xs font-medium text-muted sm:text-sm">
        {WEEKDAYS.map((label) => (
          <div key={label} className="py-2">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1 sm:gap-1">
        {cells.map((cell, index) => {
          if (!cell.ymd) {
            return <div key={`empty-${index}`} className="h-14 sm:h-20 lg:h-24" />
          }

          const dayEvents = eventsByDate.get(cell.ymd) ?? []
          const isSelected = selectedYmd === cell.ymd
          const isToday = cell.ymd === todayYmd

          return (
            <button
              key={cell.ymd}
              type="button"
              onClick={() => onSelect(cell.ymd!)}
              className={`flex h-14 flex-col items-center rounded-xl px-0.5 pt-1 sm:h-20 sm:px-1 sm:pt-2 lg:h-24 ${
                isSelected ? 'bg-brand text-white' : isToday ? 'bg-peach text-navy' : 'text-ink'
              }`}
            >
              <span className="text-sm font-semibold sm:text-base">{cell.day}</span>
              <span className="mt-0.5 flex flex-wrap justify-center gap-0.5 sm:hidden">
                {dayEvents.slice(0, 3).map((event) => (
                  <span
                    key={event.id}
                    className={`h-1.5 w-1.5 rounded-full ${
                      event.type === 'training'
                        ? isSelected
                          ? 'bg-white'
                          : 'bg-brand'
                        : event.type === 'match'
                          ? isSelected
                            ? 'bg-sky-200'
                            : 'bg-match'
                          : isSelected
                            ? 'bg-orange-200'
                            : 'bg-tourney'
                    }`}
                    title={EVENT_TYPE_LABEL[event.type]}
                  />
                ))}
              </span>
              <span className="mt-1 hidden w-full space-y-0.5 px-0.5 sm:block">
                {dayEvents.slice(0, 2).map((event) => (
                  <span
                    key={event.id}
                    className={`block truncate text-[10px] leading-tight lg:text-xs ${
                      isSelected ? 'text-white/90' : 'text-muted'
                    }`}
                  >
                    {EVENT_TYPE_LABEL[event.type]}
                  </span>
                ))}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
