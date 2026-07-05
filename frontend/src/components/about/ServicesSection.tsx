import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Building2, LineChart, Briefcase, CheckCircle2, 
  ArrowRight, ShieldCheck, Sparkles
} from 'lucide-react'

const services = [
  {
    id: 'advisory',
    icon: Building2,
    title: 'Business Advisory',
    subtitle: 'Strategic Foundation & Scaling',
    description: 'We work closely with founders to refine their business model, optimize operations, and build a sustainable strategy for scale.',
    benefits: [
      'Business Model Canvas & Validation',
      'Go-To-Market (GTM) Strategy',
      'Operational Efficiency Consulting',
      'Corporate Governance Frameworks',
    ],
    metric: '45%',
    metricLabel: 'Average Efficiency Gain',
    color: 'emerald',
    gradient: 'from-emerald/20 via-emerald/5 to-transparent',
    accentColor: 'text-emerald',
  },
  {
    id: 'readiness',
    icon: LineChart,
    title: 'Venture Readiness',
    subtitle: 'Preparing for the Spotlight',
    description: 'We structure your financial models, pitch narratives, and legal frameworks to meet the expectations of sophisticated investors.',
    benefits: [
      'Professional Pitch Deck Creation',
      'Dynamic Financial Modeling (3-5 Year)',
      'Data Room Setup & Due Diligence Prep',
      'Valuation Advisory & Deal Structuring',
    ],
    metric: '10x',
    metricLabel: 'Faster Due Diligence',
    color: 'gold',
    gradient: 'from-gold/20 via-gold/5 to-transparent',
    accentColor: 'text-gold-light',
  },
  {
    id: 'connectivity',
    icon: Briefcase,
    title: 'Capital Connectivity',
    subtitle: 'Unlocking Global Capital',
    description: 'We connect growth-ready and investment-ready businesses with institutional investors, venture capitals, and angel networks.',
    benefits: [
      'Targeted Investor Matchmaking',
      'Warm Introductions to VC & Angels',
      'Roadshow Preparation & Pitch Coaching',
      'Post-Funding Strategic Guidance',
    ],
    metric: '$80M+',
    metricLabel: 'Capital Network Access',
    color: 'navy',
    gradient: 'from-gold/20 via-emerald/10 to-transparent',
    accentColor: 'text-white',
  },
]

export default function ServicesSection() {
  const [activeTab, setActiveTab] = useState('advisory')

  const currentService = services.find((s) => s.id === activeTab) || services[0]
  const IconComponent = currentService.icon

  return (
    <section id="services" className="relative py-24 lg:py-32 bg-deep-navy overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-gold/5 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 rounded-full bg-emerald/5 blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-medium text-gold-light border border-gold/20 mb-4 shadow-lg shadow-gold/5"
          >
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Our Offerings
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight"
          >
            Empowering Growth at Every Stage
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-white/60 text-lg"
          >
            We bridge the gap between structure, strategy, and capital to elevate startups and MSMEs.
          </motion.p>
        </div>

        {/* Tab Selection buttons */}
        <div className="flex flex-col lg:flex-row gap-12 items-stretch">
          <div className="lg:w-1/3 flex flex-col gap-4 justify-center">
            {services.map((service) => {
              const ServiceIcon = service.icon
              const isActive = activeTab === service.id
              return (
                <button
                  key={service.id}
                  onClick={() => setActiveTab(service.id)}
                  className={`group relative text-left p-6 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${
                    isActive
                      ? 'bg-white/[0.07] border-gold/30 shadow-xl shadow-gold/5'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeBorder" 
                      className="absolute inset-0 rounded-2xl border-2 border-gold/40 pointer-events-none" 
                    />
                  )}
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                    isActive 
                      ? 'bg-gold/20 border-gold/30 text-gold-light scale-105' 
                      : 'bg-white/5 border-white/10 text-white/50 group-hover:text-white/80 group-hover:border-white/20'
                  }`}>
                    <ServiceIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold text-base transition-colors ${
                      isActive ? 'text-white' : 'text-white/70 group-hover:text-white'
                    }`}>
                      {service.title}
                    </h3>
                    <p className="text-xs text-white/40 mt-1 leading-relaxed">{service.subtitle}</p>
                  </div>
                  <ArrowRight className={`h-4 w-4 shrink-0 transition-transform duration-300 mt-1 ${
                    isActive ? 'text-gold translate-x-1' : 'text-white/20 group-hover:text-white/40'
                  }`} />
                </button>
              )
            })}
          </div>

          {/* Active Tab Details */}
          <div className="flex-1 lg:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="h-full rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Glow Backdrop */}
                <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-b ${currentService.gradient} blur-3xl opacity-60 pointer-events-none`} />

                <div>
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <span className={`text-xs font-semibold tracking-wider uppercase ${
                        currentService.color === 'emerald' ? 'text-emerald-light' : 'text-gold-light'
                      }`}>
                        {currentService.subtitle}
                      </span>
                      <h3 className="text-3xl font-bold text-white mt-2 flex items-center gap-3">
                        <IconComponent className={`h-8 w-8 ${
                          currentService.color === 'emerald' ? 'text-emerald-light' : 'text-gold'
                        }`} />
                        {currentService.title}
                      </h3>
                    </div>

                    <div className="flex flex-col items-end bg-white/5 border border-white/10 rounded-2xl px-5 py-3 shadow-inner">
                      <span className={`text-3xl font-extrabold ${
                        currentService.color === 'emerald' ? 'text-emerald-light' : 'text-gold-light'
                      }`}>
                        {currentService.metric}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-white/40 mt-0.5">{currentService.metricLabel}</span>
                    </div>
                  </div>

                  <p className="mt-6 text-white/70 text-base leading-relaxed max-w-2xl">
                    {currentService.description}
                  </p>

                  <div className="mt-8 border-t border-white/10 pt-8">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-5">
                      Key Deliverables & Outcomes
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {currentService.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-3 group">
                          <CheckCircle2 className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                          <span className="text-sm text-white/80 group-hover:text-white transition-colors">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <ShieldCheck className="h-4 w-4 text-emerald" />
                    <span>Structured, NDA-protected advisory</span>
                  </div>
                  <a
                    href="#consultation"
                    className="inline-flex items-center gap-2 rounded-xl bg-white text-deep-navy px-6 py-3 text-sm font-semibold hover:bg-gold-light hover:text-deep-navy hover:scale-105 transition-all duration-300 shadow-lg shadow-white/5 hover:shadow-gold/20"
                  >
                    Get Started with {currentService.title}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
