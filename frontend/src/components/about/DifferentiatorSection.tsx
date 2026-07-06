import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldOff, XCircle, Ban, Building2, GraduationCap,
  ShieldCheck, Network, TrendingUp,
  CheckCircle2, Sparkles
} from 'lucide-react'

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
    color: 'emerald'
  },
  {
    icon: Network, title: 'Connect',
    points: ['Advisors', 'Investors', 'Industry experts', 'Strategic partners', 'Ecosystem networks'],
    color: 'gold'
  },
  {
    icon: TrendingUp, title: 'Grow',
    points: ['Opportunities', 'Partnerships', 'Long-term value creation', 'Sustainable business development'],
    color: 'emerald'
  },
]

export default function DifferentiatorSection() {
  const [activeSide, setActiveSide] = useState<'not' | 'are'>('are')

  return (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-px bg-gradient-to-l from-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute top-1/4 right-10 w-48 h-48 rounded-full bg-gold/5 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-10 w-48 h-48 rounded-full bg-emerald/5 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-gold/5 px-4 py-1.5 text-xs font-semibold text-gold border border-gold/20 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            More Than Consulting. A Complete Growth Ecosystem.
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-deep-navy tracking-tight">
            What Makes Antara Global Different
          </h2>
          <p className="mt-4 text-medium-gray text-base leading-relaxed max-w-2xl mx-auto">
            Antara Global goes beyond traditional business support by combining strategy, knowledge,
            partnerships, venture readiness, and capital connectivity to help businesses prepare, connect, and grow.
          </p>
        </motion.div>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-2xl bg-light-gray border border-border-gray p-1.5">
            {(['not', 'are'] as const).map((side) => (
              <button
                key={side}
                onClick={() => setActiveSide(side)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeSide === side
                    ? 'bg-white text-deep-navy shadow-md'
                    : 'text-medium-gray hover:text-deep-navy'
                }`}
              >
                {side === 'not' ? 'We Are Not' : 'We Are'}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeSide === 'not' ? (
            <motion.div
              key="not"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto"
            >
              {notItems.map((item) => (
                <div
                  key={item.label}
                  className="group relative rounded-2xl border border-red-200/60 bg-red-50/40 p-6 hover:shadow-lg hover:border-red-300/60 transition-all duration-300"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-deep-navy text-sm">{item.label}</h3>
                  <p className="mt-2 text-xs text-medium-gray leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="are"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto"
            >
              <div className="rounded-3xl bg-gradient-to-br from-deep-navy via-deep-navy to-deep-navy-dark border border-white/5 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gold/5 blur-3xl animate-pulse-glow" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

                <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
                  Strategic Business Advisory, Venture Readiness, Fundraising Support & Capital Connectivity Ecosystem
                </h3>
                <p className="text-white/60 text-sm mt-2 mb-10 max-w-2xl">
                  Antara Global helps businesses become growth-ready and investment-ready through:
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                  {areItems.map((item) => {
                    const Icon = item.icon
                    const isGold = item.color === 'gold'
                    return (
                      <div
                        key={item.title}
                        className="rounded-2xl bg-white/[0.03] border border-white/5 p-6 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 group"
                      >
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border mb-5 transition-all duration-300 group-hover:scale-110 ${
                          isGold
                            ? 'bg-gold/15 border-gold/20 text-gold group-hover:shadow-lg group-hover:shadow-gold/10'
                            : 'bg-emerald/15 border-emerald/20 text-emerald-light group-hover:shadow-lg group-hover:shadow-emerald/10'
                        }`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <h4 className={`text-lg font-extrabold mb-4 ${
                          isGold ? 'text-gold-light' : 'text-emerald-light'
                        }`}>{item.title}</h4>
                        <ul className="space-y-2.5">
                          {item.points.map((point) => (
                            <li key={point} className="flex items-center gap-2 text-xs text-white/70">
                              <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 ${
                                isGold ? 'text-gold' : 'text-emerald'
                              }`} />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-10 pt-8 border-t border-white/5 text-center">
                  <p className="text-lg sm:text-xl font-bold text-white">
                    Prepare. Connect. Capitalize. Scale.
                  </p>
                  <p className="text-sm text-white/50 mt-2">
                    We bridge the gap between businesses, knowledge, capital, and opportunities to create sustainable growth journeys.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
