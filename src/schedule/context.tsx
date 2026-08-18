import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { fetchRemoteSchedule } from './api'
import fallbackJson from './fallback.json'
import type { ScheduleData } from './types'

const fallbackSchedule = fallbackJson as ScheduleData

type ScheduleValue = {
  schedule: ScheduleData
  source: 'remote' | 'file'
  status: 'loading' | 'ready'
  reload: () => Promise<void>
}

const ScheduleContext = createContext<ScheduleValue | null>(null)

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [schedule, setSchedule] = useState<ScheduleData>(fallbackSchedule)
  const [source, setSource] = useState<'remote' | 'file'>('file')
  const [status, setStatus] = useState<ScheduleValue['status']>(supabase ? 'loading' : 'ready')

  const reload = useCallback(async () => {
    if (!supabase) {
      setSchedule(fallbackSchedule)
      setSource('file')
      setStatus('ready')
      return
    }

    setStatus('loading')
    try {
      setSchedule(await fetchRemoteSchedule())
      setSource('remote')
    } catch {
      setSchedule(fallbackSchedule)
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
  if (!value) throw new Error('useSchedule must be used within ScheduleProvider')
  return value
}
