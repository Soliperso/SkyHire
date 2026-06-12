import type { FaaVerification, VerificationStatus } from '../types'

export interface NewVerification {
  pilotId: string
  pilotName: string
  certificateType: string
  certificateNumber: string
  expiresAt: string | null
}

export interface VerificationRepository {
  list(): Promise<FaaVerification[]>
  /** Submissions awaiting an admin decision — verification queue. */
  listPending(): Promise<FaaVerification[]>
  /** The most recent verification record for a pilot (their Verification center). */
  getForPilot(pilotId: string): Promise<FaaVerification | undefined>
  /** Pilot submits certification details for review (status → pending). */
  submit(input: NewVerification): Promise<FaaVerification>
  /** Admin decision on a submission (approve/reject). Stamps verifiedAt on approval. Returns the updated record. */
  setStatus(id: string, status: VerificationStatus): Promise<FaaVerification | undefined>
}
