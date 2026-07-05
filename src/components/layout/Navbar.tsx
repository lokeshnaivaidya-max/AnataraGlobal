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
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const [location, setLocation] = useLocation()

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
        className="fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-md transition-all duration-500"
        style={{ backgroundColor: '#FFF8F2', borderColor: 'rgba(0,0,0,0.12)' }}
      >
        <nav
          className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          <Link
            href="/"
            onClick={goHome}
            className="flex items-center shrink-0 group cursor-pointer"
            aria-label="ANTARA Global — Go to homepage"
          >
            <img
              src="/image.png"
              alt="ANTARA Global"
              className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navConfig.map((link) => {
              const isCurrent = link.href === '/' ? location === '/' : location.startsWith(link.href ?? '')
              return (
                <Link
                  key={link.label}
                  href={link.href ?? '/'}
                  className="nav-trigger relative px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all duration-200"
                  style={{ color: isCurrent ? '#FD7C06' : '#CEA041' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FD7C06'}
                  onMouseLeave={(e) => e.currentTarget.style.color = isCurrent ? '#FD7C06' : '#CEA041'}
                >
                  {link.label}
                  {isCurrent && (
                    <span className="absolute bottom-[-4px] left-0 h-0.5 w-full" style={{ backgroundColor: '#FD7C06' }} />
                  )}
                </Link>
              )
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-200"
                  style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.12)', color: '#000000' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold" style={{ backgroundColor: 'rgba(253,124,6,0.15)', color: '#FD7C06' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} style={{ color: 'rgba(0,0,0,0.5)' }} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-2xl border shadow-xl overflow-hidden"
                      style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.12)' }}
                    >
                      <div className="border-b px-4 py-3" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                        <p className="text-sm font-bold truncate" style={{ color: '#000000' }}>{user.name}</p>
                        <p className="text-xs truncate" style={{ color: 'rgba(0,0,0,0.5)' }}>{user.email}</p>
                      </div>
                      <div className="p-1.5">
                        {userMenuLinks.map(link => {
                          const Icon = userMenuIcons[link.label] || User
                          return (
                            <Link
                              key={link.label}
                              href={link.href}
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors duration-150"
                              style={{ color: '#CEA041' }}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = '#000000' }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#CEA041' }}
                            >
                              <Icon className="h-4 w-4" style={{ color: '#FD7C06' }} />
                              {link.label}
                            </Link>
                          )
                        })}
                      </div>
                      <div className="border-t p-1.5" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                        <button
                          onClick={() => { setUserMenuOpen(false); logout() }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors duration-150"
                          style={{ color: '#DC2626' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold border shadow-lg transition-all duration-300 hover:shadow-xl"
                  style={{ backgroundColor: 'rgba(206,160,65,0.08)', borderColor: 'rgba(206,160,65,0.25)', color: '#CEA041' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#CEA041'; e.currentTarget.style.color = '#FFFFFF' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(206,160,65,0.08)'; e.currentTarget.style.color = '#CEA041' }}
                >
                  {authLinks.login.label}
                </Link>
                <Link
                  href={authLinks.register.href}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold border shadow-lg transition-all duration-300 hover:shadow-xl"
                  style={{ backgroundColor: 'rgba(206,160,65,0.08)', borderColor: 'rgba(206,160,65,0.25)', color: '#CEA041' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#CEA041'; e.currentTarget.style.color = '#FFFFFF' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(206,160,65,0.08)'; e.currentTarget.style.color = '#CEA041' }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {authLinks.register.label}
                </Link>
              </>
            )}
          </div>

          <button
            className="lg:hidden p-2 rounded-lg transition-all duration-200"
            style={{ color: '#CEA041' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#FD7C06'; e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#CEA041'; e.currentTarget.style.backgroundColor = 'transparent' }}
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
            className="fixed inset-0 z-40 backdrop-blur-sm lg:hidden" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
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
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              <Link
                href="/"
                onClick={goHome}
                className="flex items-center group cursor-pointer"
                aria-label="ANTARA Global — Go to homepage"
              >
                <img
                  src="/image.png"
                  alt="ANTARA Global"
                  className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <button
                onClick={closeMobile}
                className="p-2 rounded-lg transition-all duration-200"
                style={{ color: '#CEA041' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#FD7C06'; e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#CEA041'; e.currentTarget.style.backgroundColor = 'transparent' }}
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 py-2.5 text-[11px] font-medium tracking-wider border-b" style={{ backgroundColor: 'rgba(0,0,0,0.04)', color: '#CEA041', borderColor: 'rgba(0,0,0,0.08)' }}>
              सर्वेषां वित्तज्ञानम् · Financial Knowledge for Everyone
            </div>

            {/* Mobile auth section */}
            <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold" style={{ backgroundColor: 'rgba(253,124,6,0.15)', color: '#FD7C06' }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: '#000000' }}>{user.name}</p>
                      <p className="text-xs" style={{ color: 'rgba(0,0,0,0.5)' }}>{user.email}</p>
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
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors duration-150"
                          style={{ color: '#CEA041' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = '#000000' }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#CEA041' }}
                        >
                          <Icon className="h-4 w-4" style={{ color: '#FD7C06' }} />
                          {link.label}
                        </Link>
                      )
                    })}
                    <button
                      onClick={() => { closeMobile(); logout() }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors duration-150"
                      style={{ color: '#DC2626' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
                    className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold border shadow-lg"
                    style={{ backgroundColor: 'rgba(206,160,65,0.08)', borderColor: 'rgba(206,160,65,0.25)', color: '#CEA041' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#CEA041'; e.currentTarget.style.color = '#FFFFFF' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(206,160,65,0.08)'; e.currentTarget.style.color = '#CEA041' }}
                  >
                    {authLinks.register.label}
                  </Link>
                  <Link
                    href={authLinks.login.href}
                    onClick={closeMobile}
                    className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold border shadow-lg"
                    style={{ backgroundColor: 'rgba(206,160,65,0.08)', borderColor: 'rgba(206,160,65,0.25)', color: '#CEA041' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#CEA041'; e.currentTarget.style.color = '#FFFFFF' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(206,160,65,0.08)'; e.currentTarget.style.color = '#CEA041' }}
                  >
                    {authLinks.login.label}
                  </Link>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
            {navConfig.map((link) => {
              const isCurrent = link.href === '/' ? location === '/' : location.startsWith(link.href ?? '')
              return (
                <Link
                  key={link.label}
                  href={link.href ?? '/'}
                  onClick={closeMobile}
                  className="flex items-center rounded-xl px-4 py-3.5 text-sm font-bold uppercase tracking-wider transition-all duration-150"
                  style={{ color: isCurrent ? '#FD7C06' : '#CEA041', backgroundColor: isCurrent ? 'rgba(253,124,6,0.08)' : 'transparent' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#FD7C06'; e.currentTarget.style.backgroundColor = 'rgba(253,124,6,0.08)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = isCurrent ? '#FD7C06' : '#CEA041'; e.currentTarget.style.backgroundColor = isCurrent ? 'rgba(253,124,6,0.08)' : 'transparent' }}
                >
                  {link.label}
                </Link>
              )
            })}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
