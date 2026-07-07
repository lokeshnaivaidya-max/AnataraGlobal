import { motion } from 'framer-motion'
import { Flag, Building2, Globe2, CheckCircle2 } from 'lucide-react'

const phases = [
  {
    icon: Flag,
    phase: 'Phase 01',
    title: 'Foundation & Advisory Ecosystem',
    desc: 'Building the foundation by helping businesses become structured, prepared, and growth-ready.',
    points: [
      'Advisory Services',
      'Funding Readiness Assessments',
      'Fundraising Support',
      'Workshops & Events',
      'Knowledge Hub',
      'Partner Network Development',
    ],
  },
  {
    icon: Building2,
    phase: 'Phase 02',
    title: 'Digital Ecosystem Expansion',
    desc: 'Creating technology-enabled tools to improve business collaboration and ecosystem access.',
    points: [
      'Founder Dashboard',
      'Investor Engagement Portal',
      'Advisory Progress Tracking',
      'Document Management System',
      'Ecosystem Marketplace',
    ],
  },
  {
    icon: Globe2,
    phase: 'Phase 03',
    title: 'Global Growth Network',
    desc: 'Building a global platform connecting businesses, knowledge, innovation, and capital.',
    points: [
      'Venture Readiness Platform',
      'Global Strategic Partnerships',
      'Innovation & Capital Network Expansion',
      'Technology-Enabled Ecosystem Services',
    ],
  },
]

export default function FutureRoadmap() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden" style={{ backgroundColor: '#FFFFFF' }} aria-labelledby="roadmap-heading">
      <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(0,128,129,0.15), transparent)' }} />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #000000 1px, transparent 0)', backgroundSize: '48px 48px' }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-8" style={{ backgroundColor: 'var(--color-accent)' }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--color-accent)' }}>
              Future Roadmap
            </span>
            <span className="h-px w-8" style={{ backgroundColor: 'var(--color-accent)' }} />
          </div>
          <h2 id="roadmap-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight" style={{ color: '#000000' }}>
            Building The Future Business Ecosystem
          </h2>
          <p className="mt-4 text-base leading-relaxed" style={{ color: 'rgba(0,0,0,0.5)' }}>
            A deliberate, three-phase expansion designed to compound trust, reach, and capital access over time.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-[52px] left-0 right-0 h-px" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="h-full origin-left"
              style={{ background: 'linear-gradient(to right, var(--color-accent), var(--color-accent-light))' }}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-10 lg:gap-8">
            {phases.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.phase}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="relative"
                >
                  <div className="hidden lg:flex relative z-10 h-[26px] items-center mb-6">
                    <div className="h-6 w-6 rounded-full border-2 flex items-center justify-center"
                      style={{ backgroundColor: '#FFFFFF', borderColor: 'var(--color-accent)', boxShadow: '0 0 16px rgba(0,128,129,0.2)' }}>
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--color-accent)' }} />
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    className="group relative rounded-3xl p-7 sm:p-8 shadow-md hover:shadow-2xl transition-all duration-500 h-full"
                    style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)' }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: '#000000', color: '#FFFFFF' }}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[11px] font-black tracking-widest uppercase" style={{ color: 'var(--color-accent-light)' }}>
                        {item.phase}
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold" style={{ color: '#000000' }}>{item.title}</h3>
                    <p className="mt-4 text-xs leading-relaxed" style={{ color: 'rgba(0,0,0,0.5)' }}>{item.desc}</p>

                    <ul className="mt-6 space-y-2.5 pt-6" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                      {item.points.map((point) => (
                        <li key={point} className="flex items-center gap-2.5 text-xs font-medium" style={{ color: '#000000' }}>
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--color-accent)' }} />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}