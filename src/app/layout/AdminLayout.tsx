import { NavLink, Outlet } from 'react-router-dom'
import { SquaresFour, ListChecks, Users, FolderSimple, ShieldWarning } from '@phosphor-icons/react'
import { ROUTES } from '@/routes'
import { Container } from '@/components/Container'
import { cn } from '@/lib/cn'

const NAV = [
  { to: ROUTES.admin(), label: 'Overview', icon: SquaresFour, end: true },
  { to: ROUTES.adminListings(), label: 'Listings', icon: ListChecks, end: false },
  { to: ROUTES.adminUsers(), label: 'Users', icon: Users, end: false },
  { to: ROUTES.adminCategories(), label: 'Categories', icon: FolderSimple, end: false },
  { to: ROUTES.adminFraud(), label: 'Fraud', icon: ShieldWarning, end: false },
]

/** Shell for the admin console: shared header + section nav + routed content. */
export function AdminLayout() {
  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="text-h1 text-white">Admin console</h1>
        <p className="mt-2 text-body text-ink-400">
          Trust &amp; safety operations — verification, moderation, listings, accounts, and taxonomy.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
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
          <Outlet />
        </div>
      </div>
    </Container>
  )
}
