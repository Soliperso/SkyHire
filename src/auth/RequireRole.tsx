import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { Role } from '@/data/types'
import { ROUTES } from '@/routes'
import { Container } from '@/components/Container'
import { homeForRole } from './accounts'
import { useAuth } from './AuthProvider'

/**
 * Route guard. Unauthenticated visitors are bounced to the login page (with a
 * `from` so we can return them after sign-in); a signed-in user with the wrong
 * role is sent to their own home rather than shown content they can't use.
 */
export function RequireRole({ role }: { role: Role }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Wait for the initial session to resolve so we don't bounce a signed-in
  // user to /login on a hard refresh.
  if (loading) {
    return <Container className="py-24 text-center text-body text-ink-400">Loading…</Container>
  }
  if (!user) {
    return <Navigate to={ROUTES.login(location.pathname)} replace />
  }
  if (user.role !== role) {
    return <Navigate to={homeForRole(user.role)} replace />
  }
  return <Outlet />
}
