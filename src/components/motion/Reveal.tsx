import type { ReactNode } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

/** Shared easing/variants so every reveal feels identical (DRY). */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

/**
 * Fades + slides content in when scrolled into view. Use standalone, or as a
 * child of <Stagger> (it shares the same `hidden`/`show` variant names).
 * Gracefully no-ops when the user prefers reduced motion.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  standalone = true,
}: {
  children: ReactNode
  delay?: number
  className?: string
  /** Set false when nested inside <Stagger> so the parent drives timing. */
  standalone?: boolean
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>

  const triggers = standalone
    ? { initial: 'hidden' as const, whileInView: 'show' as const, viewport: { once: true, margin: '-80px' } }
    : {}

  return (
    <motion.div className={className} variants={revealVariants} transition={{ delay }} {...triggers}>
      {children}
    </motion.div>
  )
}
