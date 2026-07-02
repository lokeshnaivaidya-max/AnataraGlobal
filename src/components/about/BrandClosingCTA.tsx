import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function BrandClosingCTA() {
  return (
    <section className="relative py-24 lg:py-32 bg-deep-navy overflow-hidden" aria-labelledby="closing-heading">
      <div className="absolute inset-0 bg-gradient-to-br from-deep-navy via-deep-navy to-deep-navy-dark" />
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gold/10 blur-3xl animate-float pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-emerald/10 blur-3xl animate-float pointer-events-none" style={{ animationDelay: '3s' }} />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)', backgroundSize: '44px 44px' }} />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-8">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            <span className="text-[11px] font-semibold tracking-widest uppercase text-white/70">
              Antara Global
            </span>
          </div>

          <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-3xl mx-auto">
            Antara Global is a strategic growth and capital-connectivity institution, built to structure businesses,
            strengthen investor readiness, and connect founders to a trusted global ecosystem of advisors, capital,
            and strategic partners.
          </p>
        </motion.div>

        <motion.h2
          id="closing-heading"
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white"
        >
          Structured today.
          <br />
          <span className="text-gradient-premium bg-gradient-to-r from-gold via-gold-light to-emerald bg-clip-text text-transparent">
            Investable tomorrow.
          </span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="#contact"
            whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(184,138,43,0.35)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-gold to-gold-dark px-8 py-4 text-sm font-bold text-white shadow-lg shadow-gold/20"
          >
            Start Your Growth Journey
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </motion.a>

          <motion.a
            href="#contact"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl px-8 py-4 text-sm font-bold text-white hover:bg-white/10 hover:border-white/25 transition-colors duration-300"
          >
            Talk to an Advisor
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}