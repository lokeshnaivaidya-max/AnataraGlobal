import { Route, Switch, useLocation } from 'wouter'
import { useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import LoadingScreen from './components/layout/LoadingScreen'
import About from './pages/About'
import Services from './pages/Services'
import TargetAudience from './pages/TargetAudience'
import Ecosystem from './pages/Ecosystem'
import Differentiator from './pages/Differentiator'
import CoreValues from './pages/CoreValues'
import KnowledgeHub from './pages/KnowledgeHub'
import Contact from './pages/Contact'
import ContactSection from './components/about/ContactSection'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyOTP from './pages/auth/VerifyOTP'
import VerifyEmail from './pages/auth/VerifyEmail'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import MfaSetup from './pages/auth/MfaSetup'
import MfaVerify from './pages/auth/MfaVerify'
import DeviceManagement from './pages/auth/DeviceManagement'
import SessionManagement from './pages/auth/SessionManagement'
import OAuthCallback from './pages/auth/OAuthCallback'
import DashboardHome from './pages/dashboard/founder/DashboardHome'
import ProfilePage from './pages/dashboard/founder/ProfilePage'
import StartupPage from './pages/dashboard/founder/StartupPage'
import TeamPage from './pages/dashboard/founder/TeamPage'
import DocumentsPage from './pages/dashboard/founder/DocumentsPage'
import KYCPage from './pages/dashboard/founder/KYCPage'
import VentureReadiness from './pages/dashboard/founder/VentureReadiness'
import Advisors from './pages/dashboard/founder/Advisors'
import AdvisorDetail from './pages/dashboard/founder/AdvisorDetail'
import MySessions from './pages/dashboard/founder/MySessions'
import FundraisingDashboard from './pages/dashboard/founder/FundraisingDashboard'
import FundraisingRounds from './pages/dashboard/founder/FundraisingRounds'
import InvestorPipeline from './pages/dashboard/founder/InvestorPipeline'
import InvestorContacts from './pages/dashboard/founder/InvestorContacts'
import InvestorContactDetail from './pages/dashboard/founder/InvestorContactDetail'
import EventsList from './pages/dashboard/events/EventsList'
import EventDetail from './pages/dashboard/events/EventDetail'
import MyEvents from './pages/dashboard/events/MyEvents'
import KnowledgeHubDashboard from './pages/dashboard/knowledge/KnowledgeHubDashboard'
import TasksPage from './pages/dashboard/tasks/TasksPage'
import LeadsPage from './pages/dashboard/crm/LeadsPage'
import LeadDetail from './pages/dashboard/crm/LeadDetail'
import PartnersList from './pages/dashboard/partners/PartnersList'
import PartnerDetail from './pages/dashboard/partners/PartnerDetail'
import CapitalProviders from './pages/dashboard/capital/CapitalProviders'
import CapitalRequests from './pages/dashboard/capital/CapitalRequests'
import PaymentsPage from './pages/dashboard/payments/PaymentsPage'
import AnalyticsPage from './pages/dashboard/analytics/AnalyticsPage'
import MsmeDashboardHome from './pages/dashboard/msme/DashboardHome'
import MsmeBusinessDetails from './pages/dashboard/msme/BusinessDetails'
import MsmeFinancialHealth from './pages/dashboard/msme/FinancialHealth'
import MsmeCompliance from './pages/dashboard/msme/Compliance'
import MsmeEmployeesExport from './pages/dashboard/msme/EmployeesExport'
import MsmeDocumentsPage from './pages/dashboard/msme/DocumentsPage'
import AdminDashboard from './pages/dashboard/admin/AdminDashboard'
import AdminUsers from './pages/dashboard/admin/AdminUsers'
import AdminSettings from './pages/dashboard/admin/AdminSettings'
import NotificationList from './pages/dashboard/notifications/NotificationList'
import NotificationPreferences from './pages/dashboard/notifications/NotificationPreferences'
import DashboardLayout, { founderNav, msmeNav, adminNav } from './components/dashboard/DashboardLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { useAuth } from './lib/auth-context'

function NavbarWithAuth() {
  const { isAuthenticated } = useAuth()
  return <Navbar isAuthenticated={isAuthenticated} />
}

export default function App() {
  const [location] = useLocation()
  const isDashboard = location.startsWith('/dashboard')

  useEffect(() => {
    try { history.scrollRestoration = 'manual' } catch { /* noop */ }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [location])

  if (isDashboard) {
    return (
      <Switch>
        <Route path="/dashboard/founder">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <DashboardHome />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/founder/profile">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <ProfilePage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/founder/startup">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <StartupPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/founder/team">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <TeamPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/founder/documents">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <DocumentsPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/founder/kyc">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <KYCPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/founder/venture-readiness">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <VentureReadiness />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/founder/advisors">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <Advisors />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/founder/advisors/:id">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <AdvisorDetail />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/founder/sessions">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <MySessions />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/founder/fundraising">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <FundraisingDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/founder/fundraising/rounds">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <FundraisingRounds />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/founder/fundraising/investors">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <InvestorPipeline />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/founder/investor-crm">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <InvestorContacts />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/founder/investor-crm/:id">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <InvestorContactDetail />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/events">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <EventsList />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/events/my-events">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <MyEvents />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/events/:id">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <EventDetail />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/knowledge">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <KnowledgeHubDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/tasks">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <TasksPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/crm">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <LeadsPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/crm/:id">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <LeadDetail />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/partners">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <PartnersList />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/partners/:id">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <PartnerDetail />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/capital">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <CapitalProviders />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/capital/requests">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <CapitalRequests />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/payments">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <PaymentsPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/analytics">
          <ProtectedRoute>
            <DashboardLayout navItems={founderNav}>
              <AnalyticsPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/msme">
          <ProtectedRoute>
            <DashboardLayout navItems={msmeNav}>
              <MsmeDashboardHome />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/msme/business">
          <ProtectedRoute>
            <DashboardLayout navItems={msmeNav}>
              <MsmeBusinessDetails />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/msme/financial-health">
          <ProtectedRoute>
            <DashboardLayout navItems={msmeNav}>
              <MsmeFinancialHealth />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/msme/compliance">
          <ProtectedRoute>
            <DashboardLayout navItems={msmeNav}>
              <MsmeCompliance />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/msme/employees">
          <ProtectedRoute>
            <DashboardLayout navItems={msmeNav}>
              <MsmeEmployeesExport />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/msme/documents">
          <ProtectedRoute>
            <DashboardLayout navItems={msmeNav}>
              <MsmeDocumentsPage />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/admin">
          <ProtectedRoute>
            <DashboardLayout navItems={adminNav}>
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/admin/users">
          <ProtectedRoute>
            <DashboardLayout navItems={adminNav}>
              <AdminUsers />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/admin/settings">
          <ProtectedRoute>
            <DashboardLayout navItems={adminNav}>
              <AdminSettings />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/notifications">
          <ProtectedRoute>
            <DashboardLayout navItems={[]}>
              <NotificationList />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard/notifications/preferences">
          <ProtectedRoute>
            <DashboardLayout navItems={[]}>
              <NotificationPreferences />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
      </Switch>
    )
  }

  return (
    <LoadingScreen>
      <div className="flex min-h-screen flex-col">
        <NavbarWithAuth />
        <main className="flex-1">
          <Switch>
            <Route path="/" component={About} />
            <Route path="/about" component={About} />
            <Route path="/services" component={Services} />
            <Route path="/target-audience" component={TargetAudience} />
            <Route path="/ecosystem" component={Ecosystem} />
            <Route path="/differentiator" component={Differentiator} />
            <Route path="/core-values" component={CoreValues} />
            <Route path="/knowledge" component={KnowledgeHub} />
            <Route path="/contact" component={Contact} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/verify-otp" component={VerifyOTP} />
            <Route path="/verify-email" component={VerifyEmail} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/reset-password" component={ResetPassword} />
            <Route path="/mfa/setup" component={MfaSetup} />
            <Route path="/mfa/verify" component={MfaVerify} />
            <Route path="/devices" component={DeviceManagement} />
            <Route path="/sessions" component={SessionManagement} />
            <Route path="/auth/callback" component={OAuthCallback} />
          </Switch>
        </main>
        {location !== '/target-audience' && location !== '/services' && location !== '/ecosystem' && location !== '/differentiator' && location !== '/why%20us' && location !== '/core-values' && <ContactSection />}
        <Footer />
      </div>
    </LoadingScreen>
  )
}
