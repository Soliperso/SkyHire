import { useState } from 'react'
import type { ReviewTag } from '@/data/types'
import { REVIEW_TAGS, REVIEW_TAG_LABELS } from '@/data/labels'
import { useRepositories } from '@/data/RepositoryProvider'
import { RatingStars } from '@/components/RatingStars'
import { TextField, TextArea } from '@/components/fields'
import { Button } from '@/components/Button'
import { cn } from '@/lib/cn'

/** Star rating + written review with structured tags (PRD §8.3). */
export function ReviewForm({
  pilotId,
  onSubmitted,
}: {
  pilotId: string
  onSubmitted?: () => void
}) {
  const { reviews } = useRepositories()
  const [rating, setRating] = useState(0)
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [tags, setTags] = useState<ReviewTag[]>([])
  const [error, setError] = useState<string | null>(null)

  const toggleTag = (tag: ReviewTag) =>
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return setError('Please select a star rating.')
    if (!name.trim() || !text.trim()) return setError('Please add your name and a short review.')
    setError(null)
    reviews.add({ pilotId, clientName: name.trim(), rating, text: text.trim(), tags })
    setRating(0)
    setName('')
    setText('')
    setTags([])
    onSubmitted?.()
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <p className="mb-1.5 text-body-sm font-semibold text-ink-200">Your rating</p>
        <RatingStars value={rating} interactive size={28} onChange={setRating} />
      </div>

      <TextField
        label="Your name"
        placeholder="e.g. Jordan P."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <TextArea
        label="Your review"
        placeholder="Share details about quality, communication, and the overall experience…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div>
        <p className="mb-2 text-body-sm font-semibold text-ink-200">What stood out?</p>
        <div className="flex flex-wrap gap-2">
          {REVIEW_TAGS.map((tag) => {
            const active = tags.includes(tag)
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-body-sm font-medium transition-colors',
                  active
                    ? 'border-brand-400/60 bg-brand-500/15 text-brand-200'
                    : 'border-white/15 bg-white/5 text-ink-300 hover:border-white/30',
                )}
              >
                {REVIEW_TAG_LABELS[tag]}
              </button>
            )
          })}
        </div>
      </div>

      {error && <p className="text-body-sm font-medium text-danger-600">{error}</p>}

      <Button type="submit" size="md">
        Submit review
      </Button>
    </form>
  )
}
