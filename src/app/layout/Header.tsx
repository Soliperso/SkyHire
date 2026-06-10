import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { List, X, SignOut } from '@phosphor-icons/react'
import { useAuth } from '@/auth/AuthProvider'
import { homeForRole } from '@/auth/accounts'
import { ROUTES } from '@/routes'
import { Logo } from '@/components/Logo'
import { Avatar } from '@/components/Avatar'
import { buttonStyles } from '@/components/Button'
import { cn } from '@/lib/cn'

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  // Nav adapts to role: admins get the console link; pilots get their dashboard.
  const nav = [
    { label: 'Browse pilots', to: ROUTES.browse() },
    { label: 'How it works', to: ROUTES.howItWorks() },
    { label: 'Pricing', to: ROUTES.pricing() },
    ...(user?.role === 'admin' ? [{ label: 'Admin', to: ROUTES.admin() }] : []),
    ...(user?.role === 'pilot' ? [{ label: 'Dashboard', to: ROUTES.dashboard() }] : []),
  ]

  const isHome = pathname === ROUTES.home()
  const overHero = isHome && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleSignOut() {
    signOut()
    setOpen(false)
    navigate(ROUTES.home())
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-colors duration-300',
        overHero ? 'bg-transparent' : 'glass border-b border-white/10 bg-ink-950/80',
      )}
    >
      <div className="mx-auto flex h-16 max-w-container items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
        <Link to={ROUTES.home()} aria-label="SkyHire home">
          <Logo variant="light" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="rounded-lg px-3 py-2 text-body-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                to={homeForRole(user.role)}
                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-body-sm font-medium text-white transition hover:bg-white/10"
              >
                {user.avatarUrl ? (
                  <Avatar src={user.avatarUrl} alt={user.name} size="sm" className="h-7 w-7 ring-white/20" />
                ) : (
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-accent-500/20 text-caption font-bold text-accent-300">
                    {user.name.charAt(0)}
                  </span>
                )}
                {user.name.split(' ')[0]}
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                aria-label="Sign out"
                className={cn(buttonStyles('ghost', 'sm'), 'text-white hover:bg-white/10')}
              >
                <SignOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                to={ROUTES.login()}
                className={cn(buttonStyles('ghost', 'sm'), 'text-white hover:bg-white/10')}
              >
                Sign in
              </Link>
              <Link to={ROUTES.browse()} className={buttonStyles('primary', 'sm')}>
                Get quotes
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <List className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="glass border-t border-white/10 bg-ink-950/90 px-5 py-3 md:hidden">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-body-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </NavLink>
          ))}
          {user ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-body-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
            >
              <SignOut className="h-4 w-4" /> Sign out ({user.name.split(' ')[0]})
            </button>
          ) : (
            <Link
              to={ROUTES.login()}
              onClick={() => setOpen(false)}
              className={cn(buttonStyles('primary', 'md'), 'mt-2 w-full')}
            >
              Sign in
            </Link>
          )}
        </nav>
      )}
    </header>
  )
}
