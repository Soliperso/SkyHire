import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SealCheck, Flag, Tray, ShieldWarning, Users } from '@phosphor-icons/react'
import type { FaaVerification, Review } from '@/data/types'
import { useRepositories } from '@/data/RepositoryProvider'
import { SPECIALTY_LABELS } from '@/data/labels'
import { ROUTES } from '@/routes'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { Reveal } from '@/components/motion/Reveal'
import { Stagger } from '@/components/motion/Stagger'
import { AdminTable, Tr, Td } from '@/features/admin/AdminTable'

export function AdminDashboardPage() {
  const { pilots, reviews, quotes, verifications } = useRepositories()

  // Local mirrors so admin actions re-render (repos mutate in place).
  const [pending, setPending] = useState<FaaVerification[]>(() => verifications.listPending())
  const [flagged, setFlagged] = useState<Review[]>(() => reviews.listFlagged())
  const leads = quotes.list()
  const allPilots = pilots.list()

  function decideVerification(v: FaaVerification, status: 'verified' | 'rejected') {
    verifications.setStatus(v.id, status)
    // Keep the pilot's public badge in sync with the decision.
    pilots.update(v.pilotId, { verificationStatus: status })
    setPending((prev) => prev.filter((p) => p.id !== v.id))
  }

  function moderateReview(r: Review, status: 'removed' | 'published') {
    reviews.setStatus(r.id, status)
    setFlagged((prev) => prev.filter((x) => x.id !== r.id))
  }

  const stats = [
    { icon: ShieldWarning, label: 'Pending verifications', value: pending.length, tone: 'warning' as const },
    { icon: Flag, label: 'Flagged reviews', value: flagged.length, tone: 'danger' as const },
    { icon: Tray, label: 'Active leads', value: leads.length, tone: 'brand' as const },
    { icon: Users, label: 'Total pilots', value: allPilots.length, tone: 'neutral' as const },
  ]

  return (
    <div className="space-y-10">
      {/* Stats */}
      <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ icon: Icon, label, value, tone }) => (
          <Reveal key={label} standalone={false}>
            <Card variant="elevated" className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-body-sm text-ink-400">{label}</span>
                <Badge tone={tone}>
                  <Icon className="h-3.5 w-3.5" />
                </Badge>
              </div>
              <p className="mt-2 text-h1 text-white">{value}</p>
            </Card>
          </Reveal>
        ))}
      </Stagger>

      {/* Verification queue */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-h2 text-white">
          <SealCheck weight="fill" className="h-6 w-6 text-verified-500" /> Verification queue
        </h2>
        <Card variant="elevated" className="overflow-hidden">
          {pending.length === 0 ? (
            <div className="p-6">
              <EmptyState title="Queue clear" description="No verification submissions awaiting review." />
            </div>
          ) : (
            <AdminTable head={['Pilot', 'Certificate', 'Submitted', 'Actions']}>
              {pending.map((v) => (
                <Tr key={v.id}>
                  <Td>
                    <Link to={ROUTES.pilot(v.pilotId)} className="font-medium text-accent-300 hover:underline">
                      {v.pilotName}
                    </Link>
                  </Td>
                  <Td>
                    <span className="text-ink-200">{v.certificateType}</span>
                    <span className="block text-caption text-ink-400">#{v.certificateNumber}</span>
                  </Td>
                  <Td className="text-ink-400">{v.submittedAt}</Td>
                  <Td>
                    <div className="flex gap-2">
                      <Button size="sm" variant="primary" onClick={() => decideVerification(v, 'verified')}>
                        Approve
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => decideVerification(v, 'rejected')}>
                        Reject
                      </Button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </AdminTable>
          )}
        </Card>
      </section>

      {/* Review moderation */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-h2 text-white">
          <Flag className="h-6 w-6 text-danger-600" /> Review moderation
        </h2>
        <Card variant="elevated" className="overflow-hidden">
          {flagged.length === 0 ? (
            <div className="p-6">
              <EmptyState title="Nothing flagged" description="No reviews are awaiting moderation." />
            </div>
          ) : (
            <AdminTable head={['Review', 'Author', 'Actions']}>
              {flagged.map((r) => (
                <Tr key={r.id}>
                  <Td>
                    <p className="max-w-md text-ink-200">{r.text}</p>
                    <Badge tone="danger" className="mt-1.5">Flagged · spam</Badge>
                  </Td>
                  <Td className="text-ink-400">{r.clientName}</Td>
                  <Td>
                    <div className="flex gap-2">
                      <Button size="sm" variant="danger" onClick={() => moderateReview(r, 'removed')}>
                        Remove
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => moderateReview(r, 'published')}>
                        Keep
                      </Button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </AdminTable>
          )}
        </Card>
      </section>

      {/* Lead monitoring */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-h2 text-white">
          <Tray className="h-6 w-6 text-brand-400" /> Recent leads
        </h2>
        <Card variant="elevated" className="overflow-hidden">
          <AdminTable head={['Client', 'Service', 'Location', 'Budget', 'Status']}>
            {leads.map((q) => (
              <Tr key={q.id}>
                <Td className="font-medium text-white">{q.clientName}</Td>
                <Td className="text-ink-200">{SPECIALTY_LABELS[q.jobType]}</Td>
                <Td className="text-ink-400">{q.location}</Td>
                <Td className="text-ink-400">{q.budgetRange}</Td>
                <Td>
                  <Badge tone={q.status === 'new' ? 'brand' : 'neutral'}>{q.status}</Badge>
                </Td>
              </Tr>
            ))}
          </AdminTable>
        </Card>
      </section>
    </div>
  )
}
