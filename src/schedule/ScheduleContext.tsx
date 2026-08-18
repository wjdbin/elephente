import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { fileSchedule } from '../data/schedule'
import { fetchRemoteSchedule } from '../lib/scheduleApi'
import { supabase } from '../lib/supabase'
import type { ScheduleData } from '../types/schedule'

export type ScheduleSource = 'remote' | 'file'

type ScheduleValue = {
  schedule: ScheduleData
  source: ScheduleSource
  status: 'loading' | 'ready'
  reload: () => Promise<void>
}

const ScheduleContext = createContext<ScheduleValue | null>(null)

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [schedule, setSchedule] = useState<ScheduleData>(fileSchedule)
  const [source, setSource] = useState<ScheduleSource>('file')
  const [status, setStatus] = useState<ScheduleValue['status']>(supabase ? 'loading' : 'ready')

  const reload = useCallback(async () => {
    if (!supabase) {
      setSchedule(fileSchedule)
      setSource('file')
      setStatus('ready')
      return
    }

    setStatus('loading')
    try {
      const remote = await fetchRemoteSchedule()
      setSchedule(remote)
      setSource('remote')
    } catch {
      setSchedule(fileSchedule)
      setSource('file')
    } finally {
      setStatus('ready')
    }
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  return (
    <ScheduleContext.Provider value={{ schedule, source, status, reload }}>
      {children}
    </ScheduleContext.Provider>
  )
}

export function useSchedule(): ScheduleValue {
  const value = useContext(ScheduleContext)
  if (!value) throw new Error('useSchedule는 ScheduleProvider 안에서만 쓸 수 있어요')
  return value
}
