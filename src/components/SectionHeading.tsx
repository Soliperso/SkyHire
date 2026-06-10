import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Consistent section title + optional subtitle/action, used across pages. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  tone = 'light',
  className,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  action?: ReactNode
  /** `dark` renders light text for use on dark/cinematic backgrounds. */
  tone?: 'light' | 'dark'
  className?: string
}) {
  const dark = tone === 'dark'
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-4', className)}>
      <div className="max-w-2xl">
        {eyebrow && (
          <p
            className={cn(
              'mb-2.5 inline-flex items-center gap-2 text-caption font-semibold uppercase tracking-wider',
              dark ? 'text-accent-300' : 'text-brand-600',
            )}
          >
            <span
              className={cn(
                'h-px w-6 bg-gradient-to-r',
                dark ? 'from-accent-400 to-brand-400' : 'from-brand-500 to-accent-400',
              )}
            />
            {eyebrow}
          </p>
        )}
        <h2 className={cn('text-h2', dark ? 'text-white' : 'text-ink-900')}>{title}</h2>
        {subtitle && (
          <p className={cn('mt-2 text-body', dark ? 'text-ink-300' : 'text-ink-500')}>{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  )
}
