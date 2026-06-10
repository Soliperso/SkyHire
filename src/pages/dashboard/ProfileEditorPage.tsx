import { useState, type FormEvent } from 'react'
import type { PricingModel, Specialty } from '@/data/types'
import { useRepositories } from '@/data/RepositoryProvider'
import { SPECIALTIES, SPECIALTY_LABELS, PRICING_LABELS } from '@/data/labels'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { TextField, TextArea, SelectField } from '@/components/fields'
import { cn } from '@/lib/cn'
import { useDashboard } from '@/app/layout/DashboardLayout'
import { useSavedFlag, SavedBanner } from '@/features/dashboard/SavedFlag'

const PRICING_OPTIONS = (Object.keys(PRICING_LABELS) as PricingModel[]).map((value) => ({
  value,
  label: value.replace('-', ' '),
}))

export function ProfileEditorPage() {
  const { pilot, refresh } = useDashboard()
  const { pilots } = useRepositories()
  const [saved, markSaved] = useSavedFlag()

  const [form, setForm] = useState({
    businessName: pilot.businessName,
    name: pilot.name,
    location: pilot.location,
    bio: pilot.bio,
    pricingModel: pilot.pricingModel,
    startingPrice: pilot.startingPrice,
  })
  const [specialties, setSpecialties] = useState<Specialty[]>(pilot.specialties)

  function toggleSpecialty(s: Specialty) {
    setSpecialties((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    pilots.update(pilot.id, {
      ...form,
      startingPrice: Number(form.startingPrice) || 0,
      specialties,
    })
    refresh()
    markSaved()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <header>
        <h2 className="text-h2 text-white">Profile</h2>
        <p className="mt-1 text-body-sm text-ink-400">This is what clients see on your public profile.</p>
      </header>

      <Card variant="elevated" className="space-y-5 p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Business name"
            value={form.businessName}
            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
            required
          />
          <TextField
            label="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <TextField
          label="Location"
          hint="City, State — where you're based."
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
        />

        <TextArea
          label="Bio"
          rows={5}
          hint="Tell clients about your experience, equipment, and turnaround."
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />

        <div>
          <span className="mb-2 block text-body-sm font-semibold text-ink-200">Specialties</span>
          <div className="flex flex-wrap gap-2">
            {SPECIALTIES.map((s) => {
              const active = specialties.includes(s)
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSpecialty(s)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-body-sm font-medium transition-colors',
                    active
                      ? 'border-brand-400 bg-brand-500/20 text-white'
                      : 'border-white/15 text-ink-300 hover:border-white/30 hover:text-white',
                  )}
                >
                  {SPECIALTY_LABELS[s]}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            label="Pricing model"
            options={PRICING_OPTIONS}
            value={form.pricingModel}
            onChange={(e) => setForm({ ...form, pricingModel: e.target.value as PricingModel })}
          />
          <TextField
            label="Starting price (USD)"
            type="number"
            min={0}
            value={form.startingPrice}
            onChange={(e) => setForm({ ...form, startingPrice: Number(e.target.value) })}
          />
        </div>
      </Card>

      <div className="flex items-center gap-4">
        <Button type="submit" variant="primary">Save changes</Button>
        <SavedBanner show={saved} />
      </div>
    </form>
  )
}
