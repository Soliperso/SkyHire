import { LegalPage, type LegalSection } from '@/features/marketing/LegalPage'

const SECTIONS: LegalSection[] = [
  {
    heading: 'Information we collect',
    body: [
      'We collect information you provide directly — such as your name, email, business details, and certification information — as well as content you post like portfolios and reviews.',
      'We also collect limited usage data to operate and improve the platform.',
    ],
  },
  {
    heading: 'How we use information',
    body: [
      'We use your information to operate the marketplace: powering search and discovery, verifying certifications, displaying profiles and reviews, routing quote requests, and protecting against fraud and abuse.',
    ],
  },
  {
    heading: 'Verification data',
    body: [
      'Certification details are used to validate FAA Part 107 status. We protect this data and restrict access to authorized trust & safety reviewers. Verification actions are logged for accountability.',
    ],
  },
  {
    heading: 'What we share',
    body: [
      'Public profile information — including your business name, specialties, ratings, and verification status — is visible to other users by design. We do not sell your personal data.',
      'Contact details shared in a quote request are provided to the pilot you contact so they can respond.',
    ],
  },
  {
    heading: 'Security',
    body: [
      'We use reasonable technical and organizational measures to protect your information, including secure authentication and role-based access to administrative tools.',
    ],
  },
  {
    heading: 'Your choices',
    body: [
      'You can review and update your profile information at any time. Contact us to request access to or deletion of your personal data, subject to legal and operational requirements.',
    ],
  },
  {
    heading: 'Changes to this policy',
    body: [
      'We may update this policy as the product evolves. We’ll revise the “last updated” date when we do.',
    ],
  },
]

export function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="June 2026"
      intro="How SkyHire collects, uses, and protects your information."
      sections={SECTIONS}
    />
  )
}
