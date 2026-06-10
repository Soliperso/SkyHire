import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RepositoryProvider } from '@/data/RepositoryProvider'
import { AuthProvider } from '@/auth/AuthProvider'
import { RequireRole } from '@/auth/RequireRole'
import { ROUTE_PATTERNS } from '@/routes'
import { RootLayout } from '@/app/layout/RootLayout'
import { DashboardLayout } from '@/app/layout/DashboardLayout'
import { HomePage } from '@/pages/HomePage'
import { BrowsePage } from '@/pages/BrowsePage'
import { PilotProfilePage } from '@/pages/PilotProfilePage'
import { QuoteRequestPage } from '@/pages/QuoteRequestPage'
import { ReviewsPage } from '@/pages/ReviewsPage'
import { LoginPage } from '@/pages/LoginPage'
import { HowItWorksPage } from '@/pages/HowItWorksPage'
import { TrustSafetyPage } from '@/pages/TrustSafetyPage'
import { PricingPage } from '@/pages/PricingPage'
import { FaqPage } from '@/pages/FaqPage'
import { ContactPage } from '@/pages/ContactPage'
import { TermsPage } from '@/pages/TermsPage'
import { PrivacyPage } from '@/pages/PrivacyPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { DashboardHomePage } from '@/pages/dashboard/DashboardHomePage'
import { ProfileEditorPage } from '@/pages/dashboard/ProfileEditorPage'
import { VerificationCenterPage } from '@/pages/dashboard/VerificationCenterPage'
import { PortfolioManagerPage } from '@/pages/dashboard/PortfolioManagerPage'
import { LeadsInboxPage } from '@/pages/dashboard/LeadsInboxPage'
import { ReviewsDashboardPage } from '@/pages/dashboard/ReviewsDashboardPage'
import { AvailabilityPage } from '@/pages/dashboard/AvailabilityPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: ROUTE_PATTERNS.home, element: <HomePage /> },
      { path: ROUTE_PATTERNS.browse, element: <BrowsePage /> },
      { path: ROUTE_PATTERNS.pilot, element: <PilotProfilePage /> },
      { path: ROUTE_PATTERNS.quote, element: <QuoteRequestPage /> },
      { path: ROUTE_PATTERNS.reviews, element: <ReviewsPage /> },
      { path: ROUTE_PATTERNS.login, element: <LoginPage /> },

      // Public / marketing pages.
      { path: ROUTE_PATTERNS.howItWorks, element: <HowItWorksPage /> },
      { path: ROUTE_PATTERNS.trustSafety, element: <TrustSafetyPage /> },
      { path: ROUTE_PATTERNS.pricing, element: <PricingPage /> },
      { path: ROUTE_PATTERNS.faq, element: <FaqPage /> },
      { path: ROUTE_PATTERNS.contact, element: <ContactPage /> },
      { path: ROUTE_PATTERNS.terms, element: <TermsPage /> },
      { path: ROUTE_PATTERNS.privacy, element: <PrivacyPage /> },

      // Admin — gated to the admin role.
      {
        element: <RequireRole role="admin" />,
        children: [{ path: ROUTE_PATTERNS.admin, element: <AdminDashboardPage /> }],
      },

      // Pilot dashboard — gated to the pilot role, nested under the dashboard shell.
      {
        element: <RequireRole role="pilot" />,
        children: [
          {
            path: ROUTE_PATTERNS.dashboard,
            element: <DashboardLayout />,
            children: [
              { index: true, element: <DashboardHomePage /> },
              { path: ROUTE_PATTERNS.dashboardProfile, element: <ProfileEditorPage /> },
              { path: ROUTE_PATTERNS.dashboardVerification, element: <VerificationCenterPage /> },
              { path: ROUTE_PATTERNS.dashboardPortfolio, element: <PortfolioManagerPage /> },
              { path: ROUTE_PATTERNS.dashboardLeads, element: <LeadsInboxPage /> },
              { path: ROUTE_PATTERNS.dashboardReviews, element: <ReviewsDashboardPage /> },
              { path: ROUTE_PATTERNS.dashboardAvailability, element: <AvailabilityPage /> },
            ],
          },
        ],
      },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export function App() {
  return (
    <AuthProvider>
      <RepositoryProvider>
        <RouterProvider router={router} />
      </RepositoryProvider>
    </AuthProvider>
  )
}
