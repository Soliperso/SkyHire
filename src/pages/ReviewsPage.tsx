import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
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

  const allPilots = useMemo(() => pilots.list(), [pilots])
  const [pilotId, setPilotId] = useState(params.get('pilot') ?? allPilots[0]?.id ?? '')
  // Bump to recompute review lists after a submission (mock store mutates in place).
  const [version, setVersion] = useState(0)

  const selected = pilots.getById(pilotId)
  const listed = useMemo(
    () => (selected ? reviews.listForPilot(selected.id) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reviews, selected, version],
  )

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
                value={pilotId}
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
                <ReviewForm pilotId={selected.id} onSubmitted={() => setVersion((v) => v + 1)} />
              )}
            </div>
          </Card>
        </aside>
      </div>
    </Container>
  )
}
