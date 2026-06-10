import type { ReactNode } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
}

/**
 * Container that staggers the entrance of nested <Reveal standalone={false}>
 * children when it scrolls into view.
 */
export function Stagger({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </motion.div>
  )
}
