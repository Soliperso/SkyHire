import { useMemo, useState, type FormEvent } from 'react'
import { Plus, Trash } from '@phosphor-icons/react'
import type { Category, Specialty } from '@/data/types'
import { useRepositories } from '@/data/RepositoryProvider'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { TextField } from '@/components/fields'
import { AdminTable, Tr, Td } from '@/features/admin/AdminTable'

/** Marketplace taxonomy management (PRD §8.6 — category management). */
export function CategoryManagementPage() {
  const { categories, pilots } = useRepositories()
  const [version, setVersion] = useState(0)
  const [label, setLabel] = useState('')

  const rows = useMemo(() => {
    void version
    return categories.list()
  }, [categories, version])

  // How many pilots list each category — informs whether it's safe to retire.
  const counts = useMemo(() => {
    const all = pilots.list()
    const map: Record<string, number> = {}
    for (const c of rows) {
      map[c.slug] = all.filter((p) => p.specialties.includes(c.slug as Specialty)).length
    }
    return map
  }, [pilots, rows])

  const bump = () => setVersion((v) => v + 1)

  function addCategory(e: FormEvent) {
    e.preventDefault()
    const trimmed = label.trim()
    if (!trimmed) return
    categories.add(trimmed)
    setLabel('')
    bump()
  }

  function toggleActive(c: Category) {
    categories.setActive(c.slug, !c.active)
    bump()
  }

  function remove(c: Category) {
    categories.remove(c.slug)
    bump()
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-h2 text-white">Categories</h2>
        <p className="mt-1 text-body-sm text-ink-400">
          The specialty taxonomy behind search filters and pilot onboarding. Deactivate to hide without losing history.
        </p>
      </header>

      <Card variant="elevated" className="p-5">
        <form onSubmit={addCategory} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <TextField
              label="Add a category"
              placeholder="e.g. Wildlife Surveying"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" className="shrink-0">
            <Plus weight="bold" className="h-4 w-4" /> Add
          </Button>
        </form>
      </Card>

      <Card variant="elevated" className="overflow-hidden">
        <AdminTable head={['Category', 'Slug', 'Pilots', 'Status', 'Actions']}>
          {rows.map((c) => (
            <Tr key={c.slug}>
              <Td className="font-medium text-white">{c.label}</Td>
              <Td className="font-mono text-caption text-ink-400">{c.slug}</Td>
              <Td className="text-ink-300">{counts[c.slug] ?? 0}</Td>
              <Td>
                <Badge tone={c.active ? 'verified' : 'neutral'}>{c.active ? 'Active' : 'Hidden'}</Badge>
              </Td>
              <Td>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => toggleActive(c)}>
                    {c.active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-danger-400 hover:bg-danger-500/10 hover:text-danger-300"
                    onClick={() => remove(c)}
                    aria-label={`Remove ${c.label}`}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </Td>
            </Tr>
          ))}
        </AdminTable>
      </Card>
    </div>
  )
}
