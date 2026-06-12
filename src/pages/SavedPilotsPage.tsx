import { Link } from 'react-router-dom'
import { Heart } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import type { PilotProfile } from '@/data/types'
import { useRepositories } from '@/data/RepositoryProvider'
import { useSavedPilots } from '@/saved/SavedPilotsProvider'
import { ROUTES } from '@/routes'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { Reveal } from '@/components/motion/Reveal'
import { Stagger } from '@/components/motion/Stagger'
import { PilotCard } from '@/features/pilots/PilotCard'

/** A client's shortlist of saved pilots (PRD §9 — saved pilots). */
export function SavedPilotsPage() {
  const { ids } = useSavedPilots()
  const { pilots } = useRepositories()

  const { data: allPilots = [] } = useQuery({
    queryKey: ['pilots', 'list', 'all'],
    queryFn: () => pilots.list(),
  })

  // Preserve save order; drop any ids that no longer resolve to a pilot.
  const byId = new Map(allPilots.map((p) => [p.id, p]))
  const saved = ids
    .map((id) => byId.get(id))
    .filter((p): p is PilotProfile => p !== undefined)

  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="flex items-center gap-2.5 text-h1 text-white">
          <Heart weight="fill" className="h-7 w-7 text-danger-500" /> Saved pilots
        </h1>
        <p className="mt-2 text-body text-ink-400">
          {saved.length > 0
            ? `${saved.length} pilot${saved.length === 1 ? '' : 's'} on your shortlist.`
            : 'Your shortlist of pilots to compare and contact.'}
        </p>
      </div>

      {saved.length === 0 ? (
        <EmptyState
          title="No saved pilots yet"
          description="Tap the heart on any pilot to add them to your shortlist."
          icon={<Heart className="h-6 w-6" />}
          action={
            <Link to={ROUTES.browse()}>
              <Button variant="primary">Browse pilots</Button>
            </Link>
          }
        />
      ) : (
        <Stagger className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {saved.map((pilot) => (
            <Reveal key={pilot.id} standalone={false}>
              <PilotCard pilot={pilot} tone="dark" />
            </Reveal>
          ))}
        </Stagger>
      )}
    </Container>
  )
}
