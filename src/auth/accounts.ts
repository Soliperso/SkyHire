import type { Role } from '@/data/types'
import { SEED_PILOTS } from '@/data/seed/pilots'

/**
 * The authenticated user shape. Mirrors the PRD `User` model (§11) plus the
 * `pilotId` link for pilot accounts. This is the contract a real Supabase auth
 * layer would later satisfy — swapping the mock store below for real sessions
 * touches nothing else in the app (same "seam" idea as the repositories).
 */
export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
  avatarUrl?: string
  /** Set for pilot accounts — links the session to a PilotProfile. */
  pilotId?: string
}

/** Derive a deterministic demo email from a person's name. */
function demoEmail(name: string): string {
  return `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@skyhire.demo`
}

/** Every seeded pilot is a sign-in-able demo account. */
const PILOT_ACCOUNTS: AuthUser[] = SEED_PILOTS.map((p) => ({
  id: p.userId,
  name: p.name,
  email: demoEmail(p.name),
  role: 'pilot',
  avatarUrl: p.avatarUrl,
  pilotId: p.id,
}))

const ADMIN_ACCOUNT: AuthUser = {
  id: 'usr-admin',
  name: 'Trust & Safety',
  email: 'admin@skyhire.demo',
  role: 'admin',
}

const CLIENT_ACCOUNT: AuthUser = {
  id: 'usr-client',
  name: 'Jordan Mills',
  email: 'client@skyhire.demo',
  role: 'client',
}

export const DEMO_ACCOUNTS: AuthUser[] = [...PILOT_ACCOUNTS, ADMIN_ACCOUNT, CLIENT_ACCOUNT]

/**
 * Quick-fill chips on the login page. The admin account is intentionally
 * excluded — the console is operator-only and gated behind VITE_ADMIN_PASSCODE,
 * so we don't advertise it as a one-click demo login.
 */
export const QUICK_ACCOUNTS: AuthUser[] = [PILOT_ACCOUNTS[0], CLIENT_ACCOUNT]

/** Mock credential check: any password works; the email must match a demo account. */
export function findAccountByEmail(email: string): AuthUser | undefined {
  const normalized = email.trim().toLowerCase()
  return DEMO_ACCOUNTS.find((a) => a.email === normalized)
}

/** Where each role lands after signing in. */
export function homeForRole(role: Role): string {
  if (role === 'pilot') return '/dashboard'
  if (role === 'admin') return '/admin'
  return '/browse'
}
