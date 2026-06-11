import { Link } from 'react-router-dom'
import { Clock, MapPin } from '@phosphor-icons/react'
import type { PilotProfile } from '@/data/types'
import { PRICING_LABELS, SPECIALTY_LABELS } from '@/data/labels'
import { ROUTES } from '@/routes'
import { Card } from '@/components/Card'
import { Avatar } from '@/components/Avatar'
import { Tag } from '@/components/Tag'
import { RatingStars } from '@/components/RatingStars'
import { VerifiedBadge } from '@/components/VerifiedBadge'
import { FastResponderBadge } from '@/components/FastResponderBadge'
import { SaveButton } from '@/features/saved/SaveButton'
import { cn } from '@/lib/cn'

/**
 * Pilot listing card. `tone="dark"` renders the elevated dark surface for the
 * cinematic dark pages; `light` is the white surface for light pages.
 */
export function PilotCard({
  pilot,
  tone = 'light',
}: {
  pilot: PilotProfile
  tone?: 'light' | 'dark'
}) {
  const dark = tone === 'dark'

  // Token-driven color sets so nothing is hardcoded per usage.
  const c = {
    name: dark ? 'text-white hover:text-brand-300' : 'text-ink-900 hover:text-brand-700',
    sub: dark ? 'text-ink-400' : 'text-ink-500',
    meta: dark ? 'text-ink-400' : 'text-ink-500',
    divider: dark ? 'border-white/10' : 'border-ink-100',
    price: dark ? 'text-white' : 'text-ink-900',
    link: dark ? 'text-brand-300 hover:text-brand-200' : 'text-brand-700 hover:text-brand-800',
    avatarRing: dark ? 'ring-ink-900' : 'ring-white',
  }

  return (
    <Card
      variant={dark ? 'elevated' : 'solid'}
      interactive
      className="group relative flex h-full flex-col overflow-hidden"
    >
      <SaveButton pilotId={pilot.id} variant="overlay" className="absolute left-3 top-3 z-20" />

      {/* Cover image */}
      <Link to={ROUTES.pilot(pilot.id)} className="relative block aspect-[16/10] overflow-hidden">
        <img
          src={pilot.portfolio[0]?.imageUrl}
          alt={`${pilot.businessName} portfolio`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/45 via-transparent to-transparent opacity-70" />
        <div className="absolute right-3 top-3">
          <VerifiedBadge status={pilot.verificationStatus} />
        </div>
        {/* Trust pills stack at bottom-right so they never collide with the
            avatar that overlaps the cover at bottom-left. */}
        <div className="absolute bottom-3 right-3 flex flex-col items-end gap-1.5">
          <FastResponderBadge hours={pilot.responseTimeHours} variant="overlay" />
          {pilot.available && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-caption font-semibold text-verified-700 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-verified-500" />
              Available now
            </span>
          )}
        </div>
      </Link>

      <div className="relative z-10 flex flex-1 flex-col p-5">
        <div className="flex items-start gap-3">
          <Avatar
            src={pilot.avatarUrl}
            alt={pilot.name}
            size="md"
            className={cn(
              '-mt-10 shadow-card',
              pilot.verificationStatus === 'verified' ? 'ring-verified-400' : c.avatarRing,
            )}
          />
          <div className="min-w-0 flex-1 pt-0.5">
            <Link
              to={ROUTES.pilot(pilot.id)}
              className={cn('block truncate text-h3', c.name)}
            >
              {pilot.businessName}
            </Link>
            <p className={cn('truncate text-body-sm', c.sub)}>{pilot.name}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <RatingStars
            value={pilot.ratingAvg}
            count={pilot.reviewCount}
            showValue
            size={15}
            tone={tone}
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {pilot.specialties.slice(0, 2).map((s) => (
            <Tag key={s} tone={tone}>
              {SPECIALTY_LABELS[s]}
            </Tag>
          ))}
        </div>

        <div className={cn('mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-body-sm', c.meta)}>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" /> {pilot.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4" /> ~{pilot.responseTimeHours}h response
          </span>
        </div>

        <div className={cn('mt-4 flex items-center justify-between border-t pt-4', c.divider)}>
          <p className="text-body-sm">
            <span className={c.sub}>from </span>
            <span className={cn('font-bold', c.price)}>${pilot.startingPrice.toLocaleString()}</span>
            <span className={c.sub}>{PRICING_LABELS[pilot.pricingModel]}</span>
          </p>
          <Link
            to={ROUTES.pilot(pilot.id)}
            className={cn('group/link inline-flex items-center gap-1 text-body-sm font-semibold', c.link)}
          >
            View profile
            <span className="transition-transform group-hover/link:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </Card>
  )
}
