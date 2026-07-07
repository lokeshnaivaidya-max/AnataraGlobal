import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Shield, CheckCircle, Sparkles, Calculator, Building } from 'lucide-react'

type Stage = 'concept' | 'mvp' | 'traction' | 'scaling'

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || 'http://localhost:5001/api'

export default function ContactSection() {
  const [stage, setStage] = useState<Stage>('mvp')
  const [revenue, setRevenue] = useState<number>(15)
  const [hasPitchDeck, setHasPitchDeck] = useState(false)
  const [hasFinancialModel, setHasFinancialModel] = useState(false)
  const [hasCapTable, setHasCapTable] = useState(false)
  const [hasStructure, setHasStructure] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [startup, setStartup] = useState('')
  const [message, setMessage] = useState('')
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle')

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
    if (s < 40) return '#EF4444'
    if (s < 75) return 'var(--color-accent-light)'
    return 'var(--color-accent)'
  }

  const getScoreLabel = (s: number) => {
    if (s < 40) return 'Early Concept'
    if (s < 75) return 'Growth Phase (Advisory Recommended)'
    return 'Highly Investment Ready'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) return
    setFormState('submitting')
    try {
      await fetch(`${API_BASE}/crm/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company: startup || undefined, notes: message }),
      })
      setFormState('success')
    } catch {
      setFormState('idle')
    }
  }

  return (
    <section id="contact" className="relative py-24 lg:py-32 overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, transparent, var(--color-accent), transparent)' }} />
      <div className="absolute top-1/3 left-10 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(0,128,129,0.04)' }} />
      <div className="absolute bottom-1/3 right-10 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(51,181,181,0.04)' }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">

        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-stretch">
          {/* ── Left Column: Readiness Calculator ── */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex-1 rounded-3xl p-8 shadow-xl flex flex-col justify-between relative overflow-hidden"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-3xl pointer-events-none"
                style={{ background: 'linear-gradient(to bottom left, rgba(0,128,129,0.05), transparent)' }} />

              <div>
                <h3 className="text-lg font-bold flex items-center gap-2.5" style={{ color: '#000000' }}>
                  <Calculator className="h-5 w-5" style={{ color: 'var(--color-accent)' }} />
                  Venture Readiness Index
                </h3>
                <p className="text-xs mt-1" style={{ color: 'rgba(0,0,0,0.5)' }}>Estimate how prepared your startup is for capital connectivity.</p>

                {/* 1. Stage */}
                <div className="mt-6">
                  <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#000000' }}>Business Stage</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {(['concept', 'mvp', 'traction', 'scaling'] as Stage[]).map((s) => (
                      <button key={s} type="button" onClick={() => setStage(s)}
                        className="text-xs font-semibold px-3 py-2 rounded-xl border capitalize transition-all cursor-pointer"
                        style={stage === s
                          ? { backgroundColor: 'var(--color-accent)', borderColor: 'var(--color-accent)', color: '#FFFFFF' }
                          : { backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.06)', color: 'rgba(0,0,0,0.5)' }}
                        onMouseEnter={(e) => { if (stage !== s) { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)' }}}
                        onMouseLeave={(e) => { if (stage !== s) { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'; e.currentTarget.style.color = 'rgba(0,0,0,0.5)' }}}>
                        {s === 'mvp' ? 'MVP Launch' : s === 'traction' ? 'Early Traction' : s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Monthly Revenue Slider */}
                <div className="mt-6">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#000000' }}>Monthly Revenue (USD)</label>
                    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ color: 'var(--color-accent-light)', backgroundColor: 'rgba(51,181,181,0.1)' }}>${revenue}k</span>
                  </div>
                  <input type="range" min="0" max="100" step="5" value={revenue}
                    onChange={(e) => setRevenue(Number(e.target.value))}
                    className="w-full h-1 rounded-lg appearance-none cursor-pointer mt-3"
                    style={{ backgroundColor: 'rgba(0,0,0,0.06)', accentColor: 'var(--color-accent)' }} />
                  <div className="flex justify-between text-[10px] mt-1" style={{ color: 'rgba(0,0,0,0.4)' }}>
                    <span>$0</span>
                    <span>$50k</span>
                    <span>$100k+</span>
                  </div>
                </div>

                {/* 3. Materials Checkboxes */}
                <div className="mt-6">
                  <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#000000' }}>Prepared Artifacts</label>
                  <div className="space-y-2 mt-2">
                    {[
                      { label: 'Professional Pitch Narrative & Deck', val: hasPitchDeck, set: setHasPitchDeck },
                      { label: 'Dynamic 3-5 Year Financial Forecast', val: hasFinancialModel, set: setHasFinancialModel },
                      { label: 'Clean Capitalization Table & Equity Ledger', val: hasCapTable, set: setHasCapTable },
                      { label: 'Registered Corporate Entity & Bylaws', val: hasStructure, set: setHasStructure },
                    ].map((item) => (
                      <label key={item.label} className="flex items-center gap-2.5 cursor-pointer text-xs" style={{ color: 'rgba(0,0,0,0.5)' }}>
                        <input type="checkbox" checked={item.val} onChange={(e) => item.set(e.target.checked)}
                          className="rounded h-4 w-4 cursor-pointer"
                          style={{ accentColor: 'var(--color-accent)', borderColor: 'rgba(0,0,0,0.06)' }} />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Calculator Output */}
              <div className="mt-8 pt-6 flex items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(0,0,0,0.4)' }}>Readiness Score</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-4xl font-extrabold transition-colors duration-300" style={{ color: getScoreColor(score) }}>
                      {score}%
                    </span>
                    <span className="text-xs" style={{ color: 'rgba(0,0,0,0.4)' }}>/ 100</span>
                  </div>
                  <p className="text-[10px] font-medium mt-1 leading-snug" style={{ color: 'rgba(0,0,0,0.4)' }}>{getScoreLabel(score)}</p>
                </div>

                <div className="h-16 w-16 shrink-0 relative flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="rgba(0,0,0,0.06)" strokeWidth="4" fill="transparent" />
                    <circle cx="32" cy="32" r="28" stroke={getScoreColor(score)} strokeWidth="4" fill="transparent"
                      strokeDasharray={2 * Math.PI * 28} strokeDashoffset={2 * Math.PI * 28 * (1 - score / 100)}
                      className="transition-all duration-500 ease-out" />
                  </svg>
                  <Building className="h-5 w-5 absolute" style={{ color: 'rgba(0,0,0,0.15)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: Contact Form ── */}
          <div className="lg:col-span-7" id="consultation">
            <div className="h-full rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col justify-between relative overflow-hidden"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, var(--color-accent), rgba(0,128,129,0.2), transparent)' }} />
              <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-3xl pointer-events-none"
                style={{ background: 'linear-gradient(to bottom left, rgba(0,128,129,0.06), transparent)' }} />

              <AnimatePresence mode="wait">
                {formState !== 'success' ? (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-6"
                    initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="pb-4" style={{ borderBottom: '1px solid rgba(0,128,129,0.15)' }}>
                      <h3 className="text-xl font-bold" style={{ color: '#000000' }}>Confidential Strategy Session</h3>
                      <p className="text-xs mt-1" style={{ color: 'rgba(0,0,0,0.5)' }}>Our partners review applications weekly. Strategy assessments are protected under standard NDA.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#000000' }}>Name *</label>
                        <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all"
                          style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.06)', color: '#000000' }}
                          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
                          onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'} />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#000000' }}>Corporate Email *</label>
                        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all"
                          style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.06)', color: '#000000' }}
                          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
                          onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'} />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="startup" className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#000000' }}>Startup / MSME Name</label>
                      <input id="startup" type="text" value={startup} onChange={(e) => setStartup(e.target.value)}
                        placeholder="Company name"
                        className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all"
                        style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.06)', color: '#000000' }}
                        onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
                        onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'} />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#000000' }}>How can we help? *</label>
                      <textarea id="message" required rows={4} value={message} onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe your current status, advisory needs, or funding timeline."
                        className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all resize-none"
                        style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.06)', color: '#000000' }}
                        onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
                        onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'} />
                    </div>

                    <div className="flex items-center justify-between gap-4 flex-wrap pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                      <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(0,0,0,0.5)' }}>
                        <Shield className="h-4 w-4" style={{ color: 'var(--color-accent)' }} />
                        <span>Data protected under 256-bit encryption</span>
                      </div>
                      <button type="submit" disabled={formState === 'submitting'}
                        className="group inline-flex items-center gap-2 rounded-xl text-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider hover:scale-105 transition-all duration-300 disabled:opacity-50 shadow-md cursor-pointer"
                        style={{ backgroundColor: '#000000' }}
                        onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'var(--color-accent)' }}
                        onMouseLeave={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#000000' }}>
                        {formState === 'submitting' ? 'Submitting...' : 'Apply for Strategy Assessment'}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div key="success" className="flex flex-col items-center justify-center text-center py-12"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 100 }}>
                    <div className="h-16 w-16 rounded-full flex items-center justify-center mb-6"
                      style={{ backgroundColor: 'rgba(0,128,129,0.08)', border: '1px solid rgba(0,128,129,0.15)' }}>
                      <CheckCircle className="h-8 w-8" style={{ color: 'var(--color-accent)' }} />
                    </div>
                    <h3 className="text-2xl font-bold" style={{ color: '#000000' }}>Application Submitted!</h3>
                    <p className="mt-3 text-sm leading-relaxed max-w-md" style={{ color: 'rgba(0,0,0,0.5)' }}>
                      Thank you, <strong style={{ color: '#000000' }}>{name}</strong>. We received your request for <strong style={{ color: '#000000' }}>{startup || 'your business'}</strong>.
                    </p>

                    <div className="mt-8 rounded-2xl p-6 w-full max-w-md text-left"
                      style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)' }}>
                      <h4 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#000000' }}>
                        <Sparkles className="h-4 w-4" style={{ color: 'var(--color-accent-light)' }} />
                        Next steps based on score ({score}%):
                      </h4>
                      <ul className="space-y-2.5 text-xs" style={{ color: 'rgba(0,0,0,0.5)' }}>
                        <li className="flex gap-2">
                          <span className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: 'var(--color-accent-light)' }} />
                          An Antara advisor will review your submitted files within 24 hours.
                        </li>
                        <li className="flex gap-2">
                          <span className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: 'var(--color-accent-light)' }} />
                          We will share custom recommendations to improve your score.
                        </li>
                        <li className="flex gap-2">
                          <span className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: 'var(--color-accent-light)' }} />
                          A scheduling link for a confidential Zoom session will be sent to <strong style={{ color: '#000000' }}>{email}</strong>.
                        </li>
                      </ul>
                    </div>

                    <button onClick={() => { setFormState('idle'); setName(''); setEmail(''); setStartup(''); setMessage('') }}
                      className="mt-8 text-xs font-semibold transition-all cursor-pointer"
                      style={{ color: 'var(--color-accent-light)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-accent-light)'}>
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
