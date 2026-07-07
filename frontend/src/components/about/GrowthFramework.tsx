import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Building2, Compass, ShieldCheck, TrendingUp, Globe } from 'lucide-react'

const flowSteps = [
  { step: '01', icon: Building2, label: 'Business' },
  { step: '02', icon: Compass, label: 'Strategy' },
  { step: '03', icon: ShieldCheck, label: 'Readiness' },
  { step: '04', icon: TrendingUp, label: 'Capital' },
  { step: '05', icon: Globe, label: 'Growth' },
]

export default function GrowthFramework() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden" style={{ backgroundColor: '#FFF8F2' }}>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold border mb-4 text-white" style={{ backgroundColor: '#000000', borderColor: '#000000' }}>
            <Sparkles className="h-3.5 w-3.5" />
            Premium Ecosystem Services
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            <span style={{ color: 'var(--color-accent)' }}>Strategic Guidance.</span><br />
            <span style={{ color: 'var(--color-accent)' }}>Capital Readiness.</span><br />
            <span style={{ color: 'var(--color-accent)' }}>Sustainable Growth.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(0,0,0,0.6)' }}>
            Antara Global helps businesses strengthen their foundations, prepare for opportunities, connect with relevant ecosystems, and build scalable growth through strategy, knowledge, partnerships, and capital connectivity.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="#consultation" className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg hover:scale-105 transition-all duration-300" style={{ backgroundColor: '#000000' }}>
              Book Consultation
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#services" className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg hover:scale-105 transition-all duration-300" style={{ backgroundColor: '#000000' }}>
              Explore Our Ecosystem
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>

        {/* Ecosystem Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative rounded-3xl p-8 sm:p-10 shadow-2xl overflow-hidden" style={{ backgroundColor: '#000000' }}
        >
          <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, var(--color-accent), transparent)' }} />

          <div className="relative">
            <div className="flex items-center gap-3 mb-8 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold border" style={{ backgroundColor: '#000000', borderColor: 'var(--color-accent)', color: '#FFFFFF' }}>∞</div>
              <h3 className="text-sm font-bold text-white tracking-wide">Ecosystem Flow</h3>
              <span className="text-[10px] text-white/50 ml-auto hidden sm:block">From foundation to growth</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {flowSteps.map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={item.step} className="relative flex flex-col items-center text-center group">
                    {i < flowSteps.length - 1 && (
                      <div className="hidden sm:block absolute top-5 left-[60%] w-[calc(80%)] h-px" style={{ borderTop: '1px dashed rgba(255,255,255,0.25)' }} />
                    )}
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg text-xs font-black transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl border" style={{ backgroundColor: '#000000', borderColor: '#FFFFFF', color: '#FFFFFF' }}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-bold mt-2 mb-0.5 text-white/60">{item.step}</span>
                    <span className="text-xs font-bold text-white">{item.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
