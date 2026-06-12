import type { PilotProfile, PilotSort } from '../types'

/**
 * Shared pilot ordering used by every PilotRepository implementation so the
 * browse experience sorts identically whether data comes from the mock layer
 * or Supabase. Relevance is a composite score, so it's applied client-side.
 */
export function sortPilots(pilots: PilotProfile[], sort: PilotSort): PilotProfile[] {
  const copy = [...pilots]
  switch (sort) {
    case 'rating':
      return copy.sort((a, b) => b.ratingAvg - a.ratingAvg || b.reviewCount - a.reviewCount)
    case 'distance':
      return copy.sort((a, b) => a.serviceAreaMiles - b.serviceAreaMiles)
    case 'response-time':
      return copy.sort((a, b) => a.responseTimeHours - b.responseTimeHours)
    case 'relevance':
    default:
      // Relevance = verified first, then featured, then rating.
      return copy.sort((a, b) => {
        const score = (p: PilotProfile) =>
          (p.verificationStatus === 'verified' ? 2 : 0) + (p.featured ? 1 : 0)
        return score(b) - score(a) || b.ratingAvg - a.ratingAvg
      })
  }
}
