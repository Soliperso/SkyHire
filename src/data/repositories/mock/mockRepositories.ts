import { SEED_PILOTS } from '../../seed/pilots'
import { SEED_REVIEWS } from '../../seed/reviews'
import { SEED_QUOTES } from '../../seed/quotes'
import { SEED_VERIFICATIONS } from '../../seed/verifications'
import { SEED_USERS } from '../../seed/users'
import { SEED_CATEGORIES } from '../../seed/categories'
import type {
  Category,
  FaaVerification,
  PilotFilters,
  PilotSort,
  QuoteRequest,
  Review,
  User,
} from '../../types'
import type { PilotRepository } from '../PilotRepository'
import type { NewReview, ReviewRepository } from '../ReviewRepository'
import type { NewQuoteRequest, QuoteRepository } from '../QuoteRepository'
import type { NewVerification, VerificationRepository } from '../VerificationRepository'
import type { UserRepository } from '../UserRepository'
import type { CategoryRepository } from '../CategoryRepository'
import { sortPilots } from '../sortPilots'

// The mock repositories satisfy the (now async) repository interfaces so the app
// still runs with zero backend — every method just resolves immediately. They
// mutate in-memory copies of the seed data, so changes reset on a full reload.
// The Supabase implementations persist for real; RepositoryProvider picks which.

const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`
const today = () => new Date().toISOString().slice(0, 10)
const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function createMockPilotRepository(): PilotRepository {
  return {
    async list(filters: PilotFilters = {}, sort: PilotSort = 'relevance') {
      let result = SEED_PILOTS.filter((p) => {
        if (filters.verifiedOnly && p.verificationStatus !== 'verified') return false
        if (filters.minRating && p.ratingAvg < filters.minRating) return false
        if (filters.specialty && filters.specialty !== 'all' && !p.specialties.includes(filters.specialty)) {
          return false
        }
        if (filters.location) {
          const loc = filters.location.toLowerCase().trim()
          if (loc && !p.location.toLowerCase().includes(loc)) return false
        }
        if (filters.query) {
          const q = filters.query.toLowerCase().trim()
          const haystack = `${p.name} ${p.businessName} ${p.bio} ${p.location}`.toLowerCase()
          if (q && !haystack.includes(q)) return false
        }
        return true
      })

      result = sortPilots(result, sort)
      return result
    },

    async getById(id) {
      return SEED_PILOTS.find((p) => p.id === id)
    },

    async featured(limit = 3) {
      return SEED_PILOTS.filter((p) => p.featured).slice(0, limit)
    },

    async update(id, patch) {
      const pilot = SEED_PILOTS.find((p) => p.id === id)
      if (!pilot) return undefined
      // Mutate in place so getById/list reflect the change for the session.
      Object.assign(pilot, patch)
      return pilot
    },
  }
}

export function createMockReviewRepository(): ReviewRepository {
  const reviews: Review[] = [...SEED_REVIEWS]
  return {
    async listForPilot(pilotId) {
      return reviews.filter((r) => r.pilotId === pilotId && r.status === 'published')
    },
    async listPublished() {
      return reviews.filter((r) => r.status === 'published')
    },
    async listFlagged() {
      return reviews.filter((r) => r.status === 'flagged')
    },
    async add(input: NewReview) {
      const review: Review = {
        id: uid('rev'),
        status: 'published',
        verifiedJob: false,
        createdAt: today(),
        ...input,
      }
      reviews.unshift(review)
      return review
    },
    async setStatus(id, status) {
      const review = reviews.find((r) => r.id === id)
      if (review) review.status = status
    },
  }
}

export function createMockQuoteRepository(): QuoteRepository {
  const quotes: QuoteRequest[] = [...SEED_QUOTES]
  return {
    async list() {
      return quotes
    },
    async listForPilot(pilotId) {
      return quotes.filter((q) => q.pilotId === pilotId)
    },
    async listForClient(clientEmail) {
      const email = clientEmail.toLowerCase().trim()
      return quotes.filter((q) => q.clientEmail.toLowerCase() === email)
    },
    async add(input: NewQuoteRequest) {
      const quote: QuoteRequest = {
        id: uid('qr'),
        status: 'new',
        createdAt: today(),
        ...input,
      }
      quotes.unshift(quote)
      return quote
    },
    async setStatus(id, status) {
      const quote = quotes.find((q) => q.id === id)
      if (quote) quote.status = status
    },
  }
}

export function createMockVerificationRepository(): VerificationRepository {
  const verifications: FaaVerification[] = [...SEED_VERIFICATIONS]
  return {
    async list() {
      return verifications
    },
    async listPending() {
      return verifications.filter((v) => v.status === 'pending')
    },
    async getForPilot(pilotId) {
      // Most recently submitted record wins if a pilot has more than one.
      return verifications
        .filter((v) => v.pilotId === pilotId)
        .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))[0]
    },
    async submit(input: NewVerification) {
      const record: FaaVerification = {
        id: uid('ver'),
        status: 'pending',
        submittedAt: today(),
        verifiedAt: null,
        ...input,
      }
      verifications.unshift(record)
      return record
    },
    async setStatus(id, status) {
      const record = verifications.find((v) => v.id === id)
      if (!record) return undefined
      record.status = status
      record.verifiedAt = status === 'verified' ? today() : null
      return record
    },
  }
}

export function createMockUserRepository(): UserRepository {
  const users: User[] = [...SEED_USERS]
  return {
    async list() {
      return users
    },
    async getById(id) {
      return users.find((u) => u.id === id)
    },
    async setStatus(id, status, reason) {
      const user = users.find((u) => u.id === id)
      if (!user) return undefined
      user.status = status
      // Clear the flag note when an account is cleared back to active.
      user.flagReason = status === 'active' ? undefined : reason ?? user.flagReason
      return user
    },
  }
}

export function createMockCategoryRepository(): CategoryRepository {
  const categories: Category[] = [...SEED_CATEGORIES]
  return {
    async list() {
      return categories
    },
    async add(label) {
      const slug = slugify(label)
      const existing = categories.find((c) => c.slug === slug)
      if (existing) return existing
      const category: Category = { slug, label: label.trim(), active: true }
      categories.push(category)
      return category
    },
    async setActive(slug, active) {
      const category = categories.find((c) => c.slug === slug)
      if (category) category.active = active
    },
    async remove(slug) {
      const i = categories.findIndex((c) => c.slug === slug)
      if (i !== -1) categories.splice(i, 1)
    },
  }
}
