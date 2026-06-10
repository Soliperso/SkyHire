import { SealCheck } from '@phosphor-icons/react'
import type { VerificationStatus } from '@/data/types'
import { VERIFICATION_LABELS } from '@/data/labels'
import { Badge, type BadgeTone } from './Badge'

const TONE_BY_STATUS: Record<VerificationStatus, BadgeTone> = {
  verified: 'verified',
  pending: 'warning',
  unverified: 'neutral',
  rejected: 'danger',
}

/**
 * Trust signal shown on profiles and cards. The FAA badge is verification-based
 * (PRD §12) — only `verified` pilots get the check mark.
 */
export function VerifiedBadge({
  status,
  className,
}: {
  status: VerificationStatus
  className?: string
}) {
  return (
    <Badge tone={TONE_BY_STATUS[status]} className={className}>
      {status === 'verified' && <SealCheck weight="fill" className="h-3.5 w-3.5" />}
      {VERIFICATION_LABELS[status]}
    </Badge>
  )
}
