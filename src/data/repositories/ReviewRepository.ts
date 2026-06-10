import type { Review } from '../types'

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
}
