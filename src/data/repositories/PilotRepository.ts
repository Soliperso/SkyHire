import type { PilotFilters, PilotProfile, PilotSort } from '../types'

/**
 * Abstraction over the pilot data source. The UI depends only on this
 * interface — the mock implementation can be swapped for a Supabase-backed
 * one without touching any component (the "Supabase seam").
 */
export interface PilotRepository {
  list(filters?: PilotFilters, sort?: PilotSort): Promise<PilotProfile[]>
  getById(id: string): Promise<PilotProfile | undefined>
  featured(limit?: number): Promise<PilotProfile[]>
  /** Apply a partial update to a pilot (used by the pilot dashboard). Returns the updated profile. */
  update(id: string, patch: Partial<PilotProfile>): Promise<PilotProfile | undefined>
}
