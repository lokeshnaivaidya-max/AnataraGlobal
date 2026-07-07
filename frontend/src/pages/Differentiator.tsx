import { Link } from 'wouter'
import { motion } from 'framer-motion'
import { ShieldOff, XCircle, Ban, Building2, GraduationCap, ShieldCheck, Network, TrendingUp, Sparkles, ArrowRight } from 'lucide-react'

const notItems = [
  { icon: Ban, label: 'Loan Agency', desc: 'Not focused on only providing financial products.' },
  { icon: XCircle, label: 'Funding Broker', desc: 'We do not promise or sell funding opportunities.' },
  { icon: GraduationCap, label: 'Training Institute', desc: 'We focus on practical business readiness, not only learning sessions.' },
  { icon: ShieldOff, label: 'Investment Guarantee Platform', desc: 'We do not guarantee investments, funding, or capital commitments.' },
  { icon: Building2, label: 'Generic Consultancy', desc: 'We provide ecosystem-driven strategic support beyond standard consulting.' },
]

const areItems = [
  {
    icon: ShieldCheck, title: 'Prepare',
    points: ['Strategic guidance', 'Business readiness support', 'Financial knowledge', 'Growth planning'],
  },
  {
    icon: Network, title: 'Connect',
    points: ['Advisors', 'Investors', 'Industry experts', 'Strategic partners', 'Ecosystem networks'],
  },
  {
    icon: TrendingUp, title: 'Grow',
    points: ['Opportunities', 'Partnerships', 'Long-term value creation', 'Sustainable business development'],
  },
]

