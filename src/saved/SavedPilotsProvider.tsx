import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'skyhire.saved'

interface SavedPilotsValue {
  /** Pilot ids the visitor has saved. */
  ids: string[]
  isSaved: (id: string) => boolean
  toggle: (id: string) => void
  count: number
}

const SavedPilotsContext = createContext<SavedPilotsValue | null>(null)

function readStored(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

/**
 * Saved (favorited) pilots, persisted to localStorage. This is a client-side
 * stand-in for a "saved pilots" table; a Supabase-backed version would expose
 * the same contract so the heart button and Saved page never change.
 */
export function SavedPilotsProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(readStored)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch {
      // Non-fatal — favorites simply won't persist across reloads.
    }
  }, [ids])

  const toggle = useCallback((id: string) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]))
  }, [])

  const value = useMemo<SavedPilotsValue>(
    () => ({ ids, isSaved: (id) => ids.includes(id), toggle, count: ids.length }),
    [ids, toggle],
  )

  return <SavedPilotsContext.Provider value={value}>{children}</SavedPilotsContext.Provider>
}

export function useSavedPilots(): SavedPilotsValue {
  const ctx = useContext(SavedPilotsContext)
  if (!ctx) throw new Error('useSavedPilots must be used within a SavedPilotsProvider')
  return ctx
}
