import type { Category } from '../types'
import { SPECIALTIES, SPECIALTY_LABELS } from '../labels'

/** Seeded from the specialty taxonomy — the admin can extend or retire entries. */
export const SEED_CATEGORIES: Category[] = SPECIALTIES.map((slug) => ({
  slug,
  label: SPECIALTY_LABELS[slug],
  active: true,
}))
