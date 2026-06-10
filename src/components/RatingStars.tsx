import { Star } from '@phosphor-icons/react'
import { cn } from '@/lib/cn'

/**
 * Star rating display. When `interactive` + `onChange` are provided it becomes a
 * selectable input (used in the review form).
 */
export function RatingStars({
  value,
  count,
  size = 16,
  showValue = false,
  interactive = false,
  onChange,
  tone = 'light',
  className,
}: {
  value: number
  count?: number
  size?: number
  showValue?: boolean
  interactive?: boolean
  onChange?: (rating: number) => void
  /** `dark` renders light value/count text for dark surfaces. */
  tone?: 'light' | 'dark'
  className?: string
}) {
  const stars = [1, 2, 3, 4, 5]
  const dark = tone === 'dark'

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <div className="inline-flex items-center">
        {stars.map((star) => {
          const filled = star <= Math.round(value)
          const icon = (
            <Star
              weight="fill"
              className={cn(filled ? 'text-star' : dark ? 'text-white/15' : 'text-ink-200')}
              style={{ width: size, height: size }}
            />
          )
          return interactive ? (
            <button
              key={star}
              type="button"
              onClick={() => onChange?.(star)}
              className="rounded p-0.5"
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              {icon}
            </button>
          ) : (
            <span key={star}>{icon}</span>
          )
        })}
      </div>
      {showValue && (
        <span className={cn('text-body-sm font-semibold', dark ? 'text-white' : 'text-ink-800')}>
          {value.toFixed(1)}
        </span>
      )}
      {typeof count === 'number' && (
        <span className={cn('text-body-sm', dark ? 'text-ink-400' : 'text-ink-500')}>
          ({count})
        </span>
      )}
    </div>
  )
}
