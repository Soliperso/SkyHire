import type { User, UserStatus } from '../types'

/**
 * Account directory for admin user management (PRD §8.6). The UI depends only on
 * this interface — a Supabase-backed impl swaps in without component changes.
 */
export interface UserRepository {
  list(): User[]
  getById(id: string): User | undefined
  /** Admin sets account status (flag for review / suspend / reinstate). */
  setStatus(id: string, status: UserStatus, reason?: string): User | undefined
}
