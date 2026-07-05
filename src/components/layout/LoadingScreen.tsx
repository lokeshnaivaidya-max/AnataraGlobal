import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const SESSION_KEY = 'antara-loaded'
const LOADING_DURATION_MS = 2800

const TITLE = 'ANTARA GLOBAL'
const SUBTITLE = "Building Tomorrow's Growth"

type AssemblyParticle = {
  id: number
  angle: number
  radius: number
  size: number
  delay: number
}

type AmbientParticle = {
  id: number
  left: number
  top: number
  size: number
  delay: number
  duration: number
}

function generateAssemblyParticles(count: number): AssemblyParticle[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    angle: (id / count) * 360 + Math.random() * 12,
    radius: 70 + Math.random() * 90,
    size: 2.5 + Math.random() * 2,
    delay: Math.random() * 0.25,
  }))
}

function generateAmbientParticles(count: number): AmbientParticle[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 1.5 + Math.random() * 2.5,
    delay: Math.random() * 3,
    duration: 5 + Math.random() * 5,
  }))
}

/**
 * Cinematic entrance experience for ANTARA Global.
 *
 * Performance notes:
 * - Only `transform` and `opacity` are animated per-frame (GPU compositable).
 * - `filter: blur()` is used only as a static, non-animated style (cheap —
 *   computed once, not recomputed every frame) or on a single element at a
 *   time, never on dozens of particles simultaneously.
 * - No `box-shadow` animation — glow is done with radial-gradient fills.
 *
 * - No user interaction of any kind is required or accepted.
 * - Plays once per browser session (tracked via sessionStorage), then
 *   dissolves into the homepage.
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

  const assemblyParticles = useMemo(() => generateAssemblyParticles(18), [])
  const ambientParticles = useMemo(() => generateAmbientParticles(16), [])
  const titleChars = useMemo(() => TITLE.split(''), [])

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
            key="antara-cinematic-entrance"
            role="status"
            aria-live="polite"
            aria-label="Entering ANTARA Global"
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
            style={{
              background:
                'radial-gradient(circle at 50% 45%, #FFFDF9 0%, #FBF3E7 48%, #F5EBDA 100%)',
            }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Very soft ambient light — static blur, only opacity breathes */}
            <div
              aria-hidden
              className="absolute rounded-full"
              style={{
                width: 620,
                height: 620,
                background:
                  'radial-gradient(circle, rgba(206,160,65,0.12) 0%, rgba(206,160,65,0.03) 45%, rgba(206,160,65,0) 70%)',
                filter: 'blur(18px)',
                transform: 'translateZ(0)',
              }}
            />

            {/* Ambient floating particles — transform + opacity only */}
            <div className="absolute inset-0">
              {ambientParticles.map((p) => (
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
                    willChange: 'transform, opacity',
                  }}
                  animate={
                    prefersReducedMotion
                      ? { opacity: 0.2 }
                      : { y: [0, -22, 0], opacity: [0, 0.5, 0] }
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

            {/* Expanding circular waves — transform + opacity only */}
            {!prefersReducedMotion &&
              [0, 1, 2].map((i) => (
                <motion.div
                  key={`wave-${i}`}
                  aria-hidden
                  className="absolute rounded-full border"
                  style={{
                    width: 120,
                    height: 120,
                    borderColor: 'rgba(184,138,43,0.35)',
                    borderWidth: 1,
                    willChange: 'transform, opacity',
                  }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [0.8, 3.2], opacity: [0.35, 0] }}
                  transition={{
                    duration: 3.2,
                    delay: 0.9 + i * 1.05,
                    repeat: Infinity,
                    repeatDelay: 0.15,
                    ease: 'easeOut',
                  }}
                />
              ))}

            {/* Logo assembly particles — converge toward center, transform + opacity only */}
            <div className="relative flex items-center justify-center">
              {!prefersReducedMotion &&
                assemblyParticles.map((p) => {
                  const rad = (p.angle * Math.PI) / 180
                  const startX = Math.cos(rad) * p.radius
                  const startY = Math.sin(rad) * p.radius
                  return (
                    <motion.span
                      key={p.id}
                      className="absolute rounded-full"
                      style={{
                        width: p.size,
                        height: p.size,
                        background:
                          'radial-gradient(circle, rgba(206,160,65,1) 0%, rgba(206,160,65,0.4) 60%, rgba(206,160,65,0) 100%)',
                        willChange: 'transform, opacity',
                      }}
                      initial={{ x: startX, y: startY, opacity: 0 }}
                      animate={{ x: [startX, 0], y: [startY, 0], opacity: [0, 1, 0] }}
                      transition={{
                        duration: 0.85,
                        delay: p.delay,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                  )
                })}

              {/* Logo mark — spring arrival, no per-frame filter cost */}
              <motion.div
                className="relative z-10 overflow-hidden"
                style={{ willChange: 'transform, opacity' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  prefersReducedMotion
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 1, scale: 1, y: [0, -8, 0] }
                }
                transition={{
                  opacity: { duration: 0.5, delay: 0.5 },
                  scale: {
                    type: 'spring',
                    stiffness: 170,
                    damping: 15,
                    mass: 0.9,
                    delay: 0.5,
                  },
                  y: { duration: 3.6, delay: 1.5, repeat: prefersReducedMotion ? 0 : Infinity, ease: 'easeInOut' },
                }}
              >
                <img
                  src="/image.png"
                  alt="ANTARA Global"
                  className="h-auto w-[210px] sm:w-[250px] object-contain select-none"
                  draggable={false}
                />

                {/* Golden light sweep — transform only */}
                {!prefersReducedMotion && (
                  <motion.div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(105deg, transparent 38%, rgba(255,241,209,0.95) 50%, transparent 62%)',
                      mixBlendMode: 'overlay',
                      willChange: 'transform',
                    }}
                    initial={{ x: '-160%' }}
                    animate={{ x: '160%' }}
                    transition={{ duration: 1.1, delay: 1.15, ease: [0.4, 0, 0.2, 1] }}
                  />
                )}
              </motion.div>

              {/* Arrival pulse ring — a single quick flash the instant the logo lands */}
              {!prefersReducedMotion && (
                <motion.div
                  aria-hidden
                  className="absolute rounded-full border"
                  style={{
                    width: 140,
                    height: 140,
                    borderColor: 'rgba(206,160,65,0.55)',
                    borderWidth: 1.5,
                    willChange: 'transform, opacity',
                  }}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1.9, opacity: [0, 0.7, 0] }}
                  transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </div>

            {/* Title — character reveal, opacity + y only (no per-char blur) */}
            <div className="relative z-10 mt-7 flex flex-wrap justify-center px-4">
              {titleChars.map((char, i) => (
                <motion.span
                  key={`${char}-${i}`}
                  className="text-[22px] sm:text-[26px] font-black tracking-[0.12em] text-deep-navy"
                  style={{ display: 'inline-block', willChange: 'transform, opacity' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 1.45 + i * 0.03,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </div>

            {/* Subtitle — the one place a soft blur reveal is used (single element, one-time) */}
            <motion.p
              className="relative z-10 mt-2 text-[11px] sm:text-xs font-medium tracking-[0.22em] uppercase text-medium-gray"
              style={{ willChange: 'opacity, filter' }}
              initial={{ opacity: 0, filter: 'blur(6px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 1.45 + titleChars.length * 0.03 + 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {SUBTITLE}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={loading ? { opacity: 0, scale: 0.98 } : false}
        animate={{ opacity: loading ? 0 : 1, scale: loading ? 0.98 : 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: loading ? 0 : 0.1 }}
      >
        {children}
      </motion.div>
    </>
  )
}
