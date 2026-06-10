import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type BadgeTone = 'neutral' | 'brand' | 'verified' | 'warning' | 'danger'

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-ink-100 text-ink-700',
  brand: 'bg-brand-50 text-brand-700',
  verified: 'bg-verified-50 text-verified-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-danger-50 text-danger-700',
}

/** Small status/label pill. */
export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: BadgeTone
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-caption font-semibold',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
