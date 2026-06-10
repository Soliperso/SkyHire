import { Lightning } from '@phosphor-icons/react'
import { isFastResponder } from '@/data/labels'
import { cn } from '@/lib/cn'
import { Badge } from './Badge'

/**
 * Trust signal for quick-replying pilots (PRD §9 should-have). Turns the raw
 * response-time hours into a comparable badge; renders nothing for slower
 * pilots — same render-or-null pattern as {@link VerifiedBadge}.
 *
 * `overlay` matches the card-cover pill style (alongside "Available now");
 * the default uses the standard light `Badge` surface.
 */
export function FastResponderBadge({
  hours,
  variant = 'badge',
  className,
}: {
  hours: number
  variant?: 'badge' | 'overlay'
  className?: string
}) {
  if (!isFastResponder(hours)) return null

  if (variant === 'overlay') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-caption font-semibold text-brand-700 backdrop-blur',
          className,
        )}
      >
        <Lightning weight="fill" className="h-3.5 w-3.5" />
        Fast responder
      </span>
    )
  }

  return (
    <Badge tone="brand" className={className}>
      <Lightning weight="fill" className="h-3.5 w-3.5" />
      Fast responder
    </Badge>
  )
}
