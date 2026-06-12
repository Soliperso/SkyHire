import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import type { PilotProfile, Specialty } from '@/data/types'
import { SPECIALTIES, SPECIALTY_LABELS } from '@/data/labels'
import { useRepositories } from '@/data/RepositoryProvider'
import { TextField, TextArea, SelectField } from '@/components/fields'
import { Button } from '@/components/Button'

const BUDGET_OPTIONS = [
  'Under $250',
  '$250 – $500',
  '$500 – $1,000',
  '$1,000 – $2,500',
  '$2,500+',
].map((v) => ({ value: v, label: v }))

/** Lead capture form (PRD §8.5). Submits a quote request to the repository. */
export function QuoteRequestForm({
  pilot,
  onSubmitted,
}: {
  pilot: PilotProfile
  onSubmitted: () => void
}) {
  const { quotes } = useRepositories()
  const [form, setForm] = useState({
    clientName: '',
    clientEmail: '',
    jobType: pilot.specialties[0] as Specialty,
    location: pilot.location,
    budgetRange: BUDGET_OPTIONS[1].value,
    details: '',
  })
  const [error, setError] = useState<string | null>(null)

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }))

  const mutation = useMutation({
    mutationFn: () => quotes.add({ pilotId: pilot.id, ...form }),
    onSuccess: () => onSubmitted(),
    onError: () => setError('Something went wrong sending your request. Please try again.'),
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.clientName.trim() || !form.clientEmail.trim() || !form.details.trim()) {
      return setError('Please fill in your name, email, and job details.')
    }
    setError(null)
    mutation.mutate()
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Your name"
          value={form.clientName}
          onChange={(e) => set({ clientName: e.target.value })}
        />
        <TextField
          label="Email"
          type="email"
          value={form.clientEmail}
          onChange={(e) => set({ clientEmail: e.target.value })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Service needed"
          value={form.jobType}
          onChange={(e) => set({ jobType: e.target.value as Specialty })}
          options={SPECIALTIES.map((s) => ({ value: s, label: SPECIALTY_LABELS[s] }))}
        />
        <TextField
          label="Job location"
          value={form.location}
          onChange={(e) => set({ location: e.target.value })}
        />
      </div>

      <SelectField
        label="Budget range"
        value={form.budgetRange}
        onChange={(e) => set({ budgetRange: e.target.value })}
        options={BUDGET_OPTIONS}
      />

      <TextArea
        label="Job details"
        placeholder="Describe the property, timeline, and deliverables you need…"
        rows={5}
        value={form.details}
        onChange={(e) => set({ details: e.target.value })}
      />

      {error && <p className="text-body-sm font-medium text-danger-600">{error}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? 'Sending…' : 'Send quote request'}
      </Button>
      <p className="text-center text-caption text-ink-400">
        No spam. Your details are shared only with {pilot.businessName}.
      </p>
    </form>
  )
}
