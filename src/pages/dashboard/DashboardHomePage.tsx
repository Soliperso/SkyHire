import { Link } from 'react-router-dom'
import { Tray, Star, SealCheck, CalendarCheck } from '@phosphor-icons/react'
import { useRepositories } from '@/data/RepositoryProvider'
import { ROUTES } from '@/routes'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { useDashboard } from '@/app/layout/DashboardLayout'
import { ProfileCompletion } from '@/features/dashboard/ProfileCompletion'

export function DashboardHomePage() {
  const { pilot } = useDashboard()
  const { quotes } = useRepositories()

  const leads = quotes.listForPilot(pilot.id)
  const newLeads = leads.filter((l) => l.status === 'new').length

  const stats = [
    {
      icon: Tray,
      label: 'Leads',
      value: leads.length,
      sub: newLeads > 0 ? `${newLeads} new` : 'All handled',
      to: ROUTES.dashboardLeads(),
    },
    {
      icon: Star,
      label: 'Rating',
      value: pilot.ratingAvg.toFixed(1),
      sub: `${pilot.reviewCount} reviews`,
      to: ROUTES.dashboardReviews(),
    },
    {
      icon: SealCheck,
      label: 'Verification',
      value: pilot.verificationStatus === 'verified' ? 'Verified' : 'Action needed',
      sub: pilot.verificationStatus,
      to: ROUTES.dashboardVerification(),
    },
    {
      icon: CalendarCheck,
      label: 'Availability',
      value: pilot.available ? 'Available' : 'Booking ahead',
      sub: `~${pilot.responseTimeHours}h response`,
      to: ROUTES.dashboardAvailability(),
    },
  ]

  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2">
        {stats.map(({ icon: Icon, label, value, sub, to }) => (
          <Link key={label} to={to}>
            <Card variant="elevated" interactive className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-body-sm text-ink-400">{label}</span>
                <Icon weight="fill" className="h-5 w-5 text-accent-300" />
              </div>
              <p className="mt-2 text-h2 capitalize text-white">{value}</p>
              <p className="mt-0.5 text-caption capitalize text-ink-400">{sub}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card variant="elevated" className="p-6">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-h3 text-white">Profile completion</h2>
          <Badge tone="brand">Boosts ranking</Badge>
        </div>
        <p className="mb-5 text-body-sm text-ink-400">
          Complete profiles rank higher in search and convert more leads.
        </p>
        <ProfileCompletion pilot={pilot} />
      </Card>
    </div>
  )
}
