import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Sparkles, Lightbulb,
  Building2, Rocket, HeartHandshake, Cpu, Cloud, GraduationCap,
  ShoppingBag, Heart, CheckCircle2, Play
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

export default function TargetAudience() {
  const [activeTab, setActiveTab] = useState('startups')

  const currentTab = audienceTabs.find(t => t.id === activeTab) || audienceTabs[0]

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[65vh] flex items-center overflow-hidden bg-gradient-to-br from-deep-navy via-deep-navy-dark to-deep-navy pt-28 pb-16">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-80 h-80 rounded-full bg-emerald/10 blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-gold/10 blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold text-emerald-light border border-emerald/20 mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-light" />
              Target Audience
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight"
            >
              Empowering Businesses<br />
              <span className="bg-gradient-to-r from-emerald-light via-emerald to-emerald-dark bg-clip-text text-transparent">
                At Every Growth Stage
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-white/70 leading-relaxed max-w-xl"
            >
              Antara Global works with startups, MSMEs, entrepreneurs, and emerging businesses by providing
              strategic guidance, venture readiness support, financial knowledge, and access to growth opportunities.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <a
                href="/services"
                className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald to-emerald-dark px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald/20 hover:shadow-xl hover:shadow-emerald/30 hover:scale-105 transition-all duration-300"
              >
                Explore Our Solutions
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/25 hover:scale-105 transition-all duration-300"
              >
                <Play className="h-4 w-4 fill-white/10" />
                Book Consultation
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Audience Tabs */}
      <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <span className="text-xs font-semibold tracking-widest uppercase text-gold">Who We Empower</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-deep-navy tracking-tight">
              Solutions For Every Business
            </h2>
            <p className="mt-4 text-medium-gray text-base leading-relaxed">
              Every business journey is different. Antara Global supports organizations at different stages
              by providing the right combination of strategy, knowledge, partnerships, and ecosystem access.
            </p>
          </motion.div>

          {/* Tab Selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {audienceTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? 'bg-deep-navy text-white border-deep-navy shadow-lg scale-105'
                      : 'bg-white text-medium-gray border-border-gray hover:border-deep-navy/30 hover:text-deep-navy'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-gold' : ''}`} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Startups / MSMEs */}
              {activeTab !== 'emerging' && currentTab.subGroups && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentTab.subGroups.map((group, idx) => (
                    <motion.div
                      key={group.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      whileHover={{ y: -4 }}
                      className="rounded-2xl border border-border-gray bg-light-gray/50 p-6 shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <h3 className="text-base font-extrabold text-deep-navy mb-1">{group.title}</h3>
                      <p className="text-xs text-medium-gray mb-4">{group.desc}</p>
                      <div className="space-y-2">
                        {group.points.map((point) => (
                          <div key={point} className="flex items-center gap-2 text-xs text-deep-navy/70 font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald shrink-0" />
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
                      <motion.div
                        key={ind.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        whileHover={{ y: -4 }}
                        className="rounded-2xl border border-border-gray bg-light-gray/50 p-6 shadow-md hover:shadow-xl hover:border-gold/30 transition-all duration-300"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold/15 to-gold/5 text-gold border border-gold/15 mb-4">
                          <IndIcon className="h-6 w-6" />
                        </div>
                        <h3 className="text-base font-extrabold text-deep-navy mb-3">{ind.label}</h3>
                        <div className="space-y-2">
                          {ind.points.map((point) => (
                            <div key={point} className="flex items-center gap-2 text-xs text-deep-navy/70 font-medium">
                              <span className="h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
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

      {/* Business Growth Journey */}
      <section className="relative py-24 lg:py-32 bg-light-gray overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-xs font-semibold tracking-widest uppercase text-gold">Growth Journey</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-deep-navy tracking-tight">
              From Foundation To Scale
            </h2>
          </motion.div>

          <div className="relative">
            <div className="hidden lg:block absolute top-[44px] left-0 right-0 h-px bg-border-gray">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="h-full origin-left bg-gradient-to-r from-emerald via-gold to-emerald"
              />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {journeyStages.map((stage, idx) => (
                <motion.div
                  key={stage.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.12 }}
                  className="relative"
                >
                  <div className="hidden lg:flex relative z-10 h-[26px] items-center mb-6">
                    <div className="h-6 w-6 rounded-full bg-white border-2 border-gold shadow-lg shadow-gold/20 flex items-center justify-center">
                      <span className="h-2 w-2 rounded-full bg-gold animate-pulse-glow" />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border-gray bg-white p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gold">{stage.stage}</span>
                    <h3 className="text-lg font-extrabold text-deep-navy mt-1">{stage.title}</h3>
                    <p className="text-xs text-medium-gray mt-2">{stage.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 bg-deep-navy overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Grow Your Business?
          </h2>
          <p className="mt-4 text-white/60 text-lg max-w-xl mx-auto">
            Let us help you build the foundation for sustainable success.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-dark px-6 py-3 text-sm font-bold uppercase tracking-wider text-deep-navy shadow-md hover:shadow-lg hover:shadow-gold/30 hover:scale-105 transition-all duration-300"
            >
              Start Your Journey
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10 transition-all duration-300"
            >
              View Our Services
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
