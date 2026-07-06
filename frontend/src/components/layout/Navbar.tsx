import { useState, useEffect, useCallback, type MouseEvent } from 'react'
import { Link, useLocation } from 'wouter'
import {
  Menu,
  X,
  Sparkles,
  ChevronDown,
  LogOut,
  User,
  Shield,
  Monitor,
  Globe,
  LayoutDashboard,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { navConfig, authLinks, userMenuLinks } from './navConfig'
import { useAuth } from '../../lib/auth-context'

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

const userMenuIcons: Record<string, typeof User> = {
  Dashboard: LayoutDashboard,
  'MFA Settings': Shield,
  Devices: Monitor,
  Sessions: Globe,
}

export default function Navbar({ isAuthenticated: _isAuthenticated }: { isAuthenticated?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const [_location, setLocation] = useLocation()

  const goHome = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      // Explicit navigation guarantees the logo always routes home,
      // even if default anchor behavior is intercepted upstream.
      e.preventDefault()
      setMobileOpen(false)
      setUserMenuOpen(false)
      setLocation('/')
    },
    [setLocation]
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false)
        setUserMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (userMenuOpen) {
      const handler = () => setUserMenuOpen(false)
      window.addEventListener('scroll', handler, { once: true })
      return () => window.removeEventListener('scroll', handler)
    }
  }, [userMenuOpen])

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return (
    <>
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
          <Link
            href="/"
            onClick={goHome}
            className="flex items-center gap-2.5 group shrink-0 cursor-pointer"
            aria-label="ANTARA Global — Go to homepage"
          >
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

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-xl border border-border-gray bg-white px-3 py-2 text-sm font-semibold text-deep-navy hover:bg-light-gray transition-all duration-200"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-gold/15 to-gold/5 text-gold text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className={`h-4 w-4 text-medium-gray transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border-gray bg-white shadow-xl shadow-deep-navy/10 overflow-hidden"
                    >
                      <div className="border-b border-border-gray/60 px-4 py-3">
                        <p className="text-sm font-bold text-deep-navy truncate">{user.name}</p>
                        <p className="text-xs text-medium-gray/70 truncate">{user.email}</p>
                      </div>
                      <div className="p-1.5">
                        {userMenuLinks.map(link => {
                          const Icon = userMenuIcons[link.label] || User
                          return (
                            <Link
                              key={link.label}
                              href={link.href}
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-medium-gray hover:bg-light-gray hover:text-deep-navy transition-colors duration-150"
                            >
                              <Icon className="h-4 w-4 text-gold" />
                              {link.label}
                            </Link>
                          )
                        })}
                      </div>
                      <div className="border-t border-border-gray/60 p-1.5">
                        <button
                          onClick={() => { setUserMenuOpen(false); logout() }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-error hover:bg-error/5 transition-colors duration-150"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href={authLinks.login.href}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-medium-gray hover:text-deep-navy transition-colors duration-200"
                >
                  {authLinks.login.label}
                </Link>
                <Link
                  href={authLinks.register.href}
                  className="rounded-xl bg-gradient-to-r from-deep-navy to-deep-navy-light px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:from-deep-navy-light hover:to-deep-navy transition-all duration-300 shadow-lg shadow-deep-navy/15 hover:shadow-xl hover:shadow-deep-navy/25"
                >
                  {authLinks.register.label}
                </Link>
              </>
            )}
          </div>

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
            <div className="flex items-center justify-between border-b border-border-gray/60 px-5 py-4">
              <Link
                href="/"
                onClick={goHome}
                className="flex items-center gap-2 group cursor-pointer"
                aria-label="ANTARA Global — Go to homepage"
              >
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

            <div className="bg-deep-navy/4 px-5 py-2.5 text-[11px] font-medium tracking-wider text-medium-gray border-b border-border-gray/40">
              सर्वेषां वित्तज्ञानम् · Financial Knowledge for Everyone
            </div>

            {/* Mobile auth section */}
            <div className="border-b border-border-gray/40 px-4 py-4">
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold/15 to-gold/5 text-gold text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-deep-navy">{user.name}</p>
                      <p className="text-xs text-medium-gray/70">{user.email}</p>
                    </div>
                  </div>
                  <div className="pt-2 space-y-1">
                    {userMenuLinks.map(link => {
                      const Icon = userMenuIcons[link.label] || User
                      return (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={closeMobile}
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-medium-gray hover:bg-deep-navy/5 hover:text-deep-navy transition-colors duration-150"
                        >
                          <Icon className="h-4 w-4 text-gold" />
                          {link.label}
                        </Link>
                      )
                    })}
                    <button
                      onClick={() => { closeMobile(); logout() }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-error hover:bg-error/5 transition-colors duration-150"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href={authLinks.register.href}
                    onClick={closeMobile}
                    className="flex items-center justify-center rounded-xl bg-gradient-to-r from-deep-navy to-deep-navy-light px-4 py-3 text-sm font-bold text-white"
                  >
                    {authLinks.register.label}
                  </Link>
                  <Link
                    href={authLinks.login.href}
                    onClick={closeMobile}
                    className="flex items-center justify-center rounded-xl border border-border-gray px-4 py-3 text-sm font-bold text-medium-gray hover:text-deep-navy transition-colors"
                  >
                    {authLinks.login.label}
                  </Link>
                </div>
              )}
            </div>

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
