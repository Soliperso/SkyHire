import type {
  PilotSort,
  PricingModel,
  ReviewTag,
  Specialty,
  UserStatus,
  VerificationStatus,
} from './types'

/** Display labels — the single place human-readable copy for enums lives. */

export const SPECIALTY_LABELS: Record<Specialty, string> = {
  'aerial-photography': 'Aerial Photography',
  'roof-inspection': 'Roof Inspection',
  'mapping-surveying': 'Mapping & Surveying',
  'real-estate': 'Real Estate',
  construction: 'Construction',
  'event-coverage': 'Event Coverage',
  agriculture: 'Agriculture',
  'solar-inspection': 'Solar Inspection',
}

export const SPECIALTIES = Object.keys(SPECIALTY_LABELS) as Specialty[]

export const PRICING_LABELS: Record<PricingModel, string> = {
  hourly: '/hr',
  'per-project': '/project',
  'per-day': '/day',
}

export const REVIEW_TAG_LABELS: Record<ReviewTag, string> = {
  communication: 'Communication',
  punctuality: 'Punctuality',
  quality: 'Quality',
  professionalism: 'Professionalism',
  value: 'Value',
}

export const REVIEW_TAGS = Object.keys(REVIEW_TAG_LABELS) as ReviewTag[]

export const VERIFICATION_LABELS: Record<VerificationStatus, string> = {
  unverified: 'Unverified',
  pending: 'Pending review',
  verified: 'FAA Verified',
  rejected: 'Rejected',
}

export const SORT_LABELS: Record<PilotSort, string> = {
  relevance: 'Relevance',
  rating: 'Highest rated',
  distance: 'Nearest',
  'response-time': 'Fastest response',
}

export const SORT_OPTIONS = Object.keys(SORT_LABELS) as PilotSort[]

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  active: 'Active',
  flagged: 'Flagged',
  suspended: 'Suspended',
}

export const ROLE_LABELS: Record<'client' | 'pilot' | 'admin', string> = {
  client: 'Client',
  pilot: 'Pilot',
  admin: 'Admin',
}

/** Format a starting price + pricing model into a compact indicator (e.g. "$500/day"). */
export function formatPrice(amount: number, model: PricingModel): string {
  return `$${amount.toLocaleString()}${PRICING_LABELS[model]}`
}

/** Pilots replying within this many hours earn the "Fast responder" trust signal (matches the homepage "<4h" stat). */
export const FAST_RESPONDER_MAX_HOURS = 4

export function isFastResponder(hours: number): boolean {
  return hours <= FAST_RESPONDER_MAX_HOURS
}
