import type { ReactNode } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'

/** Friendly empty/zero-result state. */
export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-16 text-center">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-ink-300">
        {icon ?? <MagnifyingGlass className="h-6 w-6" />}
      </div>
      <h3 className="text-h3 text-white">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-body-sm text-ink-400">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
