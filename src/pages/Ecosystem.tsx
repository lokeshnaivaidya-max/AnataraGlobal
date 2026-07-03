import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Sparkles, BookOpen, Target, Network, TrendingUp,
  CheckCircle2, RefreshCw
} from 'lucide-react'

const ecosystemSteps = [
  {
    step: '01',
    icon: BookOpen,
    title: 'Educate',
    desc: 'Building awareness and knowledge that enables entrepreneurs and businesses to make informed decisions.',
    points: ['Workshops', 'Webinars', 'Founder Sessions', 'Business Resources'],
    color: 'emerald',
  },
  {
    step: '02',
    icon: Target,
    title: 'Advise',
    desc: 'Providing strategic guidance and business readiness support to strengthen business foundations.',
    points: ['Strategic guidance', 'Business readiness support'],
    color: 'gold',
  },
  {
    step: '03',
    icon: Network,
    title: 'Connect',
    desc: 'Creating meaningful connections between businesses and relevant ecosystem participants.',
    points: ['Advisors', 'Investors', 'Partners', 'Growth Opportunities'],
    color: 'emerald',
  },
  {
    step: '04',
    icon: TrendingUp,
    title: 'Grow',
    desc: 'Supporting businesses in achieving sustainable expansion and long-term value creation.',
    points: ['Long-term value creation', 'Sustainable business expansion'],
    color: 'gold',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Ecosystem() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % ecosystemSteps.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const currentStep = ecosystemSteps[activeStep]
  const StepIcon = currentStep.icon

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-deep-navy via-deep-navy-dark to-deep-navy pt-28 pb-16">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-gold/10 blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-emerald/10 blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold via-emerald to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold text-gold-light border border-gold/20 mb-6"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Ecosystem Model
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight"
            >
              Our Ecosystem<br />
              <span className="bg-gradient-to-r from-gold-light via-gold to-emerald bg-clip-text text-transparent">
                Model
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-white/70 leading-relaxed max-w-xl"
            >
              Antara Global follows a structured ecosystem approach that helps businesses gain knowledge,
              build strategic foundations, access opportunities, and achieve sustainable growth.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Ecosystem Journey */}
      <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8 bg-gold" />
              <span className="text-xs font-semibold tracking-widest uppercase text-gold">
                The Journey
              </span>
              <span className="h-px w-8 bg-gold" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-deep-navy tracking-tight">
              Educate → Advise → Connect → Grow
            </h2>
            <p className="mt-4 text-medium-gray text-base leading-relaxed">
              A continuous loop of learning, strategy, connections, and expansion.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-[60px] left-[12.5%] right-[12.5%] h-px bg-border-gray">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="h-full origin-left bg-gradient-to-r from-emerald via-gold via-emerald to-gold"
              />
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {ecosystemSteps.map((step, idx) => {
                const Icon = step.icon
                const isGold = step.color === 'gold'
                return (
                  <motion.div
                    key={step.title}
                    variants={cardVariants}
                    whileHover={{ y: -8 }}
                    className="group relative text-center"
                  >
                    <div className="hidden lg:flex justify-center relative z-10 mb-8">
                      <div className={`h-8 w-8 rounded-full bg-white border-2 shadow-lg flex items-center justify-center ${
                        isGold ? 'border-gold shadow-gold/20' : 'border-emerald shadow-emerald/20'
                      }`}>
                        <span className={`h-3 w-3 rounded-full animate-pulse-glow ${
                          isGold ? 'bg-gold' : 'bg-emerald'
                        }`} />
                      </div>
                    </div>

                    <div className="rounded-3xl border border-border-gray bg-light-gray/50 p-7 shadow-md hover:shadow-2xl transition-all duration-500 h-full flex flex-col items-center">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border mb-5 transition-all duration-300 group-hover:scale-110 ${
                        isGold
                          ? 'bg-gradient-to-br from-gold/15 to-gold/5 text-gold border-gold/15 group-hover:shadow-lg group-hover:shadow-gold/20'
                          : 'bg-gradient-to-br from-emerald/15 to-emerald/5 text-emerald border-emerald/15 group-hover:shadow-lg group-hover:shadow-emerald/20'
                      }`}>
                        <Icon className="h-8 w-8" />
                      </div>

                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        isGold ? 'text-gold' : 'text-emerald'
                      }`}>
                        {step.step}
                      </span>
                      <h3 className={`text-xl font-extrabold text-deep-navy mt-1 transition-colors ${
                        isGold ? 'group-hover:text-gold' : 'group-hover:text-emerald'
                      }`}>
                        {step.title}
                      </h3>
                      <p className="text-xs text-medium-gray mt-3 leading-relaxed">{step.desc}</p>

                      <ul className="mt-5 pt-5 border-t border-border-gray w-full space-y-2">
                        {step.points.map((point) => (
                          <li key={point} className="flex items-center justify-center gap-2 text-xs text-deep-navy/70 font-medium">
                            <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 ${isGold ? 'text-gold' : 'text-emerald'}`} />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Arrow between steps */}
                    {idx < ecosystemSteps.length - 1 && (
                      <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                        <ArrowRight className="h-5 w-5 text-gold/40" />
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </motion.div>
          </div>

          {/* Loop indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-gold/5 border border-gold/20 px-5 py-2.5 text-xs font-semibold text-gold">
              <RefreshCw className="h-4 w-4 animate-spin-slow" />
              Continuous Improvement Loop — After Grow, return to Educate
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Preview */}
      <section className="relative py-24 lg:py-32 bg-light-gray overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-semibold tracking-widest uppercase text-gold">Ecosystem In Action</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-deep-navy tracking-tight">
                Beyond Consulting. Building Ecosystems.
              </h2>
              <p className="mt-4 text-medium-gray text-base leading-relaxed">
                Antara Global connects knowledge, strategy, capital, and opportunities to help businesses
                become growth-ready, investment-ready, and future-ready.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-dark px-5 py-3 text-sm font-bold uppercase tracking-wider text-deep-navy shadow-md hover:shadow-lg hover:shadow-gold/30 hover:scale-105 transition-all duration-300"
                >
                  Join The Ecosystem
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>

            {/* Interactive Step Viewer */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-gradient-to-br from-deep-navy via-deep-navy to-deep-navy-dark border border-white/5 p-6 sm:p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gold/5 blur-3xl animate-float" />
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

              <h3 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-6">
                Current Ecosystem Phase
              </h3>

              {/* Step selector */}
              <div className="flex gap-2 mb-6">
                {ecosystemSteps.map((step, idx) => (
                  <button
                    key={step.title}
                    onClick={() => setActiveStep(idx)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                      activeStep === idx
                        ? step.color === 'gold'
                          ? 'bg-gold/20 text-gold-light border border-gold/30'
                          : 'bg-emerald/20 text-emerald-light border border-emerald/30'
                        : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10'
                    }`}
                  >
                    {step.step}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${
                      currentStep.color === 'gold'
                        ? 'bg-gold/15 border-gold/20 text-gold'
                        : 'bg-emerald/15 border-emerald/20 text-emerald-light'
                    }`}>
                      <StepIcon className="h-7 w-7" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{currentStep.step}</span>
                      <h4 className="text-2xl font-extrabold text-white">{currentStep.title}</h4>
                    </div>
                  </div>

                  <p className="text-sm text-white/70 leading-relaxed">{currentStep.desc}</p>

                  <ul className="space-y-2.5 border-t border-white/5 pt-5">
                    {currentStep.points.map((point) => (
                      <li key={point} className="flex items-center gap-2.5 text-xs text-white/80">
                        <CheckCircle2 className={`h-4 w-4 shrink-0 ${
                          currentStep.color === 'gold' ? 'text-gold' : 'text-emerald-light'
                        }`} />
                        {point}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 bg-deep-navy overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Transform Your Business?
          </h2>
          <p className="mt-4 text-white/60 text-lg max-w-xl mx-auto">
            Join our ecosystem and experience the power of structured growth.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-dark px-6 py-3 text-sm font-bold uppercase tracking-wider text-deep-navy shadow-md hover:shadow-lg hover:shadow-gold/30 hover:scale-105 transition-all duration-300"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10 transition-all duration-300"
            >
              Explore Services
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
