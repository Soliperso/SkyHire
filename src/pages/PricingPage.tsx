import { Link } from 'react-router-dom'
import { Check, Lightning } from '@phosphor-icons/react'
import { ROUTES } from '@/routes'
import { Container } from '@/components/Container'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { buttonStyles } from '@/components/Button'
import { Reveal } from '@/components/motion/Reveal'
import { Stagger } from '@/components/motion/Stagger'
import { PageHeader } from '@/features/marketing/PageHeader'
import { FaqAccordion, type FaqItem } from '@/features/marketing/FaqAccordion'
import { cn } from '@/lib/cn'

interface Plan {
  name: string
  price: string
  cadence?: string
  forWho: string
  cta: { label: string; to: string }
  features: string[]
  featured?: boolean
  badge?: string
}

const PLANS: Plan[] = [
  {
    name: 'Client',
    price: 'Free',
    forWho: 'For anyone hiring a pilot',
    cta: { label: 'Browse pilots', to: ROUTES.browse() },
    features: [
      'Search & filter verified pilots',
      'Compare portfolios and ratings',
      'Request quotes — no booking fees',
      'Read reviews from real jobs',
    ],
  },
  {
    name: 'Pilot — Basic',
    price: 'Free',
    forWho: 'For pilots getting started',
    cta: { label: 'List your services', to: ROUTES.login() },
    featured: true,
    badge: 'Most popular',
    features: [
      'Public profile & portfolio',
      'FAA verification badge',
      'Receive & respond to leads',
      'Collect client reviews',
    ],
  },
  {
    name: 'Pilot — Pro',
    price: 'Coming soon',
    forWho: 'For pilots scaling up',
    cta: { label: 'Join the waitlist', to: ROUTES.contact() },
    features: [
      'Everything in Basic',
      'Featured placement in search',
      'Priority lead notifications',
      'Performance analytics',
    ],
  },
]

const PRICING_FAQ: FaqItem[] = [
  { q: 'Is SkyHire free for clients?', a: 'Yes. Searching, comparing, and requesting quotes is completely free — we never charge booking fees.' },
  { q: 'What does it cost pilots?', a: 'A Basic pilot profile is free, including FAA verification and lead requests. A paid Pro tier with featured placement and analytics is on the way.' },
  { q: 'How do pilots get verified?', a: 'Submit your FAA Part 107 certificate details in your dashboard. Our trust team validates them before the badge goes live.' },
  { q: 'Do you take a cut of the job?', a: 'No. SkyHire connects clients and pilots — payment is arranged directly between you. We may add optional paid placements later.' },
]

export function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Free to start. No booking fees."
        subtitle="Clients hire for free. Pilots list for free and only pay later for premium visibility — when it’s worth it."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <Stagger className="grid gap-6 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <Reveal key={plan.name} standalone={false}>
                <Card
                  variant={plan.featured ? 'elevated' : 'glass'}
                  className={cn('flex h-full flex-col p-7', plan.featured && 'ring-1 ring-accent-400/40')}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-h3 text-white">{plan.name}</h3>
                    {plan.badge && (
                      <Badge tone="brand">
                        <Lightning weight="fill" className="h-3.5 w-3.5" />
                        {plan.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-body-sm text-ink-400">{plan.forWho}</p>
                  <p className="mt-5 text-display text-white">{plan.price}</p>

                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-body-sm text-ink-200">
                        <Check weight="bold" className="mt-0.5 h-4 w-4 shrink-0 text-verified-500" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={plan.cta.to}
                    className={cn(buttonStyles(plan.featured ? 'primary' : 'glass', 'md'), 'mt-7 w-full')}
                  >
                    {plan.cta.label}
                  </Link>
                </Card>
              </Reveal>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="border-t border-white/10 bg-ink-900 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <h2 className="mb-8 text-center text-h2 text-white">Pricing questions</h2>
          <FaqAccordion items={PRICING_FAQ} />
        </Container>
      </section>
    </>
  )
}
