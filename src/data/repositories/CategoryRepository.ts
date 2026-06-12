import type { Category } from '../types'

/** Marketplace taxonomy management (PRD §8.6 — category management). */
export interface CategoryRepository {
  list(): Promise<Category[]>
  /** Create a new category from a display label (slug derived). Returns it, or the existing one on slug collision. */
  add(label: string): Promise<Category>
  /** Toggle whether a category is offered in filters/onboarding. */
  setActive(slug: string, active: boolean): Promise<void>
  remove(slug: string): Promise<void>
}
