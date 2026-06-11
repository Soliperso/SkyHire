import { ChartLineUp, Eye, MagnifyingGlass, Tray } from '@phosphor-icons/react'
import type { PilotProfile, QuoteRequest } from '@/data/types'
import { Card } from '@/components/Card'
import { AnimatedCounter } from '@/components/motion/AnimatedCounter'

/** Deterministic pseudo-metric from a seed so demo numbers stay stable per pilot. */
function seeded(seed: string, min: number, max: number): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return min + (h % (max - min + 1))
}

/**
 * Lightweight performance snapshot for the pilot dashboard (PRD §9 "could have").
 * Views/impressions are demo figures derived deterministically from the profile;
 * leads and response rate are real, computed from quote requests.
 */
export function PilotAnalytics({ pilot, leads }: { pilot: PilotProfile; leads: QuoteRequest[] }) {
  const views = seeded(pilot.id + 'v', 240, 1480)
  const impressions = views * (3 + (seeded(pilot.id + 'i', 0, 20) / 10))
  const responded = leads.filter((l) => l.status !== 'new').length
  const responseRate = leads.length ? Math.round((responded / leads.length) * 100) : null

  const cards = [
    { icon: Eye, label: 'Profile views', node: <AnimatedCounter value={views} />, sub: 'Last 30 days' },
    {
      icon: MagnifyingGlass,
      label: 'Search impressions',
      node: <AnimatedCounter value={Math.round(impressions)} />,
      sub: 'Last 30 days',
    },
    { icon: Tray, label: 'Leads received', node: <AnimatedCounter value={leads.length} />, sub: 'All time' },
    {
      icon: ChartLineUp,
      label: 'Response rate',
      node: responseRate === null ? '—' : <AnimatedCounter value={responseRate} suffix="%" />,
      sub: responseRate === null ? 'No leads yet' : `${responded} of ${leads.length} answered`,
    },
  ]

  return (
    <div>
      <h2 className="mb-4 text-h3 text-white">Performance</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ icon: Icon, label, node, sub }) => (
          <Card key={label} variant="elevated" className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-ink-400">{label}</span>
              <Icon weight="fill" className="h-5 w-5 text-accent-300" />
            </div>
            <p className="mt-2 text-h2 text-white">{node}</p>
            <p className="mt-0.5 text-caption text-ink-400">{sub}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
