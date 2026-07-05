import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
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
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-deep-navy via-deep-navy-dark to-deep-navy pt-28 pb-16">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-gold/8 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-emerald/8 blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-deep-navy-light/10 blur-3xl" />
      </div>
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="relative mx-auto w-full max-w-lg px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="relative flex items-center">
              <Sparkles className="h-5 w-5 text-gold" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-gold/40 animate-pulse-glow" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              ANTARA{' '}
              <span className="font-light text-gold">GLOBAL</span>
            </span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 sm:p-10"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm text-white/60">{subtitle}</p>
            )}
          </div>
          {children}
        </motion.div>
      </div>
    </section>
  )
}
