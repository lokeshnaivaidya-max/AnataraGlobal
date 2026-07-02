import { motion } from 'framer-motion'
import { Compass, ShieldCheck, Network, Rocket, ArrowUpRight } from 'lucide-react'

const pillars = [
  {
    icon: Compass,
    tag: '01',
    title: 'Strategy',
    desc: 'Clarifying vision, positioning, and a defensible growth roadmap so every decision compounds toward the same outcome.',
    accent: 'gold',
  },
  {
    icon: ShieldCheck,
    tag: '02',
    title: 'Readiness',
    desc: 'Building investor-grade governance, financial hygiene, and due-diligence infrastructure ahead of capital conversations.',
    accent: 'emerald',
  },
  {
    icon: Network,
    tag: '03',
    title: 'Connectivity',
    desc: 'Opening direct access to vetted advisors, venture capital, angel syndicates, and strategic ecosystem partners.',
    accent: 'gold',
  },
  {
    icon: Rocket,
    tag: '04',
    title: 'Scale',
    desc: 'Installing repeatable systems and leadership structures that let the business grow without founder bottlenecks.',
    accent: 'emerald',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function GrowthFramework() {
  return (
    <section className="relative py-24 lg:py-32 bg-light-gray overflow-hidden" aria-labelledby="growth-framework-heading">
      <div className="absolute top-1/4 left-0 w-72 h-72 rounded-full bg-gold/5 blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 rounded-full bg-emerald/5 blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2.5s' }} />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-8 bg-gold" />
            <span className="text-xs font-semibold tracking-widest uppercase text-gold">
              The Growth Framework
            </span>
            <span className="h-px w-8 bg-gold" />
          </div>
          <h2 id="growth-framework-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-deep-navy tracking-tight">
            Four Pillars of Structured Growth
          </h2>
          <p className="mt-4 text-medium-gray text-base leading-relaxed">
            A disciplined, repeatable methodology that moves a business from ambiguity to institutional-grade scale.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {pillars.map((pillar) => {
            const Icon = pillar.icon
            const isGold = pillar.accent === 'gold'
            return (
              <motion.div
                key={pillar.title}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="group relative rounded-3xl border border-border-gray bg-white/70 backdrop-blur-xl p-7 shadow-md hover:shadow-2xl transition-shadow duration-500"
              >
                <div
                  className={`absolute top-0 left-0 w-full h-1 rounded-t-3xl bg-gradient-to-r ${
                    isGold ? 'from-gold via-gold/40' : 'from-emerald via-emerald/40'
                  } to-transparent`}
                />
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:scale-110 ${
                      isGold
                        ? 'bg-gradient-to-br from-gold/15 to-gold/5 text-gold border-gold/15 group-hover:shadow-lg group-hover:shadow-gold/20'
                        : 'bg-gradient-to-br from-emerald/15 to-emerald/5 text-emerald border-emerald/15 group-hover:shadow-lg group-hover:shadow-emerald/20'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[11px] font-black text-medium-gray/40 tracking-widest">{pillar.tag}</span>
                </div>

                <h3 className={`mt-6 text-lg font-extrabold text-deep-navy transition-colors duration-300 ${isGold ? 'group-hover:text-gold' : 'group-hover:text-emerald'}`}>
                  {pillar.title}
                </h3>
                <p className="mt-3 text-xs text-medium-gray leading-relaxed">
                  {pillar.desc}
                </p>

                <ArrowUpRight className={`mt-5 h-4 w-4 opacity-0 -translate-y-1 group-hover:opacity-60 group-hover:translate-y-0 transition-all duration-300 ${isGold ? 'text-gold' : 'text-emerald'}`} />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}