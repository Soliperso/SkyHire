import { cn } from '@/lib/cn'

const SIZES = {
  sm: 'h-9 w-9',
  md: 'h-12 w-12',
  lg: 'h-20 w-20',
} as const

/** Round profile image with consistent sizing. */
export function Avatar({
  src,
  alt,
  size = 'md',
  className,
}: {
  src: string
  alt: string
  size?: keyof typeof SIZES
  className?: string
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={cn('rounded-full object-cover ring-2 ring-white', SIZES[size], className)}
    />
  )
}
