import { ShieldCheck } from '@phosphor-icons/react'
import type { Review } from '@/data/types'
import { REVIEW_TAG_LABELS } from '@/data/labels'
import { RatingStars } from '@/components/RatingStars'
import { Tag } from '@/components/Tag'
import { Badge } from '@/components/Badge'

export function ReviewItem({ review }: { review: Review }) {
  return (
    <article className="border-b border-white/10 py-5 last:border-0">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">{review.clientName}</span>
          {review.verifiedJob && (
            <Badge tone="verified">
              <ShieldCheck className="h-3 w-3" />
              Verified job
            </Badge>
          )}
        </div>
        <time className="text-caption text-ink-400">{review.createdAt}</time>
      </div>

      <div className="mt-2">
        <RatingStars value={review.rating} size={15} />
      </div>

      <p className="mt-2 text-body-sm leading-relaxed text-ink-300">{review.text}</p>

      {review.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {review.tags.map((t) => (
            <Tag key={t} tone="dark">{REVIEW_TAG_LABELS[t]}</Tag>
          ))}
        </div>
      )}
    </article>
  )
}
