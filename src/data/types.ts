/**
 * Domain types — mapped directly to the PRD data model (§11).
 * These are the single source of truth for the shapes the UI renders and the
 * repositories return. Swapping the mock data source for Supabase later means
 * matching these shapes, with no changes required in the UI.
 */

export type Role = 'client' | 'pilot' | 'admin'
/** `flagged` = surfaced by fraud monitoring but not yet actioned; `suspended` = access revoked. */
export type UserStatus = 'active' | 'flagged' | 'suspended'

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'

export type Specialty =
  | 'aerial-photography'
  | 'roof-inspection'
  | 'mapping-surveying'
  | 'real-estate'
  | 'construction'
  | 'event-coverage'
  | 'agriculture'
  | 'solar-inspection'

export type PricingModel = 'hourly' | 'per-project' | 'per-day'

export type ReviewTag =
  | 'communication'
  | 'punctuality'
  | 'quality'
  | 'professionalism'
  | 'value'

export type ReviewStatus = 'published' | 'flagged' | 'removed'

export type QuoteStatus = 'new' | 'responded' | 'closed'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  status: UserStatus
  createdAt: string
  /** Why fraud monitoring surfaced this account, when status !== 'active'. */
  flagReason?: string
}

/** A marketplace taxonomy entry — the admin-managed list behind specialty filters (PRD §8.6). */
export interface Category {
  slug: string
  label: string
  active: boolean
}

export interface PortfolioItem {
  id: string
  imageUrl: string
  caption: string
}

export interface PilotProfile {
  id: string
  userId: string
  name: string
  businessName: string
  avatarUrl: string
  bio: string
  location: string
  serviceAreaMiles: number
  specialties: Specialty[]
  pricingModel: PricingModel
  startingPrice: number
  verificationStatus: VerificationStatus
  ratingAvg: number
  reviewCount: number
  responseTimeHours: number
  available: boolean
  featured: boolean
  portfolio: PortfolioItem[]
}

export interface FaaVerification {
  id: string
  pilotId: string
  pilotName: string
  certificateType: string
  certificateNumber: string
  status: VerificationStatus
  submittedAt: string
  verifiedAt: string | null
  expiresAt: string | null
}

export interface Review {
  id: string
  pilotId: string
  clientName: string
  rating: number
  text: string
  tags: ReviewTag[]
  status: ReviewStatus
  verifiedJob: boolean
  createdAt: string
}

export interface QuoteRequest {
  id: string
  pilotId: string
  clientName: string
  clientEmail: string
  jobType: Specialty
  location: string
  budgetRange: string
  details: string
  status: QuoteStatus
  createdAt: string
}

/** Filters used by the browse/search experience (FR §8.1). */
export interface PilotFilters {
  query?: string
  location?: string
  specialty?: Specialty | 'all'
  minRating?: number
  verifiedOnly?: boolean
}

export type PilotSort = 'relevance' | 'rating' | 'distance' | 'response-time'
