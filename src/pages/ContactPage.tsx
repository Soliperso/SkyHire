import { useState, type FormEvent } from 'react'
import { EnvelopeSimple, ChatCircleText, ShieldCheck, CheckCircle } from '@phosphor-icons/react'
import { Container } from '@/components/Container'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { TextField, TextArea } from '@/components/fields'
import { PageHeader } from '@/features/marketing/PageHeader'

const CHANNELS = [
  { icon: EnvelopeSimple, title: 'Email us', body: 'support@skyhire.demo' },
  { icon: ChatCircleText, title: 'General questions', body: 'Most replies within one business day.' },
  { icon: ShieldCheck, title: 'Trust & safety', body: 'Report a profile, review, or message.' },
]

export function ContactPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    // Mock submit — a real backend would POST this to a support inbox.
    setSent(true)
  }

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        subtitle="Questions about hiring, listing, or trust & safety? We’d love to hear from you."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div className="space-y-5">
              {CHANNELS.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-accent-300">
                    <Icon weight="fill" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-body font-semibold text-white">{title}</p>
                    <p className="text-body-sm text-ink-400">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            <Card variant="elevated" className="p-6 sm:p-8">
              {sent ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <CheckCircle weight="fill" className="h-12 w-12 text-verified-500" />
                  <h2 className="text-h3 text-white">Message sent</h2>
                  <p className="max-w-sm text-body-sm text-ink-400">
                    Thanks, {form.name || 'there'} — we’ll get back to you at {form.email || 'your email'} soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <TextField
                      label="Name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                    <TextField
                      label="Email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                  <TextArea
                    label="Message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  />
                  <Button type="submit" variant="primary" size="lg" className="w-full">
                    Send message
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </Container>
      </section>
    </>
  )
}
