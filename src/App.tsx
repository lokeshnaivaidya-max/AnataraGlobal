import { Route, Switch } from 'wouter'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import About from './pages/About'
import Services from './pages/Services'
import TargetAudience from './pages/TargetAudience'
import Ecosystem from './pages/Ecosystem'
import Differentiator from './pages/Differentiator'
import CoreValues from './pages/CoreValues'
import KnowledgeHub from './pages/KnowledgeHub'
import Contact from './pages/Contact'
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
import { useAuth } from './lib/auth-context'

function NavbarWithAuth() {
  const { isAuthenticated } = useAuth()
  return <Navbar isAuthenticated={isAuthenticated} />
}

export default function App() {
  return (
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
      <Footer />
    </div>
  )
}
