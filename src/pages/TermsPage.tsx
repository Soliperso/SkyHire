import { LegalPage, type LegalSection } from '@/features/marketing/LegalPage'

const SECTIONS: LegalSection[] = [
  {
    heading: 'Acceptance of terms',
    body: [
      'By accessing or using SkyHire, you agree to these Terms of Service. If you do not agree, please do not use the platform.',
    ],
  },
  {
    heading: 'The marketplace',
    body: [
      'SkyHire is a marketplace that connects clients with independent drone pilots. We are not a party to any agreement formed between a client and a pilot. Pilots are independent professionals, not employees or agents of SkyHire.',
      'We facilitate discovery, verification, reviews, and quote requests. Payment and the performance of any job are arranged directly between the client and the pilot.',
    ],
  },
  {
    heading: 'Verification',
    body: [
      'FAA verification badges are granted only after our trust team validates a pilot’s certificate. Verification reflects our review at a point in time and does not guarantee future compliance or the quality of any job.',
    ],
  },
  {
    heading: 'Acceptable use',
    body: [
      'You agree not to post false, misleading, or fraudulent information, submit fake reviews, harass other users, or attempt to circumvent platform safeguards. We may suspend or remove accounts that violate these terms.',
    ],
  },
  {
    heading: 'Reviews and content',
    body: [
      'You retain ownership of content you submit but grant SkyHire a license to display it on the platform. Reviews must reflect genuine experiences. We may remove content that is abusive, spammy, or fraudulent.',
    ],
  },
  {
    heading: 'Limitation of liability',
    body: [
      'SkyHire is provided “as is.” To the fullest extent permitted by law, we are not liable for the conduct of any user or the outcome of any job arranged through the platform.',
    ],
  },
  {
    heading: 'Changes to these terms',
    body: [
      'We may update these terms from time to time. Continued use of the platform after changes take effect constitutes acceptance of the revised terms.',
    ],
  },
]

export function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated="June 2026"
      intro="The rules for using the SkyHire marketplace, for both clients and pilots."
      sections={SECTIONS}
    />
  )
}
