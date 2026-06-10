import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes'
import { Container } from '@/components/Container'
import { buttonStyles } from '@/components/Button'

export function NotFoundPage() {
  return (
    <Container className="py-28 text-center">
      <p className="text-h1 font-bold text-gradient">404</p>
      <h1 className="mt-2 text-h2 text-white">Page not found</h1>
      <p className="mx-auto mt-3 max-w-md text-body text-ink-400">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <Link to={ROUTES.home()} className={buttonStyles('primary', 'md') + ' mt-7'}>
        Back to home
      </Link>
    </Container>
  )
}
