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
 * Wires concrete repository implementations into the app. Today these are the
 * in-memory mock implementations; to go live, build Supabase-backed classes
 * that satisfy the same interfaces and construct them here — nothing else in
 * the app changes.
 */
export function RepositoryProvider({ children }: { children: ReactNode }) {
  const repositories = useMemo<Repositories>(
    () => ({
      pilots: createMockPilotRepository(),
      reviews: createMockReviewRepository(),
      quotes: createMockQuoteRepository(),
      verifications: createMockVerificationRepository(),
      users: createMockUserRepository(),
      categories: createMockCategoryRepository(),
    }),
    [],
  )

  return <RepositoryContext.Provider value={repositories}>{children}</RepositoryContext.Provider>
}

export function useRepositories(): Repositories {
  const ctx = useContext(RepositoryContext)
  if (!ctx) {
    throw new Error('useRepositories must be used within a RepositoryProvider')
  }
  return ctx
}
