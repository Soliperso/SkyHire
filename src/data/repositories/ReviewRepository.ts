import type { Review, ReviewStatus } from '../types'

export interface NewReview {
  pilotId: string
  clientName: string
  rating: number
  text: string
  tags: Review['tags']
}

export interface ReviewRepository {
  listForPilot(pilotId: string): Review[]
  listPublished(): Review[]
  /** Reviews needing moderation (flagged/spam) — admin queue. */
  listFlagged(): Review[]
  add(review: NewReview): Review
  /** Admin moderation decision (remove abusive/spam, or keep → publish). */
  setStatus(id: string, status: ReviewStatus): void
}
