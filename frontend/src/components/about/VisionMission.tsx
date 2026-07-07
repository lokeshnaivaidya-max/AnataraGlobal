import { motion } from 'framer-motion'
import { Eye, Target, ArrowRight } from 'lucide-react'

export default function VisionMission() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden" style={{ backgroundColor: '#000000' }}>
      <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, transparent, var(--color-accent), transparent)' }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-8" style={{ backgroundColor: 'var(--color-accent)' }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--color-accent)' }}>
              Strategic Direction
            </span>
            <span className="h-px w-8" style={{ backgroundColor: 'var(--color-accent)' }} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: '#FFFFFF' }}>
            Our Purpose & Compass
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative overflow-hidden rounded-3xl border p-8 sm:p-10 hover:-translate-y-1 transition-all duration-500"
            style={{ backgroundColor: '#000000', borderColor: 'var(--color-accent)' }}
          >
            <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(to right, var(--color-accent), rgba(0,128,129,0.3))' }} />
            <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-full pointer-events-none" style={{ background: 'linear-gradient(to bottom left, rgba(0,128,129,0.05), transparent)' }} />

            <div className="relative flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl mb-6 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300" style={{ backgroundColor: 'var(--color-accent-hover)', color: 'white' }}>
                <Eye className="h-7 w-7" />
              </div>
              <ArrowRight className="h-5 w-5 opacity-30 group-hover:opacity-60 group-hover:translate-x-1 transition-all duration-300" style={{ color: 'var(--color-accent-hover)' }} />
            </div>

            <h3 className="text-2xl font-extrabold transition-colors duration-300" style={{ color: 'var(--color-accent)' }}>Our Vision</h3>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              To build a globally trusted business ecosystem that empowers entrepreneurs, startups, and MSMEs through strategic guidance, financial knowledge, innovation, partnerships, and seamless capital connectivity.
            </p>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="group relative overflow-hidden rounded-3xl border p-8 sm:p-10 hover:-translate-y-1 transition-all duration-500"
            style={{ backgroundColor: '#000000', borderColor: 'var(--color-accent)' }}
          >
            <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(to right, var(--color-accent), rgba(0,128,129,0.3))' }} />
            <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-full pointer-events-none" style={{ background: 'linear-gradient(to bottom left, rgba(0,128,129,0.05), transparent)' }} />

            <div className="relative flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl mb-6 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300" style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}>
                <Target className="h-7 w-7" />
              </div>
              <ArrowRight className="h-5 w-5 opacity-30 group-hover:opacity-60 group-hover:translate-x-1 transition-all duration-300" style={{ color: 'var(--color-accent)' }} />
            </div>

            <h3 className="text-2xl font-extrabold transition-colors duration-300" style={{ color: 'var(--color-accent)' }}>Our Mission</h3>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              To help businesses strengthen their corporate foundations, improve funding readiness, access strategic partner opportunities, and achieve sustainable scale through advisor support, ecosystem collaboration, and secure investor networks.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
