import { motion } from 'framer-motion'
import {
  Compass, BarChart3, ShieldCheck, Network, TrendingUp, Building2, Quote
} from 'lucide-react'

const problems = [
  {
    icon: Compass,
    label: 'Strategic Direction',
    desc: 'Eliminating ambiguous vision and ad-hoc execution through structured 3-year strategic growth roadmaps.'
  },
  {
    icon: BarChart3,
    label: 'Financial Preparedness',
    desc: 'Correcting poor financial hygiene and lack of bookkeeping with investor-grade 3-statement models.'
  },
  {
    icon: ShieldCheck,
    label: 'Investor Readiness',
    desc: 'Solving lack of structured due diligence materials and weak narratives with secure deal rooms.'
  },
  {
    icon: Network,
    label: 'Targeted Networks',
    desc: 'Overcoming isolation by connecting founders with curated, vetted venture capitals and angels.'
  },
  {
    icon: TrendingUp,
    label: 'Scalable Systems',
    desc: 'Replacing founder-dependent systems with repeatable customer acquisition and operational workflows.'
  },
  {
    icon: Building2,
    label: 'Governance Structure',
    desc: 'Strengthening legal bylaws, clean cap tables, and board governance to eliminate transaction friction.'
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function PhilosophySection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden" style={{ backgroundColor: '#FFF8F2' }}>
      <div className="absolute bottom-0 right-0 w-1/2 h-px bg-gradient-to-l from-transparent via-black/10 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Why We Exist */}
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-16 lg:mb-20">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8" style={{ backgroundColor: 'var(--color-accent)' }} />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--color-accent)' }}>Why We Exist</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-black tracking-tight leading-tight">
              Bridging the Gap Between Concept and Capital
            </h2>
            <p className="mt-4 text-black/60 text-base leading-relaxed">
              We started Antara Global because we noticed a recurring tragedy: brilliant businesses with validated products failing to secure growth capital simply because they lacked the proper foundational governance and investor-readiness materials.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl border p-8 sm:p-10 shadow-xl overflow-hidden group transition-all duration-300" style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.1)' }}>
              <Quote className="absolute -top-4 -left-2 h-16 w-16 pointer-events-none" style={{ color: 'var(--color-accent-hover)', opacity: 0.1 }} />
              <div className="relative">
                <p className="text-base sm:text-lg italic leading-relaxed font-semibold pl-6 border-l-2" style={{ color: '#000000', borderColor: 'var(--color-accent)' }}>
                  &ldquo;Many businesses do not struggle because they lack ideas or markets. They struggle because they lack the structure required to sustain growth.&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-2 pl-6">
                  <span className="h-0.5 w-4" style={{ backgroundColor: 'var(--color-accent-hover)' }} />
                  <span className="text-xs font-bold text-black">Antara Founding Philosophy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Pillars Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {problems.map((item) => (
            <motion.div
              key={item.label}
              variants={cardVariants}
              className="group relative rounded-2xl border p-6 hover:-translate-y-1 transition-all duration-300"
              style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.1)' }}
            >
              <div className="absolute top-0 left-0 w-full h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" style={{ background: 'linear-gradient(to right, var(--color-accent), transparent)' }} />
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border group-hover:scale-110 transition-all duration-300" style={{ backgroundColor: 'var(--color-accent-hover)', color: 'white', borderColor: 'transparent' }}>
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-sm text-black">{item.label}</h3>
                <p className="mt-2 text-xs text-black/60 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Closing CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="relative inline-block max-w-2xl w-full group">
            <div className="absolute -inset-1 rounded-3xl blur-md group-hover:blur-lg transition-all duration-500" style={{ background: 'linear-gradient(to right, rgba(0,128,129,0.2), rgba(252,158,0,0.1), rgba(0,128,129,0.2))' }} />
            <div className="relative rounded-3xl p-8 sm:p-10 border overflow-hidden" style={{ backgroundColor: '#FFFFFF', borderColor: '#000000' }}>
              <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, transparent, #000000, transparent)' }} />
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-black/5 blur-2xl animate-float" />
              <p className="text-sm sm:text-base font-semibold leading-relaxed max-w-lg mx-auto" style={{ color: '#000000' }}>
                We believe that structured, compliant, and transparent businesses will naturally attract capital. Our advisory acts as the catalyst to unlock that potential.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
