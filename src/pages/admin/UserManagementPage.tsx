import { useMemo, useState } from 'react'
import type { BadgeTone } from '@/components/Badge'
import type { Role, User, UserStatus } from '@/data/types'
import { useRepositories } from '@/data/RepositoryProvider'
import { ROLE_LABELS, USER_STATUS_LABELS } from '@/data/labels'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { SelectField } from '@/components/fields'
import { AdminTable, Tr, Td } from '@/features/admin/AdminTable'

const STATUS_TONE: Record<UserStatus, BadgeTone> = {
  active: 'verified',
  flagged: 'warning',
  suspended: 'danger',
}

const ROLE_FILTER_OPTIONS = [
  { value: 'all', label: 'All roles' },
  { value: 'client', label: 'Clients' },
  { value: 'pilot', label: 'Pilots' },
  { value: 'admin', label: 'Admins' },
]

/** Account directory with status actions (PRD §8.6 — user management). */
export function UserManagementPage() {
  const { users } = useRepositories()
  const [version, setVersion] = useState(0)
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all')

  const rows = useMemo(() => {
    void version // recompute after a status change
    const all = users.list()
    return roleFilter === 'all' ? all : all.filter((u) => u.role === roleFilter)
  }, [users, roleFilter, version])

  function setStatus(u: User, status: UserStatus) {
    users.setStatus(u.id, status)
    setVersion((v) => v + 1)
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-h2 text-white">Users</h2>
          <p className="mt-1 text-body-sm text-ink-400">Manage platform accounts — flag, suspend, or reinstate.</p>
        </div>
        <div className="w-44">
          <SelectField
            label="Filter"
            options={ROLE_FILTER_OPTIONS}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as Role | 'all')}
          />
        </div>
      </header>

      <Card variant="elevated" className="overflow-hidden">
        <AdminTable head={['Account', 'Role', 'Joined', 'Status', 'Actions']}>
          {rows.map((u) => (
            <Tr key={u.id}>
              <Td>
                <span className="font-medium text-white">{u.name}</span>
                <span className="block text-caption text-ink-400">{u.email}</span>
              </Td>
              <Td className="text-ink-200">{ROLE_LABELS[u.role]}</Td>
              <Td className="text-ink-400">{u.createdAt}</Td>
              <Td>
                <Badge tone={STATUS_TONE[u.status]}>{USER_STATUS_LABELS[u.status]}</Badge>
                {u.flagReason && <span className="mt-1 block max-w-xs text-caption text-ink-400">{u.flagReason}</span>}
              </Td>
              <Td>
                {u.role === 'admin' ? (
                  <span className="text-caption text-ink-500">—</span>
                ) : (
                  <div className="flex gap-2">
                    {u.status === 'active' && (
                      <Button size="sm" variant="secondary" onClick={() => setStatus(u, 'flagged')}>
                        Flag
                      </Button>
                    )}
                    {u.status !== 'suspended' ? (
                      <Button size="sm" variant="danger" onClick={() => setStatus(u, 'suspended')}>
                        Suspend
                      </Button>
                    ) : (
                      <Button size="sm" variant="primary" onClick={() => setStatus(u, 'active')}>
                        Reinstate
                      </Button>
                    )}
                    {u.status === 'flagged' && (
                      <Button size="sm" variant="ghost" className="text-ink-300 hover:bg-white/5 hover:text-white" onClick={() => setStatus(u, 'active')}>
                        Clear
                      </Button>
                    )}
                  </div>
                )}
              </Td>
            </Tr>
          ))}
        </AdminTable>
      </Card>
    </div>
  )
}
