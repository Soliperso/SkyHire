import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SignIn, Warning } from '@phosphor-icons/react'
import { useAuth } from '@/auth/AuthProvider'
import { QUICK_ACCOUNTS, homeForRole } from '@/auth/accounts'
import { Container } from '@/components/Container'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { TextField } from '@/components/fields'
import { Logo } from '@/components/Logo'

const ROLE_LABEL: Record<string, string> = {
  pilot: 'Pilot',
  admin: 'Admin',
  client: 'Client',
}

export function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const from = params.get('from')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  function attempt(withEmail: string) {
    const user = signIn(withEmail)
    if (!user) {
      setError('No account matches that email. Try a demo account below.')
      return
    }
    setError(null)
    // Return the visitor to where they were headed, else their role's home.
    navigate(from ?? homeForRole(user.role), { replace: true })
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    attempt(email)
  }

  return (
    <Container className="flex min-h-[80vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <Logo variant="light" />
          <div>
            <h1 className="text-h1 text-white">Welcome back</h1>
            <p className="mt-1 text-body text-ink-400">Sign in to manage your pilot profile and leads.</p>
          </div>
        </div>

        <Card variant="elevated" className="p-6">
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
              autoComplete="current-password"
              placeholder="••••••••"
              hint="Demo mode — any password works."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <p className="flex items-center gap-2 rounded-lg bg-danger-50 px-3 py-2 text-body-sm font-medium text-danger-700">
                <Warning weight="fill" className="h-4 w-4 shrink-0" />
                {error}
              </p>
            )}

            <Button type="submit" variant="primary" size="lg" className="mt-1 w-full">
              <SignIn weight="bold" className="h-5 w-5" /> Sign in
            </Button>
          </form>
        </Card>

        <div className="mt-6">
          <p className="mb-3 text-center text-caption font-semibold uppercase tracking-wide text-ink-400">
            Or try a demo account
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {QUICK_ACCOUNTS.map((account) => (
              <button
                key={account.id}
                type="button"
                onClick={() => attempt(account.email)}
                className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-body-sm font-medium text-white transition hover:bg-white/[0.18] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
              >
                <span className="rounded-full bg-accent-500/20 px-2 py-0.5 text-caption font-semibold text-accent-300">
                  {ROLE_LABEL[account.role]}
                </span>
                {account.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}
