import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useSchedule } from '../schedule/context'
import { checkAdminPin, deleteEvent, upsertEvent } from '../schedule/api'
import { EVENT_TYPE_LABEL, defaultEventTitle, getEventPreview } from '../schedule/helpers'
import { EVENT_TYPES, type ClubEvent, type EventType } from '../schedule/types'

const emptyForm: Omit<ClubEvent, 'id'> & { id?: string } = {
  type: 'jeongmo',
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  place: '',
  opponent: '',
  note: '',
}

export function AdminPage() {
  const { schedule, status, reload } = useSchedule()
  const [pinInput, setPinInput] = useState('')
  const [pin, setPin] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [showPin, setShowPin] = useState(false)

  useEffect(() => {
    sessionStorage.removeItem('elephente-admin-pin')
  }, [])

  const events = useMemo(
    () => [...schedule.events].sort((a, b) => a.date.localeCompare(b.date) || (a.startTime ?? '').localeCompare(b.startTime ?? '')),
    [schedule.events],
  )

  async function unlock(event: FormEvent) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      const ok = await checkAdminPin(pinInput)
      if (!ok) {
        setError('비밀번호가 달라요')
        return
      }
      setPin(pinInput)
      setPinInput('')
      setUnlocked(true)
    } catch {
      setError('운영 페이지에 연결하지 못했어요')
    } finally {
      setBusy(false)
    }
  }

  function startEdit(event: ClubEvent) {
    setForm({ ...event })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    if (!form.date || !form.place) {
      setError('날짜와 장소는 필수예요')
      return
    }
    if (form.type === 'jeongmo' && (!form.startTime || !form.endTime)) {
      setError('정모는 시작·끝나는 시간을 넣어 주세요')
      return
    }
    if ((form.type === 'wufl' || form.type === 'sufa') && !form.opponent?.trim()) {
      setError('상대 학교를 넣어 주세요')
      return
    }
    setError('')
    setBusy(true)
    try {
      await upsertEvent(pin, {
        id: form.id || crypto.randomUUID(),
        type: form.type,
        title: defaultEventTitle({ type: form.type, title: form.title, opponent: form.opponent }),
        date: form.date,
        startTime: form.startTime || undefined,
        endTime: form.endTime || undefined,
        place: form.place.trim(),
        opponent: form.type === 'jeongmo' ? undefined : form.opponent?.trim() || undefined,
        note: form.note?.trim() || undefined,
      })
      setForm(emptyForm)
      await reload()
    } catch {
      setError('저장에 실패했어요. 비밀번호를 다시 확인해 주세요.')
    } finally {
      setBusy(false)
    }
  }

  async function remove(id: string) {
    if (!window.confirm('이 일정을 삭제할까요?')) return
    setBusy(true)
    setError('')
    try {
      await deleteEvent(pin, id)
      await reload()
    } catch {
      setError('삭제에 실패했어요.')
    } finally {
      setBusy(false)
    }
  }

  if (!unlocked) {
    return (
      <form onSubmit={unlock} className="mx-auto max-w-sm space-y-4">
        <h2 className="text-lg font-bold text-ink">운영</h2>
        <p className="text-sm text-muted">임원진만 일정을 고칠 수 있어요. 비밀번호를 입력해 주세요.</p>
        <div className="relative">
          <input
            type={showPin ? 'text' : 'password'}
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="운영 비밀번호"
            autoComplete="current-password"
            autoFocus
            className="w-full rounded-2xl border border-line bg-white py-3 pl-4 pr-12"
          />
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              setShowPin((prev) => !prev)
            }}
            aria-label={showPin ? '비밀번호 숨기기' : '비밀번호 보기'}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted"
          >
            {showPin ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 3l18 18" />
                <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                <path d="M9.9 5.1A9.8 9.8 0 0 1 12 5c5 0 9.3 3.1 11 7-.5 1.2-1.2 2.3-2.1 3.3M6.1 6.1C3.9 7.6 2.2 9.7 1 12c1.7 3.9 6 7 11 7 1.7 0 3.3-.4 4.7-1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M1 12c1.7-3.9 6-7 11-7s9.3 3.1 11 7c-1.7 3.9-6 7-11 7S2.7 15.9 1 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {error ? <p className="text-sm text-tourney">{error}</p> : null}
        <button
          type="submit"
          disabled={busy || !pinInput}
          className="w-full rounded-2xl bg-brand py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          들어가기
        </button>
      </form>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-ink">일정 수정</h2>
          <p className="mt-1 text-sm text-muted">저장하면 부원 화면에 바로 반영돼요. 톡에는 그다음에 올리면 됩니다.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setUnlocked(false)
            setPin('')
            setForm(emptyForm)
            setError('')
          }}
          className="shrink-0 text-sm font-semibold text-muted hover:text-brand"
        >
          잠금
        </button>
      </div>

      <form onSubmit={save} className="space-y-3 rounded-3xl border border-line bg-white p-4 sm:p-5">
        <p className="text-sm font-semibold text-ink">{form.id ? '일정 수정' : '새 일정'}</p>
        <select
          value={form.type}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              type: e.target.value as EventType,
              opponent: e.target.value === 'jeongmo' ? '' : prev.opponent,
            }))
          }
          className="w-full rounded-2xl border border-line px-4 py-3"
        >
          {EVENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {EVENT_TYPE_LABEL[type]}
            </option>
          ))}
        </select>
        <input
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="제목 (선택)"
          className="w-full rounded-2xl border border-line px-4 py-3"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
            className="rounded-2xl border border-line px-4 py-3"
          />
          <input
            type="time"
            value={form.startTime ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, startTime: e.target.value }))}
            className="rounded-2xl border border-line px-4 py-3"
          />
          <input
            type="time"
            value={form.endTime ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, endTime: e.target.value }))}
            className="rounded-2xl border border-line px-4 py-3"
          />
        </div>
        <input
          value={form.place}
          onChange={(e) => setForm((prev) => ({ ...prev, place: e.target.value }))}
          placeholder="장소"
          className="w-full rounded-2xl border border-line px-4 py-3"
        />
        {form.type === 'wufl' || form.type === 'sufa' ? (
          <input
            value={form.opponent ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, opponent: e.target.value }))}
            placeholder="상대 학교"
            className="w-full rounded-2xl border border-line px-4 py-3"
          />
        ) : null}
        <input
          value={form.note ?? ''}
          onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
          placeholder="메모 (선택)"
          className="w-full rounded-2xl border border-line px-4 py-3"
        />
        {error ? <p className="text-sm text-tourney">{error}</p> : null}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={busy}
            className="flex-1 rounded-2xl bg-brand py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            저장
          </button>
          {form.id ? (
            <button
              type="button"
              onClick={() => setForm(emptyForm)}
              className="rounded-2xl border border-line px-4 py-3 text-sm font-semibold text-muted"
            >
              취소
            </button>
          ) : null}
        </div>
      </form>

      {status === 'loading' ? (
        <p className="text-sm text-muted">일정을 불러오는 중…</p>
      ) : (
        <ul className="space-y-2">
          {events.map((event) => (
            <li key={event.id} className="rounded-2xl border border-line bg-white px-4 py-3">
              <p className="text-xs font-semibold text-brand">{EVENT_TYPE_LABEL[event.type]}</p>
              <p className="font-medium text-ink">{getEventPreview(event).primary}</p>
              <p className="text-sm text-muted">
                {event.date} · {getEventPreview(event).secondary}
              </p>
              <div className="mt-2 flex gap-3">
                <button type="button" onClick={() => startEdit(event)} className="text-sm font-semibold text-brand">
                  수정
                </button>
                <button type="button" onClick={() => remove(event.id)} className="text-sm font-semibold text-muted">
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
