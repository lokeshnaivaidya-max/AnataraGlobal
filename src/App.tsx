import { Route, Switch } from 'wouter'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import About from './pages/About'
import Services from './pages/Services'
import Solutions from './pages/Solutions'
import Ecosystem from './pages/Ecosystem'
import KnowledgeHub from './pages/KnowledgeHub'
import Contact from './pages/Contact'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={About} />
          <Route path="/about" component={About} />
          <Route path="/services" component={Services} />
          <Route path="/solutions" component={Solutions} />
          <Route path="/ecosystem" component={Ecosystem} />
          <Route path="/knowledge" component={KnowledgeHub} />
          <Route path="/contact" component={Contact} />
        </Switch>
      </main>
      <Footer />
    </div>
  )
}
