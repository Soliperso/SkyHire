import { useCallback, useEffect, useRef, useState } from 'react'
import { CaretLeft, CaretRight, X } from '@phosphor-icons/react'
import type { PortfolioItem } from '@/data/types'

/** Responsive portfolio grid shown on the pilot profile (PRD §9 should-have). */
export function PortfolioGallery({ items }: { items: PortfolioItem[] }) {
  const [openAt, setOpenAt] = useState<number | null>(null)
  // Remember the tile that opened the lightbox so focus can return on close.
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([])

  if (items.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setOpenAt(i)}
            ref={(el) => {
              triggerRefs.current[i] = el
            }}
            className="group relative block overflow-hidden rounded-xl border border-white/10 bg-ink-900 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
          >
            <img
              src={item.imageUrl}
              alt={item.caption}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/80 to-transparent p-3 text-body-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
              {item.caption}
            </span>
            {i === 0 && (
              <span className="absolute left-2 top-2 rounded-md bg-white/90 px-2 py-0.5 text-caption font-semibold text-ink-700 backdrop-blur">
                Featured
              </span>
            )}
          </button>
        ))}
      </div>

      {openAt !== null && (
        <Lightbox
          items={items}
          index={openAt}
          onIndexChange={setOpenAt}
          onClose={() => {
            const trigger = triggerRefs.current[openAt]
            setOpenAt(null)
            trigger?.focus()
          }}
        />
      )}
    </>
  )
}

/** Full-screen viewer for a portfolio item, with keyboard navigation. */
function Lightbox({
  items,
  index,
  onIndexChange,
  onClose,
}: {
  items: PortfolioItem[]
  index: number
  onIndexChange: (i: number) => void
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const item = items[index]

  const go = useCallback(
    (delta: number) => onIndexChange((index + delta + items.length) % items.length),
    [index, items.length, onIndexChange],
  )

  // Keyboard controls + body scroll lock while the lightbox is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [go, onClose])

  const showNav = items.length > 1

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={item.caption || 'Portfolio image'}
      tabIndex={-1}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/90 p-4 backdrop-blur focus:outline-none sm:p-8"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
      >
        <X className="h-5 w-5" />
      </button>

      {showNav && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            go(-1)
          }}
          aria-label="Previous image"
          className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
        >
          <CaretLeft className="h-5 w-5" />
        </button>
      )}

      {/* Stop propagation so clicking the image itself doesn't close the dialog. */}
      <figure onClick={(e) => e.stopPropagation()} className="flex max-h-full flex-col items-center gap-3">
        <img
          src={item.imageUrl}
          alt={item.caption}
          className="max-h-[80vh] w-auto max-w-full rounded-xl object-contain"
        />
        {item.caption && (
          <figcaption className="text-center text-body-sm text-ink-200">{item.caption}</figcaption>
        )}
      </figure>

      {showNav && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            go(1)
          }}
          aria-label="Next image"
          className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
        >
          <CaretRight className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
