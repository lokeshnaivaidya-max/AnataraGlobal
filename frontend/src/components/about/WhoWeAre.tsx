import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Handshake, LineChart, ShieldCheck, Globe, ArrowRight, Quote, Rocket, BarChart3, Building2
} from 'lucide-react'

const connections = [
  {
    id: 'advisors',
    icon: Users,
    label: 'Advisors',
    desc: 'Top-tier corporate strategy advisors, ex-founders, and functional leaders guiding business validation.',
    stat: '40+',
    statLabel: 'Active Consultants'
  },
  {
    id: 'vcs',
    icon: LineChart,
    label: 'Venture Capitals',
    desc: 'Direct deal-flow pipeline sharing with 45+ seed, early-stage, and growth-stage institutional funds.',
    stat: '45+',
    statLabel: 'Partner Funds'
  },
  {
    id: 'angels',
    icon: Globe,
    label: 'Angel Syndicates',
    desc: 'Global networks of high-net-worth angel investors and corporate executives backing early ventures.',
    stat: '150+',
    statLabel: 'Individual Angels'
  },
  {
    id: 'partners',
    icon: Handshake,
    label: 'Strategic Partners',
    desc: 'Incubators, tech enablers, and corporate service providers offering discounted ecosystems perks.',
    stat: '15+',
    statLabel: 'Ecosystem Alliances'
  },
  {
    id: 'compliance',
    icon: ShieldCheck,
    label: 'Compliance Experts',
    desc: 'Experienced legal, corporate secretary, and tax partners preparing businesses for due diligence.',
    stat: '100%',
    statLabel: 'Audit Readiness'
  },
]

const stats = [
  { value: '200+', label: 'Ecosystem Partners' },
  { value: '50+', label: 'Industries Served' },
  { value: '98%', label: 'Client Satisfaction' },
]

export default function WhoWeAre() {
  const [activeConnection, setActiveConnection] = useState('advisors')

  const currentConnection = connections.find(c => c.id === activeConnection) || connections[0]
  const ConnectionIcon = currentConnection.icon

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden" style={{ backgroundColor: '#FFF8F2' }}>
      {/* Divider */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">

          {/* ─── Left: Identity ─── */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold border mb-5" style={{ color: '#FD7C06', borderColor: 'rgba(253,124,6,0.3)', backgroundColor: 'rgba(253,124,6,0.06)' }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#FD7C06' }} />
                Our Identity
              </span>

              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-black leading-tight">
                An Integrated <br />
                <span style={{ color: '#FD7C06' }}>Venture Ecosystem</span>
              </h2>

              <div className="mt-6 space-y-5 text-sm text-black/60 leading-relaxed">
                <p>
                  Antara Global is not just an advisory agency; we are a structured, strategic business framework and capital connectivity gateway built to accelerate growth-stage businesses.
                </p>
                <p>
                  We operate at the nexus of business design, operational excellence, compliance governance, and investment relationships. Our focus is to take startups and MSMEs out of isolation and integrate them into a supportive infrastructure.
                </p>
              </div>

              {/* Quote */}
              <div className="relative mt-8 rounded-2xl p-5 border" style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.08)' }}>
                <Quote className="absolute -top-2 -left-2 h-6 w-6" style={{ color: '#FD7C06', opacity: 0.2 }} />
                <p className="text-xs italic text-black/60 leading-relaxed pl-3 border-l-2" style={{ borderColor: '#FD7C06' }}>
                  &ldquo;By aligning standard business governance with VC expectations, we help founders reduce funding cycles from months to weeks.&rdquo;
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-5 mt-10">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-3xl font-black leading-none" style={{ color: '#FD7C06' }}>{stat.value}</p>
                    <p className="text-[10px] text-black/50 uppercase tracking-wider font-semibold mt-1.5 leading-snug">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ─── Right: Ecosystem + Growth Outputs ─── */}
          <div className="lg:col-span-7 flex flex-col gap-6">

            {/* Ecosystem Orbit */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="rounded-3xl border p-6 sm:p-8 shadow-xl relative overflow-hidden"
              style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.08)' }}
            >
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 h-40 w-40 rounded-bl-[3rem] pointer-events-none opacity-30" style={{ background: 'linear-gradient(135deg, #FD7C06, transparent)' }} />

              <div className="relative">
                <h3 className="text-sm font-bold text-black flex items-center gap-2.5 mb-6">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-black text-white" style={{ backgroundColor: '#FD7C06' }}>◉</span>
                  Interactive Ecosystem Orbit
                </h3>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2">
                  {connections.map((item) => {
                    const Icon = item.icon
                    const isActive = activeConnection === item.id
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveConnection(item.id)}
                        className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all duration-300 ${
                          isActive
                            ? 'text-white shadow-md scale-105'
                            : 'text-black/60 border-black/10 bg-white hover:border-[#FC9E00]/30 hover:text-black hover:shadow-sm'
                        }`}
                        style={isActive ? { backgroundColor: '#FD7C06', borderColor: '#FD7C06' } : undefined}
                      >
                        <Icon className="h-3.5 w-3.5" style={!isActive ? { color: '#FC9E00' } : undefined} />
                        {item.label}
                      </button>
                    )
                  })}
                </div>

                {/* Active Panel */}
                <div className="mt-5 rounded-2xl p-5 border" style={{ backgroundColor: '#FFF8F2', borderColor: 'rgba(0,0,0,0.06)' }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeConnection}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FC9E00' }}>
                            <ConnectionIcon className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="text-sm font-extrabold text-black">{currentConnection.label} Pipeline</h4>
                            <span className="text-[10px] text-black/40">Connection Tier: Institutional & Trusted</span>
                          </div>
                        </div>
                        <div className="text-right rounded-xl px-3 py-1.5 border" style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.06)' }}>
                          <span className="text-sm font-black text-black">{currentConnection.stat}</span>
                          <span className="text-[9px] text-black/40 block font-medium tracking-wide uppercase">{currentConnection.statLabel}</span>
                        </div>
                      </div>
                      <p className="text-xs text-black/60 leading-relaxed">{currentConnection.desc}</p>
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between">
                    <span className="text-[10px] text-black/40">Institutional-grade matchmaking</span>
                    <a href="#contact" className="text-[10px] font-bold flex items-center gap-1" style={{ color: '#FC9E00' }}>
                      Apply for Introductions
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Growth Outputs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="relative rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
              style={{ backgroundColor: '#FD7C06' }}
            >
              <div className="absolute -inset-1 rounded-3xl blur-sm" style={{ backgroundColor: 'rgba(253,124,6,0.3)' }} />
              <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/15 text-[10px] font-bold text-white">✦</span>
                  <h3 className="text-xs font-bold text-white tracking-wider uppercase">Structured Growth Outputs</h3>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { title: 'Growth-Ready', text: 'Operational frameworks and unit economics aligned for growth.', icon: Rocket },
                    { title: 'Investment-Ready', text: 'Due diligence records, financial projections, and clear narratives.', icon: BarChart3 },
                    { title: 'Future-Ready', text: 'Corporate governance systems to scale without leadership friction.', icon: Building2 },
                  ].map((item, i) => {
                    const Icon = item.icon
                    return (
                      <div key={i} className="rounded-2xl p-5 bg-white shadow-lg hover:-translate-y-0.5 transition-transform duration-200" style={{ borderLeft: '3px solid #FC9E00' }}>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg mb-3" style={{ backgroundColor: '#FC9E00' }}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <h4 className="text-sm font-extrabold text-black">{item.title}</h4>
                        <p className="text-[11px] text-black/60 mt-1.5 leading-relaxed">{item.text}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
