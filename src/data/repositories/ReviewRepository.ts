import type { Review, ReviewStatus } from '../types'

export interface NewReview {
  pilotId: string
  clientName: string
  rating: number
  text: string
  tags: Review['tags']
}

export interface ReviewRepository {
  listForPilot(pilotId: string): Promise<Review[]>
  listPublished(): Promise<Review[]>
  /** Reviews needing moderation (flagged/spam) — admin queue. */
  listFlagged(): Promise<Review[]>
  add(review: NewReview): Promise<Review>
  /** Admin moderation decision (remove abusive/spam, or keep → publish). */
  setStatus(id: string, status: ReviewStatus): Promise<void>
}
