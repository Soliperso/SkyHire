import { useCallback } from 'react'
import { NavLink, Outlet, useOutletContext } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  SquaresFour,
  IdentificationCard,
  SealCheck,
  Images,
  Tray,
  Star,
  CalendarCheck,
} from '@phosphor-icons/react'
import type { PilotProfile } from '@/data/types'
import { useAuth } from '@/auth/AuthProvider'
import { useRepositories } from '@/data/RepositoryProvider'
import { ROUTES } from '@/routes'
import { Container } from '@/components/Container'
import { Avatar } from '@/components/Avatar'
import { EmptyState } from '@/components/EmptyState'
import { cn } from '@/lib/cn'

export interface DashboardContext {
  pilot: PilotProfile
  /** Re-read the pilot from the repository after a mutating action. */
  refresh: () => void
}

/** Section pages read the current pilot + refresh fn from here. */
export function useDashboard(): DashboardContext {
  return useOutletContext<DashboardContext>()
}

const NAV = [
  { to: ROUTES.dashboard(), label: 'Overview', icon: SquaresFour, end: true },
  { to: ROUTES.dashboardProfile(), label: 'Profile', icon: IdentificationCard, end: false },
  { to: ROUTES.dashboardVerification(), label: 'Verification', icon: SealCheck, end: false },
  { to: ROUTES.dashboardPortfolio(), label: 'Portfolio', icon: Images, end: false },
  { to: ROUTES.dashboardLeads(), label: 'Leads', icon: Tray, end: false },
  { to: ROUTES.dashboardReviews(), label: 'Reviews', icon: Star, end: false },
  { to: ROUTES.dashboardAvailability(), label: 'Availability', icon: CalendarCheck, end: false },
]

export function DashboardLayout() {
  const { user } = useAuth()
  const { pilots } = useRepositories()
  const queryClient = useQueryClient()

  const { data: pilot, isPending } = useQuery({
    queryKey: ['pilots', 'byId', user?.pilotId],
    queryFn: () => pilots.getById(user!.pilotId!),
    enabled: Boolean(user?.pilotId),
  })

  // After a mutating action a section page calls refresh(); re-fetch active
  // queries so the dashboard reflects the new state from the backend.
  const refresh = useCallback(() => {
    void queryClient.invalidateQueries()
  }, [queryClient])

  if (isPending) {
    return <Container className="py-16 text-center text-body text-ink-400">Loading dashboard…</Container>
  }

  if (!pilot) {
    return (
      <Container className="py-16">
        <EmptyState title="No pilot profile" description="This account isn't linked to a pilot profile." />
      </Container>
    )
  }

  return (
    <Container className="py-10">
      <div className="mb-8 flex items-center gap-4">
        <Avatar src={pilot.avatarUrl} alt={pilot.name} size="lg" className="ring-ink-900" />
        <div>
          <h1 className="text-h1 text-white">{pilot.businessName}</h1>
          <p className="text-body text-ink-400">Pilot dashboard · {pilot.name}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* Side nav — horizontal scroll on small screens, sidebar on lg. */}
        <nav className="-mx-1 flex gap-1 overflow-x-auto pb-1 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'inline-flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-body-sm font-medium transition-colors',
                  isActive ? 'bg-white/10 text-white' : 'text-ink-400 hover:bg-white/5 hover:text-white',
                )
              }
            >
              <Icon weight="fill" className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="min-w-0">
          <Outlet context={{ pilot, refresh } satisfies DashboardContext} />
        </div>
      </div>
    </Container>
  )
}
