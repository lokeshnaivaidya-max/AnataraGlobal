import { useState, useRef, useCallback } from 'react'
import { Link } from 'wouter'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Sparkles, Lightbulb,
  Building2, Rocket, HeartHandshake, Cpu, Cloud, GraduationCap,
  ShoppingBag, Heart, CheckCircle2, Play, TrendingUp
} from 'lucide-react'

const audienceTabs = [
  {
    id: 'startups',
    label: 'Startups',
    icon: Rocket,
    subGroups: [
      {
        title: 'Early-Stage Ventures',
        desc: 'Support for businesses building their foundation.',
        points: ['Business strategy', 'Market validation', 'Business structure', 'Growth planning', 'Readiness assessment'],
      },
      {
        title: 'Growth-Stage Startups',
        desc: 'Supporting startups preparing for expansion and investment opportunities.',
        points: ['Scaling strategy', 'Investor readiness', 'Financial planning', 'Fundraising preparation', 'Strategic partnerships'],
      },
      {
        title: 'Innovation-Led Businesses',
        desc: 'Supporting businesses building new solutions and market opportunities.',
        points: ['Innovation strategy', 'Ecosystem connections', 'Growth opportunities', 'Market positioning'],
      },
    ],
  },
  {
    id: 'msmes',
    label: 'MSMEs',
    icon: Building2,
    subGroups: [
      {
        title: 'Manufacturing Businesses',
        desc: 'Support areas for manufacturing enterprises.',
        points: ['Growth strategy', 'Operational improvement', 'Expansion planning', 'Business transformation'],
      },
      {
        title: 'Service Enterprises',
        desc: 'Support areas for service-based businesses.',
        points: ['Market positioning', 'Process improvement', 'Scaling strategy', 'Business optimization'],
      },
      {
        title: 'Family-Owned Businesses',
        desc: 'Support areas for family enterprises.',
        points: ['Business restructuring', 'Governance improvement', 'Succession planning', 'Long-term growth'],
      },
      {
        title: 'Export-Oriented Enterprises',
        desc: 'Support areas for export-focused businesses.',
        points: ['Expansion planning', 'Market opportunities', 'Strategic connections', 'Growth readiness'],
      },
    ],
  },
  {
    id: 'emerging',
    label: 'Emerging Businesses',
    icon: Lightbulb,
    industries: [
      { icon: Heart, label: 'Healthcare Ventures', points: ['Growth planning', 'Business strategy', 'Ecosystem connections'] },
      { icon: Cpu, label: 'Technology Companies', points: ['Scaling strategy', 'Innovation support', 'Strategic partnerships'] },
      { icon: Cloud, label: 'SaaS Businesses', points: ['Growth systems', 'Market positioning', 'Investment readiness'] },
      { icon: GraduationCap, label: 'EdTech Organizations', points: ['Business expansion', 'Strategic planning', 'Partnership opportunities'] },
      { icon: ShoppingBag, label: 'D2C Brands', points: ['Brand growth', 'Market positioning', 'Business scalability'] },
      { icon: HeartHandshake, label: 'Social Enterprises', points: ['Sustainable growth', 'Impact strategy', 'Ecosystem collaboration'] },
    ],
  },
]

const journeyStages = [
  { stage: 'Stage 1', title: 'Foundation', desc: 'For early businesses building structure and direction.' },
  { stage: 'Stage 2', title: 'Growth', desc: 'For businesses improving operations and market position.' },
  { stage: 'Stage 3', title: 'Investment Readiness', desc: 'For businesses preparing for capital opportunities.' },
  { stage: 'Stage 4', title: 'Expansion', desc: 'For businesses scaling through partnerships and ecosystems.' },
]

