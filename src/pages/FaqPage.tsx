import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes'
import { Container } from '@/components/Container'
import { buttonStyles } from '@/components/Button'
import { Reveal } from '@/components/motion/Reveal'
import { PageHeader } from '@/features/marketing/PageHeader'
import { FaqAccordion, type FaqItem } from '@/features/marketing/FaqAccordion'

const CLIENT_FAQ: FaqItem[] = [
  { q: 'How do I find the right pilot?', a: 'Search by location and specialty, then filter by rating and verification status. Compare portfolios and reviews side by side before requesting a quote.' },
  { q: 'What does the FAA verified badge mean?', a: 'It means our trust team has validated the pilot’s FAA Part 107 certificate. Unverified pilots may appear in results but never carry the badge.' },
  { q: 'How much does it cost to hire?', a: 'Using SkyHire is free for clients — there are no booking fees. You arrange payment directly with the pilot you hire.' },
  { q: 'How fast will pilots respond?', a: 'Most verified pilots reply within a few hours. Pilots who consistently respond in 4 hours or less earn a “Fast responder” badge.' },
  { q: 'Can I leave a review?', a: 'Yes. After a job you can leave a star rating plus structured tags for communication, punctuality, and quality to help future clients.' },
]

const PILOT_FAQ: FaqItem[] = [
  { q: 'How do I list my services?', a: 'Create a pilot account, build your profile with specialties and portfolio, then submit your certification for verification.' },
  { q: 'How do I get verified?', a: 'Submit your FAA Part 107 certificate details from the Verification center in your dashboard. We validate them before the badge goes live.' },
  { q: 'What does it cost pilots?', a: 'A Basic profile is free, including verification and lead requests. A paid Pro tier with featured placement is coming soon.' },
  { q: 'How do I receive leads?', a: 'Clients send quote requests to your inbox. Respond quickly to win the job — response time is shown on your profile.' },
]

export function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Frequently asked questions"
        subtitle="Everything you need to know about hiring pilots and listing your services on SkyHire."
      />

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl space-y-12">
          <Reveal>
            <h2 className="mb-5 text-h3 text-white">For clients</h2>
            <FaqAccordion items={CLIENT_FAQ} />
          </Reveal>
          <Reveal>
            <h2 className="mb-5 text-h3 text-white">For pilots</h2>
            <FaqAccordion items={PILOT_FAQ} />
          </Reveal>

          <div className="rounded-2xl border border-white/10 bg-ink-900 p-8 text-center">
            <h2 className="text-h3 text-white">Still have questions?</h2>
            <p className="mx-auto mt-2 max-w-md text-body-sm text-ink-400">
              We’re happy to help — reach out and we’ll get back to you.
            </p>
            <Link to={ROUTES.contact()} className={`${buttonStyles('primary', 'md')} mt-5`}>
              Contact us
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
