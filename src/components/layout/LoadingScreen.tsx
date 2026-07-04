import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const SESSION_KEY = 'antara-loaded'
const LOADING_DURATION_MS = 2600

type Particle = {
  id: number
  left: number
  top: number
  size: number
  delay: number
  duration: number
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 2 + Math.random() * 3,
    delay: Math.random() * 3,
    duration: 4 + Math.random() * 4,
  }))
}

/**
 * Premium, fully-automatic loading screen for ANTARA Global.
 *
 * - No user interaction of any kind is required or accepted.
 * - Plays once per browser session (tracked via sessionStorage), then
 *   reveals the site content with a scale + opacity transition.
 * - Purely presentational: does not alter any homepage/page content.
 */
export default function LoadingScreen({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion()

  const [loading, setLoading] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    try {
      return window.sessionStorage.getItem(SESSION_KEY) !== 'true'
    } catch {
      return true
    }
  })

  const particles = useMemo(() => generateParticles(16), [])

  useEffect(() => {
    if (!loading) return
    const timer = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(SESSION_KEY, 'true')
      } catch {
        /* sessionStorage unavailable — still proceed to reveal content */
      }
      setLoading(false)
    }, LOADING_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [loading])

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="antara-loading-screen"
            role="status"
            aria-live="polite"
            aria-label="Preparing your growth journey"
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
            style={{
              background:
                'radial-gradient(circle at 50% 42%, #FFFFFF 0%, #FBF8F0 45%, #F7F1E4 100%)',
            }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Ambient particles */}
            <div className="absolute inset-0">
              {particles.map((p) => (
                <motion.span
                  key={p.id}
                  className="absolute rounded-full"
                  style={{
                    left: `${p.left}%`,
                    top: `${p.top}%`,
                    width: p.size,
                    height: p.size,
                    background:
                      'radial-gradient(circle, rgba(184,138,43,0.55) 0%, rgba(184,138,43,0) 75%)',
                  }}
                  animate={
                    prefersReducedMotion
                      ? { opacity: 0.25 }
                      : { y: [0, -28, 0], opacity: [0, 0.55, 0] }
                  }
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    repeat: prefersReducedMotion ? 0 : Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>

            {/* Soft golden glow behind the logo */}
            <motion.div
              aria-hidden
              className="absolute rounded-full"
              style={{
                width: 320,
                height: 320,
                background:
                  'radial-gradient(circle, rgba(184,138,43,0.32) 0%, rgba(184,138,43,0.08) 45%, rgba(184,138,43,0) 72%)',
                filter: 'blur(6px)',
              }}
              animate={
                prefersReducedMotion
                  ? { opacity: 0.6 }
                  : { scale: [1, 1.14, 1], opacity: [0.55, 0.85, 0.55] }
              }
              transition={{ duration: 3, repeat: prefersReducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
            />

            {/* Logo mark — gently floating */}
            <motion.div
              className="relative z-10 flex flex-col items-center"
              animate={prefersReducedMotion ? {} : { y: [0, -8, 0] }}
              transition={{ duration: 3.4, repeat: prefersReducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
            >
              <div className="relative overflow-hidden">
                <img
                  src="/image.png"
                  alt="ANTARA Global"
                  className="h-auto w-[220px] sm:w-[260px] object-contain select-none"
                  draggable={false}
                />

                {/* Light sweep passing across the logo */}
                {!prefersReducedMotion && (
                  <motion.div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.9) 50%, transparent 65%)',
                      mixBlendMode: 'overlay',
                    }}
                    initial={{ x: '-160%' }}
                    animate={{ x: '160%' }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 2.4,
                      ease: 'easeInOut',
                    }}
                  />
                )}
              </div>
            </motion.div>

            {/* Thin premium loading line */}
            <div className="relative z-10 mt-9 flex flex-col items-center gap-4">
              <div className="relative h-[2px] w-44 overflow-hidden rounded-full bg-border-gray/70">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #8C6A1D, #B88A2B, #CEA041)' }}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: LOADING_DURATION_MS / 1000 - 0.2, ease: [0.65, 0, 0.35, 1] }}
                />
              </div>

              <motion.p
                className="text-[11px] sm:text-xs font-medium tracking-[0.18em] uppercase text-medium-gray"
                animate={prefersReducedMotion ? { opacity: 0.85 } : { opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.8, repeat: prefersReducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
              >
                Preparing Your Growth Journey
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={loading ? { opacity: 0, scale: 0.98 } : false}
        animate={{ opacity: loading ? 0 : 1, scale: loading ? 0.98 : 1 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: loading ? 0 : 0.05 }}
      >
        {children}
      </motion.div>
    </>
  )
}
