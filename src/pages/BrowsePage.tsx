import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import type { PilotFilters, PilotSort, Specialty } from '@/data/types'
import { useRepositories } from '@/data/RepositoryProvider'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { Reveal } from '@/components/motion/Reveal'
import { Stagger } from '@/components/motion/Stagger'
import { FilterPanel } from '@/features/pilots/FilterPanel'
import { SortControl } from '@/features/pilots/SortControl'
import { PilotCard } from '@/features/pilots/PilotCard'

const EMPTY: PilotFilters = { specialty: 'all', minRating: 0, verifiedOnly: false, location: '', query: '' }

export function BrowsePage() {
  const { pilots } = useRepositories()
  const [params] = useSearchParams()

  // Seed filters from the URL (set by the home-page search).
  const [filters, setFilters] = useState<PilotFilters>(() => ({
    ...EMPTY,
    query: params.get('q') ?? '',
    location: params.get('location') ?? '',
    specialty: (params.get('specialty') as Specialty) ?? 'all',
  }))
  const [sort, setSort] = useState<PilotSort>('relevance')

  const { data: results = [], isPending } = useQuery({
    queryKey: ['pilots', 'list', filters, sort],
    queryFn: () => pilots.list(filters, sort),
  })

  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="text-h1 text-white">Browse drone pilots</h1>
        <p className="mt-2 text-body text-ink-400">
          {isPending
            ? 'Finding pilots…'
            : `${results.length} pilot${results.length === 1 ? '' : 's'} matching your criteria.`}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <FilterPanel filters={filters} onChange={setFilters} onReset={() => setFilters(EMPTY)} />
        </aside>

        <div>
          <div className="mb-5 flex items-center justify-end">
            <SortControl value={sort} onChange={setSort} />
          </div>

          {isPending ? null : results.length === 0 ? (
            <EmptyState
              title="No pilots match these filters"
              description="Try widening your location radius or clearing the verified-only filter."
              action={<Button variant="glass" onClick={() => setFilters(EMPTY)}>Clear filters</Button>}
            />
          ) : (
            <Stagger className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((pilot) => (
                <Reveal key={pilot.id} standalone={false}>
                  <PilotCard pilot={pilot} tone="dark" />
                </Reveal>
              ))}
            </Stagger>
          )}
        </div>
      </div>
    </Container>
  )
}
