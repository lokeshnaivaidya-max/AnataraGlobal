import { motion } from 'framer-motion'
import { Link } from 'wouter'
import type { ReactNode } from 'react'

export default function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-16" style={{ backgroundColor: '#FFF8F2' }}>
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse-glow" style={{ backgroundColor: 'rgba(253,124,6,0.06)' }} />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full blur-3xl animate-pulse-glow" style={{ backgroundColor: 'rgba(253,124,6,0.06)', animationDelay: '2s' }} />
      </div>
      <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(to right, transparent, #FD7C06, transparent)' }} />

      <div className="relative mx-auto w-full max-w-lg px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <img
              src="/image.png"
              alt="Antara Global"
              className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-xl font-black tracking-tight" style={{ color: '#000000' }}>
              ANTARA{' '}
              <span className="font-light" style={{ color: '#FD7C06' }}>GLOBAL</span>
            </span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border p-8 sm:p-10 shadow-xl" style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.12)' }}
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: '#000000' }}>
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm" style={{ color: 'rgba(0,0,0,0.6)' }}>{subtitle}</p>
            )}
          </div>
          {children}
        </motion.div>
      </div>
    </section>
  )
}
