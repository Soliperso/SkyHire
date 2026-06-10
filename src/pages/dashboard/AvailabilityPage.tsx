import { useState, type FormEvent } from 'react'
import { useRepositories } from '@/data/RepositoryProvider'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { TextField } from '@/components/fields'
import { cn } from '@/lib/cn'
import { useDashboard } from '@/app/layout/DashboardLayout'
import { useSavedFlag, SavedBanner } from '@/features/dashboard/SavedFlag'

export function AvailabilityPage() {
  const { pilot, refresh } = useDashboard()
  const { pilots } = useRepositories()
  const [saved, markSaved] = useSavedFlag()

  const [available, setAvailable] = useState(pilot.available)
  const [serviceAreaMiles, setServiceArea] = useState(pilot.serviceAreaMiles)
  const [responseTimeHours, setResponseTime] = useState(pilot.responseTimeHours)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    pilots.update(pilot.id, {
      available,
      serviceAreaMiles: Number(serviceAreaMiles) || 0,
      responseTimeHours: Number(responseTimeHours) || 0,
    })
    refresh()
    markSaved()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <header>
        <h2 className="text-h2 text-white">Availability</h2>
        <p className="mt-1 text-body-sm text-ink-400">Control how you appear in search and on your profile.</p>
      </header>

      <Card variant="elevated" className="space-y-6 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-body font-semibold text-white">Accepting work</p>
            <p className="text-body-sm text-ink-400">
              Shows an “Available now” badge to clients when on.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={available}
            onClick={() => setAvailable((v) => !v)}
            className={cn(
              'relative h-7 w-12 shrink-0 rounded-full transition-colors',
              available ? 'bg-verified-500' : 'bg-white/15',
            )}
          >
            <span
              className={cn(
                'absolute top-1 h-5 w-5 rounded-full bg-white transition-transform',
                available ? 'translate-x-6' : 'translate-x-1',
              )}
            />
          </button>
        </div>

        <div className="grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-2">
          <TextField
            label="Service area (miles)"
            type="number"
            min={0}
            value={serviceAreaMiles}
            onChange={(e) => setServiceArea(Number(e.target.value))}
          />
          <TextField
            label="Typical response time (hours)"
            type="number"
            min={0}
            hint="Replies at/under 4h earn a “Fast responder” badge."
            value={responseTimeHours}
            onChange={(e) => setResponseTime(Number(e.target.value))}
          />
        </div>
      </Card>

      <div className="flex items-center gap-4">
        <Button type="submit" variant="primary">Save changes</Button>
        <SavedBanner show={saved} />
      </div>
    </form>
  )
}
