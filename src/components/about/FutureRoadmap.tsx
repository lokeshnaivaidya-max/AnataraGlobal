import { motion } from 'framer-motion'
import { Flag, Building2, Globe2, CheckCircle2 } from 'lucide-react'

const phases = [
  {
    icon: Flag,
    phase: 'Phase 01',
    title: 'Foundation',
    period: 'Establish the Framework',
    desc: 'Standardize advisory delivery, onboard founding ecosystem partners, and launch the core readiness methodology.',
    points: ['Advisory framework live', 'Founding partner cohort', 'Governance playbooks'],
  },
  {
    icon: Building2,
    phase: 'Phase 02',
    title: 'Expansion',
    period: 'Deepen the Ecosystem',
    desc: 'Scale the capital network, widen sector coverage, and formalize structured deal-flow between founders and investors.',
    points: ['150+ investor connections', 'Sector-specific playbooks', 'Regional advisory hubs'],
  },
  {
    icon: Globe2,
    phase: 'Phase 03',
    title: 'Global Scale',
    period: 'Institutionalize the Platform',
    desc: 'Operate as a globally recognized growth and capital-connectivity institution trusted by founders and institutions alike.',
    points: ['Cross-border capital access', 'Institutional-grade platform', 'Global partner network'],
  },
]

export default function FutureRoadmap() {
  return (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden" aria-labelledby="roadmap-heading">
      <div className="absolute top-0 right-0 w-1/2 h-px bg-gradient-to-l from-transparent via-gold/20 to-transparent" />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #081C3A 1px, transparent 0)', backgroundSize: '48px 48px' }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-8 bg-gold" />
            <span className="text-xs font-semibold tracking-widest uppercase text-gold">
              Future Roadmap
            </span>
            <span className="h-px w-8 bg-gold" />
          </div>
          <h2 id="roadmap-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-deep-navy tracking-tight">
            Our Path to Global Scale
          </h2>
          <p className="mt-4 text-medium-gray text-base leading-relaxed">
            A deliberate, three-phase expansion designed to compound trust, reach, and capital access over time.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-[52px] left-0 right-0 h-px bg-border-gray">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="h-full origin-left bg-gradient-to-r from-gold via-gold to-emerald"
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
                    <div className="h-6 w-6 rounded-full bg-white border-2 border-gold shadow-lg shadow-gold/20 flex items-center justify-center">
                      <span className="h-2 w-2 rounded-full bg-gold animate-pulse-glow" />
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    className="group relative rounded-3xl border border-border-gray bg-light-gray/60 backdrop-blur-xl p-7 sm:p-8 shadow-md hover:shadow-2xl hover:border-gold/30 transition-shadow duration-500 h-full"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-deep-navy to-deep-navy-dark text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[11px] font-black tracking-widest uppercase text-gold">
                        {item.phase}
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-deep-navy">{item.title}</h3>
                    <p className="mt-1 text-xs font-semibold text-emerald uppercase tracking-wide">{item.period}</p>
                    <p className="mt-4 text-xs text-medium-gray leading-relaxed">{item.desc}</p>

                    <ul className="mt-6 space-y-2.5 pt-6 border-t border-border-gray">
                      {item.points.map((point) => (
                        <li key={point} className="flex items-center gap-2.5 text-xs text-deep-navy font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5 text-gold shrink-0" />
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