import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRepositories } from '@/data/RepositoryProvider'
import { Container } from '@/components/Container'
import { Card } from '@/components/Card'
import { SectionHeading } from '@/components/SectionHeading'
import { SelectField } from '@/components/fields'
import { Badge } from '@/components/Badge'
import { Reveal } from '@/components/motion/Reveal'
import { ReviewList } from '@/features/reviews/ReviewList'
import { ReviewForm } from '@/features/reviews/ReviewForm'

export function ReviewsPage() {
  const { pilots, reviews } = useRepositories()
  const [params] = useSearchParams()
  const queryClient = useQueryClient()

  const { data: allPilots = [] } = useQuery({
    queryKey: ['pilots', 'list', 'all'],
    queryFn: () => pilots.list(),
  })
  const [pilotId, setPilotId] = useState(params.get('pilot') ?? '')
  // Fall back to the first pilot once the list loads, if none is chosen yet.
  const effectiveId = pilotId || allPilots[0]?.id || ''

  const selected = allPilots.find((p) => p.id === effectiveId)
  const { data: listed = [] } = useQuery({
    queryKey: ['reviews', 'pilot', effectiveId],
    queryFn: () => reviews.listForPilot(effectiveId),
    enabled: Boolean(effectiveId),
  })

  return (
    <Container className="py-10">
      <SectionHeading
        tone="dark"
        eyebrow="Reputation"
        title="Reviews & ratings"
        subtitle="Real feedback from clients, with structured tags and verified-job trust signals."
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Reviews for the selected pilot */}
        <Reveal>
          <Card variant="elevated" className="p-6">
            <div className="mb-4 max-w-xs">
              <SelectField
                label="Choose a pilot"
                value={effectiveId}
                onChange={(e) => setPilotId(e.target.value)}
                options={allPilots.map((p) => ({ value: p.id, label: p.businessName }))}
              />
            </div>

            {selected && (
              <div className="mb-4 flex items-center gap-2 text-body-sm text-ink-400">
                <span className="font-semibold text-white">{selected.ratingAvg.toFixed(1)}</span>
                average · {listed.length} review{listed.length === 1 ? '' : 's'} shown
                <Badge tone="brand">{selected.businessName}</Badge>
              </div>
            )}

            <ReviewList reviews={listed} />
          </Card>
        </Reveal>

        {/* Submission form */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card variant="elevated" className="p-6">
            <h2 className="text-h3 text-white">Write a review</h2>
            <p className="mt-1 text-body-sm text-ink-400">
              Reviews help the next client hire with confidence.
            </p>
            <div className="mt-5">
              {selected && (
                <ReviewForm
                  pilotId={selected.id}
                  onSubmitted={() =>
                    queryClient.invalidateQueries({ queryKey: ['reviews', 'pilot', effectiveId] })
                  }
                />
              )}
            </div>
          </Card>
        </aside>
      </div>
    </Container>
  )
}
