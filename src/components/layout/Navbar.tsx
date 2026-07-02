import { useState, useEffect } from 'react'
import { Link } from 'wouter'
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#resources', label: 'Resources' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'top-4 mx-auto max-w-6xl w-[92%] sm:w-[95%] rounded-2xl bg-white/85 border border-border-gray/50 shadow-lg shadow-deep-navy/5 backdrop-blur-xl'
        : 'top-0 w-full bg-white/60 border-b border-border-gray/50 backdrop-blur-md'
    }`}>
      <nav className="px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'h-16' : 'h-20'
        }`}>
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Sparkles className="h-4.5 w-4.5 text-gold group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-gold/30 animate-pulse-glow" />
            </div>
            <span className="text-lg font-black tracking-tight text-deep-navy group-hover:text-gold transition-colors duration-300">
              ANTARA
            </span>
            <span className="hidden sm:inline text-lg font-light text-gold">
              GLOBAL
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-bold uppercase tracking-wider text-medium-gray hover:text-deep-navy transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-gold hover:after:w-full after:transition-all duration-300"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#consultation"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-dark px-4.5 py-2.5 text-xs font-bold uppercase tracking-wider text-deep-navy shadow-md hover:shadow-lg hover:shadow-gold/25 hover:scale-105 transition-all duration-300"
            >
              Book Call
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          <button
            className="md:hidden p-2 text-charcoal hover:text-gold transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-border-gray/50 pb-4"
            >
              <div className="py-2 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-xs font-bold uppercase tracking-wider text-medium-gray hover:text-deep-navy px-2 py-1.5 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#consultation"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-dark px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-deep-navy mt-2 hover:shadow-lg transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  Book Consultation
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
