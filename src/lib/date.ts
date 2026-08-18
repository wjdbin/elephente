const KST = 'Asia/Seoul'

function pad2(value: number): string {
  return String(value).padStart(2, '0')
}

/** 오늘 날짜 YYYY-MM-DD (KST) */
export function todayYmd(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: KST,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

export function toYmd(year: number, month: number, day: number): string {
  return `${year}-${pad2(month)}-${pad2(day)}`
}

export function parseYmd(ymd: string): { year: number; month: number; day: number } {
  const [year, month, day] = ymd.split('-').map(Number)
  return { year, month, day }
}

/** 일요일=0. 날짜만 있는 YYYY-MM-DD 기준 (KST 정오). */
export function weekdaySun0(ymd: string): number {
  const { year, month, day } = parseYmd(ymd)
  return new Date(Date.UTC(year, month - 1, day, 3, 0, 0)).getUTCDay()
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

export function addMonths(year: number, month: number, delta: number): { year: number; month: number } {
  const index = year * 12 + (month - 1) + delta
  return { year: Math.floor(index / 12), month: (index % 12) + 1 }
}

export function formatMonthTitle(year: number, month: number): string {
  return `${year}년 ${month}월`
}

/** 화 8/18 */
export function formatCardDate(ymd: string): string {
  const { month, day } = parseYmd(ymd)
  const weekday = new Intl.DateTimeFormat('ko-KR', {
    weekday: 'short',
    timeZone: KST,
  }).format(new Date(`${ymd}T12:00:00+09:00`))
  return `${weekday} ${month}/${day}`
}

/** 8월 18일 (화) */
export function formatLongDate(ymd: string): string {
  const { month, day } = parseYmd(ymd)
  const weekday = new Intl.DateTimeFormat('ko-KR', {
    weekday: 'short',
    timeZone: KST,
  }).format(new Date(`${ymd}T12:00:00+09:00`))
  return `${month}월 ${day}일 (${weekday})`
}

/** 9/6 */
export function formatShortDate(ymd: string): string {
  const { month, day } = parseYmd(ymd)
  return `${month}/${day}`
}

export function formatTimeRange(startTime?: string, endTime?: string): string {
  if (!startTime && !endTime) return '시간 미정'
  if (startTime && endTime) return `${startTime} – ${endTime}`
  return startTime ?? endTime ?? '시간 미정'
}

/** 18:00부터 20:00까지 */
export function formatFromTo(startTime?: string, endTime?: string): string {
  if (startTime && endTime) return `${startTime}부터 ${endTime}까지`
  if (startTime) return `${startTime}부터`
  if (endTime) return `${endTime}까지`
  return '시간 미정'
}

/** HH:MM에서 분을 빼기. 자정을 넘으면 dayOffset -1 */
export function timeMinusMinutes(
  time: string,
  minutes: number,
): { time: string; dayOffset: number } | undefined {
  const matched = time.match(/^(\d{1,2}):(\d{2})$/)
  if (!matched) return undefined

  const hours = Number(matched[1])
  const mins = Number(matched[2])
  if (!Number.isInteger(hours) || !Number.isInteger(mins) || hours > 23 || mins > 59) return undefined

  const total = hours * 60 + mins - minutes
  const dayOffset = Math.floor(total / (24 * 60))
  const wrapped = ((total % (24 * 60)) + 24 * 60) % (24 * 60)

  return {
    time: `${pad2(Math.floor(wrapped / 60))}:${pad2(wrapped % 60)}`,
    dayOffset,
  }
}

export function formatArriveBy(startTime?: string, minutesBefore = 90): string | undefined {
  if (!startTime) return undefined
  const result = timeMinusMinutes(startTime, minutesBefore)
  if (!result) return undefined
  if (result.dayOffset < 0) return `전날 ${result.time}까지`
  return `${result.time}까지`
}

export function formatUpdatedAt(iso: string, now = new Date()): string {
  const updated = new Date(iso)
  const today = todayYmd(now)
  const updatedDay = new Intl.DateTimeFormat('en-CA', {
    timeZone: KST,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(updated)

  const time = new Intl.DateTimeFormat('ko-KR', {
    timeZone: KST,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(updated)

  if (updatedDay === today) return `오늘 ${time} 갱신`

  const { year, month, day } = parseYmd(today)
  const yesterdayDate = new Date(Date.UTC(year, month - 1, day, 3, 0, 0))
  yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1)
  const yesterday = `${yesterdayDate.getUTCFullYear()}-${pad2(yesterdayDate.getUTCMonth() + 1)}-${pad2(yesterdayDate.getUTCDate())}`

  if (updatedDay === yesterday) return `어제 ${time} 갱신`

  const parts = parseYmd(updatedDay)
  return `${parts.month}월 ${parts.day}일 ${time} 갱신`
}
