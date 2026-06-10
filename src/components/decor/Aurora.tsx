import { cn } from '@/lib/cn'

/**
 * Decorative blurred gradient "glow blobs" for cinematic dark backgrounds.
 * Purely presentational and aria-hidden; sits behind content (-z-10).
 */
export function Aurora({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}>
      <div className="absolute -left-24 -top-24 h-96 w-96 animate-aurora rounded-full bg-brand-600/30 blur-3xl" />
      <div className="absolute right-[-6rem] top-10 h-80 w-80 animate-aurora rounded-full bg-accent-500/25 blur-3xl [animation-delay:-6s]" />
      <div className="absolute bottom-[-8rem] left-1/3 h-96 w-96 animate-aurora rounded-full bg-brand-500/20 blur-3xl [animation-delay:-12s]" />
    </div>
  )
}
