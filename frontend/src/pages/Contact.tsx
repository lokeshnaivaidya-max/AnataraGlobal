import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, ArrowRight, Shield, CheckCircle, Sparkles, Calculator, Building, AlertCircle } from 'lucide-react'
import { useCreateLead } from '../lib/crm-hooks'

type Stage = 'concept' | 'mvp' | 'traction' | 'scaling'

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
  const [errorMsg, setErrorMsg] = useState('')

  const createLead = useCreateLead()

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
    if (s < 75) return '#CEA041'
    return '#FD7C06'
  }

  const getScoreLabel = (s: number) => {
    if (s < 40) return 'Early Concept'
    if (s < 75) return 'Growth Phase (Advisory Recommended)'
    return 'Highly Investment Ready'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return
    setErrorMsg('')

    createLead.mutate(
      {
        name,
        email,
        company: startup || undefined,
        notes: message,
        source: 'website',
      },
      {
        onError: (err: any) => {
          setErrorMsg(
            err?.response?.data?.message ||
              'Something went wrong submitting your request. Please try again.'
          )
        },
      }
    )
  }

  const resetForm = () => {
    createLead.reset()
    setName('')
    setEmail('')
    setStartup('')
    setMessage('')
    setErrorMsg('')
  }

  const formState: 'idle' | 'submitting' | 'success' = createLead.isPending
    ? 'submitting'
    : createLead.isSuccess
    ? 'success'
    : 'idle'

  return (
    <section id="contact" className="relative py-24 lg:py-32 overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, transparent, #FD7C06, transparent)' }} />
      <div className="absolute top-1/3 left-10 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(253,124,6,0.04)' }} />
      <div className="absolute bottom-1/3 right-10 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(206,160,65,0.04)' }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold border mb-4"
            style={{ backgroundColor: 'rgba(253,124,6,0.08)', borderColor: 'rgba(253,124,6,0.2)', color: '#FD7C06' }}>
            <Calendar className="h-3.5 w-3.5" style={{ color: '#FD7C06' }} />
            Strategic Advisory
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight" style={{ color: '#000000' }}>
            Connect With <span style={{ color: '#FD7C06' }}>Our Advisors</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="mt-4 text-lg" style={{ color: 'rgba(0,0,0,0.5)' }}>
            Calculate your startup's venture readiness score and apply for a strategy assessment round.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-stretch">
          {/* ── Left Column: Readiness Calculator ── */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex-1 rounded-3xl p-8 shadow-xl flex flex-col justify-between relative overflow-hidden"
              style={{ backgroundColor: '#FFF8F2', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-3xl pointer-events-none"
                style={{ background: 'linear-gradient(to bottom left, rgba(253,124,6,0.05), transparent)' }} />

              <div>
                <h3 className="text-lg font-bold flex items-center gap-2.5" style={{ color: '#000000' }}>
                  <Calculator className="h-5 w-5" style={{ color: '#FD7C06' }} />
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
                          ? { backgroundColor: '#FD7C06', borderColor: '#FD7C06', color: '#FFFFFF' }
                          : { backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.06)', color: 'rgba(0,0,0,0.5)' }}
                        onMouseEnter={(e) => { if (stage !== s) { e.currentTarget.style.borderColor = '#FD7C06'; e.currentTarget.style.color = '#FD7C06' }}}
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
                    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ color: '#CEA041', backgroundColor: 'rgba(206,160,65,0.1)' }}>${revenue}k</span>
                  </div>
                  <input type="range" min="0" max="100" step="5" value={revenue}
                    onChange={(e) => setRevenue(Number(e.target.value))}
                    className="w-full h-1 rounded-lg appearance-none cursor-pointer mt-3"
                    style={{ backgroundColor: 'rgba(0,0,0,0.06)', accentColor: '#FD7C06' }} />
                  <div className="flex justify-between text-[10px] mt-1" style={{ color: 'rgba(0,0,0,0.4)' }}>
                    <span>$0k</span>
                    <span>$100k+</span>
                  </div>
                </div>

                {/* 3. Checklist */}
                <div className="mt-6 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#000000' }}>Documentation Readiness</label>
                  {[
                    { label: 'Pitch Deck', value: hasPitchDeck, setter: setHasPitchDeck },
                    { label: 'Financial Model', value: hasFinancialModel, setter: setHasFinancialModel },
                    { label: 'Cap Table', value: hasCapTable, setter: setHasCapTable },
                    { label: 'Legal Structure', value: hasStructure, setter: setHasStructure },
                  ].map((item) => (
                    <button key={item.label} type="button" onClick={() => item.setter(!item.value)}
                      className="w-full flex items-center justify-between rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all cursor-pointer"
                      style={item.value
                        ? { backgroundColor: 'rgba(253,124,6,0.06)', borderColor: 'rgba(253,124,6,0.3)', color: '#000000' }
                        : { backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.06)', color: 'rgba(0,0,0,0.5)' }}>
                      <span className="flex items-center gap-2">
                        <Building className="h-3.5 w-3.5" style={{ color: item.value ? '#FD7C06' : 'rgba(0,0,0,0.3)' }} />
                        {item.label}
                      </span>
                      <span className="h-4 w-4 rounded flex items-center justify-center"
                        style={{ backgroundColor: item.value ? '#FD7C06' : 'rgba(0,0,0,0.06)' }}>
                        {item.value && <CheckCircle className="h-3 w-3 text-white" />}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Score */}
              <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#000000' }}>Readiness Score</span>
                  <span className="text-2xl font-extrabold" style={{ color: getScoreColor(score) }}>{Math.min(score, 100)}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
                  <motion.div className="h-full rounded-full" style={{ backgroundColor: getScoreColor(score) }}
                    initial={{ width: 0 }} animate={{ width: `${Math.min(score, 100)}%` }} transition={{ duration: 0.6 }} />
                </div>
                <p className="text-xs font-semibold mt-2" style={{ color: getScoreColor(score) }}>{getScoreLabel(score)}</p>
              </div>
            </div>
          </div>

          {/* ── Right Column: Contact Form ── */}
          <div className="lg:col-span-7">
            <div className="h-full rounded-3xl p-8 lg:p-10 shadow-xl relative overflow-hidden"
              style={{ backgroundColor: '#FFF8F2', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-3xl pointer-events-none"
                style={{ background: 'linear-gradient(to bottom left, rgba(253,124,6,0.06), transparent)' }} />

              <AnimatePresence mode="wait">
                {formState !== 'success' ? (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-6"
                    initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="pb-4" style={{ borderBottom: '1px solid rgba(253,124,6,0.15)' }}>
                      <h3 className="text-xl font-bold" style={{ color: '#000000' }}>Confidential Strategy Session</h3>
                      <p className="text-xs mt-1" style={{ color: 'rgba(0,0,0,0.5)' }}>Our partners review applications weekly. Strategy assessments are protected under standard NDA.</p>
                    </div>

                    {errorMsg && (
                      <div className="flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold"
                        style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {errorMsg}
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#000000' }}>Name *</label>
                        <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all"
                          style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.06)', color: '#000000' }}
                          onFocus={(e) => e.currentTarget.style.borderColor = '#FD7C06'}
                          onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'} />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#000000' }}>Corporate Email *</label>
                        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all"
                          style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.06)', color: '#000000' }}
                          onFocus={(e) => e.currentTarget.style.borderColor = '#FD7C06'}
                          onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'} />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="startup" className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#000000' }}>Startup / MSME Name</label>
                      <input id="startup" type="text" value={startup} onChange={(e) => setStartup(e.target.value)}
                        placeholder="Company name"
                        className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all"
                        style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.06)', color: '#000000' }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#FD7C06'}
                        onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'} />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#000000' }}>How can we help? *</label>
                      <textarea id="message" required rows={4} value={message} onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe your current status, advisory needs, or funding timeline."
                        className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all resize-none"
                        style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.06)', color: '#000000' }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#FD7C06'}
                        onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'} />
                    </div>

                    <div className="flex items-center justify-between gap-4 flex-wrap pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                      <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(0,0,0,0.5)' }}>
                        <Shield className="h-4 w-4" style={{ color: '#FD7C06' }} />
                        <span>Data protected under 256-bit encryption</span>
                      </div>
                      <button type="submit" disabled={formState === 'submitting'}
                        className="group inline-flex items-center gap-2 rounded-xl text-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider hover:scale-105 transition-all duration-300 disabled:opacity-50 shadow-md cursor-pointer"
                        style={{ backgroundColor: '#000000' }}
                        onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#FD7C06' }}
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
                      style={{ backgroundColor: 'rgba(253,124,6,0.08)', border: '1px solid rgba(253,124,6,0.15)' }}>
                      <CheckCircle className="h-8 w-8" style={{ color: '#FD7C06' }} />
                    </div>
                    <h3 className="text-2xl font-bold" style={{ color: '#000000' }}>Application Submitted!</h3>
                    <p className="mt-3 text-sm leading-relaxed max-w-md" style={{ color: 'rgba(0,0,0,0.5)' }}>
                      Thank you, <strong style={{ color: '#000000' }}>{name}</strong>. We received your request for <strong style={{ color: '#000000' }}>{startup || 'your business'}</strong>.
                    </p>

                    <div className="mt-8 rounded-2xl p-6 w-full max-w-md text-left"
                      style={{ backgroundColor: '#FFF8F2', border: '1px solid rgba(0,0,0,0.06)' }}>
                      <h4 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#000000' }}>
                        <Sparkles className="h-4 w-4" style={{ color: '#CEA041' }} />
                        Next steps based on score ({score}%):
                      </h4>
                      <ul className="space-y-2.5 text-xs" style={{ color: 'rgba(0,0,0,0.5)' }}>
                        <li className="flex gap-2">
                          <span className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: '#CEA041' }} />
                          An Antara advisor will review your submitted files within 24 hours.
                        </li>
                        <li className="flex gap-2">
                          <span className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: '#CEA041' }} />
                          We will share custom recommendations to improve your score.
                        </li>
                        <li className="flex gap-2">
                          <span className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: '#CEA041' }} />
                          A scheduling link for a confidential Zoom session will be sent to <strong style={{ color: '#000000' }}>{email}</strong>.
                        </li>
                      </ul>
                    </div>

                    <button onClick={resetForm}
                      className="mt-8 text-xs font-semibold transition-all cursor-pointer"
                      style={{ color: '#CEA041' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#FD7C06'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#CEA041'}>
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
