import { useMemo, useState } from 'react'
import { addMonths, formatLongDate, formatMonthTitle, parseYmd, todayYmd } from '../lib/date'
import { getEventsOnDate, getMonthCells } from '../lib/schedule'
import { EventRow } from '../components/EventRow'
import { MonthCalendar } from '../components/MonthCalendar'
import { useSchedule } from '../schedule/ScheduleContext'

export function CalendarPage() {
  const { schedule, status } = useSchedule()
  const today = todayYmd()
  const todayParts = parseYmd(today)
  const [cursor, setCursor] = useState({ year: todayParts.year, month: todayParts.month })
  const [selectedYmd, setSelectedYmd] = useState<string | null>(today)

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
  const selectedInView =
    selectedYmd !== null &&
    parseYmd(selectedYmd).year === cursor.year &&
    parseYmd(selectedYmd).month === cursor.month

  function go(delta: number) {
    setCursor((prev) => addMonths(prev.year, prev.month, delta))
  }

  if (status === 'loading') {
    return <p className="text-sm text-muted">일정을 불러오는 중…</p>
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="space-y-4 lg:col-span-7">
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
            <i className="inline-block h-1.5 w-1.5 rounded-full bg-brand" /> 훈련
          </span>
          <span className="inline-flex items-center gap-1">
            <i className="inline-block h-1.5 w-1.5 rounded-full bg-match" /> 경기
          </span>
          <span className="inline-flex items-center gap-1">
            <i className="inline-block h-1.5 w-1.5 rounded-full bg-tourney" /> 대회
          </span>
        </div>

        <MonthCalendar
          cells={cells}
          eventsByDate={eventsByDate}
          selectedYmd={selectedInView ? selectedYmd : null}
          todayYmd={today}
          onSelect={setSelectedYmd}
        />
      </div>

      <section className="lg:col-span-5">
        <h3 className="mb-2 text-sm font-bold text-ink sm:text-base">
          {selectedYmd ? formatLongDate(selectedYmd) : '날짜를 선택하세요'}
        </h3>
        {selectedEvents.length === 0 ? (
          <p className="rounded-2xl border border-line bg-white px-4 py-5 text-sm text-muted">
            이 날 일정이 없어요
          </p>
        ) : (
          <ul className="space-y-2">
            {selectedEvents.map((event) => (
              <li key={event.id}>
                <EventRow event={event} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
