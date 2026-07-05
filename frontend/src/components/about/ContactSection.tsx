import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, ArrowRight, Shield, CheckCircle, Sparkles, Calculator, Building
} from 'lucide-react'

type Stage = 'concept' | 'mvp' | 'traction' | 'scaling'

export default function ContactSection() {
  // Calculator State
  const [stage, setStage] = useState<Stage>('mvp')
  const [revenue, setRevenue] = useState<number>(15) // in thousands
  const [hasPitchDeck, setHasPitchDeck] = useState(false)
  const [hasFinancialModel, setHasFinancialModel] = useState(false)
  const [hasCapTable, setHasCapTable] = useState(false)
  const [hasStructure, setHasStructure] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [startup, setStartup] = useState('')
  const [message, setMessage] = useState('')
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle')

  // Calculate Readiness Score
  let score = 0
  if (stage === 'concept') score += 15
  if (stage === 'mvp') score += 25
  if (stage === 'traction') score += 35
  if (stage === 'scaling') score += 45

  score += Math.min(25, Math.floor(revenue * 0.25))

  if (hasPitchDeck) score += 10
  if (hasFinancialModel) score += 10
  if (hasCapTable) score += 5
  if (hasStructure) score += 5

  const getScoreColor = (s: number) => {
    if (s < 40) return 'text-red-500'
    if (s < 75) return 'text-gold'
    return 'text-emerald'
  }

  const getScoreLabel = (s: number) => {
    if (s < 40) return 'Early Concept'
    if (s < 75) return 'Growth Phase (Advisory Recommended)'
    return 'Highly Investment Ready'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) return
    setFormState('submitting')
    setTimeout(() => {
      setFormState('success')
    }, 1500)
  }

  return (
    <section id="contact" className="relative py-24 lg:py-32 bg-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute top-1/3 left-10 w-64 h-64 rounded-full bg-gold/5 blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-10 w-64 h-64 rounded-full bg-emerald/5 blur-3xl animate-float" style={{ animationDelay: '2.5s' }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full bg-emerald/10 px-4 py-1.5 text-xs font-semibold text-emerald border border-emerald/20 mb-4"
          >
            <Calendar className="h-3.5 w-3.5 text-emerald" />
            Strategic Advisory
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-deep-navy tracking-tight"
          >
            Connect With Our Advisors
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-medium-gray text-lg"
          >
            Calculate your startup’s venture readiness score and apply for a strategy assessment round.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-stretch">
          {/* Left Column: Readiness Calculator */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex-1 rounded-3xl border border-border-gray bg-light-gray p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-3xl bg-gradient-to-bl from-gold/5 to-transparent pointer-events-none" />
              
              <div>
                <h3 className="text-lg font-bold text-deep-navy flex items-center gap-2.5">
                  <Calculator className="h-5 w-5 text-emerald" />
                  Venture Readiness Index
                </h3>
                <p className="text-xs text-medium-gray mt-1">Estimate how prepared your startup is for capital connectivity.</p>

                {/* 1. Stage */}
                <div className="mt-6">
                  <label className="text-xs font-bold text-deep-navy uppercase tracking-wider">Business Stage</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {(['concept', 'mvp', 'traction', 'scaling'] as Stage[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStage(s)}
                        className={`text-xs font-semibold px-3 py-2 rounded-xl border capitalize transition-all ${
                          stage === s
                            ? 'bg-emerald border-emerald text-white shadow-md cursor-pointer'
                            : 'bg-white border-border-gray text-medium-gray hover:bg-light-gray hover:border-emerald/30 cursor-pointer'
                        }`}
                      >
                        {s === 'mvp' ? 'MVP Launch' : s === 'traction' ? 'Early Traction' : s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Monthly Revenue Slider */}
                <div className="mt-6">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-deep-navy uppercase tracking-wider">Monthly Revenue (USD)</label>
                    <span className="text-xs font-bold text-emerald bg-emerald/10 px-2 py-0.5 rounded">${revenue}k</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={revenue}
                    onChange={(e) => setRevenue(Number(e.target.value))}
                    className="w-full h-1 bg-border-gray rounded-lg appearance-none cursor-pointer accent-emerald mt-3"
                  />
                  <div className="flex justify-between text-[10px] text-medium-gray mt-1">
                    <span>$0</span>
                    <span>$50k</span>
                    <span>$100k+</span>
                  </div>
                </div>

                {/* 3. Materials Checkboxes */}
                <div className="mt-6">
                  <label className="text-xs font-bold text-deep-navy uppercase tracking-wider">Prepared Artifacts</label>
                  <div className="space-y-2 mt-2">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-medium-gray">
                      <input
                        type="checkbox"
                        checked={hasPitchDeck}
                        onChange={(e) => setHasPitchDeck(e.target.checked)}
                        className="rounded border-border-gray text-emerald focus:ring-emerald h-4 w-4 bg-white"
                      />
                      <span>Professional Pitch Narrative & Deck</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-medium-gray">
                      <input
                        type="checkbox"
                        checked={hasFinancialModel}
                        onChange={(e) => setHasFinancialModel(e.target.checked)}
                        className="rounded border-border-gray text-emerald focus:ring-emerald h-4 w-4 bg-white"
                      />
                      <span>Dynamic 3-5 Year Financial Forecast</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-medium-gray">
                      <input
                        type="checkbox"
                        checked={hasCapTable}
                        onChange={(e) => setHasCapTable(e.target.checked)}
                        className="rounded border-border-gray text-emerald focus:ring-emerald h-4 w-4 bg-white"
                      />
                      <span>Clean Capitalization Table & Equity Ledger</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-medium-gray">
                      <input
                        type="checkbox"
                        checked={hasStructure}
                        onChange={(e) => setHasStructure(e.target.checked)}
                        className="rounded border-border-gray text-emerald focus:ring-emerald h-4 w-4 bg-white"
                      />
                      <span>Registered Corporate Entity & Bylaws</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Calculator Output Display */}
              <div className="mt-8 pt-6 border-t border-border-gray flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-medium-gray uppercase tracking-wider">Readiness Score</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className={`text-4xl font-extrabold transition-colors duration-300 ${getScoreColor(score)}`}>
                      {score}%
                    </span>
                    <span className="text-xs text-medium-gray">/ 100</span>
                  </div>
                  <p className="text-[10px] text-medium-gray font-medium mt-1 leading-snug">{getScoreLabel(score)}</p>
                </div>

                <div className="h-16 w-16 shrink-0 relative flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="28" className="stroke-border-gray" strokeWidth="4" fill="transparent" />
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="28" 
                      className={`transition-all duration-500 ease-out ${
                        score < 40 ? 'stroke-red-500' : score < 75 ? 'stroke-gold' : 'stroke-emerald'
                      }`}
                      strokeWidth="4" 
                      fill="transparent" 
                      strokeDasharray={2 * Math.PI * 28}
                      strokeDashoffset={2 * Math.PI * 28 * (1 - score / 100)}
                    />
                  </svg>
                  <Building className="h-5 w-5 absolute text-deep-navy/20" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7" id="consultation">
            <div className="h-full rounded-3xl border border-border-gray p-8 sm:p-10 shadow-xl flex flex-col justify-between relative overflow-hidden bg-white">
              <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-3xl bg-gradient-to-bl from-emerald/5 to-transparent pointer-events-none" />

              <AnimatePresence mode="wait">
                {formState !== 'success' ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div>
                      <h3 className="text-xl font-bold text-deep-navy">Confidential Strategy Session</h3>
                      <p className="text-xs text-medium-gray mt-1">Our partners review applications weekly. Strategy assessments are protected under standard NDA.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-xs font-bold text-deep-navy uppercase tracking-wider mb-2">Name *</label>
                        <input
                          id="name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full rounded-xl border border-border-gray bg-white px-4 py-3 text-sm text-deep-navy placeholder-medium-gray/40 focus:border-emerald outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-xs font-bold text-deep-navy uppercase tracking-wider mb-2">Corporate Email *</label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          className="w-full rounded-xl border border-border-gray bg-white px-4 py-3 text-sm text-deep-navy placeholder-medium-gray/40 focus:border-emerald outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="startup" className="block text-xs font-bold text-deep-navy uppercase tracking-wider mb-2">Startup / MSME Name</label>
                      <input
                        id="startup"
                        type="text"
                        value={startup}
                        onChange={(e) => setStartup(e.target.value)}
                        placeholder="Company name"
                        className="w-full rounded-xl border border-border-gray bg-white px-4 py-3 text-sm text-deep-navy placeholder-medium-gray/40 focus:border-emerald outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-xs font-bold text-deep-navy uppercase tracking-wider mb-2">How can we help? *</label>
                      <textarea
                        id="message"
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe your current status, advisory needs, or funding timeline."
                        className="w-full rounded-xl border border-border-gray bg-white px-4 py-3 text-sm text-deep-navy placeholder-medium-gray/40 focus:border-emerald outline-none transition-all resize-none animate-none"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-4 flex-wrap pt-4 border-t border-border-gray">
                      <div className="flex items-center gap-2 text-xs text-medium-gray">
                        <Shield className="h-4 w-4 text-emerald" />
                        <span>Data protected under 256-bit encryption</span>
                      </div>
                      <button
                        type="submit"
                        disabled={formState === 'submitting'}
                        className="group inline-flex items-center gap-2 rounded-xl bg-deep-navy text-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-emerald hover:scale-105 transition-all duration-300 disabled:opacity-50 shadow-md cursor-pointer"
                      >
                        {formState === 'submitting' ? 'Submitting...' : 'Apply for Strategy Assessment'}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    className="flex flex-col items-center justify-center text-center py-12"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                  >
                    <div className="h-16 w-16 rounded-full bg-emerald/10 border border-emerald/20 flex items-center justify-center mb-6">
                      <CheckCircle className="h-8 w-8 text-emerald animate-pulse-glow" />
                    </div>
                    <h3 className="text-2xl font-bold text-deep-navy">Application Submitted!</h3>
                    <p className="mt-3 text-sm text-medium-gray leading-relaxed max-w-md">
                      Thank you, <strong className="text-deep-navy">{name}</strong>. We received your request for <strong className="text-deep-navy">{startup || 'your business'}</strong>.
                    </p>

                    <div className="mt-8 rounded-2xl bg-light-gray border border-border-gray p-6 w-full max-w-md text-left">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-deep-navy mb-3 flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-gold" />
                        Next steps based on score ({score}%):
                      </h4>
                      <ul className="space-y-2.5 text-xs text-medium-gray">
                        <li className="flex gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                          An Antara advisor will review your submitted files within 24 hours.
                        </li>
                        <li className="flex gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                          We will share custom recommendations to improve your score.
                        </li>
                        <li className="flex gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                          A scheduling link for a confidential Zoom session will be sent to <strong className="text-deep-navy">{email}</strong>.
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={() => {
                        setFormState('idle')
                        setName('')
                        setEmail('')
                        setStartup('')
                        setMessage('')
                      }}
                      className="mt-8 text-xs font-semibold text-gold hover:text-gold-dark hover:underline transition-all cursor-pointer"
                    >
                      Submit another request
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