function GrowthChart() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [mouseX, setMouseX] = useState<number | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)

  const pathRef = useRef<SVGPathElement>(null)
  const linePath = 'M50,210 C100,190 140,170 180,120 S260,80 310,40 S380,30 420,15'
  const arrowPath = 'M420,15 L405,30 M420,15 L412,5'

  const getValueAtX = useCallback((svgX: number) => {
    const clampedX = Math.max(50, Math.min(440, svgX))
    let value = 0
    let y = 250
    const path = pathRef.current
    if (path) {
      const totalLen = path.getTotalLength()
      for (let i = 0; i <= 100; i++) {
        const pt = path.getPointAtLength((i / 100) * totalLen)
        if (pt.x >= clampedX) {
          const prevPt = path.getPointAtLength(Math.max(0, ((i - 1) / 100) * totalLen))
          const frac = (clampedX - prevPt.x) / (pt.x - prevPt.x || 1)
          y = prevPt.y + (pt.y - prevPt.y) * frac
          break
        }
        if (i === 100) { y = pt.y }
      }
      value = Math.round((1 - (y - 30) / 220) * 100)
    } else {
      const t = (clampedX - 50) / 390
      value = Math.round(t * 95 + 5)
    }
    return { value, svgX: clampedX, y }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const svgX = ((e.clientX - rect.left) / rect.width) * 480
    setMouseX(Math.max(50, Math.min(440, svgX)))
  }, [])

  const cursorInfo = mouseX !== null ? getValueAtX(mouseX) : null
  const showCrosshair = showTooltip && cursorInfo && mouseX !== null

  return (
    <div className="relative w-full max-w-lg aspect-[4/3] rounded-3xl p-6 select-none" style={{ backgroundColor: '#1A1A1A' }}>
      <svg ref={svgRef} className="w-full h-full" viewBox="0 0 480 300" preserveAspectRatio="xMidYMid meet"
        onMouseMove={handleMouseMove} onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => { setShowTooltip(false); setMouseX(null) }}
        style={{ cursor: 'crosshair' }}>
        {/* Grid lines */}
        <line x1="50" y1="250" x2="440" y2="250" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" strokeDasharray="4,4" />
        <line x1="50" y1="200" x2="440" y2="200" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" strokeDasharray="4,4" />
        <line x1="50" y1="150" x2="440" y2="150" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" strokeDasharray="4,4" />
        <line x1="50" y1="100" x2="440" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" strokeDasharray="4,4" />
        <line x1="50" y1="50" x2="440" y2="50" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" strokeDasharray="4,4" />

        {/* Axis lines */}
        <line x1="50" y1="250" x2="440" y2="250" stroke="#FFFFFF" strokeWidth="1" />
        <line x1="50" y1="250" x2="50" y2="30" stroke="#FFFFFF" strokeWidth="1" />

        {/* Y-axis labels */}
        <text x="42" y="254" textAnchor="end" fill="rgba(255,255,255,0.5)" fontSize="11" fontWeight="500">0</text>
        <text x="42" y="204" textAnchor="end" fill="rgba(255,255,255,0.5)" fontSize="11" fontWeight="500">25</text>
        <text x="42" y="154" textAnchor="end" fill="rgba(255,255,255,0.5)" fontSize="11" fontWeight="500">50</text>
        <text x="42" y="104" textAnchor="end" fill="rgba(255,255,255,0.5)" fontSize="11" fontWeight="500">75</text>
        <text x="42" y="54" textAnchor="end" fill="rgba(255,255,255,0.5)" fontSize="11" fontWeight="500">100</text>

        {/* X-axis labels */}
        <text x="50" y="270" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11" fontWeight="500">Foundation</text>
        <text x="170" y="270" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11" fontWeight="500">Growth</text>
        <text x="310" y="270" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11" fontWeight="500">Scale</text>
        <text x="440" y="270" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11" fontWeight="500">Expansion</text>

        {/* Gradient under line */}
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${linePath} L440,250 L50,250 Z`} fill="url(#areaGrad)">
          <animate attributeName="opacity" from="0" to="1" dur="1.2s" begin="0.6s" fill="freeze" />
        </path>

        {/* Animated line */}
        <path ref={pathRef} d={linePath} stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"
          strokeDasharray="700" strokeDashoffset="700">
          <animate attributeName="strokeDashoffset" from="700" to="0" dur="1.5s" begin="0.3s" fill="freeze" />
        </path>

        {/* Animated dots */}
        <circle cx="140" cy="170" r="5" fill="#FFFFFF" stroke="var(--color-accent)" strokeWidth="2.5" opacity="0">
          <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="0.9s" fill="freeze" />
        </circle>
        <circle cx="310" cy="40" r="5" fill="#FFFFFF" stroke="var(--color-accent)" strokeWidth="2.5" opacity="0">
          <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="1.2s" fill="freeze" />
        </circle>
        <circle cx="420" cy="15" r="6" fill="var(--color-accent)" stroke="#FFFFFF" strokeWidth="3" opacity="0">
          <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="1.5s" fill="freeze" />
        </circle>

        {/* Upward arrow */}
        <g opacity="0">
          <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin="2s" fill="freeze" />
          <path d={arrowPath} stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>

        {/* Pulsing glow */}
        <circle cx="420" cy="15" r="14" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" opacity="0">
          <animate attributeName="r" values="10;20;10" dur="2s" begin="2.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" begin="2.2s" repeatCount="indefinite" />
        </circle>

        {/* Crosshair vertical line */}
        {showCrosshair && (
          <line x1={cursorInfo!.svgX} y1="30" x2={cursorInfo!.svgX} y2="250" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3,3" />
        )}

        {/* Crosshair dot on curve */}
        {showCrosshair && (
          <circle cx={cursorInfo!.svgX} cy={cursorInfo!.y} r="5" fill="var(--color-accent)" stroke="#FFFFFF" strokeWidth="2" />
        )}
      </svg>

      {/* Tooltip */}
      {showCrosshair && cursorInfo && (
        <div className="absolute px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg pointer-events-none"
          style={{
            left: `${(cursorInfo.svgX / 480) * 100}%`,
            top: `${(cursorInfo.y / 300) * 100}%`,
            transform: 'translate(-50%, -120%)',
            backgroundColor: 'var(--color-accent)',
            color: '#FFFFFF',
          }}>
          {cursorInfo.value}%
        </div>
      )}

      {/* Floating label */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.4 }}
        className="absolute top-[6%] right-[4%] flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold shadow-lg pointer-events-none"
        style={{ backgroundColor: '#FFFFFF', color: 'var(--color-accent)' }}>
        <TrendingUp className="h-3.5 w-3.5" />
        +84% Growth
      </motion.div>
    </div>
  )
}

export default function TargetAudience() {
  const [activeTab, setActiveTab] = useState('startups')

  const currentTab = audienceTabs.find(t => t.id === activeTab) || audienceTabs[0]

  return (
    <>
      {/* ── Hero (left: content, right: graph animation) ── */}
      <section className="relative min-h-[82vh] flex items-center overflow-hidden pt-28 pb-16" style={{ backgroundColor: '#FFF8F2' }}>
        <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, transparent, var(--color-accent), transparent)' }} />
        <div className="mx-auto relative max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Content */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold border mb-6"
                style={{ backgroundColor: 'rgba(51,181,181,0.08)', borderColor: 'rgba(51,181,181,0.2)', color: 'var(--color-accent-light)' }}>
                <Sparkles className="h-3.5 w-3.5" />
                Target Audience
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight" style={{ color: '#000000' }}>
                Empowering Businesses<br />
                <span style={{ color: 'var(--color-accent)' }}>At Every Growth Stage</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="mt-6 text-base sm:text-lg leading-relaxed max-w-xl" style={{ color: 'rgba(0,0,0,0.6)' }}>
                Antara Global works with startups, MSMEs, entrepreneurs, and emerging businesses by providing strategic guidance, venture readiness support, financial knowledge, and access to growth opportunities.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 flex flex-wrap gap-4">
                <Link href="/services"
                  className="group inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  style={{ backgroundColor: '#000000' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}>
                  Explore Our Solutions <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/contact"
                  className="inline-flex items-center gap-2.5 rounded-xl border px-6 py-3.5 text-sm font-semibold hover:scale-105 transition-all duration-300"
                  style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.12)', color: 'rgba(0,0,0,0.6)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.color = 'rgba(0,0,0,0.6)' }}>
                  <Play className="h-4 w-4" />
                  Book Consultation
                </Link>
              </motion.div>
            </div>

            {/* Right: Animated Growth Chart */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.6 }}
              className="relative flex items-center justify-center">
              <GrowthChart />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Audience Tabs ── */}
      <section className="relative py-24 lg:py-32 overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block rounded-full px-4 py-1 text-xs font-semibold tracking-widest uppercase" style={{ backgroundColor: '#000000', color: '#FFFFFF' }}>Who We Empower</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: '#000000' }}>
              Solutions For Every Business
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: 'rgba(0,0,0,0.5)' }}>
              Every business journey is different. Antara Global supports organizations at different stages by providing the right combination of strategy, knowledge, partnerships, and ecosystem access.
            </p>
          </motion.div>

          {/* Tab Selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {audienceTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
                  style={isActive
                    ? { backgroundColor: '#000000', borderColor: '#000000', color: '#FFFFFF' }
                    : { backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.06)', color: 'rgba(0,0,0,0.5)' }}
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)' }}}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'; e.currentTarget.style.color = 'rgba(0,0,0,0.5)' }}}>
                  <Icon className="h-4 w-4" style={{ color: isActive ? 'var(--color-accent-light)' : 'inherit' }} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {/* Startups / MSMEs */}
              {activeTab !== 'emerging' && currentTab.subGroups && (
                <div className={`grid sm:grid-cols-2 gap-6 ${activeTab === 'msmes' ? 'lg:grid-cols-2' : 'lg:grid-cols-3'}`}>
                  {currentTab.subGroups.map((group, idx) => (
                    <motion.div key={group.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }} whileHover={{ y: -4 }}
                      className="rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
                      style={{ backgroundColor: '#FFFFFF', border: '1px solid #000000' }}>
                      <h3 className="text-base font-extrabold mb-1" style={{ color: '#000000' }}>{group.title}</h3>
                      <p className="text-xs mb-4" style={{ color: 'rgba(0,0,0,0.5)' }}>{group.desc}</p>
                      <div className="space-y-2">
                        {group.points.map((point) => (
                          <div key={point} className="flex items-center gap-2 text-xs font-medium" style={{ color: 'rgba(0,0,0,0.7)' }}>
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--color-accent)' }} />
                            {point}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Emerging Businesses */}
              {activeTab === 'emerging' && currentTab.industries && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentTab.industries.map((ind, idx) => {
                    const IndIcon = ind.icon
                    return (
                      <motion.div key={ind.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }} whileHover={{ y: -4 }}
                        className="rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
                        style={{ backgroundColor: '#FFFFFF', border: '1px solid #000000' }}>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border mb-4"
                          style={{ backgroundColor: 'rgba(0,128,129,0.08)', borderColor: 'rgba(0,128,129,0.15)', color: 'var(--color-accent)' }}>
                          <IndIcon className="h-6 w-6" />
                        </div>
                        <h3 className="text-base font-extrabold mb-3" style={{ color: '#000000' }}>{ind.label}</h3>
                        <div className="space-y-2">
                          {ind.points.map((point) => (
                            <div key={point} className="flex items-center gap-2 text-xs font-medium" style={{ color: 'rgba(0,0,0,0.7)' }}>
                              <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--color-accent-light)' }} />
                              {point}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Growth Journey ── */}
      <section className="relative py-24 lg:py-32 overflow-hidden" style={{ backgroundColor: '#FFF8F2' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block rounded-full px-4 py-1 text-xs font-semibold tracking-widest uppercase" style={{ backgroundColor: '#000000', color: '#FFFFFF' }}>Growth Journey</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--color-accent)' }}>
              From Foundation To Scale
            </h2>
          </motion.div>

          <div className="relative">
            <div className="hidden lg:block absolute top-[13px] left-0 right-0 h-px" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
              <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="h-full origin-left" style={{ background: 'linear-gradient(90deg, var(--color-accent), var(--color-accent-light), var(--color-accent))' }} />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {journeyStages.map((stage, idx) => (
                <motion.div key={stage.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: idx * 0.12 }} className="relative">
                  <div className="hidden lg:flex relative z-10 h-[26px] items-center mb-6">
                    <div className="h-6 w-6 rounded-full bg-white border-2 flex items-center justify-center"
                      style={{ borderColor: 'var(--color-accent-light)' }}>
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--color-accent-light)' }} />
                    </div>
                  </div>

                  <div className="rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-accent-light)' }}>{stage.stage}</span>
                    <h3 className="text-lg font-extrabold mt-1" style={{ color: '#000000' }}>{stage.title}</h3>
                    <p className="text-xs mt-2" style={{ color: 'rgba(0,0,0,0.5)' }}>{stage.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>


    </>
  )
}
