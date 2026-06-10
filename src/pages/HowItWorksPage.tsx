import { Link } from 'react-router-dom'
import {
  MagnifyingGlass,
  SealCheck,
  ChatCircleText,
  Star,
  UserPlus,
  FileArrowUp,
  ShieldCheck,
  Tray,
} from '@phosphor-icons/react'
import { ROUTES } from '@/routes'
import { Container } from '@/components/Container'
import { Card } from '@/components/Card'
import { SectionHeading } from '@/components/SectionHeading'
import { buttonStyles } from '@/components/Button'
import { Reveal } from '@/components/motion/Reveal'
import { Stagger } from '@/components/motion/Stagger'
import { PageHeader } from '@/features/marketing/PageHeader'

const CLIENT_STEPS = [
  { icon: MagnifyingGlass, title: 'Search', body: 'Filter by location, specialty, rating, and verification to shortlist pilots near you.' },
  { icon: SealCheck, title: 'Compare', body: 'Review FAA-verified credentials, portfolios, and structured client ratings side by side.' },
  { icon: ChatCircleText, title: 'Request a quote', body: 'Send your job details to one or more pilots and compare responses — free, no obligation.' },
  { icon: Star, title: 'Hire & review', body: 'Book the right pilot, then leave a structured review to help the next client.' },
]

const PILOT_STEPS = [
  { icon: UserPlus, title: 'Create your profile', body: 'Add your business, specialties, service area, and portfolio in minutes.' },
  { icon: FileArrowUp, title: 'Submit certification', body: 'Upload your FAA Part 107 details for verification by our trust team.' },
  { icon: ShieldCheck, title: 'Earn your badge', body: 'Once verified, your badge goes live on every profile and listing card.' },
  { icon: Tray, title: 'Receive leads', body: 'Get quote requests from nearby clients and respond fast to win the job.' },
]

export function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="How it works"
        title="From search to hire, without the guesswork"
        subtitle="SkyHire unifies discovery, trust, and hiring into one streamlined experience — for clients and pilots alike."
      >
        <Link to={ROUTES.browse()} className={buttonStyles('primary', 'lg')}>
          Find a pilot
        </Link>
        <Link to={ROUTES.pricing()} className={buttonStyles('glass', 'lg')}>
          See pricing
        </Link>
      </PageHeader>

      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading tone="dark" eyebrow="For clients" title="Hire a pilot in four steps" />
          </Reveal>
          <Stagger className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {CLIENT_STEPS.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} standalone={false}>
                <Step index={i} Icon={Icon} title={title} body={body} />
              </Reveal>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-ink-900 py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading tone="dark" eyebrow="For pilots" title="Turn demand into qualified leads" />
          </Reveal>
          <Stagger className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {PILOT_STEPS.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} standalone={false}>
                <Step index={i} Icon={Icon} title={title} body={body} />
              </Reveal>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <Card variant="glass" className="flex flex-col items-center gap-5 p-10 text-center">
            <h2 className="text-h2 text-white">Ready to get started?</h2>
            <p className="max-w-xl text-body text-ink-300">
              Browse verified pilots near you, or list your services and start receiving leads today.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to={ROUTES.browse()} className={buttonStyles('primary', 'lg')}>
                Browse pilots
              </Link>
              <Link to={ROUTES.login()} className={buttonStyles('glass', 'lg')}>
                List your services
              </Link>
            </div>
          </Card>
        </Container>
      </section>
    </>
  )
}

function Step({
  index,
  Icon,
  title,
  body,
}: {
  index: number
  Icon: React.ComponentType<{ className?: string }>
  title: string
  body: string
}) {
  return (
    <div className="relative">
      <div className="mb-4 inline-flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-glow">
          <Icon className="h-5 w-5" />
        </span>
        <span className="font-display text-h2 font-bold text-white/15">0{index + 1}</span>
      </div>
      <h3 className="text-h3 text-white">{title}</h3>
      <p className="mt-2 text-body-sm text-ink-300">{body}</p>
    </div>
  )
}
