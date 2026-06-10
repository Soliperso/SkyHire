import { Container } from '@/components/Container'
import { PageHeader } from './PageHeader'

export interface LegalSection {
  heading: string
  body: string[]
}

/** Shared layout for plain-text legal pages (Terms, Privacy). */
export function LegalPage({
  title,
  lastUpdated,
  intro,
  sections,
}: {
  title: string
  lastUpdated: string
  intro: string
  sections: LegalSection[]
}) {
  return (
    <>
      <PageHeader eyebrow={`Updated ${lastUpdated}`} title={title} subtitle={intro} />

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl space-y-10">
          {sections.map((section, i) => (
            <div key={section.heading}>
              <h2 className="text-h3 text-white">
                {i + 1}. {section.heading}
              </h2>
              {section.body.map((p, j) => (
                <p key={j} className="mt-3 text-body-sm leading-relaxed text-ink-300">
                  {p}
                </p>
              ))}
            </div>
          ))}

          <p className="border-t border-white/10 pt-8 text-caption text-ink-400">
            This is sample content for a demo product and does not constitute legal advice.
          </p>
        </Container>
      </section>
    </>
  )
}
