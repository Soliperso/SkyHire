import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

/**
 * Counts up to `value` once when scrolled into view. Supports decimals plus a
 * prefix/suffix so it covers stats like "500+", "4.8★", "<4h".
 */
export function AnimatedCounter({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.4,
}: {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(reduce ? value : 0)

  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    })
    return () => controls.stop()
  }, [inView, reduce, value, duration])

  return (
    <span ref={ref}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  )
}
