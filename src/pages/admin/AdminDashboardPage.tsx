import { Link } from 'react-router-dom'
import { SealCheck, Flag, Tray, ShieldWarning, Users } from '@phosphor-icons/react'
import { useRepositories } from '@/data/RepositoryProvider'
import { ROUTES } from '@/routes'
import { Container } from '@/components/Container'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { Reveal } from '@/components/motion/Reveal'
import { Stagger } from '@/components/motion/Stagger'

export function AdminDashboardPage() {
  const { pilots, reviews, quotes, verifications } = useRepositories()

  const pending = verifications.listPending()
  const flagged = reviews.listFlagged()
  const leads = quotes.list()
  const allPilots = pilots.list()

  const stats = [
    { icon: ShieldWarning, label: 'Pending verifications', value: pending.length, tone: 'warning' as const },
    { icon: Flag, label: 'Flagged reviews', value: flagged.length, tone: 'danger' as const },
    { icon: Tray, label: 'Active leads', value: leads.length, tone: 'brand' as const },
    { icon: Users, label: 'Total pilots', value: allPilots.length, tone: 'neutral' as const },
  ]

  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="text-h1 text-white">Admin console</h1>
        <p className="mt-2 text-body text-ink-400">
          Trust &amp; safety operations — verification, moderation, and lead monitoring.
        </p>
      </div>

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
      <section className="mt-10">
        <h2 className="mb-4 flex items-center gap-2 text-h2 text-white">
          <SealCheck weight="fill" className="h-6 w-6 text-verified-500" /> Verification queue
        </h2>
        <Card variant="elevated" className="overflow-hidden">
          {pending.length === 0 ? (
            <div className="p-6">
              <EmptyState title="Queue clear" description="No verification submissions awaiting review." />
            </div>
          ) : (
            <Table head={['Pilot', 'Certificate', 'Submitted', 'Actions']}>
              {pending.map((v) => (
                <tr key={v.id} className="border-t border-white/10">
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
                      <Button size="sm" variant="primary">Approve</Button>
                      <Button size="sm" variant="secondary">Reject</Button>
                    </div>
                  </Td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
      </section>

      {/* Review moderation */}
      <section className="mt-10">
        <h2 className="mb-4 flex items-center gap-2 text-h2 text-white">
          <Flag className="h-6 w-6 text-danger-600" /> Review moderation
        </h2>
        <Card variant="elevated" className="overflow-hidden">
          {flagged.length === 0 ? (
            <div className="p-6">
              <EmptyState title="Nothing flagged" description="No reviews are awaiting moderation." />
            </div>
          ) : (
            <Table head={['Review', 'Author', 'Actions']}>
              {flagged.map((r) => (
                <tr key={r.id} className="border-t border-white/10">
                  <Td>
                    <p className="max-w-md text-ink-200">{r.text}</p>
                    <Badge tone="danger" className="mt-1.5">Flagged · spam</Badge>
                  </Td>
                  <Td className="text-ink-400">{r.clientName}</Td>
                  <Td>
                    <div className="flex gap-2">
                      <Button size="sm" variant="danger">Remove</Button>
                      <Button size="sm" variant="secondary">Keep</Button>
                    </div>
                  </Td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
      </section>

      {/* Lead monitoring */}
      <section className="mt-10">
        <h2 className="mb-4 flex items-center gap-2 text-h2 text-white">
          <Tray className="h-6 w-6 text-brand-400" /> Recent leads
        </h2>
        <Card variant="elevated" className="overflow-hidden">
          <Table head={['Client', 'Service', 'Location', 'Budget', 'Status']}>
            {leads.map((q) => (
              <tr key={q.id} className="border-t border-white/10">
                <Td className="font-medium text-white">{q.clientName}</Td>
                <Td className="text-ink-200">{q.jobType.replace('-', ' ')}</Td>
                <Td className="text-ink-400">{q.location}</Td>
                <Td className="text-ink-400">{q.budgetRange}</Td>
                <Td>
                  <Badge tone={q.status === 'new' ? 'brand' : 'neutral'}>{q.status}</Badge>
                </Td>
              </tr>
            ))}
          </Table>
        </Card>
      </section>
    </Container>
  )
}

function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-body-sm">
        <thead>
          <tr className="bg-white/5">
            {head.map((h) => (
              <th key={h} className="px-5 py-3 font-semibold text-ink-300">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-4 align-top ${className ?? ''}`}>{children}</td>
}
