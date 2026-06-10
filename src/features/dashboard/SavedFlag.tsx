import { useCallback, useEffect, useRef, useState } from 'react'
import { CheckCircle } from '@phosphor-icons/react'

/** Transient "saved" state that auto-clears, so each form doesn't re-implement it. */
export function useSavedFlag(ms = 2500): [boolean, () => void] {
  const [saved, setSaved] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const mark = useCallback(() => {
    setSaved(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setSaved(false), ms)
  }, [ms])

  useEffect(() => () => clearTimeout(timer.current), [])
  return [saved, mark]
}

export function SavedBanner({ show, children = 'Changes saved' }: { show: boolean; children?: React.ReactNode }) {
  if (!show) return null
  return (
    <p className="flex items-center gap-2 rounded-lg bg-verified-50 px-3 py-2 text-body-sm font-medium text-verified-700">
      <CheckCircle weight="fill" className="h-4 w-4 shrink-0" />
      {children}
    </p>
  )
}
