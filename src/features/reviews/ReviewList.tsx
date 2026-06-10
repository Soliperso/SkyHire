import type { Review } from '@/data/types'
import { EmptyState } from '@/components/EmptyState'
import { ReviewItem } from './ReviewItem'

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        title="No reviews yet"
        description="Be the first to share your experience with this pilot."
      />
    )
  }

  return (
    <div className="divide-y divide-white/10">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  )
}
