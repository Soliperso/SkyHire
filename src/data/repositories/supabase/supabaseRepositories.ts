import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  Category,
  FaaVerification,
  PilotFilters,
  PilotProfile,
  PilotSort,
  PortfolioItem,
  QuoteRequest,
  Review,
  ReviewTag,
  Specialty,
  User,
} from '../../types'
import type { PilotRepository } from '../PilotRepository'
import type { NewReview, ReviewRepository } from '../ReviewRepository'
import type { NewQuoteRequest, QuoteRepository } from '../QuoteRepository'
import type { NewVerification, VerificationRepository } from '../VerificationRepository'
import type { UserRepository } from '../UserRepository'
import type { CategoryRepository } from '../CategoryRepository'
import { sortPilots } from '../sortPilots'

// Supabase-backed repositories. They satisfy the same interfaces as the mocks,
// so the UI is unchanged — RepositoryProvider just constructs these instead when
// a backend is configured. Column names are snake_case in Postgres; we map to
// the camelCase domain shapes here so nothing leaks db naming into the app.

const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`
const today = () => new Date().toISOString().slice(0, 10)
const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/** Throws on a Supabase error, otherwise returns the data. */
function unwrap<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message)
  return res.data as T
}

// --- Row shapes + mappers ---------------------------------------------------

interface PilotRow {
  id: string
  user_id: string
  name: string
  business_name: string
  avatar_url: string
  bio: string
  location: string
  service_area_miles: number
  specialties: Specialty[]
  pricing_model: PilotProfile['pricingModel']
  starting_price: number
  verification_status: PilotProfile['verificationStatus']
  rating_avg: number | string
  review_count: number
  response_time_hours: number
  available: boolean
  featured: boolean
  portfolio: PortfolioItem[]
}

function pilotFromRow(r: PilotRow): PilotProfile {
  return {
    id: r.id,
    userId: r.user_id,
    name: r.name,
    businessName: r.business_name,
    avatarUrl: r.avatar_url,
    bio: r.bio,
    location: r.location,
    serviceAreaMiles: r.service_area_miles,
    specialties: r.specialties ?? [],
    pricingModel: r.pricing_model,
    startingPrice: r.starting_price,
    verificationStatus: r.verification_status,
    // numeric columns arrive as strings over PostgREST — coerce.
    ratingAvg: Number(r.rating_avg),
    reviewCount: r.review_count,
    responseTimeHours: r.response_time_hours,
    available: r.available,
    featured: r.featured,
    portfolio: r.portfolio ?? [],
  }
}

/** Map a partial PilotProfile patch to snake_case columns (only provided keys). */
function pilotPatchToRow(patch: Partial<PilotProfile>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  const set = (key: keyof PilotProfile, col: string) => {
    if (patch[key] !== undefined) out[col] = patch[key]
  }
  set('userId', 'user_id')
  set('name', 'name')
  set('businessName', 'business_name')
  set('avatarUrl', 'avatar_url')
  set('bio', 'bio')
  set('location', 'location')
  set('serviceAreaMiles', 'service_area_miles')
  set('specialties', 'specialties')
  set('pricingModel', 'pricing_model')
  set('startingPrice', 'starting_price')
  set('verificationStatus', 'verification_status')
  set('ratingAvg', 'rating_avg')
  set('reviewCount', 'review_count')
  set('responseTimeHours', 'response_time_hours')
  set('available', 'available')
  set('featured', 'featured')
  set('portfolio', 'portfolio')
  return out
}

interface ReviewRow {
  id: string
  pilot_id: string
  client_name: string
  rating: number
  text: string
  tags: ReviewTag[]
  status: Review['status']
  verified_job: boolean
  created_at: string
}

function reviewFromRow(r: ReviewRow): Review {
  return {
    id: r.id,
    pilotId: r.pilot_id,
    clientName: r.client_name,
    rating: r.rating,
    text: r.text,
    tags: r.tags ?? [],
    status: r.status,
    verifiedJob: r.verified_job,
    createdAt: r.created_at,
  }
}

interface QuoteRow {
  id: string
  pilot_id: string
  client_name: string
  client_email: string
  job_type: Specialty
  location: string
  budget_range: string
  details: string
  status: QuoteRequest['status']
  created_at: string
}

function quoteFromRow(r: QuoteRow): QuoteRequest {
  return {
    id: r.id,
    pilotId: r.pilot_id,
    clientName: r.client_name,
    clientEmail: r.client_email,
    jobType: r.job_type,
    location: r.location,
    budgetRange: r.budget_range,
    details: r.details,
    status: r.status,
    createdAt: r.created_at,
  }
}

interface VerificationRow {
  id: string
  pilot_id: string
  pilot_name: string
  certificate_type: string
  certificate_number: string
  status: FaaVerification['status']
  submitted_at: string
  verified_at: string | null
  expires_at: string | null
}

function verificationFromRow(r: VerificationRow): FaaVerification {
  return {
    id: r.id,
    pilotId: r.pilot_id,
    pilotName: r.pilot_name,
    certificateType: r.certificate_type,
    certificateNumber: r.certificate_number,
    status: r.status,
    submittedAt: r.submitted_at,
    verifiedAt: r.verified_at,
    expiresAt: r.expires_at,
  }
}

interface UserRow {
  id: string
  name: string
  email: string
  role: User['role']
  status: User['status']
  flag_reason: string | null
  created_at: string
}

function userFromRow(r: UserRow): User {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    role: r.role,
    status: r.status,
    createdAt: r.created_at,
    flagReason: r.flag_reason ?? undefined,
  }
}

// --- Repositories -----------------------------------------------------------

export function createSupabasePilotRepository(db: SupabaseClient): PilotRepository {
  return {
    async list(filters: PilotFilters = {}, sort: PilotSort = 'relevance') {
      let q = db.from('pilots').select('*')
      if (filters.verifiedOnly) q = q.eq('verification_status', 'verified')
      if (filters.minRating) q = q.gte('rating_avg', filters.minRating)
      if (filters.specialty && filters.specialty !== 'all') {
        q = q.contains('specialties', [filters.specialty])
      }
      if (filters.location?.trim()) {
        q = q.ilike('location', `%${filters.location.trim()}%`)
      }
      if (filters.query?.trim()) {
        const term = filters.query.trim()
        q = q.or(
          `name.ilike.%${term}%,business_name.ilike.%${term}%,bio.ilike.%${term}%,location.ilike.%${term}%`,
        )
      }
      const rows = unwrap(await q.returns<PilotRow[]>())
      return sortPilots(rows.map(pilotFromRow), sort)
    },

    async getById(id) {
      const res = await db.from('pilots').select('*').eq('id', id).maybeSingle<PilotRow>()
      const row = unwrap(res)
      return row ? pilotFromRow(row) : undefined
    },

    async featured(limit = 3) {
      const rows = unwrap(
        await db.from('pilots').select('*').eq('featured', true).limit(limit).returns<PilotRow[]>(),
      )
      return rows.map(pilotFromRow)
    },

    async update(id, patch) {
      const row = unwrap(
        await db
          .from('pilots')
          .update(pilotPatchToRow(patch))
          .eq('id', id)
          .select('*')
          .maybeSingle<PilotRow>(),
      )
      return row ? pilotFromRow(row) : undefined
    },
  }
}

export function createSupabaseReviewRepository(db: SupabaseClient): ReviewRepository {
  return {
    async listForPilot(pilotId) {
      const rows = unwrap(
        await db
          .from('reviews')
          .select('*')
          .eq('pilot_id', pilotId)
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .returns<ReviewRow[]>(),
      )
      return rows.map(reviewFromRow)
    },
    async listPublished() {
      const rows = unwrap(
        await db
          .from('reviews')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .returns<ReviewRow[]>(),
      )
      return rows.map(reviewFromRow)
    },
    async listFlagged() {
      const rows = unwrap(
        await db
          .from('reviews')
          .select('*')
          .eq('status', 'flagged')
          .order('created_at', { ascending: false })
          .returns<ReviewRow[]>(),
      )
      return rows.map(reviewFromRow)
    },
    async add(input: NewReview) {
      const row = unwrap(
        await db
          .from('reviews')
          .insert({
            id: uid('rev'),
            pilot_id: input.pilotId,
            client_name: input.clientName,
            rating: input.rating,
            text: input.text,
            tags: input.tags,
            status: 'published',
            verified_job: false,
            created_at: today(),
          })
          .select('*')
          .single<ReviewRow>(),
      )
      return reviewFromRow(row)
    },
    async setStatus(id, status) {
      unwrap(await db.from('reviews').update({ status }).eq('id', id).select('id').maybeSingle())
    },
  }
}

export function createSupabaseQuoteRepository(db: SupabaseClient): QuoteRepository {
  return {
    async list() {
      const rows = unwrap(
        await db.from('quote_requests').select('*').order('created_at', { ascending: false }).returns<QuoteRow[]>(),
      )
      return rows.map(quoteFromRow)
    },
    async listForPilot(pilotId) {
      const rows = unwrap(
        await db
          .from('quote_requests')
          .select('*')
          .eq('pilot_id', pilotId)
          .order('created_at', { ascending: false })
          .returns<QuoteRow[]>(),
      )
      return rows.map(quoteFromRow)
    },
    async listForClient(clientEmail) {
      const rows = unwrap(
        await db
          .from('quote_requests')
          .select('*')
          .ilike('client_email', clientEmail.trim())
          .order('created_at', { ascending: false })
          .returns<QuoteRow[]>(),
      )
      return rows.map(quoteFromRow)
    },
    async add(input: NewQuoteRequest) {
      const row = unwrap(
        await db
          .from('quote_requests')
          .insert({
            id: uid('qr'),
            pilot_id: input.pilotId,
            client_name: input.clientName,
            client_email: input.clientEmail,
            job_type: input.jobType,
            location: input.location,
            budget_range: input.budgetRange,
            details: input.details,
            status: 'new',
            created_at: today(),
          })
          .select('*')
          .single<QuoteRow>(),
      )
      const quote = quoteFromRow(row)
      // Fire-and-forget lead notification. Never let an email failure (or an
      // unconfigured Resend key) break the quote flow.
      void db.functions.invoke('notify-lead', { body: { quote } }).catch(() => {})
      return quote
    },
    async setStatus(id, status) {
      unwrap(await db.from('quote_requests').update({ status }).eq('id', id).select('id').maybeSingle())
    },
  }
}

export function createSupabaseVerificationRepository(db: SupabaseClient): VerificationRepository {
  return {
    async list() {
      const rows = unwrap(
        await db
          .from('faa_verifications')
          .select('*')
          .order('submitted_at', { ascending: false })
          .returns<VerificationRow[]>(),
      )
      return rows.map(verificationFromRow)
    },
    async listPending() {
      const rows = unwrap(
        await db
          .from('faa_verifications')
          .select('*')
          .eq('status', 'pending')
          .order('submitted_at', { ascending: false })
          .returns<VerificationRow[]>(),
      )
      return rows.map(verificationFromRow)
    },
    async getForPilot(pilotId) {
      const rows = unwrap(
        await db
          .from('faa_verifications')
          .select('*')
          .eq('pilot_id', pilotId)
          .order('submitted_at', { ascending: false })
          .limit(1)
          .returns<VerificationRow[]>(),
      )
      return rows[0] ? verificationFromRow(rows[0]) : undefined
    },
    async submit(input: NewVerification) {
      const row = unwrap(
        await db
          .from('faa_verifications')
          .insert({
            id: uid('ver'),
            pilot_id: input.pilotId,
            pilot_name: input.pilotName,
            certificate_type: input.certificateType,
            certificate_number: input.certificateNumber,
            status: 'pending',
            submitted_at: today(),
            verified_at: null,
            expires_at: input.expiresAt,
          })
          .select('*')
          .single<VerificationRow>(),
      )
      return verificationFromRow(row)
    },
    async setStatus(id, status) {
      const row = unwrap(
        await db
          .from('faa_verifications')
          .update({ status, verified_at: status === 'verified' ? today() : null })
          .eq('id', id)
          .select('*')
          .maybeSingle<VerificationRow>(),
      )
      return row ? verificationFromRow(row) : undefined
    },
  }
}

export function createSupabaseUserRepository(db: SupabaseClient): UserRepository {
  return {
    async list() {
      const rows = unwrap(
        await db.from('users').select('*').order('created_at', { ascending: false }).returns<UserRow[]>(),
      )
      return rows.map(userFromRow)
    },
    async getById(id) {
      const res = await db.from('users').select('*').eq('id', id).maybeSingle<UserRow>()
      const row = unwrap(res)
      return row ? userFromRow(row) : undefined
    },
    async setStatus(id, status, reason) {
      // Clear the flag note when an account is cleared back to active.
      const flagReason = status === 'active' ? null : reason ?? undefined
      const update: Record<string, unknown> = { status }
      if (flagReason !== undefined) update.flag_reason = flagReason
      const row = unwrap(
        await db.from('users').update(update).eq('id', id).select('*').maybeSingle<UserRow>(),
      )
      return row ? userFromRow(row) : undefined
    },
  }
}

export function createSupabaseCategoryRepository(db: SupabaseClient): CategoryRepository {
  return {
    async list() {
      const rows = unwrap(await db.from('categories').select('*').order('label').returns<Category[]>())
      return rows
    },
    async add(label) {
      const slug = slugify(label)
      const existing = unwrap(
        await db.from('categories').select('*').eq('slug', slug).maybeSingle<Category>(),
      )
      if (existing) return existing
      const row = unwrap(
        await db
          .from('categories')
          .insert({ slug, label: label.trim(), active: true })
          .select('*')
          .single<Category>(),
      )
      return row
    },
    async setActive(slug, active) {
      unwrap(await db.from('categories').update({ active }).eq('slug', slug).select('slug').maybeSingle())
    },
    async remove(slug) {
      unwrap(await db.from('categories').delete().eq('slug', slug).select('slug').maybeSingle())
    },
  }
}
