import { Quotes } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { useRepositories } from '@/data/RepositoryProvider'
import { Card } from '@/components/Card'
import { RatingStars } from '@/components/RatingStars'
import { Reveal } from '@/components/motion/Reveal'
import { Stagger } from '@/components/motion/Stagger'

/** Social proof built from real published reviews + their pilot context. */
export function Testimonials() {
  const { reviews, pilots } = useRepositories()

  const { data: published = [] } = useQuery({
    queryKey: ['reviews', 'published'],
    queryFn: () => reviews.listPublished(),
  })
  const { data: allPilots = [] } = useQuery({
    queryKey: ['pilots', 'list', 'all'],
    queryFn: () => pilots.list(),
  })

  const items = published
    .filter((r) => r.rating === 5 && r.text.length < 180)
    .slice(0, 3)
    .map((r) => ({ review: r, pilot: allPilots.find((p) => p.id === r.pilotId) }))

  if (items.length === 0) return null

  return (
    <Stagger className="grid gap-6 md:grid-cols-3">
      {items.map(({ review, pilot }) => (
        <Reveal key={review.id} standalone={false}>
          <Card variant="glass" interactive className="flex h-full flex-col p-6">
            <Quotes weight="fill" className="h-7 w-7 text-accent-300" />
            <p className="mt-3 flex-1 text-body leading-relaxed text-ink-200">“{review.text}”</p>
            <div className="mt-5 border-t border-white/10 pt-4">
              <RatingStars value={review.rating} size={14} />
              <p className="mt-2 text-body-sm font-semibold text-white">{review.clientName}</p>
              {pilot && <p className="text-caption text-ink-400">on {pilot.businessName}</p>}
            </div>
          </Card>
        </Reveal>
      ))}
    </Stagger>
  )
}
