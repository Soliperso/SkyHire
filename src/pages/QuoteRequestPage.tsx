import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle } from '@phosphor-icons/react'
import { useRepositories } from '@/data/RepositoryProvider'
import { ROUTES } from '@/routes'
import { Container } from '@/components/Container'
import { Card } from '@/components/Card'
import { Avatar } from '@/components/Avatar'
import { RatingStars } from '@/components/RatingStars'
import { VerifiedBadge } from '@/components/VerifiedBadge'
import { buttonStyles } from '@/components/Button'
import { Reveal } from '@/components/motion/Reveal'
import { QuoteRequestForm } from '@/features/quotes/QuoteRequestForm'
import { NotFoundPage } from './NotFoundPage'

export function QuoteRequestPage() {
  const { id = '' } = useParams()
  const { pilots } = useRepositories()
  const pilot = pilots.getById(id)
  const [submitted, setSubmitted] = useState(false)

  if (!pilot) return <NotFoundPage />

  return (
    <Container className="py-10">
      <Link
        to={ROUTES.pilot(pilot.id)}
        className="mb-6 inline-flex items-center gap-1.5 text-body-sm font-medium text-ink-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to profile
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <Reveal>
          {submitted ? (
            <Card variant="elevated" className="p-10 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-verified-500/15 text-verified-300">
                <CheckCircle weight="fill" className="h-8 w-8" />
              </div>
              <h1 className="text-h2 text-white">Request sent!</h1>
              <p className="mx-auto mt-3 max-w-md text-body text-ink-400">
                {pilot.businessName} typically responds within ~{pilot.responseTimeHours} hours.
                We’ll notify you by email as soon as they reply.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link to={ROUTES.browse()} className={buttonStyles('glass', 'md')}>
                  Browse more pilots
                </Link>
                <Link to={ROUTES.pilot(pilot.id)} className={buttonStyles('primary', 'md')}>
                  Back to profile
                </Link>
              </div>
            </Card>
          ) : (
            <Card variant="elevated" className="p-6 sm:p-8">
              <h1 className="text-h1 text-white">Request a quote</h1>
              <p className="mt-2 text-body text-ink-400">
                Tell {pilot.name} about your job. It only takes a minute.
              </p>
              <div className="mt-6">
                <QuoteRequestForm pilot={pilot} onSubmitted={() => setSubmitted(true)} />
              </div>
            </Card>
          )}
        </Reveal>

        {/* Pilot summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card variant="elevated" className="p-6">
            <div className="flex items-center gap-3">
              <Avatar src={pilot.avatarUrl} alt={pilot.name} size="md" className="ring-ink-900" />
              <div className="min-w-0">
                <p className="truncate text-h3 text-white">{pilot.businessName}</p>
                <p className="truncate text-body-sm text-ink-400">{pilot.location}</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <VerifiedBadge status={pilot.verificationStatus} />
              <RatingStars value={pilot.ratingAvg} count={pilot.reviewCount} showValue size={15} tone="dark" />
            </div>
          </Card>
        </aside>
      </div>
    </Container>
  )
}
