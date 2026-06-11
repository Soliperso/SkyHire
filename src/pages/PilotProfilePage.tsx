import { Link, useParams } from 'react-router-dom'
import { Clock, MapPin, Compass } from '@phosphor-icons/react'
import { useRepositories } from '@/data/RepositoryProvider'
import { PRICING_LABELS, SPECIALTY_LABELS } from '@/data/labels'
import { ROUTES } from '@/routes'
import { Container } from '@/components/Container'
import { Card } from '@/components/Card'
import { Avatar } from '@/components/Avatar'
import { Tag } from '@/components/Tag'
import { Badge } from '@/components/Badge'
import { RatingStars } from '@/components/RatingStars'
import { VerifiedBadge } from '@/components/VerifiedBadge'
import { FastResponderBadge } from '@/components/FastResponderBadge'
import { buttonStyles } from '@/components/Button'
import { SaveButton } from '@/features/saved/SaveButton'
import { Reveal } from '@/components/motion/Reveal'
import { PortfolioGallery } from '@/features/pilots/PortfolioGallery'
import { ReviewList } from '@/features/reviews/ReviewList'
import { NotFoundPage } from './NotFoundPage'

export function PilotProfilePage() {
  const { id = '' } = useParams()
  const { pilots, reviews } = useRepositories()
  const pilot = pilots.getById(id)

  if (!pilot) return <NotFoundPage />

  const pilotReviews = reviews.listForPilot(pilot.id)

  return (
    <>
      {/* Cover */}
      <div className="relative h-48 overflow-hidden bg-ink-900 sm:h-64">
        <img
          src={pilot.portfolio[0]?.imageUrl}
          alt=""
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 to-transparent" />
      </div>

      <Container className="relative z-10 -mt-16 pb-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Main column */}
          <div>
            <Card variant="elevated" className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <Avatar src={pilot.avatarUrl} alt={pilot.name} size="lg" className="shadow-card ring-ink-900" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-h1 text-white">{pilot.businessName}</h1>
                    <VerifiedBadge status={pilot.verificationStatus} />
                    <FastResponderBadge hours={pilot.responseTimeHours} />
                  </div>
                  <p className="mt-1 text-body text-ink-400">{pilot.name}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-body-sm text-ink-400">
                    <RatingStars value={pilot.ratingAvg} count={pilot.reviewCount} showValue size={16} tone="dark" />
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" /> {pilot.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Compass className="h-4 w-4" /> {pilot.serviceAreaMiles} mi service area
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-4 w-4" /> ~{pilot.responseTimeHours}h response
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-body leading-relaxed text-ink-300">{pilot.bio}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {pilot.specialties.map((s) => (
                  <Tag key={s} tone="dark">{SPECIALTY_LABELS[s]}</Tag>
                ))}
              </div>
            </Card>

            {/* Portfolio */}
            <section className="mt-8">
              <Reveal>
                <h2 className="mb-4 text-h2 text-white">Portfolio</h2>
                <PortfolioGallery items={pilot.portfolio} />
              </Reveal>
            </section>

            {/* Reviews */}
            <section className="mt-10">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-h2 text-white">
                  Reviews <span className="text-ink-400">({pilot.reviewCount})</span>
                </h2>
                <Link
                  to={ROUTES.reviews(pilot.id)}
                  className="text-body-sm font-semibold text-accent-300 hover:text-accent-200"
                >
                  Write a review →
                </Link>
              </div>
              <Card variant="elevated" className="px-6 py-2">
                <ReviewList reviews={pilotReviews} />
              </Card>
            </section>
          </div>

          {/* Sticky hire sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card variant="elevated" className="p-6">
              <p className="text-body-sm text-ink-400">Starting from</p>
              <p className="mt-1 text-h1 text-white">
                ${pilot.startingPrice.toLocaleString()}
                <span className="text-body font-normal text-ink-400">{PRICING_LABELS[pilot.pricingModel]}</span>
              </p>

              <div className="my-5 space-y-2.5 border-y border-white/10 py-5 text-body-sm">
                <Row label="Availability">
                  {pilot.available ? (
                    <Badge tone="verified">Available now</Badge>
                  ) : (
                    <Badge tone="neutral">Booking ahead</Badge>
                  )}
                </Row>
                <Row label="Response time">~{pilot.responseTimeHours} hours</Row>
                <Row label="Verification">{pilot.verificationStatus === 'verified' ? 'FAA verified' : 'Not verified'}</Row>
              </div>

              <div className="flex gap-2">
                <Link to={ROUTES.quote(pilot.id)} className={buttonStyles('primary', 'lg') + ' flex-1'}>
                  Request a quote
                </Link>
                <SaveButton pilotId={pilot.id} variant="plain" className="h-12 w-12 shrink-0" />
              </div>
              <p className="mt-3 text-center text-caption text-ink-400">
                Free to request · No obligation
              </p>
            </Card>
          </aside>
        </div>
      </Container>
    </>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-400">{label}</span>
      <span className="font-medium text-white">{children}</span>
    </div>
  )
}
