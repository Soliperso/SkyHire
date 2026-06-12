import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { PilotRepository } from './repositories/PilotRepository'
import type { ReviewRepository } from './repositories/ReviewRepository'
import type { QuoteRepository } from './repositories/QuoteRepository'
import type { VerificationRepository } from './repositories/VerificationRepository'
import type { UserRepository } from './repositories/UserRepository'
import type { CategoryRepository } from './repositories/CategoryRepository'
import {
  createMockCategoryRepository,
  createMockPilotRepository,
  createMockQuoteRepository,
  createMockReviewRepository,
  createMockUserRepository,
  createMockVerificationRepository,
} from './repositories/mock/mockRepositories'
import {
  createSupabaseCategoryRepository,
  createSupabasePilotRepository,
  createSupabaseQuoteRepository,
  createSupabaseReviewRepository,
  createSupabaseUserRepository,
  createSupabaseVerificationRepository,
} from './repositories/supabase/supabaseRepositories'
import { getSupabaseClient, hasSupabaseEnv } from './supabase/client'

export interface Repositories {
  pilots: PilotRepository
  reviews: ReviewRepository
  quotes: QuoteRepository
  verifications: VerificationRepository
  users: UserRepository
  categories: CategoryRepository
}

const RepositoryContext = createContext<Repositories | null>(null)

/**
 * Wires concrete repository implementations into the app — the single "Supabase
 * seam" swap point. When a Supabase backend is configured (VITE_SUPABASE_URL /
 * VITE_SUPABASE_ANON_KEY), data persists for real; otherwise the in-memory mock
 * implementations are used so the app still runs with no backend. The UI depends
 * only on the repository interfaces, so nothing else changes either way.
 */
export function RepositoryProvider({ children }: { children: ReactNode }) {
  const repositories = useMemo<Repositories>(() => {
    if (hasSupabaseEnv) {
      const db = getSupabaseClient()
      return {
        pilots: createSupabasePilotRepository(db),
        reviews: createSupabaseReviewRepository(db),
        quotes: createSupabaseQuoteRepository(db),
        verifications: createSupabaseVerificationRepository(db),
        users: createSupabaseUserRepository(db),
        categories: createSupabaseCategoryRepository(db),
      }
    }
    return {
      pilots: createMockPilotRepository(),
      reviews: createMockReviewRepository(),
      quotes: createMockQuoteRepository(),
      verifications: createMockVerificationRepository(),
      users: createMockUserRepository(),
      categories: createMockCategoryRepository(),
    }
  }, [])

  return <RepositoryContext.Provider value={repositories}>{children}</RepositoryContext.Provider>
}

export function useRepositories(): Repositories {
  const ctx = useContext(RepositoryContext)
  if (!ctx) {
    throw new Error('useRepositories must be used within a RepositoryProvider')
  }
  return ctx
}
