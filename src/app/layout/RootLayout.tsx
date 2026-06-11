import { Suspense } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { CircleNotch } from '@phosphor-icons/react'
import { ROUTES } from '@/routes'
import { cn } from '@/lib/cn'
import { Header } from './Header'
import { Footer } from './Footer'

/** Fallback shown while a lazily-loaded route chunk is fetched. */
function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading">
      <CircleNotch className="h-8 w-8 animate-spin text-accent-300" />
    </div>
  )
}

/** App shell: fixed header + routed page content + footer. */
export function RootLayout() {
  const { pathname } = useLocation()
  // The home hero sits behind the transparent header; other pages offset for it.
  const isHome = pathname === ROUTES.home()

  return (
    <div className="flex min-h-screen flex-col bg-ink-950 text-white">
      <Header />
      <main className={cn('flex-1', !isHome && 'pt-16')}>
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
