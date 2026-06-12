import { useQuery } from '@tanstack/react-query'
import { useRepositories } from '@/data/RepositoryProvider'
import { Card } from '@/components/Card'
import { RatingStars } from '@/components/RatingStars'
import { useDashboard } from '@/app/layout/DashboardLayout'
import { ReviewList } from '@/features/reviews/ReviewList'

export function ReviewsDashboardPage() {
  const { pilot } = useDashboard()
  const { reviews } = useRepositories()
  const { data: pilotReviews = [] } = useQuery({
    queryKey: ['reviews', 'pilot', pilot.id],
    queryFn: () => reviews.listForPilot(pilot.id),
  })

  // Star distribution (5→1) across this pilot's published reviews.
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: pilotReviews.filter((r) => Math.round(r.rating) === star).length,
  }))
  const max = Math.max(1, ...dist.map((d) => d.count))

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-h2 text-white">Reviews</h2>
        <p className="mt-1 text-body-sm text-ink-400">What clients say about your work.</p>
      </header>

      <Card variant="elevated" className="p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="text-center sm:w-40">
            <p className="text-display text-white">{pilot.ratingAvg.toFixed(1)}</p>
            <RatingStars value={pilot.ratingAvg} size={16} tone="dark" />
            <p className="mt-1 text-body-sm text-ink-400">{pilot.reviewCount} reviews</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {dist.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-3 text-body-sm">
                <span className="w-6 shrink-0 text-ink-400">{star}★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-star" style={{ width: `${(count / max) * 100}%` }} />
                </div>
                <span className="w-6 shrink-0 text-right text-ink-400">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card variant="elevated" className="px-6 py-2">
        <ReviewList reviews={pilotReviews} />
      </Card>
    </div>
  )
}
