import { Link } from 'react-router-dom'
import { ShieldCheck } from '@phosphor-icons/react'
import { ROUTES } from '@/routes'
import { Logo } from '@/components/Logo'
import { Container } from '@/components/Container'
import { Aurora } from '@/components/decor/Aurora'

const COLUMNS = [
  {
    title: 'Discover',
    links: [
      { label: 'Browse pilots', to: ROUTES.browse() },
      { label: 'Saved pilots', to: ROUTES.saved() },
      { label: 'Reviews', to: ROUTES.reviews() },
      { label: 'How it works', to: ROUTES.howItWorks() },
    ],
  },
  {
    title: 'For pilots',
    links: [
      { label: 'List your services', to: ROUTES.login() },
      { label: 'Pricing', to: ROUTES.pricing() },
      { label: 'FAQ', to: ROUTES.faq() },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Trust & safety', to: ROUTES.trustSafety() },
      { label: 'Contact', to: ROUTES.contact() },
      { label: 'FAQ', to: ROUTES.faq() },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-ink-950 text-white">
      {/* Gradient top edge + ambient glow. */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-400/60 to-transparent" />
      <Aurora className="opacity-40" />

      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Logo variant="light" />
            <p className="mt-4 text-body-sm text-ink-400">
              The trusted marketplace for discovering, evaluating, and hiring professional drone
              pilots.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-body-sm font-medium text-verified-500">
              <ShieldCheck className="h-4 w-4" />
              FAA verification on every badge
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-body-sm font-semibold text-white">{col.title}</h3>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-body-sm text-ink-400 transition-colors hover:text-accent-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-caption text-ink-400 sm:flex-row">
          <p>© {new Date().getFullYear()} SkyHire. All rights reserved.</p>
          <p className="flex gap-4">
            <Link to={ROUTES.terms()} className="transition-colors hover:text-white">
              Terms
            </Link>
            <Link to={ROUTES.privacy()} className="transition-colors hover:text-white">
              Privacy
            </Link>
          </p>
        </div>
      </Container>
    </footer>
  )
}
