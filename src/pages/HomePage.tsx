import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowRight,
  CaretDown,
  SealCheck,
  FileArrowUp,
  MapPin,
  ChatCircleText,
  MagnifyingGlass,
  ShieldCheck,
  Star,
  Lightning,
} from '@phosphor-icons/react'
import type { Specialty } from '@/data/types'
import { SPECIALTIES, SPECIALTY_LABELS } from '@/data/labels'
import { useRepositories } from '@/data/RepositoryProvider'
import { ROUTES } from '@/routes'
import { Container } from '@/components/Container'
import { Card } from '@/components/Card'
import { SectionHeading } from '@/components/SectionHeading'
import { Button, buttonStyles } from '@/components/Button'
import { DroneMark } from '@/components/Logo'
import { Reveal } from '@/components/motion/Reveal'
import { Stagger } from '@/components/motion/Stagger'
import { AnimatedCounter } from '@/components/motion/AnimatedCounter'
import { Aurora } from '@/components/decor/Aurora'
import { PilotCard } from '@/features/pilots/PilotCard'
import { SpecialtyCard } from '@/features/pilots/SpecialtyCard'
import { HeroBackground } from '@/features/home/HeroBackground'
import { Testimonials } from '@/features/home/Testimonials'

const VALUE_PROPS = [
  {
    icon: ShieldCheck,
    title: 'FAA verification, not self-claims',
    body: 'Every verified badge is checked against the pilot’s Part 107 certificate — trust you can see.',
  },
  {
    icon: Star,
    title: 'Reviews from real jobs',
    body: 'Structured ratings for quality, communication, and punctuality, weighted toward verified work.',
  },
  {
    icon: Lightning,
    title: 'Quotes in hours, not days',
    body: 'Send one request and compare responses. Most pilots reply within a few hours.',
  },
]

const STEPS = [
  { icon: MagnifyingGlass, title: 'Search', body: 'Filter by location, specialty, rating, and verification.' },
  { icon: SealCheck, title: 'Compare', body: 'Review portfolios, credentials, and client ratings side by side.' },
  { icon: ChatCircleText, title: 'Request a quote', body: 'Share your job details and hire with confidence.' },
]

const TRUST_STEPS = [
  { icon: FileArrowUp, title: 'Submit credentials', body: 'Pilots upload their FAA Part 107 certificate details.' },
  { icon: ShieldCheck, title: 'We verify', body: 'Our trust team validates each certificate before any badge is granted.' },
  { icon: SealCheck, title: 'Badge goes live', body: 'Verified pilots earn a badge visible on every profile and card.' },
]

