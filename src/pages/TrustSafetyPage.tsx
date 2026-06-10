import { Link } from 'react-router-dom'
import { ShieldCheck, SealCheck, Flag, ClipboardText, Eye, UserFocus } from '@phosphor-icons/react'
import { ROUTES } from '@/routes'
import { Container } from '@/components/Container'
import { Card } from '@/components/Card'
import { SectionHeading } from '@/components/SectionHeading'
import { buttonStyles } from '@/components/Button'
import { Reveal } from '@/components/motion/Reveal'
import { Stagger } from '@/components/motion/Stagger'
import { PageHeader } from '@/features/marketing/PageHeader'

const PILLARS = [
  {
    icon: SealCheck,
    title: 'Verification, not self-claims',
    body: 'The FAA badge is granted only after our trust team validates a pilot’s Part 107 certificate. Pilots can be listed without it — but they never get the badge.',
  },
  {
    icon: Flag,
    title: 'Review integrity',
    body: 'Reviews are weighted toward verified jobs, and spam or fraudulent reviews are detectable and removable by our moderation team.',
  },
  {
    icon: UserFocus,
    title: 'Account monitoring',
    body: 'Suspicious accounts and abuse patterns are flagged for review so the marketplace stays trustworthy on both sides.',
  },
  {
    icon: ClipboardText,
    title: 'Auditable actions',
    body: 'Every verification decision is logged. Trust is a process you can hold us accountable to, not a one-time stamp.',
  },
  {
    icon: Eye,
    title: 'Transparent signals',
    body: 'Verification status, ratings, response time, and portfolio proof are visible on every profile — no hidden surprises.',
  },
  {
    icon: ShieldCheck,
    title: 'Trust by default',
    body: 'Trust isn’t a later enhancement. It’s the core product requirement that shapes every feature we build.',
  },
]

export function TrustSafetyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Trust & safety"
        title="Trust is the product, not a feature"
        subtitle="Hiring a drone pilot should be confident, not risky. Here’s how we reduce fraud and protect both clients and pilots."
      >
        <Link to={ROUTES.browse()} className={buttonStyles('primary', 'lg')}>
          Browse verified pilots
        </Link>
      </PageHeader>

      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              tone="dark"
              eyebrow="Our commitments"
              title="Six pillars of a trustworthy marketplace"
            />
          </Reveal>
          <Stagger className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <Reveal key={title} standalone={false}>
                <Card variant="glass" interactive className="h-full p-6">
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-glow">
                    <Icon weight="fill" className="h-5 w-5" />
                  </div>
                  <h3 className="text-h3 text-white">{title}</h3>
                  <p className="mt-2 text-body-sm text-ink-300">{body}</p>
                </Card>
              </Reveal>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="border-t border-white/10 bg-ink-900 py-16 sm:py-20">
        <Container>
          <Card variant="elevated" className="flex flex-col items-center gap-4 p-10 text-center">
            <h2 className="text-h2 text-white">See a problem?</h2>
            <p className="max-w-xl text-body text-ink-300">
              Report a suspicious profile, review, or message and our trust team will investigate.
            </p>
            <Link to={ROUTES.contact()} className={buttonStyles('primary', 'lg')}>
              Contact trust & safety
            </Link>
          </Card>
        </Container>
      </section>
    </>
  )
}
