import type { PilotSort } from '@/data/types'
import { SORT_LABELS, SORT_OPTIONS } from '@/data/labels'

/** Result ordering control (PRD §8.1). */
export function SortControl({
  value,
  onChange,
}: {
  value: PilotSort
  onChange: (sort: PilotSort) => void
}) {
  return (
    <label className="inline-flex items-center gap-2 text-body-sm text-ink-400">
      Sort by
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as PilotSort)}
        className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-body-sm font-medium text-white [&>option]:text-ink-900"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {SORT_LABELS[opt]}
          </option>
        ))}
      </select>
    </label>
  )
}
