import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { ROUTES } from '@/routes'
import { cn } from '@/lib/cn'
import { Header } from './Header'
import { Footer } from './Footer'

/** App shell: fixed header + routed page content + footer. */
export function RootLayout() {
  const { pathname } = useLocation()
  // The home hero sits behind the transparent header; other pages offset for it.
  const isHome = pathname === ROUTES.home()

  return (
    <div className="flex min-h-screen flex-col bg-ink-950 text-white">
      <Header />
      <main className={cn('flex-1', !isHome && 'pt-16')}>
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
