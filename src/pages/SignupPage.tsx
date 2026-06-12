import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { UserPlus, Warning } from '@phosphor-icons/react'
import { useAuth } from '@/auth/AuthProvider'
import { homeForRole } from '@/auth/accounts'
import { ROUTES } from '@/routes'
import { Container } from '@/components/Container'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { TextField } from '@/components/fields'
import { Logo } from '@/components/Logo'

/** Client self-signup (PRD §10). Pilots/admins are provisioned out-of-band. */
export function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const from = params.get('from')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return setError('Please enter your name.')
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    setError(null)
    setSubmitting(true)
    const res = await signUp(email, password, name)
    setSubmitting(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    navigate(from ?? homeForRole(res.role), { replace: true })
  }

  return (
    <Container className="flex min-h-[80vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <Logo variant="light" />
          <div>
            <h1 className="text-h1 text-white">Create your account</h1>
            <p className="mt-1 text-body text-ink-400">
              Find and hire verified drone pilots, and track your quote requests.
            </p>
          </div>
        </div>

        <Card variant="elevated" className="p-6">
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <TextField
              label="Name"
              autoComplete="name"
              placeholder="Jordan Mills"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="flex items-center gap-2 rounded-lg bg-danger-50 px-3 py-2 text-body-sm font-medium text-danger-700">
                <Warning weight="fill" className="h-4 w-4 shrink-0" />
                {error}
              </p>
            )}

            <Button type="submit" variant="primary" size="lg" className="mt-1 w-full" disabled={submitting}>
              <UserPlus weight="bold" className="h-5 w-5" /> {submitting ? 'Creating…' : 'Create account'}
            </Button>
          </form>

          <p className="mt-4 text-center text-body-sm text-ink-400">
            Already have an account?{' '}
            <Link to={ROUTES.login()} className="font-semibold text-accent-300 hover:text-accent-200">
              Sign in
            </Link>
          </p>
        </Card>

        <p className="mt-6 text-center text-caption text-ink-500">
          Are you a pilot? Contact us to get your profile set up.
        </p>
      </div>
    </Container>
  )
}
