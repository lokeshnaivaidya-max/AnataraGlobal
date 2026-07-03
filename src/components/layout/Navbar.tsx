// =============================================================================
// Navbar.tsx — Antara Global
// Features:
//   • Scroll shrink: floating pill at scroll > 20px
//   • Desktop inline links
//   • Mobile slide-in drawer
//   • "Book a Consultation" primary CTA + "Become a Partner" secondary CTA
// =============================================================================

import { useState, useEffect, useCallback } from 'react'
import { Link } from 'wouter'
import {
  Menu,
  X,
  Sparkles,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { navConfig } from './navConfig'

// ─── Animation variants ────────────────────────────────────────────────────

const drawerVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.28, ease: 'easeOut' as const },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: 0.22, ease: 'easeIn' as const },
  },
}

// ─── Main Navbar ───────────────────────────────────────────────────────────

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return (
    <>
      {/* ── Header bar ── */}
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'top-3 mx-auto max-w-screen-xl w-[94%] rounded-2xl bg-white/90 border border-border-gray/60 shadow-xl shadow-deep-navy/8 backdrop-blur-2xl'
            : 'top-0 w-full bg-white/70 border-b border-border-gray/50 backdrop-blur-md'
        }`}
      >
        <nav
          className={`flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-500 ${
            scrolled ? 'h-16' : 'h-[72px]'
          }`}
          aria-label="Main navigation"
        >
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative flex items-center">
              <Sparkles className="h-5 w-5 text-gold transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-gold/40 animate-pulse-glow" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[17px] font-black tracking-tight text-deep-navy group-hover:text-gold transition-colors duration-300">
                ANTARA{' '}
                <span className="font-light text-gold">GLOBAL</span>
              </span>
              <span
                className={`text-[9px] font-medium tracking-wider text-medium-gray/70 transition-all duration-300 ${
                  scrolled ? 'hidden' : 'hidden sm:block'
                }`}
              >
                सर्वेषां वित्तज्ञानम्
              </span>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden lg:flex items-center gap-1">
            {navConfig.map((link) => (
              <Link
                key={link.label}
                href={link.href ?? '/'}
                className="nav-trigger relative px-3 py-1 text-xs font-bold uppercase tracking-wider text-medium-gray hover:text-deep-navy transition-colors duration-200 after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-gold hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Right CTAs ── */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="lg:hidden p-2 rounded-lg text-charcoal hover:text-gold hover:bg-deep-navy/5 transition-all duration-200"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
        </nav>
      </header>

      {/* ── Mobile drawer backdrop ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-deep-navy/40 backdrop-blur-sm lg:hidden"
            onClick={closeMobile}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ── Mobile drawer panel ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            key="drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-2xl shadow-deep-navy/20 flex flex-col lg:hidden"
            aria-label="Mobile navigation"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-border-gray/60 px-5 py-4">
              <Link href="/" onClick={closeMobile} className="flex items-center gap-2 group">
                <Sparkles className="h-4.5 w-4.5 text-gold group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-base font-black tracking-tight text-deep-navy">
                  ANTARA{' '}
                  <span className="font-light text-gold">GLOBAL</span>
                </span>
              </Link>
              <button
                onClick={closeMobile}
                className="p-2 rounded-lg text-charcoal hover:text-gold hover:bg-deep-navy/5 transition-all duration-200"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tagline strip */}
            <div className="bg-deep-navy/4 px-5 py-2.5 text-[11px] font-medium tracking-wider text-medium-gray border-b border-border-gray/40">
              सर्वेषां वित्तज्ञानम् · Financial Knowledge for Everyone
            </div>

            {/* Nav links */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
              {navConfig.map((link) => (
                <Link
                  key={link.label}
                  href={link.href ?? '/'}
                  onClick={closeMobile}
                  className="flex items-center rounded-xl px-4 py-3.5 text-sm font-bold uppercase tracking-wider text-charcoal hover:bg-deep-navy/5 hover:text-deep-navy transition-colors duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </div>


          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
