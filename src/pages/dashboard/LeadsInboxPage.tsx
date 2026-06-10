import { useState } from 'react'
import { MapPin, CurrencyDollar, EnvelopeSimple } from '@phosphor-icons/react'
import type { QuoteRequest, QuoteStatus } from '@/data/types'
import { useRepositories } from '@/data/RepositoryProvider'
import { SPECIALTY_LABELS } from '@/data/labels'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge, type BadgeTone } from '@/components/Badge'
import { EmptyState } from '@/components/EmptyState'
import { useDashboard } from '@/app/layout/DashboardLayout'

const STATUS_TONE: Record<QuoteStatus, BadgeTone> = {
  new: 'brand',
  responded: 'verified',
  closed: 'neutral',
}

export function LeadsInboxPage() {
  const { pilot } = useDashboard()
  const { quotes } = useRepositories()
  // Local mirror so status actions re-render (repo mutates in place).
  const [leads, setLeads] = useState<QuoteRequest[]>(() => quotes.listForPilot(pilot.id))

  function setStatus(id: string, status: QuoteStatus) {
    quotes.setStatus(id, status)
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-h2 text-white">Leads</h2>
        <p className="mt-1 text-body-sm text-ink-400">Quote requests from clients. Respond fast to win the job.</p>
      </header>

      {leads.length === 0 ? (
        <EmptyState
          title="No leads yet"
          description="When clients request a quote, they'll show up here."
          icon={<EnvelopeSimple className="h-6 w-6" />}
        />
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <Card key={lead.id} variant="elevated" className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-h3 text-white">{lead.clientName}</h3>
                    <Badge tone={STATUS_TONE[lead.status]}>{lead.status}</Badge>
                  </div>
                  <p className="mt-0.5 text-body-sm text-ink-400">{SPECIALTY_LABELS[lead.jobType]}</p>
                </div>
                <span className="text-caption text-ink-400">{lead.createdAt}</span>
              </div>

              <p className="mt-3 text-body-sm text-ink-200">{lead.details}</p>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-body-sm text-ink-400">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {lead.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CurrencyDollar className="h-4 w-4" /> {lead.budgetRange}
                </span>
                <a
                  href={`mailto:${lead.clientEmail}`}
                  className="inline-flex items-center gap-1.5 text-accent-300 hover:text-accent-200"
                >
                  <EnvelopeSimple className="h-4 w-4" /> {lead.clientEmail}
                </a>
              </div>

              <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
                <Button
                  size="sm"
                  variant="primary"
                  disabled={lead.status === 'responded'}
                  onClick={() => setStatus(lead.id, 'responded')}
                >
                  Mark responded
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-ink-300 hover:bg-white/5 hover:text-white"
                  disabled={lead.status === 'closed'}
                  onClick={() => setStatus(lead.id, 'closed')}
                >
                  Close
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
