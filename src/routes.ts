/**
 * Centralized route definitions. Every link in the app is built from these
 * helpers — no hardcoded URL strings scattered through components (DRY). If a
 * path changes, it changes here once.
 */
export const ROUTES = {
  home: () => '/',
  browse: (query?: string) => (query ? `/browse?q=${encodeURIComponent(query)}` : '/browse'),
  pilot: (id: string) => `/pilots/${id}`,
  quote: (pilotId: string) => `/pilots/${pilotId}/quote`,
  reviews: (pilotId?: string) => (pilotId ? `/reviews?pilot=${pilotId}` : '/reviews'),
  admin: () => '/admin',
  login: (from?: string) => (from ? `/login?from=${encodeURIComponent(from)}` : '/login'),
  // Public / marketing pages.
  howItWorks: () => '/how-it-works',
  trustSafety: () => '/trust-safety',
  pricing: () => '/pricing',
  faq: () => '/faq',
  contact: () => '/contact',
  terms: () => '/terms',
  privacy: () => '/privacy',
  // Pilot dashboard (auth-gated).
  dashboard: () => '/dashboard',
  dashboardProfile: () => '/dashboard/profile',
  dashboardVerification: () => '/dashboard/verification',
  dashboardPortfolio: () => '/dashboard/portfolio',
  dashboardLeads: () => '/dashboard/leads',
  dashboardReviews: () => '/dashboard/reviews',
  dashboardAvailability: () => '/dashboard/availability',
} as const

/** Route patterns for <Route path=…>. */
export const ROUTE_PATTERNS = {
  home: '/',
  browse: '/browse',
  pilot: '/pilots/:id',
  quote: '/pilots/:id/quote',
  reviews: '/reviews',
  admin: '/admin',
  login: '/login',
  howItWorks: '/how-it-works',
  trustSafety: '/trust-safety',
  pricing: '/pricing',
  faq: '/faq',
  contact: '/contact',
  terms: '/terms',
  privacy: '/privacy',
  // Dashboard children are mounted relative to this parent path.
  dashboard: '/dashboard',
  dashboardProfile: '/dashboard/profile',
  dashboardVerification: '/dashboard/verification',
  dashboardPortfolio: '/dashboard/portfolio',
  dashboardLeads: '/dashboard/leads',
  dashboardReviews: '/dashboard/reviews',
  dashboardAvailability: '/dashboard/availability',
} as const
