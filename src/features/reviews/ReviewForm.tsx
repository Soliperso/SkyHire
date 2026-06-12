import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import type { ReviewTag } from '@/data/types'
import { REVIEW_TAGS, REVIEW_TAG_LABELS } from '@/data/labels'
import { useRepositories } from '@/data/RepositoryProvider'
import { useAuth } from '@/auth/AuthProvider'
import { ROUTES } from '@/routes'
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
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [name, setName] = useState(user?.name ?? '')
  const [text, setText] = useState('')
  const [tags, setTags] = useState<ReviewTag[]>([])
  const [error, setError] = useState<string | null>(null)

  const toggleTag = (tag: ReviewTag) =>
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))

  const mutation = useMutation({
    mutationFn: () => reviews.add({ pilotId, clientName: name.trim(), rating, text: text.trim(), tags }),
    onSuccess: () => {
      setRating(0)
      setName('')
      setText('')
      setTags([])
      onSubmitted?.()
    },
    onError: () => setError('Something went wrong submitting your review. Please try again.'),
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return setError('Please select a star rating.')
    if (!name.trim() || !text.trim()) return setError('Please add your name and a short review.')
    setError(null)
    mutation.mutate()
  }

  // Reviews require a signed-in account (keeps reputation accountable).
  if (!user) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
        <p className="text-body-sm text-ink-300">Sign in to leave a review.</p>
        <Link
          to={ROUTES.login(ROUTES.reviews(pilotId))}
          className="mt-3 inline-block font-semibold text-accent-300 hover:text-accent-200"
        >
          Sign in →
        </Link>
      </div>
    )
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

      <Button type="submit" size="md" disabled={mutation.isPending}>
        {mutation.isPending ? 'Submitting…' : 'Submit review'}
      </Button>
    </form>
  )
}
