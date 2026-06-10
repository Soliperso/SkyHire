import { cn } from '@/lib/cn'

/** Custom quadcopter drone mark — used in the header, footer and hero. */
export function DroneMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* propeller arms */}
      <path d="M16 16 L22 22 M32 16 L26 22 M16 32 L22 26 M32 32 L26 26" />
      {/* rotors */}
      <ellipse cx="13" cy="13" rx="6" ry="2.4" />
      <ellipse cx="35" cy="13" rx="6" ry="2.4" />
      <ellipse cx="13" cy="35" rx="6" ry="2.4" />
      <ellipse cx="35" cy="35" rx="6" ry="2.4" />
      {/* body */}
      <rect x="20" y="20" width="8" height="8" rx="2.2" fill="currentColor" stroke="none" />
      {/* camera gimbal */}
      <path d="M24 28 L24 31" />
      <circle cx="24" cy="32.5" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Full lockup: drone mark in a brand tile + wordmark. */
export function Logo({
  className,
  variant = 'dark',
}: {
  className?: string
  variant?: 'dark' | 'light'
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-card">
        <DroneMark className="h-5 w-5" />
      </span>
      <span
        className={cn(
          'text-h3 font-bold tracking-tight',
          variant === 'light' ? 'text-white' : 'text-ink-900',
        )}
      >
        Sky<span className={variant === 'light' ? 'text-brand-300' : 'text-brand-600'}>Hire</span>
      </span>
    </span>
  )
}
