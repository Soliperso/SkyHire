import { CaretDown } from '@phosphor-icons/react'

export interface FaqItem {
  q: string
  a: string
}

/**
 * Accessible FAQ list built on native <details>/<summary> — keyboard- and
 * screen-reader-friendly with no JS state to manage.
 */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-ink-900">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-body font-medium text-white transition-colors hover:bg-white/5 [&::-webkit-details-marker]:hidden">
            {item.q}
            <CaretDown className="h-5 w-5 shrink-0 text-ink-400 transition-transform group-open:rotate-180" />
          </summary>
          <p className="px-5 pb-5 text-body-sm leading-relaxed text-ink-300">{item.a}</p>
        </details>
      ))}
    </div>
  )
}
