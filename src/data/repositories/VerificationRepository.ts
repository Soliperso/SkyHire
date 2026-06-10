import type { FaaVerification } from '../types'

export interface NewVerification {
  pilotId: string
  pilotName: string
  certificateType: string
  certificateNumber: string
  expiresAt: string | null
}

export interface VerificationRepository {
  list(): FaaVerification[]
  /** Submissions awaiting an admin decision — verification queue. */
  listPending(): FaaVerification[]
  /** The most recent verification record for a pilot (their Verification center). */
  getForPilot(pilotId: string): FaaVerification | undefined
  /** Pilot submits certification details for review (status → pending). */
  submit(input: NewVerification): FaaVerification
}
