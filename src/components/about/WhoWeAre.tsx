import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, Handshake, LineChart, ShieldCheck, Globe, ArrowRight
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
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-1/3 h-px bg-gradient-to-l from-gold/30 to-transparent" />
      <div className="absolute top-0 right-0 w-px h-32 bg-gradient-to-b from-gold/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-emerald/20 to-transparent" />

      {/* Subtle Dot Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #081C3A 1px, transparent 0)', backgroundSize: '50px 50px' }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Who We Are Text */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-gold" />
                <span className="text-xs font-semibold tracking-widest uppercase text-gold">
                  Our Identity
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-deep-navy tracking-tight">
                An Integrated Venture Ecosystem
              </h2>
              <div className="mt-6 space-y-6 text-medium-gray leading-relaxed text-sm">
                <p>
                  Antara Global is not just an advisory agency; we are a structured, strategic business framework and capital connectivity gateway built to accelerate growth-stage businesses.
                </p>
                <p>
                  We operate at the nexus of business design, operational excellence, compliance governance, and investment relationships. Our focus is to take startups and MSMEs out of isolation and integrate them into a supportive infrastructure.
                </p>
                <p className="border-l-2 border-gold/30 pl-4 italic text-xs text-medium-gray/80">
                  &ldquo;By aligning standard business governance with VC expectations, we help founders reduce funding cycles from months to weeks.&rdquo;
                </p>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-border-gray">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center sm:text-left">
                    <p className="text-2xl font-black text-gradient-premium">{stat.value}</p>
                    <p className="text-[10px] text-medium-gray uppercase tracking-wider font-semibold mt-1 leading-snug">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interactive Ecosystem Board */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-3xl border border-border-gray bg-light-gray p-6 sm:p-8 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-3xl bg-gradient-to-bl from-gold/5 to-transparent pointer-events-none" />
              
              <h3 className="text-sm font-bold text-deep-navy mb-5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse-glow" />
                Interactive Ecosystem Orbit
              </h3>

              {/* Connected Orbit Nodes Layout */}
              <div className="flex flex-wrap gap-2.5">
                {connections.map((item) => {
                  const Icon = item.icon
                  const isActive = activeConnection === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveConnection(item.id)}
                      className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 transition-all duration-300 ${
                        isActive
                          ? 'bg-emerald border-emerald text-white shadow-lg scale-105'
                          : 'bg-white border-border-gray text-deep-navy hover:border-gold/30 hover:shadow-md'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gold'} shrink-0`} />
                      <span className="text-xs font-bold">{item.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Active Connection Description Panel */}
              <div className="mt-6 rounded-2xl bg-white border border-border-gray p-5 sm:p-6 shadow-inner relative min-h-[160px] flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeConnection}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
                          <ConnectionIcon className="h-4 w-4" />
                        </div>
                        <h4 className="text-sm font-extrabold text-deep-navy">{currentConnection.label} Pipeline</h4>
                      </div>
                      <div className="bg-light-gray border border-border-gray rounded-lg px-2.5 py-1 text-right">
                        <span className="text-xs font-black text-deep-navy">{currentConnection.stat}</span>
                        <span className="text-[9px] text-medium-gray block font-medium tracking-wide uppercase">{currentConnection.statLabel}</span>
                      </div>
                    </div>

                    <p className="text-xs text-medium-gray leading-relaxed">
                      {currentConnection.desc}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-4 pt-4 border-t border-border-gray flex items-center justify-between text-[10px] text-medium-gray">
                  <span>Connection Tier: Institutional & Trusted</span>
                  <a href="#contact" className="font-bold text-gold hover:text-gold-dark flex items-center gap-1">
                    Apply for Introductions
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Bottom Panel: Readiness Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative rounded-3xl bg-gradient-to-br from-deep-navy via-deep-navy to-deep-navy-dark p-6 sm:p-8 border border-white/5 shadow-xl overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gold/5 blur-2xl animate-float" />
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

              <h3 className="relative text-xs font-bold text-white/50 mb-4 tracking-wider uppercase">
                Structured Growth Outputs
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { title: 'Growth-Ready', text: 'Operational frameworks and unit economics aligned for growth.' },
                  { title: 'Investment-Ready', text: 'Due diligence records, financial projections, and clear narratives.' },
                  { title: 'Future-Ready', text: 'Corporate governance systems to scale without leadership friction.' },
                ].map((item, i) => (
                  <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 flex flex-col justify-between">
                    <div>
                      <span className="h-1.5 w-1.5 rounded-full bg-gold inline-block mb-2 shadow-sm shadow-gold/50" />
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <p className="text-[10px] text-white/50 mt-1 leading-normal">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
