import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { Role } from '@/data/types'
import { ROUTES } from '@/routes'
import { homeForRole } from './accounts'
import { useAuth } from './AuthProvider'

/**
 * Route guard. Unauthenticated visitors are bounced to the login page (with a
 * `from` so we can return them after sign-in); a signed-in user with the wrong
 * role is sent to their own home rather than shown content they can't use.
 */
export function RequireRole({ role }: { role: Role }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to={ROUTES.login(location.pathname)} replace />
  }
  if (user.role !== role) {
    return <Navigate to={homeForRole(user.role)} replace />
  }
  return <Outlet />
}
