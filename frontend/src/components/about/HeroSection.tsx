import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, Play, Sparkles, TrendingUp, Shield, Users, Zap, 
  CheckCircle2
} from 'lucide-react'

const ecosystemSteps = [
  { 
    letter: 'B', 
    label: 'Business', 
    desc: 'Strategy & Foundation', 
    color: 'emerald', 
    icon: TrendingUp,
    accent: 'emerald-light',
    metrics: {
      title: 'Structural Validation',
      status: 'Ready',
      detail: 'GTM Strategy & Corporate Governance verified.',
      features: ['Entity Structure Setup', 'Model Canvas Validation', 'Moat Analysis'],
      stat: '98%',
      statLabel: 'Foundation Strength'
    }
  },
  { 
    letter: 'A', 
    label: 'Advisors', 
    desc: 'Expert Guidance', 
    color: 'gold', 
    icon: Users,
    accent: 'gold',
    metrics: {
      title: 'Advisor Matching',
      status: 'Active Match',
      detail: 'Assigned sector specialists for weekly sprints.',
      features: ['Ex-Founders Mentoring', 'Compliance Oversight', 'Pitch Deck Drilling'],
      stat: '24h',
      statLabel: 'Average Response'
    }
  },
  { 
    letter: 'I', 
    label: 'Investors', 
    desc: 'Capital & Networks', 
    color: 'white', 
    icon: Shield,
    accent: 'white',
    metrics: {
      title: 'Investor Matching',
      status: 'Connected',
      detail: 'Active matchmaking across 200+ partner network.',
      features: ['Warm VC Introductions', 'Angel Syndicate Access', 'Secure Deal Room'],
      stat: '220+',
      statLabel: 'Investor Networks'
    }
  },
  { 
    letter: 'G', 
    label: 'Growth', 
    desc: 'Sustainable Success', 
    color: 'emerald', 
    icon: Zap,
    accent: 'emerald',
    metrics: {
      title: 'Scale & Metric Hub',
      status: 'Operational',
      detail: 'Scalable processes to achieve financial targets.',
      features: ['Unit Economics Audit', 'Market Expansion Prep', 'Hiring Frameworks'],
      stat: '3.4x',
      statLabel: 'Avg Revenue Growth'
    }
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function HeroSection() {
  const [activeStep, setActiveStep] = useState(0)

  // Auto-cycle through steps unless hovered/clicked
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % ecosystemSteps.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const currentStep = ecosystemSteps[activeStep]
  const StepIcon = currentStep.icon

  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-gradient-to-br from-deep-navy via-deep-navy-dark to-deep-navy pt-24 pb-16">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-emerald/15 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-[30rem] h-[30rem] rounded-full bg-gold/10 blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-gold/5 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-emerald/5 blur-2xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      {/* Top Border Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald via-gold to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline */}
          <div className="lg:col-span-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col"
            >
              <motion.div 
                variants={itemVariants} 
                className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold text-gold-light border border-gold/20 mb-6 shadow-lg shadow-gold/5 w-fit"
              >
                <Sparkles className="h-3.5 w-3.5 text-gold animate-spin-slow" />
                <span>Antara Global Advisory Platform</span>
              </motion.div>

              <motion.h1 
                variants={itemVariants} 
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white tracking-tight"
              >
                Building Growth-Ready &{' '}
                <span className="bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent drop-shadow-sm">
                  Investment-Ready
                </span>{' '}
                Businesses
              </motion.h1>

              <motion.p 
                variants={itemVariants} 
                className="mt-6 text-base sm:text-lg text-white/70 leading-relaxed max-w-xl"
              >
                Antara Global is a strategic business advisory, venture readiness, fundraising
                support, and capital connectivity ecosystem helping startups, MSMEs, entrepreneurs,
                and growth-stage businesses prepare, connect, and grow.
              </motion.p>

              <motion.div 
                variants={itemVariants} 
                className="mt-8 flex flex-wrap gap-4"
              >
                <a
                  href="#services"
                  className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-dark px-6 py-3.5 text-sm font-semibold text-deep-navy shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30 hover:scale-105 transition-all duration-300"
                >
                  Explore Services
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#consultation"
                  className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/25 hover:scale-105 transition-all duration-300"
                >
                  <Play className="h-4 w-4 fill-white/10" />
                  Book Strategy Session
                </a>
              </motion.div>

              {/* Trusted Indicators */}
              <motion.div 
                variants={itemVariants} 
                className="mt-12 flex items-center gap-6 text-white/50 text-xs"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-9 w-9 rounded-full border-2 border-deep-navy bg-gradient-to-br from-deep-navy-light to-deep-navy flex items-center justify-center text-[10px] font-bold text-gold border-gold/10 shadow-lg"
                    >
                      {['IN', 'EU', 'US', 'ME'][i-1]}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-white/70">Global Connectivity</span>
                  <span className="tracking-wide text-[10px] mt-0.5 text-white/40">Serving Founders & Investors Worldwide</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: Interactive Ecosystem Dashboard */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full max-w-xl mx-auto"
            >
              {/* Premium Glow Aura */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-gold/20 via-emerald/10 to-transparent blur-md pointer-events-none" />

              <div className="relative rounded-3xl bg-white/[0.03] backdrop-blur-md border border-white/10 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row gap-6 items-stretch">
                
                {/* Steps Selector Column */}
                <div className="flex md:flex-col justify-between md:justify-center gap-3">
                  {ecosystemSteps.map((step, idx) => {
                    const Icon = step.icon
                    const isSelected = activeStep === idx
                    return (
                      <button
                        key={step.letter}
                        onClick={() => setActiveStep(idx)}
                        className={`h-12 w-12 rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 relative ${
                          isSelected
                            ? step.accent === 'gold' 
                              ? 'bg-gold/20 border-gold text-gold-light scale-110 shadow-lg shadow-gold/10'
                              : 'bg-emerald/20 border-emerald text-emerald-light scale-110 shadow-lg shadow-emerald/10'
                            : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-[9px] font-bold mt-0.5">{step.letter}</span>
                        {isSelected && (
                          <span className={`absolute -right-1.5 top-1/2 -translate-y-1/2 hidden md:block h-3 w-3 rotate-45 border-r border-t ${
                            step.accent === 'gold' ? 'border-gold bg-gold/20' : 'border-emerald bg-emerald/20'
                          }`} />
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Dashboard Details Screen */}
                <div className="flex-1 rounded-2xl bg-deep-navy-dark/60 border border-white/5 p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-white/[0.02] blur-xl" />
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                          {currentStep.label} Node Status
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          currentStep.accent === 'gold' ? 'bg-gold/10 text-gold-light' : 'bg-emerald/10 text-emerald-light'
                        }`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse-glow" />
                          {currentStep.metrics.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-white flex items-center gap-2">
                          <StepIcon className={`h-5 w-5 ${
                            currentStep.accent === 'gold' ? 'text-gold' : 'text-emerald-light'
                          }`} />
                          {currentStep.metrics.title}
                        </h4>
                        <p className="text-xs text-white/60 mt-1 leading-relaxed">
                          {currentStep.metrics.detail}
                        </p>
                      </div>

                      <div className="space-y-2 border-t border-white/5 pt-4">
                        {currentStep.metrics.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-white/80">
                            <CheckCircle2 className="h-4 w-4 text-emerald shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-white/40">{currentStep.metrics.statLabel}</p>
                          <p className={`text-2xl font-black ${
                            currentStep.accent === 'gold' ? 'text-gold' : 'text-emerald-light'
                          }`}>{currentStep.metrics.stat}</p>
                        </div>
                        <a 
                          href="#services"
                          className="inline-flex items-center gap-1.5 text-xs text-gold-light font-semibold hover:text-white transition-colors"
                        >
                          Unlock Node
                          <ArrowRight className="h-3 w-3" />
                        </a>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

              </div>

              {/* Decorative Glow Dots */}
              <div className="absolute -top-3 -right-3 h-24 w-24 rounded-2xl bg-gradient-to-br from-gold/20 to-emerald/10 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-2 -left-2 h-16 w-16 rounded-2xl bg-gradient-to-tr from-gold/10 to-transparent blur-xl pointer-events-none" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