export default function Differentiator() {
  return (
    <>
      {/* ── Hero (left: content, right: journey timeline) ── */}
      <section className="relative min-h-screen overflow-hidden pt-28 pb-16" style={{ backgroundColor: '#FFF8F2' }}>
        <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, transparent, var(--color-accent), transparent)' }} />
        <div className="mx-auto relative w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left: Content */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold border text-white"
                style={{ backgroundColor: '#000000', borderColor: '#000000' }}>
                <Sparkles className="h-3.5 w-3.5" />
                Strategic Business Advisory
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="mt-6 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight" style={{ color: '#000000' }}>
                What Makes <span style={{ color: 'var(--color-accent)' }}>Antara Global</span> Different
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="mt-6 text-base sm:text-lg leading-relaxed max-w-xl min-h-[4.5rem]" style={{ color: 'rgba(0,0,0,0.6)' }}>
                Antara Global helps startups, MSMEs, and emerging businesses grow through strategic advisory, investor readiness, partnerships, and capital connections—delivering ecosystem-driven, long-term growth beyond traditional consulting.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 flex flex-wrap gap-4">
                <Link href="/services"
                  className="group inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold border-2 border-black shadow-lg transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: '#FFFFFF', color: '#000000' }}>
                  Explore Services <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/contact"
                  className="inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: '#000000' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}>
                  Book Consultation
                </Link>
              </motion.div>
            </div>

            {/* Right: Journey Timeline */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              className="rounded-3xl p-8 sm:p-10" style={{ backgroundColor: '#000000', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-center mb-10">
                <div style={{ width: 60, height: 3, backgroundColor: 'var(--color-accent)', margin: '0 auto 0.75rem', borderRadius: 2 }} />
                <p className="text-sm uppercase tracking-widest font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>✦ Your Journey with Antara Global ✦</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2" style={{ color: '#FFFFFF' }}>
                  From Discovery to <span style={{ color: 'var(--color-accent)' }}>Growth</span>
                </h3>
              </div>

              {/* Desktop horizontal timeline */}
              <div className="hidden md:block relative py-4">
                <div className="absolute top-[24px] left-[8%] right-[8%] h-[2px] rounded" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.15), var(--color-accent), rgba(255,255,255,0.15))' }} />
                <div className="flex justify-between items-start">
                  {[
                    { step: '01', title: 'Discovery', desc: 'Assess readiness & identify gaps' },
                    { step: '02', title: 'Strategy', desc: 'Develop tailored growth roadmap' },
                    { step: '03', title: 'Connect', desc: 'Access capital & ecosystem' },
                    { step: '04', title: 'Grow', desc: 'Scale & create lasting value' },
                  ].map((t, idx) => (
                    <div key={t.step} className="flex flex-col items-center flex-1 relative z-10">
                      <div className="w-4 h-4 rounded-full border-2 mb-3"
                        style={{ backgroundColor: idx === 0 ? 'var(--color-accent)' : '#000000', borderColor: 'var(--color-accent)', boxShadow: idx === 0 ? '0 0 16px rgba(0,128,129,0.25)' : 'none' }} />
                      <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Step {t.step}</span>
                      <span className="text-sm font-bold mt-1 text-center" style={{ color: '#FFFFFF' }}>{t.title}</span>
                      <span className="text-xs text-center mt-0.5 leading-tight max-w-[130px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{t.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile vertical timeline */}
              <div className="md:hidden relative">
                <div className="absolute left-[9px] top-0 bottom-0 w-px" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
                <div className="space-y-6">
                  {[
                    { step: '01', title: 'Discovery', desc: 'Assess readiness & identify gaps' },
                    { step: '02', title: 'Strategy', desc: 'Develop tailored growth roadmap' },
                    { step: '03', title: 'Connect', desc: 'Access capital & ecosystem' },
                    { step: '04', title: 'Grow', desc: 'Scale & create lasting value' },
                  ].map((t, idx) => (
                    <motion.div key={t.step} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + idx * 0.1 }}
                      className="relative pl-10">
                      <div className="absolute left-[3px] top-1 w-3 h-3 rounded-full border-2" style={{ backgroundColor: idx === 0 ? 'var(--color-accent)' : '#000000', borderColor: 'var(--color-accent)' }} />
                      <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Step {t.step}</span>
                        <h4 className="text-sm font-bold mt-0.5" style={{ color: '#FFFFFF' }}>{t.title}</h4>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{t.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Two-Column Comparison ── */}
      <section className="relative py-24 lg:py-32 overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl" style={{ backgroundColor: 'rgba(0,128,129,0.06)' }} />
        </div>
        <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, transparent, var(--color-accent), transparent)' }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14">
            <div style={{ width: 60, height: 2, backgroundColor: 'var(--color-accent)', margin: '0 auto 1rem', borderRadius: 2 }} />
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold border mb-6"
              style={{ backgroundColor: 'rgba(0,128,129,0.1)', borderColor: 'rgba(0,128,129,0.25)', color: 'var(--color-accent)' }}>
              <Sparkles className="h-3.5 w-3.5" /> What We Are / What We Are Not
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Two Sides of the <span style={{ color: 'var(--color-accent)' }}>Same Mission</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10 items-start">

            {/* ── LEFT: We Are Not ── */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="rounded-3xl p-8 sm:p-10 border" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.2)' }}>
              <div className="relative mb-8 text-center">
                <h3 className="text-3xl sm:text-4xl font-extralight tracking-wide text-white">
                  We Are <span className="font-bold" style={{ color: 'var(--color-accent-light)' }}>Not</span>
                </h3>
              </div>

              <div className="space-y-3">
                {notItems.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <motion.div key={item.label}
                      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }}
                      className="rounded-xl border-l-[3px] p-4 transition-all duration-300 hover:translate-x-1 hover:shadow-lg"
                      style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderLeftColor: '#766D6D', borderTop: '1px solid #766D6D', borderRight: '1px solid #766D6D', borderBottom: '1px solid #766D6D' }}>
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--color-accent-light)' }}>
                          <Icon className="h-4 w-4" style={{ color: '#FFFFFF' }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm text-white">{item.label}</h4>
                            <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#9B1C1C' }}>✕ Not</span>
                          </div>
                          <p className="mt-0.5 text-xs font-light" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.desc}</p>
                        </div>
                        <span className="text-lg font-light shrink-0" style={{ color: 'var(--color-accent-light)' }}>✕</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* ── RIGHT: We Are ── */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="rounded-3xl p-8 sm:p-10 border" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.2)' }}>
              <div className="relative mb-8 text-center">
                <h3 className="text-3xl sm:text-4xl font-extralight tracking-wide text-white">
                  We Are <span className="font-bold" style={{ color: 'var(--color-accent)' }}>Antara</span>
                </h3>
              </div>

              {/* Highlight Card */}
              <div className="rounded-2xl p-6 sm:p-7 mb-6 text-white text-center relative overflow-hidden shadow-lg border"
                style={{ backgroundColor: '#000000', borderColor: '#9B9494' }}>
                <div className="absolute top-[-50%] right-[-20%] w-[200px] h-[200px] rounded-full" style={{ backgroundColor: 'rgba(0,128,129,0.05)' }} />
                <p className="relative z-10 text-base sm:text-lg font-light leading-relaxed text-white">
                  <strong className="font-bold">Strategic Business Advisory</strong> · Venture Readiness ·<br />
                  Fundraising Support &amp; <strong className="font-bold">Capital Connectivity Ecosystem</strong>
                </p>
                <p className="relative z-10 text-sm mt-2 font-light text-white">
                  Antara Global helps businesses become growth-ready and investment-ready
                </p>
              </div>

              {/* Feature Grid */}
              <div className="space-y-4">
                {areItems.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title}
                      className="rounded-2xl border p-5 sm:p-6 transition-all duration-300 hover:shadow-lg"
                      style={{ backgroundColor: '#000000', borderColor: 'var(--color-accent)' }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(0,128,129,0.6)'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}>
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                        <div className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2 sm:w-20 shrink-0">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: 'var(--color-accent)' }}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-white">Phase {idx + 1}</span>
                            <h4 className="text-lg font-extrabold leading-tight text-white">{item.title}</h4>
                          </div>
                        </div>
                        <div className="flex-1 grid sm:grid-cols-2 gap-x-6 gap-y-2">
                          {item.points.map((pt) => (
                            <div key={pt} className="flex items-center gap-2.5 py-1">
                              <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--color-accent)' }} />
                              <span className="text-sm text-white">{pt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

            </motion.div>

          </div>
        </div>
      </section>



      {/* ── Brand Statement ── */}
      <section className="relative py-20 lg:py-28 overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl" style={{ backgroundColor: 'rgba(0,128,129,0.08)' }} />
        </div>
        <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, transparent, var(--color-accent), transparent)' }} />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ width: 60, height: 2, backgroundColor: 'var(--color-accent)', margin: '0 auto 1rem', borderRadius: 2 }} />
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold border mb-6"
              style={{ backgroundColor: 'rgba(0,128,129,0.1)', borderColor: 'rgba(0,128,129,0.25)', color: 'var(--color-accent)' }}>
              <Sparkles className="h-3.5 w-3.5" /> Our Promise
            </span>
            <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              <span style={{ color: 'var(--color-accent)' }}>Prepare.</span> Connect. <span style={{ color: 'var(--color-accent-light)' }}>Capitalize.</span> Scale.
            </p>
            <p className="mt-6 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
              We bridge the gap between businesses, knowledge, capital, and opportunities to create sustainable growth journeys.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
