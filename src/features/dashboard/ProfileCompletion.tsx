import { Link } from 'react-router-dom'
import { CheckCircle, Circle } from '@phosphor-icons/react'
import type { PilotProfile } from '@/data/types'
import { ROUTES } from '@/routes'

interface ChecklistItem {
  label: string
  done: boolean
  /** Dashboard route that lets the pilot complete this item. */
  to: string
}

/** Pure scoring of profile completeness (PRD §9 should-have + §3 completion metric). */
export function computeProfileCompletion(pilot: PilotProfile): {
  items: ChecklistItem[]
  completed: number
  total: number
  percent: number
} {
  const items: ChecklistItem[] = [
    { label: 'Write a bio (40+ characters)', done: pilot.bio.trim().length >= 40, to: ROUTES.dashboardProfile() },
    { label: 'Add at least one specialty', done: pilot.specialties.length > 0, to: ROUTES.dashboardProfile() },
    { label: 'Set a starting price', done: pilot.startingPrice > 0, to: ROUTES.dashboardProfile() },
    { label: 'Define your service area', done: pilot.serviceAreaMiles > 0, to: ROUTES.dashboardProfile() },
    { label: 'Upload 3+ portfolio items', done: pilot.portfolio.length >= 3, to: ROUTES.dashboardPortfolio() },
    { label: 'Verify your FAA certification', done: pilot.verificationStatus === 'verified', to: ROUTES.dashboardVerification() },
  ]
  const completed = items.filter((i) => i.done).length
  const total = items.length
  return { items, completed, total, percent: Math.round((completed / total) * 100) }
}

/** Visual checklist + progress meter for the dashboard. */
export function ProfileCompletion({ pilot }: { pilot: PilotProfile }) {
  const { items, completed, total, percent } = computeProfileCompletion(pilot)
  const complete = completed === total

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-body-sm font-semibold text-ink-200">
          {complete ? 'Profile complete' : `${completed} of ${total} complete`}
        </span>
        <span className="text-body-sm font-bold text-accent-300">{percent}%</span>
      </div>

      {/* Progress meter */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-400 transition-[width] duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ul className="mt-5 space-y-2.5">
        {items.map((item) => (
          <li key={item.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2.5 text-body-sm">
              {item.done ? (
                <CheckCircle weight="fill" className="h-5 w-5 shrink-0 text-verified-500" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-ink-500" />
              )}
              <span className={item.done ? 'text-ink-400 line-through' : 'text-ink-200'}>{item.label}</span>
            </span>
            {!item.done && (
              <Link
                to={item.to}
                className="shrink-0 text-body-sm font-semibold text-accent-300 hover:text-accent-200"
              >
                Fix →
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
