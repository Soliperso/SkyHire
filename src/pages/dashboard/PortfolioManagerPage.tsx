import { useState, type FormEvent } from 'react'
import { Trash, Plus } from '@phosphor-icons/react'
import { useMutation } from '@tanstack/react-query'
import type { PortfolioItem } from '@/data/types'
import { useRepositories } from '@/data/RepositoryProvider'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { TextField } from '@/components/fields'
import { useDashboard } from '@/app/layout/DashboardLayout'
import { useSavedFlag, SavedBanner } from '@/features/dashboard/SavedFlag'

export function PortfolioManagerPage() {
  const { pilot, refresh } = useDashboard()
  const { pilots } = useRepositories()
  const [saved, markSaved] = useSavedFlag()

  const [draft, setDraft] = useState({ imageUrl: '', caption: '' })

  const mutation = useMutation({
    mutationFn: (portfolio: PortfolioItem[]) => pilots.update(pilot.id, { portfolio }),
    onSuccess: () => {
      refresh()
      markSaved()
    },
  })

  function persist(portfolio: PortfolioItem[]) {
    mutation.mutate(portfolio)
  }

  function addItem(e: FormEvent) {
    e.preventDefault()
    if (!draft.imageUrl.trim()) return
    const item: PortfolioItem = {
      id: `ptf-${Math.random().toString(36).slice(2, 8)}`,
      imageUrl: draft.imageUrl.trim(),
      caption: draft.caption.trim(),
    }
    persist([...pilot.portfolio, item])
    setDraft({ imageUrl: '', caption: '' })
  }

  function removeItem(id: string) {
    persist(pilot.portfolio.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-h2 text-white">Portfolio</h2>
          <p className="mt-1 text-body-sm text-ink-400">{pilot.portfolio.length} item(s) · the first is featured.</p>
        </div>
        <SavedBanner show={saved} children="Saved" />
      </header>

      {pilot.portfolio.length === 0 ? (
        <EmptyState title="No portfolio items" description="Add your best aerial work to win more clients." />
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {pilot.portfolio.map((item, i) => (
            <Card key={item.id} variant="elevated" className="group relative overflow-hidden p-0">
              <img src={item.imageUrl} alt={item.caption} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              {i === 0 && (
                <span className="absolute left-2 top-2 rounded-md bg-white/90 px-2 py-0.5 text-caption font-semibold text-ink-700">
                  Featured
                </span>
              )}
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                aria-label="Remove item"
                className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink-950/70 text-white opacity-0 transition hover:bg-danger-600 focus:opacity-100 group-hover:opacity-100"
              >
                <Trash className="h-4 w-4" />
              </button>
              {item.caption && (
                <p className="truncate px-3 py-2 text-caption text-ink-300">{item.caption}</p>
              )}
            </Card>
          ))}
        </div>
      )}

      <Card variant="elevated" className="p-6">
        <h3 className="mb-4 text-h3 text-white">Add an item</h3>
        <form onSubmit={addItem} className="space-y-4">
          <TextField
            label="Image URL"
            placeholder="https://…"
            value={draft.imageUrl}
            onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
            required
          />
          <TextField
            label="Caption"
            placeholder="e.g. Hillside estate, golden hour"
            value={draft.caption}
            onChange={(e) => setDraft({ ...draft, caption: e.target.value })}
          />
          <Button type="submit" variant="primary">
            <Plus weight="bold" className="h-4 w-4" /> Add to portfolio
          </Button>
        </form>
      </Card>
    </div>
  )
}