export function HomePage() {
  const { pilots } = useRepositories()
  const { data: featured = [] } = useQuery({
    queryKey: ['pilots', 'featured', 3],
    queryFn: () => pilots.featured(3),
  })
  const navigate = useNavigate()

  const [location, setLocation] = useState('')
  const [specialty, setSpecialty] = useState<Specialty | 'all'>('all')

  const search = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (location.trim()) params.set('location', location.trim())
    if (specialty !== 'all') params.set('specialty', specialty)
    navigate(`/browse${params.toString() ? `?${params}` : ''}`)
  }

  return (
    <div className="bg-ink-950 text-white">
      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden">
        <HeroBackground />

        <Container className="w-full py-24 sm:py-28 lg:py-32">
          {/* Copy + search — staggered cinematic entrance. */}
          <Stagger className="max-w-2xl">
            <Reveal standalone={false}>
              <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-body-sm font-medium text-white">
                <DroneMark className="h-4 w-4 text-accent-300" />
                Verified pilots · transparent reviews
              </span>
            </Reveal>

            <Reveal standalone={false}>
              <h1 className="mt-6 text-h1 leading-[1.05] tracking-tight text-white sm:text-display">
                Hire a drone pilot you can{' '}
                <span className="text-gradient animate-gradient-pan">trust</span>.
              </h1>
            </Reveal>

            <Reveal standalone={false}>
              <p className="mt-5 max-w-xl text-body text-ink-200">
                Discover FAA-certified pilots for aerial photography, inspections, mapping, and event
                coverage. Compare credentials and portfolios, then request a quote in minutes.
              </p>
            </Reveal>

            {/* Search */}
            <Reveal standalone={false}>
              <form
                onSubmit={search}
                className="mt-8 flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-glow-lg sm:flex-row sm:items-center"
              >
                <div className="flex flex-1 items-center gap-2 rounded-xl px-3">
                  <MapPin className="h-5 w-5 shrink-0 text-ink-400" weight="fill" />
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location (e.g. Austin, TX)"
                    className="h-11 w-full bg-transparent text-body-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
                  />
                </div>
                <div className="hidden w-px self-stretch bg-ink-200 sm:block" />
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value as Specialty | 'all')}
                  className="h-11 rounded-xl bg-ink-50 px-3 text-body-sm font-medium text-ink-800 sm:bg-transparent"
                >
                  <option value="all">All specialties</option>
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s}>
                      {SPECIALTY_LABELS[s]}
                    </option>
                  ))}
                </select>
                <Button type="submit" size="lg" className="sm:w-auto">
                  <MagnifyingGlass className="h-4 w-4" weight="bold" />
                  Search pilots
                </Button>
              </form>
            </Reveal>

            {/* Trust proof row — concrete, on-brand reassurance under the search. */}
            <Reveal standalone={false}>
              <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-body-sm text-ink-300">
                <li className="inline-flex items-center gap-1.5">
                  <SealCheck weight="fill" className="h-4 w-4 text-verified-400" />
                  FAA Part 107 verified
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <ShieldCheck weight="fill" className="h-4 w-4 text-accent-300" />
                  Insured pilots
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Lightning weight="fill" className="h-4 w-4 text-star" />
                  Free — no booking fees
                </li>
              </ul>
            </Reveal>

            <Reveal standalone={false}>
              <dl className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 text-white">
                <Stat value={<AnimatedCounter value={500} suffix="+" />} label="Verified pilots" />
                <span className="hidden h-10 w-px bg-white/15 sm:block" />
                <Stat value={<AnimatedCounter value={4.8} decimals={1} suffix="★" />} label="Average rating" />
                <span className="hidden h-10 w-px bg-white/15 sm:block" />
                <Stat value={<AnimatedCounter value={4} prefix="<" suffix="h" />} label="Median response" />
              </dl>
            </Reveal>
          </Stagger>
        </Container>

        {/* Scroll cue — subtle invitation to explore below the fold. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-7 z-10 hidden justify-center sm:flex">
          <span className="glass grid h-9 w-9 animate-bounce place-items-center rounded-full text-accent-300">
            <CaretDown className="h-4 w-4" weight="bold" />
          </span>
        </div>

        {/* Horizon divider: soft glow + gradient hairline marking the hero's edge. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto h-24 max-w-5xl bg-[radial-gradient(60%_100%_at_50%_100%,rgba(56,189,248,0.12),transparent_70%)]" />
          <div className="h-px w-full bg-gradient-to-r from-transparent via-accent-400/50 to-transparent" />
        </div>
      </section>

      {/* ─────────────────── Browse by specialty ─────────────────── */}
      <section className="relative isolate overflow-hidden py-16 sm:py-20">
        <Aurora className="opacity-50" />
        <Container>
          <Reveal>
            <SectionHeading
              tone="dark"
              eyebrow="Explore"
              title="Browse by specialty"
              subtitle="Jump straight to the kind of pilot your project needs."
            />
          </Reveal>
          <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SPECIALTIES.map((s) => (
              <Reveal key={s} standalone={false}>
                <SpecialtyCard specialty={s} />
              </Reveal>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ─────────────────── Why SkyHire ─────────────────── */}
      <section className="border-y border-white/10 bg-ink-900 py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading tone="dark" eyebrow="Why SkyHire" title="Trust built into every step" />
          </Reveal>
          <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
            {VALUE_PROPS.map(({ icon: Icon, title, body }) => (
              <Reveal key={title} standalone={false}>
                <Card variant="glass" interactive className="h-full p-6">
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-glow">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-h3 text-white">{title}</h3>
                  <p className="mt-2 text-body-sm text-ink-300">{body}</p>
                </Card>
              </Reveal>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ─────────────────── Featured pilots ─────────────────── */}
      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              tone="dark"
              eyebrow="Top rated"
              title="Featured pilots"
              subtitle="Hand-picked, FAA-verified pilots with outstanding client reviews."
              action={
                <Link to={ROUTES.browse()} className={buttonStyles('glass', 'md')}>
                  Browse all pilots
                </Link>
              }
            />
          </Reveal>
          <Stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((pilot) => (
              <Reveal key={pilot.id} standalone={false}>
                <PilotCard pilot={pilot} tone="dark" />
              </Reveal>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ─────────────────── How it works ─────────────────── */}
      <section className="border-y border-white/10 bg-ink-900 py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading tone="dark" eyebrow="How it works" title="From search to hire in three steps" />
          </Reveal>
          <Stagger className="mt-10 grid gap-8 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} standalone={false}>
                <div className="relative">
                  <div className="mb-4 inline-flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-glow">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-display text-h2 font-bold text-white/15">0{i + 1}</span>
                  </div>
                  <h3 className="text-h3 text-white">{title}</h3>
                  <p className="mt-2 text-body-sm text-ink-300">{body}</p>
                </div>
              </Reveal>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ─────────────────── Testimonials ─────────────────── */}
      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              tone="dark"
              eyebrow="Loved by clients"
              title="Results that speak for themselves"
              subtitle="Real reviews from real, completed jobs."
            />
          </Reveal>
          <div className="mt-8">
            <Testimonials />
          </div>
        </Container>
      </section>

      {/* ─────────────────── Trust & verification ─────────────────── */}
      <section className="relative isolate overflow-hidden border-y border-white/10 bg-ink-900 py-20">
        <Aurora />
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div>
                <p className="mb-2.5 inline-flex items-center gap-2 text-caption font-semibold uppercase tracking-wider text-accent-300">
                  <span className="h-px w-6 bg-gradient-to-r from-accent-400 to-brand-400" />
                  Trust &amp; safety
                </p>
                <h2 className="text-h1 text-white">The verified badge actually means something</h2>
                <p className="mt-4 max-w-lg text-body text-ink-300">
                  Unlike open directories, our FAA badge is earned — not self-asserted. Every
                  certificate is reviewed before a pilot is marked verified, so you can hire with
                  confidence.
                </p>
                <Link to={ROUTES.browse()} className={buttonStyles('primary', 'lg') + ' mt-7'}>
                  Browse verified pilots
                </Link>
              </div>
            </Reveal>

            <Stagger className="space-y-4">
              {TRUST_STEPS.map(({ icon: Icon, title, body }) => (
                <Reveal key={title} standalone={false}>
                  <Card variant="glass" className="flex items-start gap-4 p-5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-accent-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-h3 text-white">{title}</h3>
                      <p className="mt-1 text-body-sm text-ink-300">{body}</p>
                    </div>
                  </Card>
                </Reveal>
              ))}
            </Stagger>
          </div>
        </Container>
      </section>

      {/* ─────────────────── Final CTA ─────────────────── */}
      <Container className="py-16 sm:py-20">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-ink-900 px-8 py-16 text-center shadow-glow-lg sm:px-16">
            <Aurora className="opacity-60" />
            <div className="absolute inset-0 -z-10 bg-grid opacity-20" />

            <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-body-sm font-medium text-white">
              <DroneMark className="h-4 w-4 text-accent-300" />
              Free for clients, always
            </span>
            <h2 className="mx-auto mt-5 max-w-2xl text-h1 text-white">
              Ready to find your{' '}
              <span className="text-gradient animate-gradient-pan">pilot</span>?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-body text-ink-300">
              Browse verified drone pilots in your area and request quotes in minutes.
            </p>
            <Link
              to={ROUTES.browse()}
              className={buttonStyles('primary', 'lg') + ' group mt-8'}
            >
              Get started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </Container>
    </div>
  )
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div>
      <dt className="font-display text-h2 font-bold">{value}</dt>
      <dd className="text-body-sm text-ink-200">{label}</dd>
    </div>
  )
}
