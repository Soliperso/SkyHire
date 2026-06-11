import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RepositoryProvider } from '@/data/RepositoryProvider'
import { AuthProvider } from '@/auth/AuthProvider'
import { RequireRole } from '@/auth/RequireRole'
import { SavedPilotsProvider } from '@/saved/SavedPilotsProvider'
import { ROUTE_PATTERNS } from '@/routes'
import { RootLayout } from '@/app/layout/RootLayout'
import { DashboardLayout } from '@/app/layout/DashboardLayout'
import { AdminLayout } from '@/app/layout/AdminLayout'

// Pages are code-split so the initial bundle only loads the landing route;
// dashboard/admin/marketing chunks load on demand.
const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })))
const BrowsePage = lazy(() => import('@/pages/BrowsePage').then((m) => ({ default: m.BrowsePage })))
const PilotProfilePage = lazy(() => import('@/pages/PilotProfilePage').then((m) => ({ default: m.PilotProfilePage })))
const QuoteRequestPage = lazy(() => import('@/pages/QuoteRequestPage').then((m) => ({ default: m.QuoteRequestPage })))
const ReviewsPage = lazy(() => import('@/pages/ReviewsPage').then((m) => ({ default: m.ReviewsPage })))
const SavedPilotsPage = lazy(() => import('@/pages/SavedPilotsPage').then((m) => ({ default: m.SavedPilotsPage })))
const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const HowItWorksPage = lazy(() => import('@/pages/HowItWorksPage').then((m) => ({ default: m.HowItWorksPage })))
const TrustSafetyPage = lazy(() => import('@/pages/TrustSafetyPage').then((m) => ({ default: m.TrustSafetyPage })))
const PricingPage = lazy(() => import('@/pages/PricingPage').then((m) => ({ default: m.PricingPage })))
const FaqPage = lazy(() => import('@/pages/FaqPage').then((m) => ({ default: m.FaqPage })))
const ContactPage = lazy(() => import('@/pages/ContactPage').then((m) => ({ default: m.ContactPage })))
const TermsPage = lazy(() => import('@/pages/TermsPage').then((m) => ({ default: m.TermsPage })))
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

// Admin console
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })))
const ListingsPage = lazy(() => import('@/pages/admin/ListingsPage').then((m) => ({ default: m.ListingsPage })))
const UserManagementPage = lazy(() => import('@/pages/admin/UserManagementPage').then((m) => ({ default: m.UserManagementPage })))
const CategoryManagementPage = lazy(() => import('@/pages/admin/CategoryManagementPage').then((m) => ({ default: m.CategoryManagementPage })))
const FraudMonitoringPage = lazy(() => import('@/pages/admin/FraudMonitoringPage').then((m) => ({ default: m.FraudMonitoringPage })))

// Pilot dashboard
const DashboardHomePage = lazy(() => import('@/pages/dashboard/DashboardHomePage').then((m) => ({ default: m.DashboardHomePage })))
const ProfileEditorPage = lazy(() => import('@/pages/dashboard/ProfileEditorPage').then((m) => ({ default: m.ProfileEditorPage })))
const VerificationCenterPage = lazy(() => import('@/pages/dashboard/VerificationCenterPage').then((m) => ({ default: m.VerificationCenterPage })))
const PortfolioManagerPage = lazy(() => import('@/pages/dashboard/PortfolioManagerPage').then((m) => ({ default: m.PortfolioManagerPage })))
const LeadsInboxPage = lazy(() => import('@/pages/dashboard/LeadsInboxPage').then((m) => ({ default: m.LeadsInboxPage })))
const ReviewsDashboardPage = lazy(() => import('@/pages/dashboard/ReviewsDashboardPage').then((m) => ({ default: m.ReviewsDashboardPage })))
const AvailabilityPage = lazy(() => import('@/pages/dashboard/AvailabilityPage').then((m) => ({ default: m.AvailabilityPage })))

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: ROUTE_PATTERNS.home, element: <HomePage /> },
      { path: ROUTE_PATTERNS.browse, element: <BrowsePage /> },
      { path: ROUTE_PATTERNS.pilot, element: <PilotProfilePage /> },
      { path: ROUTE_PATTERNS.quote, element: <QuoteRequestPage /> },
      { path: ROUTE_PATTERNS.reviews, element: <ReviewsPage /> },
      { path: ROUTE_PATTERNS.saved, element: <SavedPilotsPage /> },
      { path: ROUTE_PATTERNS.login, element: <LoginPage /> },

      // Public / marketing pages.
      { path: ROUTE_PATTERNS.howItWorks, element: <HowItWorksPage /> },
      { path: ROUTE_PATTERNS.trustSafety, element: <TrustSafetyPage /> },
      { path: ROUTE_PATTERNS.pricing, element: <PricingPage /> },
      { path: ROUTE_PATTERNS.faq, element: <FaqPage /> },
      { path: ROUTE_PATTERNS.contact, element: <ContactPage /> },
      { path: ROUTE_PATTERNS.terms, element: <TermsPage /> },
      { path: ROUTE_PATTERNS.privacy, element: <PrivacyPage /> },

      // Admin console — gated to the admin role, nested under the admin shell.
      {
        element: <RequireRole role="admin" />,
        children: [
          {
            path: ROUTE_PATTERNS.admin,
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminDashboardPage /> },
              { path: ROUTE_PATTERNS.adminListings, element: <ListingsPage /> },
              { path: ROUTE_PATTERNS.adminUsers, element: <UserManagementPage /> },
              { path: ROUTE_PATTERNS.adminCategories, element: <CategoryManagementPage /> },
              { path: ROUTE_PATTERNS.adminFraud, element: <FraudMonitoringPage /> },
            ],
          },
        ],
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
      <SavedPilotsProvider>
        <RepositoryProvider>
          <RouterProvider router={router} />
        </RepositoryProvider>
      </SavedPilotsProvider>
    </AuthProvider>
  )
}
