import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type CardVariant = 'solid' | 'glass' | 'elevated'

const SURFACES: Record<CardVariant, string> = {
  // Light surface for white/neutral backgrounds.
  solid: 'border border-ink-200 bg-white shadow-card',
  // Translucent surface for dark/cinematic backgrounds.
  glass: 'glass',
  // Opaque dark surface for dark/cinematic backgrounds (content cards).
  elevated: 'border border-white/10 bg-ink-900 shadow-card-hover',
}

const HOVERS: Record<CardVariant, string> = {
  solid: 'hover:-translate-y-1 hover:shadow-card-hover',
  glass: 'hover:-translate-y-1 hover:bg-white/[0.14]',
  elevated: 'hover:-translate-y-1 hover:border-white/20 hover:shadow-glow',
}

/**
 * The single card surface for the whole app — guarantees a consistent radius,
 * border, elevation and hover across every card-like element (DRY / cohesion).
 * Use `variant="glass"` on dark backgrounds, `interactive` for hover lift.
 */
export function Card({
  children,
  className,
  variant = 'solid',
  interactive = false,
}: {
  children: ReactNode
  className?: string
  variant?: CardVariant
  interactive?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-200',
        SURFACES[variant],
        interactive && HOVERS[variant],
        className,
      )}
    >
      {children}
    </div>
  )
}
