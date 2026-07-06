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
      {/* ── Hero (left: content, right: interactive phase viewer) ── */}
      <section className="relative min-h-screen overflow-hidden pt-28 pb-16" style={{ backgroundColor: '#FFF8F2' }}>
        <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, transparent, #FD7C06, transparent)' }} />
        <div className="mx-auto relative w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: Content */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold border text-white"
                style={{ backgroundColor: '#000000', borderColor: '#000000' }}>
                <Sparkles className="h-3.5 w-3.5" />
                Ecosystem Model
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="mt-6 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight" style={{ color: '#000000' }}>
                Our Ecosystem<br />
                <span style={{ color: '#FD7C06' }}>Model</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="mt-6 text-base sm:text-lg leading-relaxed max-w-xl min-h-[4.5rem]" style={{ color: 'rgba(0,0,0,0.6)' }}>
                Antara Global follows a structured ecosystem approach that helps businesses gain knowledge, build strategic foundations, access opportunities, and achieve sustainable growth. Our model integrates strategic advisory, venture readiness, capital connectivity, and ecosystem partnerships into a seamless growth journey designed for startups and MSMEs.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 flex flex-wrap gap-4">
                <a href="/services"
                  className="group inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold border-2 border-black shadow-lg transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: '#FFFFFF', color: '#000000' }}>
                  Explore Services <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a href="/contact"
                  className="inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: '#000000' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FD7C06'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}>
                  Book Consultation
                </a>
              </motion.div>
            </div>

            {/* Right: Interactive Phase Viewer */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              className="rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden"
              style={{ backgroundColor: '#000000', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(253,124,6,0.08)' }} />
              <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, transparent, #FD7C06, transparent)' }} />

              <h3 className="text-xs font-bold uppercase tracking-wider mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Current Ecosystem Phase
              </h3>

              {/* Step selector */}
              <div className="flex gap-2 mb-6">
                {ecosystemSteps.map((step, idx) => (
                  <button key={step.title} onClick={() => setActiveStep(idx)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
                    style={activeStep === idx
                      ? { backgroundColor: 'rgba(253,124,6,0.15)', border: '1px solid rgba(253,124,6,0.3)', color: '#FD7C06' }
                      : { backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}
                    onMouseEnter={(e) => { if (activeStep !== idx) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)' }}}
                    onMouseLeave={(e) => { if (activeStep !== idx) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)' }}}>
                    {step.step}
                  </button>
                ))}
              </div>

              <div className="min-h-[270px]">
                <AnimatePresence mode="wait">
                  <motion.div key={activeStep} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border"
                      style={{ backgroundColor: 'rgba(253,124,6,0.12)', borderColor: 'rgba(253,124,6,0.2)', color: '#FD7C06' }}>
                      <StepIcon className="h-7 w-7" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>{currentStep.step}</span>
                      <h4 className="text-2xl font-extrabold text-white">{currentStep.title}</h4>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{currentStep.desc}</p>

                  <ul className="space-y-2.5 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    {currentStep.points.map((point) => (
                      <li key={point} className="flex items-center gap-2.5 text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: '#FD7C06' }} />
                        {point}
                      </li>
                    ))}
                  </ul>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Ecosystem Journey — 4 Cards ── */}
      <section className="relative py-24 lg:py-32 overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8" style={{ backgroundColor: '#CEA041' }} />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#CEA041' }}>The Journey</span>
              <span className="h-px w-8" style={{ backgroundColor: '#CEA041' }} />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight whitespace-nowrap" style={{ color: '#000000' }}>
              Educate → Advise → Connect → Grow
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: 'rgba(0,0,0,0.5)' }}>
              A continuous loop of learning, strategy, connections, and expansion.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-[60px] left-[12.5%] right-[12.5%] h-px" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
              <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="h-full origin-left" style={{ background: 'linear-gradient(90deg, #FD7C06, #CEA041, #FD7C06)' }} />
            </div>

            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {ecosystemSteps.map((step, idx) => {
                const Icon = step.icon
                const isGold = step.color === 'gold'
                return (
                  <motion.div key={step.title} variants={cardVariants} whileHover={{ y: -8 }} className="group relative text-center">
                    <div className="hidden lg:flex justify-center relative z-10 mb-8">
                      <div className="h-8 w-8 rounded-full bg-white border-2 shadow-lg flex items-center justify-center"
                        style={{ borderColor: isGold ? '#CEA041' : '#FD7C06' }}>
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: isGold ? '#CEA041' : '#FD7C06' }} />
                      </div>
                    </div>

                    <div className="rounded-3xl p-7 shadow-md hover:shadow-2xl transition-all duration-500 h-full flex flex-col items-center"
                      style={{ backgroundColor: '#FFF8F2', border: '1px solid rgba(0,0,0,0.06)' }}>
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border mb-5 transition-all duration-300 group-hover:scale-110"
                        style={{
                          backgroundColor: isGold ? 'rgba(206,160,65,0.1)' : 'rgba(253,124,6,0.1)',
                          borderColor: isGold ? 'rgba(206,160,65,0.15)' : 'rgba(253,124,6,0.15)',
                          color: isGold ? '#CEA041' : '#FD7C06',
                        }}>
                        <Icon className="h-8 w-8" />
                      </div>

                      <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: isGold ? '#CEA041' : '#FD7C06' }}>
                        {step.step}
                      </span>
                      <h3 className="text-xl font-extrabold mt-1 transition-colors" style={{ color: '#000000' }}>{step.title}</h3>
                      <p className="text-xs mt-3 leading-relaxed" style={{ color: 'rgba(0,0,0,0.5)' }}>{step.desc}</p>

                      <ul className="mt-5 pt-5 w-full space-y-2" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                        {step.points.map((point) => (
                          <li key={point} className="flex items-center justify-center gap-2 text-xs font-medium" style={{ color: 'rgba(0,0,0,0.7)' }}>
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: isGold ? '#CEA041' : '#FD7C06' }} />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {idx < ecosystemSteps.length - 1 && (
                      <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                        <ArrowRight className="h-5 w-5" style={{ color: 'rgba(0,0,0,0.2)' }} />
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </motion.div>
          </div>

          {/* Loop indicator */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold"
              style={{ backgroundColor: 'rgba(206,160,65,0.08)', border: '1px solid rgba(206,160,65,0.2)', color: '#CEA041' }}>
              <RefreshCw className="h-4 w-4" />
              Continuous Improvement Loop — After Grow, return to Educate
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(253,124,6,0.08)' }} />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Ready to Transform Your Business?
          </h2>
          <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Join our ecosystem and experience the power of structured growth.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="/contact"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
              style={{ backgroundColor: '#FD7C06' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#CEA041'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD7C06'}>
              Get Started <ArrowRight className="h-4 w-4" />
            </a>
            <a href="/services"
              className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-bold uppercase tracking-wider hover:scale-105 transition-all duration-300"
              style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FD7C06'; e.currentTarget.style.color = '#FFFFFF' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}>
              Explore Services
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
