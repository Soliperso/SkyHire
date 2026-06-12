import { useState, type FormEvent } from 'react'
import { SealCheck, ShieldCheck, Clock } from '@phosphor-icons/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRepositories } from '@/data/RepositoryProvider'
import { VERIFICATION_LABELS } from '@/data/labels'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { VerifiedBadge } from '@/components/VerifiedBadge'
import { TextField } from '@/components/fields'
import { useDashboard } from '@/app/layout/DashboardLayout'

export function VerificationCenterPage() {
  const { pilot, refresh } = useDashboard()
  const { verifications, pilots } = useRepositories()

  const { data: record } = useQuery({
    queryKey: ['verifications', 'pilot', pilot.id],
    queryFn: () => verifications.getForPilot(pilot.id),
  })
  const status = pilot.verificationStatus

  const [form, setForm] = useState({
    certificateType: 'FAA Part 107 Remote Pilot',
    certificateNumber: '',
    expiresAt: '',
  })

  const mutation = useMutation({
    mutationFn: async () => {
      await verifications.submit({
        pilotId: pilot.id,
        pilotName: pilot.name,
        certificateType: form.certificateType,
        certificateNumber: form.certificateNumber,
        expiresAt: form.expiresAt || null,
      })
      // Reflect the pending state on the public profile immediately.
      await pilots.update(pilot.id, { verificationStatus: 'pending' })
    },
    onSuccess: () => refresh(),
  })

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    mutation.mutate()
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-h2 text-white">Verification</h2>
        <p className="mt-1 text-body-sm text-ink-400">
          The FAA badge is verification-based, not self-asserted — clients trust what we check.
        </p>
      </header>

      <Card variant="elevated" className="p-6">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2.5 text-body font-semibold text-white">
            <ShieldCheck weight="fill" className="h-5 w-5 text-accent-300" /> Current status
          </span>
          <VerifiedBadge status={status} />
        </div>

        {record && (
          <dl className="mt-5 grid gap-4 border-t border-white/10 pt-5 text-body-sm sm:grid-cols-2">
            <Detail label="Certificate">{record.certificateType}</Detail>
            <Detail label="Number">#{record.certificateNumber}</Detail>
            <Detail label="Submitted">{record.submittedAt}</Detail>
            <Detail label="Expires">{record.expiresAt ?? '—'}</Detail>
          </dl>
        )}
      </Card>

      {status === 'verified' ? (
        <Card variant="elevated" className="flex items-center gap-3 p-6">
          <SealCheck weight="fill" className="h-6 w-6 text-verified-500" />
          <p className="text-body-sm text-ink-200">
            Your certification is verified. The badge is live on your public profile.
          </p>
        </Card>
      ) : status === 'pending' ? (
        <Card variant="elevated" className="flex items-center gap-3 p-6">
          <Clock weight="fill" className="h-6 w-6 text-amber-500" />
          <p className="text-body-sm text-ink-200">
            Your submission is <Badge tone="warning">pending review</Badge> by our trust team.
          </p>
        </Card>
      ) : (
        <Card variant="elevated" className="space-y-5 p-6">
          <div>
            <h3 className="text-h3 text-white">Submit your certification</h3>
            <p className="mt-1 text-body-sm text-ink-400">
              We verify against the FAA registry before granting the badge. {VERIFICATION_LABELS[status]}.
            </p>
          </div>
          <form onSubmit={onSubmit} className="space-y-5">
            <TextField
              label="Certificate type"
              value={form.certificateType}
              onChange={(e) => setForm({ ...form, certificateType: e.target.value })}
              required
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label="Certificate number"
                placeholder="e.g. 4392001"
                value={form.certificateNumber}
                onChange={(e) => setForm({ ...form, certificateNumber: e.target.value })}
                required
              />
              <TextField
                label="Expires"
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              />
            </div>
            <Button type="submit" variant="primary" disabled={mutation.isPending}>
              {mutation.isPending ? 'Submitting…' : 'Submit for review'}
            </Button>
          </form>
        </Card>
      )}
    </div>
  )
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-ink-400">{label}</dt>
      <dd className="mt-0.5 font-medium text-white">{children}</dd>
    </div>
  )
}
