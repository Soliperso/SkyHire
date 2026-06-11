import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldWarning, Flag, Prohibit, Warning } from '@phosphor-icons/react'
import type { BadgeTone } from '@/components/Badge'
import type { User, UserStatus } from '@/data/types'
import { useRepositories } from '@/data/RepositoryProvider'
import { USER_STATUS_LABELS } from '@/data/labels'
import { ROUTES } from '@/routes'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { AdminTable, Tr, Td } from '@/features/admin/AdminTable'

const STATUS_TONE: Record<UserStatus, BadgeTone> = {
  active: 'verified',
  flagged: 'warning',
  suspended: 'danger',
}

/** Suspicious-account monitoring + review-spam signals (PRD §8.6 / §12). */
export function FraudMonitoringPage() {
  const { users, reviews } = useRepositories()
  const [version, setVersion] = useState(0)

  const flaggedAccounts = useMemo(() => {
    void version
    return users.list().filter((u) => u.status !== 'active')
  }, [users, version])

  const spamReviews = useMemo(() => reviews.listFlagged(), [reviews])

  const stats = [
    { icon: Flag, label: 'Flagged accounts', value: flaggedAccounts.filter((u) => u.status === 'flagged').length, tone: 'warning' as const },
    { icon: Prohibit, label: 'Suspended', value: flaggedAccounts.filter((u) => u.status === 'suspended').length, tone: 'danger' as const },
    { icon: Warning, label: 'Spam reviews', value: spamReviews.length, tone: 'danger' as const },
  ]

  function setStatus(u: User, status: UserStatus) {
    users.setStatus(u.id, status)
    setVersion((v) => v + 1)
  }

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-h2 text-white">Fraud monitoring</h2>
        <p className="mt-1 text-body-sm text-ink-400">
          Suspicious accounts and review-integrity signals surfaced for trust &amp; safety review.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-3">
        {stats.map(({ icon: Icon, label, value, tone }) => (
          <Card key={label} variant="elevated" className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-ink-400">{label}</span>
              <Badge tone={tone}>
                <Icon className="h-3.5 w-3.5" />
              </Badge>
            </div>
            <p className="mt-2 text-h1 text-white">{value}</p>
          </Card>
        ))}
      </div>

      <section>
        <h3 className="mb-4 flex items-center gap-2 text-h3 text-white">
          <ShieldWarning weight="fill" className="h-5 w-5 text-amber-400" /> Accounts under review
        </h3>
        <Card variant="elevated" className="overflow-hidden">
          {flaggedAccounts.length === 0 ? (
            <div className="p-6">
              <EmptyState title="All clear" description="No accounts are currently flagged or suspended." />
            </div>
          ) : (
            <AdminTable head={['Account', 'Status', 'Reason', 'Actions']}>
              {flaggedAccounts.map((u) => (
                <Tr key={u.id}>
                  <Td>
                    <span className="font-medium text-white">{u.name}</span>
                    <span className="block text-caption text-ink-400">{u.email}</span>
                  </Td>
                  <Td>
                    <Badge tone={STATUS_TONE[u.status]}>{USER_STATUS_LABELS[u.status]}</Badge>
                  </Td>
                  <Td className="max-w-xs text-ink-300">{u.flagReason ?? '—'}</Td>
                  <Td>
                    <div className="flex gap-2">
                      {u.status !== 'suspended' && (
                        <Button size="sm" variant="danger" onClick={() => setStatus(u, 'suspended')}>
                          Suspend
                        </Button>
                      )}
                      <Button size="sm" variant="secondary" onClick={() => setStatus(u, 'active')}>
                        Dismiss
                      </Button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </AdminTable>
          )}
        </Card>
      </section>

      <section>
        <h3 className="mb-4 flex items-center gap-2 text-h3 text-white">
          <Warning weight="fill" className="h-5 w-5 text-danger-500" /> Review-integrity signals
        </h3>
        <Card variant="elevated" className="overflow-hidden">
          {spamReviews.length === 0 ? (
            <div className="p-6">
              <EmptyState title="No spam detected" description="No reviews are currently flagged for spam." />
            </div>
          ) : (
            <AdminTable head={['Author', 'Flagged review', 'Action']}>
              {spamReviews.map((r) => (
                <Tr key={r.id}>
                  <Td className="text-ink-200">{r.clientName}</Td>
                  <Td className="max-w-md text-ink-300">{r.text}</Td>
                  <Td>
                    <Link
                      to={ROUTES.admin()}
                      className="text-body-sm font-semibold text-accent-300 hover:text-accent-200"
                    >
                      Moderate →
                    </Link>
                  </Td>
                </Tr>
              ))}
            </AdminTable>
          )}
        </Card>
      </section>
    </div>
  )
}
