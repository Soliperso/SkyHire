import { Heart } from '@phosphor-icons/react'
import { useSavedPilots } from '@/saved/SavedPilotsProvider'
import { cn } from '@/lib/cn'

/**
 * Heart toggle to save/unsave a pilot. `variant="overlay"` is the translucent
 * circle used over card cover images; `plain` is for inline use on profiles.
 */
export function SaveButton({
  pilotId,
  variant = 'overlay',
  className,
}: {
  pilotId: string
  variant?: 'overlay' | 'plain'
  className?: string
}) {
  const { isSaved, toggle } = useSavedPilots()
  const saved = isSaved(pilotId)

  return (
    <button
      type="button"
      onClick={(e) => {
        // Cards wrap regions in <Link>; don't navigate when saving.
        e.preventDefault()
        e.stopPropagation()
        toggle(pilotId)
      }}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from saved pilots' : 'Save pilot'}
      className={cn(
        'inline-grid place-items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400',
        variant === 'overlay'
          ? 'h-9 w-9 bg-ink-950/55 text-white backdrop-blur hover:bg-ink-950/75'
          : 'h-10 w-10 border border-white/15 bg-white/5 text-white hover:bg-white/10',
        className,
      )}
    >
      <Heart
        weight={saved ? 'fill' : 'regular'}
        className={cn('h-5 w-5 transition-colors', saved && 'text-danger-500')}
      />
    </button>
  )
}
