import type { ReactNode } from 'react'
import { Container } from '@/components/Container'
import { Aurora } from '@/components/decor/Aurora'

/** Centered hero band for static/marketing pages — keeps them visually consistent. */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  children?: ReactNode
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10">
      <Aurora className="opacity-50" />
      <Container className="py-16 text-center sm:py-20">
        {eyebrow && (
          <p className="mb-3 text-caption font-semibold uppercase tracking-wider text-accent-300">{eyebrow}</p>
        )}
        <h1 className="mx-auto max-w-3xl text-h1 text-white sm:text-display">{title}</h1>
        {subtitle && <p className="mx-auto mt-4 max-w-2xl text-body text-ink-300">{subtitle}</p>}
        {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
      </Container>
    </section>
  )
}
