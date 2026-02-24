import { createContext, useContext, useRef, useState, useCallback, type ReactNode } from 'react'
import type { Application, CompletenessResult, AlignmentResult, PrimerResult } from './types'
import { invokeCompletenessCheck, invokeAlignmentCheck, invokePrimerGenerate } from './api'

interface ToolState<T> {
  appId: string
  selectedApp: Application | null
  result: T | null
  loading: boolean
  error: string | null
}

function emptyState<T>(): ToolState<T> {
  return { appId: '', selectedApp: null, result: null, loading: false, error: null }
}

interface ContextValue {
  completeness: ToolState<CompletenessResult>
  alignment: ToolState<AlignmentResult>
  primer: ToolState<PrimerResult>

  setCompletenessApp: (id: string, app: Application | null) => void
  setAlignmentApp: (id: string, app: Application | null) => void
  setPrimerApp: (id: string, app: Application | null) => void

  runCompleteness: (force?: boolean) => void
  runAlignment: (force?: boolean) => void
  runPrimer: (force?: boolean) => void
}

const ToolContext = createContext<ContextValue | null>(null)

export function ToolProvider({ children }: { children: ReactNode }) {
  const [completeness, setCompleteness] = useState<ToolState<CompletenessResult>>(emptyState)
  const [alignment, setAlignment] = useState<ToolState<AlignmentResult>>(emptyState)
  const [primer, setPrimer] = useState<ToolState<PrimerResult>>(emptyState)

  // Track the current appId per tool so stale responses don't overwrite
  const completenessAppRef = useRef('')
  const alignmentAppRef = useRef('')
  const primerAppRef = useRef('')

  const setCompletenessApp = useCallback((id: string, app: Application | null) => {
    completenessAppRef.current = id
    setCompleteness({ appId: id, selectedApp: app, result: null, loading: false, error: null })
  }, [])

  const setAlignmentApp = useCallback((id: string, app: Application | null) => {
    alignmentAppRef.current = id
    setAlignment({ appId: id, selectedApp: app, result: null, loading: false, error: null })
  }, [])

  const setPrimerApp = useCallback((id: string, app: Application | null) => {
    primerAppRef.current = id
    setPrimer({ appId: id, selectedApp: app, result: null, loading: false, error: null })
  }, [])

  const runCompleteness = useCallback((force = false) => {
    const appId = completenessAppRef.current
    if (!appId) return
    setCompleteness((prev) => ({ ...prev, loading: true, error: null }))
    invokeCompletenessCheck(appId, force)
      .then((res) => {
        if (completenessAppRef.current === appId) {
          setCompleteness((prev) => ({ ...prev, result: res, loading: false }))
        }
      })
      .catch((err) => {
        if (completenessAppRef.current === appId) {
          setCompleteness((prev) => ({ ...prev, error: String(err instanceof Error ? err.message : err), loading: false }))
        }
      })
  }, [])

  const runAlignment = useCallback((force = false) => {
    const appId = alignmentAppRef.current
    if (!appId) return
    setAlignment((prev) => ({ ...prev, loading: true, error: null }))
    invokeAlignmentCheck(appId, force)
      .then((res) => {
        if (alignmentAppRef.current === appId) {
          setAlignment((prev) => ({ ...prev, result: res, loading: false }))
        }
      })
      .catch((err) => {
        if (alignmentAppRef.current === appId) {
          setAlignment((prev) => ({ ...prev, error: String(err instanceof Error ? err.message : err), loading: false }))
        }
      })
  }, [])

  const runPrimer = useCallback((force = false) => {
    const appId = primerAppRef.current
    if (!appId) return
    setPrimer((prev) => ({ ...prev, loading: true, error: null }))
    invokePrimerGenerate(appId, force)
      .then((res) => {
        if (primerAppRef.current === appId) {
          setPrimer((prev) => ({ ...prev, result: res, loading: false }))
        }
      })
      .catch((err) => {
        if (primerAppRef.current === appId) {
          setPrimer((prev) => ({ ...prev, error: String(err instanceof Error ? err.message : err), loading: false }))
        }
      })
  }, [])

  return (
    <ToolContext.Provider value={{
      completeness, alignment, primer,
      setCompletenessApp, setAlignmentApp, setPrimerApp,
      runCompleteness, runAlignment, runPrimer,
    }}>
      {children}
    </ToolContext.Provider>
  )
}

export function useTools() {
  const ctx = useContext(ToolContext)
  if (!ctx) throw new Error('useTools must be used within ToolProvider')
  return ctx
}
