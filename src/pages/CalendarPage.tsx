import { useMemo, useState } from 'react'
import { addMonths, formatMonthTitle, parseYmd, todayYmd } from '../lib/date'
import { DayEventsModal } from '../components/DayEventsModal'
import { MonthCalendar } from '../components/MonthCalendar'
import { useSchedule } from '../schedule/context'
import { getEventsOnDate, getMonthCells } from '../schedule/helpers'

export function CalendarPage() {
  const { schedule, status } = useSchedule()
  const today = todayYmd()
  const todayParts = parseYmd(today)
  const [cursor, setCursor] = useState({ year: todayParts.year, month: todayParts.month })
  const [selectedYmd, setSelectedYmd] = useState<string | null>(null)

  const cells = useMemo(() => getMonthCells(cursor.year, cursor.month), [cursor])

  const eventsByDate = useMemo(() => {
    const map = new Map<string, typeof schedule.events>()
    for (const event of schedule.events) {
      const list = map.get(event.date) ?? []
      list.push(event)
      map.set(event.date, list)
    }
    return map
  }, [schedule.events])

  const selectedEvents = selectedYmd ? getEventsOnDate(schedule.events, selectedYmd) : []

  function go(delta: number) {
    setCursor((prev) => addMonths(prev.year, prev.month, delta))
  }

  if (status === 'loading') {
    return <p className="text-sm text-muted">일정을 불러오는 중…</p>
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => go(-1)} className="px-2 py-1 text-sm font-semibold text-brand">
          이전
        </button>
        <h2 className="text-base font-bold text-ink sm:text-lg">{formatMonthTitle(cursor.year, cursor.month)}</h2>
        <button type="button" onClick={() => go(1)} className="px-2 py-1 text-sm font-semibold text-brand">
          다음
        </button>
      </div>

      <div className="flex items-center justify-center gap-3 text-[11px] text-muted sm:text-xs">
        <span className="inline-flex items-center gap-1">
          <i className="inline-block h-1.5 w-1.5 rounded-full bg-brand" /> 정모
        </span>
        <span className="inline-flex items-center gap-1">
          <i className="inline-block h-1.5 w-1.5 rounded-full bg-match" /> WUFL
        </span>
        <span className="inline-flex items-center gap-1">
          <i className="inline-block h-1.5 w-1.5 rounded-full bg-tourney" /> SUFA
        </span>
      </div>

      <MonthCalendar
        cells={cells}
        eventsByDate={eventsByDate}
        selectedYmd={selectedYmd}
        todayYmd={today}
        onSelect={setSelectedYmd}
      />

      {selectedYmd ? (
        <DayEventsModal ymd={selectedYmd} events={selectedEvents} onClose={() => setSelectedYmd(null)} />
      ) : null}
    </div>
  )
}
