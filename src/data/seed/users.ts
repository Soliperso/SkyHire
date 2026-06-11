import type { User } from '../types'
import { SEED_PILOTS } from './pilots'

/** Derive a deterministic demo email from a person's name (matches auth/accounts). */
function demoEmail(name: string): string {
  return `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@skyhire.demo`
}

/** Every seeded pilot is also a platform user account. */
const PILOT_USERS: User[] = SEED_PILOTS.map((p, i) => ({
  id: p.userId,
  name: p.name,
  email: demoEmail(p.name),
  role: 'pilot',
  status: 'active',
  createdAt: `2026-0${(i % 5) + 1}-1${i % 9}`,
}))

/** Staff + client accounts, including a couple flagged for the fraud demo. */
const OTHER_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'Trust & Safety',
    email: 'admin@skyhire.demo',
    role: 'admin',
    status: 'active',
    createdAt: '2025-10-01',
  },
  {
    id: 'usr-client',
    name: 'Jordan Mills',
    email: 'client@skyhire.demo',
    role: 'client',
    status: 'active',
    createdAt: '2026-04-12',
  },
  {
    id: 'usr-c-avery',
    name: 'Avery Stone',
    email: 'avery@stonerealty.com',
    role: 'client',
    status: 'active',
    createdAt: '2026-05-30',
  },
  {
    id: 'usr-c-harbor',
    name: 'Harbor Events',
    email: 'book@harborevents.co',
    role: 'client',
    status: 'active',
    createdAt: '2026-06-02',
  },
  {
    id: 'usr-spam',
    name: 'anon_user_88',
    email: 'promo+88@mailinator.com',
    role: 'client',
    status: 'flagged',
    createdAt: '2026-06-05',
    flagReason: 'Posted a review flagged as spam (external links).',
  },
  {
    id: 'usr-c-dupe',
    name: 'Quick Quotes LLC',
    email: 'noreply@temp-mail.org',
    role: 'client',
    status: 'flagged',
    createdAt: '2026-06-09',
    flagReason: 'Disposable email domain; 6 quote requests in under an hour.',
  },
]

export const SEED_USERS: User[] = [...PILOT_USERS, ...OTHER_USERS]
