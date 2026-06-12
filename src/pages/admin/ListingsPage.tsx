import { Link } from 'react-router-dom'
import { Star } from '@phosphor-icons/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { PilotProfile } from '@/data/types'
import { useRepositories } from '@/data/RepositoryProvider'
import { ROUTES } from '@/routes'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { VerifiedBadge } from '@/components/VerifiedBadge'
import { RatingStars } from '@/components/RatingStars'
import { AdminTable, Tr, Td } from '@/features/admin/AdminTable'

/** Listing management + featured-placement controls (PRD §8.6). */
export function ListingsPage() {
  const { pilots } = useRepositories()
  const queryClient = useQueryClient()

  const { data: rows = [] } = useQuery({ queryKey: ['pilots', 'list', 'all'], queryFn: () => pilots.list() })

  const featuredCount = rows.filter((p) => p.featured).length

  const toggleMutation = useMutation({
    mutationFn: (p: PilotProfile) => pilots.update(p.id, { featured: !p.featured }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['pilots'] }),
  })

  function toggleFeatured(p: PilotProfile) {
    toggleMutation.mutate(p)
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-h2 text-white">Listings</h2>
        <p className="mt-1 text-body-sm text-ink-400">
          {rows.length} listings · {featuredCount} featured. Featured pilots surface first in search and on the home page.
        </p>
      </header>

      <Card variant="elevated" className="overflow-hidden">
        <AdminTable head={['Pilot', 'Verification', 'Rating', 'Featured', '']}>
          {rows.map((p) => (
            <Tr key={p.id}>
              <Td>
                <Link to={ROUTES.pilot(p.id)} className="font-medium text-white hover:text-brand-300">
                  {p.businessName}
                </Link>
                <span className="block text-caption text-ink-400">{p.name} · {p.location}</span>
              </Td>
              <Td>
                <VerifiedBadge status={p.verificationStatus} />
              </Td>
              <Td>
                <RatingStars value={p.ratingAvg} count={p.reviewCount} showValue size={14} tone="dark" />
              </Td>
              <Td>
                <button
                  type="button"
                  onClick={() => toggleFeatured(p)}
                  aria-pressed={p.featured}
                  aria-label={p.featured ? 'Remove from featured' : 'Add to featured'}
                  className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
                >
                  <Star
                    weight={p.featured ? 'fill' : 'regular'}
                    className={p.featured ? 'h-5 w-5 text-star' : 'h-5 w-5 text-ink-500'}
                  />
                </button>
              </Td>
              <Td>
                <Button
                  size="sm"
                  variant={p.featured ? 'secondary' : 'primary'}
                  onClick={() => toggleFeatured(p)}
                >
                  {p.featured ? 'Unfeature' : 'Feature'}
                </Button>
              </Td>
            </Tr>
          ))}
        </AdminTable>
      </Card>
    </div>
  )
}
