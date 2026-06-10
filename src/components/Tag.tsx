import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

const TONES = {
  light: 'border-ink-200 bg-ink-50 text-ink-600',
  dark: 'border-white/15 bg-white/10 text-ink-200',
} as const

/** Quiet chip for specialties and review attributes. */
export function Tag({
  children,
  tone = 'light',
  className,
}: {
  children: ReactNode
  tone?: keyof typeof TONES
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg border px-2.5 py-1 text-caption font-medium',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
