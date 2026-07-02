import { Route, Switch } from 'wouter'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import About from './pages/About'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={About} />
          <Route path="/about" component={About} />
        </Switch>
      </main>
      <Footer />
    </div>
  )
}
