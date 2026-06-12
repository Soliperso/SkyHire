import { Link } from 'react-router-dom'
import { Briefcase } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import type { QuoteStatus } from '@/data/types'
import { SPECIALTY_LABELS } from '@/data/labels'
import { useRepositories } from '@/data/RepositoryProvider'
import { useAuth } from '@/auth/AuthProvider'
import { ROUTES } from '@/routes'
import { Container } from '@/components/Container'
import { Card } from '@/components/Card'
import { Badge, type BadgeTone } from '@/components/Badge'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { Reveal } from '@/components/motion/Reveal'
import { Stagger } from '@/components/motion/Stagger'

const STATUS_TONE: Record<QuoteStatus, BadgeTone> = {
  new: 'brand',
  responded: 'verified',
  closed: 'neutral',
}

const STATUS_LABEL: Record<QuoteStatus, string> = {
  new: 'Awaiting reply',
  responded: 'Pilot responded',
  closed: 'Closed',
}

/** A client's own quote requests — their job history (PRD §10, client pages). */
export function JobHistoryPage() {
  const { user } = useAuth()
  const { quotes, pilots } = useRepositories()
  const email = user?.email ?? ''

  const { data: history = [], isPending } = useQuery({
    queryKey: ['quotes', 'client', email],
    queryFn: () => quotes.listForClient(email),
    enabled: Boolean(email),
  })
  const { data: allPilots = [] } = useQuery({
    queryKey: ['pilots', 'list', 'all'],
    queryFn: () => pilots.list(),
  })
  const pilotName = (id: string) => allPilots.find((p) => p.id === id)?.businessName ?? 'Pilot'

  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="flex items-center gap-2.5 text-h1 text-white">
          <Briefcase weight="fill" className="h-7 w-7 text-accent-300" /> Your quote requests
        </h1>
        <p className="mt-2 text-body text-ink-400">
          {history.length > 0
            ? `${history.length} request${history.length === 1 ? '' : 's'} you've sent to pilots.`
            : 'Track the quote requests you send to pilots here.'}
        </p>
      </div>

      {isPending ? null : history.length === 0 ? (
        <EmptyState
          title="No requests yet"
          description="When you request a quote from a pilot, it'll show up here so you can track replies."
          icon={<Briefcase className="h-6 w-6" />}
          action={
            <Link to={ROUTES.browse()}>
              <Button variant="primary">Browse pilots</Button>
            </Link>
          }
        />
      ) : (
        <Stagger className="space-y-4">
          {history.map((q) => (
            <Reveal key={q.id} standalone={false}>
              <Card variant="elevated" className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={ROUTES.pilot(q.pilotId)}
                        className="text-h3 text-white hover:text-accent-200"
                      >
                        {pilotName(q.pilotId)}
                      </Link>
                      <Badge tone={STATUS_TONE[q.status]}>{STATUS_LABEL[q.status]}</Badge>
                    </div>
                    <p className="mt-1 text-body-sm text-ink-400">
                      {SPECIALTY_LABELS[q.jobType] ?? q.jobType} · {q.location} · {q.budgetRange}
                    </p>
                    <p className="mt-2 text-body-sm text-ink-300">{q.details}</p>
                  </div>
                  <span className="shrink-0 text-caption text-ink-500">{q.createdAt}</span>
                </div>
              </Card>
            </Reveal>
          ))}
        </Stagger>
      )}
    </Container>
  )
}
