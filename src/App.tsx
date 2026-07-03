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

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
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
        </Switch>
      </main>
      <Footer />
    </div>
  )
}
