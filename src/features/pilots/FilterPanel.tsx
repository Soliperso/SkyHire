import { SealCheck } from '@phosphor-icons/react'
import type { PilotFilters, Specialty } from '@/data/types'
import { SPECIALTIES, SPECIALTY_LABELS } from '@/data/labels'
import { Card } from '@/components/Card'
import { TextField, SelectField } from '@/components/fields'
import { cn } from '@/lib/cn'

const RATING_OPTIONS = [
  { value: '0', label: 'Any rating' },
  { value: '4', label: '4.0 & up' },
  { value: '4.5', label: '4.5 & up' },
]

/** Discovery filters (PRD §8.1). Controlled — parent owns the filter state. */
export function FilterPanel({
  filters,
  onChange,
  onReset,
}: {
  filters: PilotFilters
  onChange: (next: PilotFilters) => void
  onReset: () => void
}) {
  const set = (patch: Partial<PilotFilters>) => onChange({ ...filters, ...patch })

  return (
    <Card variant="elevated" className="space-y-5 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-h3 text-white">Filters</h3>
        <button
          type="button"
          onClick={onReset}
          className="text-body-sm font-medium text-accent-300 hover:text-accent-200"
        >
          Reset
        </button>
      </div>

      <TextField
        label="Location"
        placeholder="City or metro"
        value={filters.location ?? ''}
        onChange={(e) => set({ location: e.target.value })}
      />

      <SelectField
        label="Specialty"
        value={filters.specialty ?? 'all'}
        onChange={(e) => set({ specialty: e.target.value as Specialty | 'all' })}
        options={[
          { value: 'all', label: 'All specialties' },
          ...SPECIALTIES.map((s) => ({ value: s, label: SPECIALTY_LABELS[s] })),
        ]}
      />

      <SelectField
        label="Minimum rating"
        value={String(filters.minRating ?? 0)}
        onChange={(e) => set({ minRating: Number(e.target.value) })}
        options={RATING_OPTIONS}
      />

      <label
        className={cn(
          'flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-colors',
          filters.verifiedOnly ? 'border-verified-500/60 bg-verified-500/10' : 'border-white/15 bg-white/5',
        )}
      >
        <span className="flex items-center gap-2 text-body-sm font-medium text-ink-200">
          <SealCheck weight="fill" className="h-4 w-4 text-verified-500" />
          FAA verified only
        </span>
        <input
          type="checkbox"
          className="h-4 w-4 accent-verified-600"
          checked={filters.verifiedOnly ?? false}
          onChange={(e) => set({ verifiedOnly: e.target.checked })}
        />
      </label>
    </Card>
  )
}
