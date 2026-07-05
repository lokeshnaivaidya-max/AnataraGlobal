import { motion } from 'framer-motion'
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Cloud,
  Cpu,
  Factory,
  Globe2,
  GraduationCap,
  Heart,
  HeartHandshake,
  Lightbulb,
  Network,
  Play,
  Rocket,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'

const growthJourney = ['Idea', 'Startup', 'Growth', 'Expansion', 'Scale']

const startupGroups = [
  {
    icon: Lightbulb,
    title: 'Early-Stage Ventures',
    desc: 'Support for businesses building their foundation.',
    points: ['Business strategy', 'Market validation', 'Business structure', 'Growth planning', 'Readiness assessment'],
  },
  {
    icon: Rocket,
    title: 'Growth-Stage Startups',
    desc: 'Supporting startups preparing for expansion and investment opportunities.',
    points: ['Scaling strategy', 'Investor readiness', 'Financial planning', 'Fundraising preparation', 'Strategic partnerships'],
  },
  {
    icon: Target,
    title: 'Innovation-Led Businesses',
    desc: 'Supporting businesses building new solutions and market opportunities.',
    points: ['Innovation strategy', 'Ecosystem connections', 'Growth opportunities', 'Market positioning'],
  },
]

const msmeGroups = [
  {
    icon: Factory,
    title: 'Manufacturing Businesses',
    desc: 'Support areas:',
    points: ['Growth strategy', 'Operational improvement', 'Expansion planning', 'Business transformation'],
  },
  {
    icon: Building2,
    title: 'Service Enterprises',
    desc: 'Support areas:',
    points: ['Market positioning', 'Process improvement', 'Scaling strategy', 'Business optimization'],
  },
  {
    icon: Users,
    title: 'Family-Owned Businesses',
    desc: 'Support areas:',
    points: ['Business restructuring', 'Governance improvement', 'Succession planning', 'Long-term growth'],
  },
  {
    icon: Globe2,
    title: 'Export-Oriented Enterprises',
    desc: 'Support areas:',
    points: ['Expansion planning', 'Market opportunities', 'Strategic connections', 'Growth readiness'],
  },
]

const emergingIndustries = [
  { icon: Heart, label: 'Healthcare Ventures', points: ['Growth planning', 'Business strategy', 'Ecosystem connections'] },
  { icon: Cpu, label: 'Technology Companies', points: ['Scaling strategy', 'Innovation support', 'Strategic partnerships'] },
  { icon: Cloud, label: 'SaaS Businesses', points: ['Growth systems', 'Market positioning', 'Investment readiness'] },
  { icon: GraduationCap, label: 'EdTech Organizations', points: ['Business expansion', 'Strategic planning', 'Partnership opportunities'] },
  { icon: ShoppingBag, label: 'D2C Brands', points: ['Brand growth', 'Market positioning', 'Business scalability'] },
  { icon: HeartHandshake, label: 'Social Enterprises', points: ['Sustainable growth', 'Impact strategy', 'Ecosystem collaboration'] },
]

const journeyStages = [
  { stage: 'Stage 1', title: 'Foundation', desc: 'For early businesses building structure and direction.' },
  { stage: 'Stage 2', title: 'Growth', desc: 'For businesses improving operations and market position.' },
  { stage: 'Stage 3', title: 'Investment Readiness', desc: 'For businesses preparing for capital opportunities.' },
  { stage: 'Stage 4', title: 'Expansion', desc: 'For businesses scaling through partnerships and ecosystems.' },
]

export default function TargetAudience() {
  return (
    <>
      <section className="relative flex min-h-[82vh] items-center overflow-hidden bg-gradient-to-br from-deep-navy via-deep-navy-dark to-deep-navy pt-28 pb-16">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 h-80 w-80 rounded-full bg-emerald/10 blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 right-10 h-80 w-80 rounded-full bg-gold/10 blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-emerald to-transparent" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald/20 bg-white/5 px-4 py-1.5 text-xs font-semibold text-emerald-light"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-light" />
              Target Audience
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
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
              className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
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
                className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald to-emerald-dark px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald/30"
              >
                Explore Our Solutions
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/25 hover:bg-white/10"
              >
                <Play className="h-4 w-4 fill-white/10" />
                Book Consultation
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-6"
          >
            <div className="relative mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-deep-navy-dark/30 backdrop-blur-md sm:p-7">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-emerald/20 via-gold/10 to-transparent blur-md" />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-deep-navy-dark/60 p-5">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Growth journey illustration</p>
                    <h2 className="mt-1 text-xl font-extrabold text-white">Idea to scalable enterprise</h2>
                  </div>
                  <TrendingUp className="h-8 w-8 text-gold" />
                </div>
                <div className="relative">
                  <div className="absolute left-5 top-6 bottom-6 w-px bg-white/10 sm:left-1/2 sm:top-5 sm:bottom-auto sm:h-px sm:w-full sm:-translate-x-1/2" />
                  <div className="grid gap-4 sm:grid-cols-5">
                    {growthJourney.map((item, index) => (
                      <div key={item} className="relative flex items-center gap-3 sm:flex-col sm:text-center">
                        <div className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-xs font-black ${
                          index % 2 === 0
                            ? 'border-emerald/30 bg-emerald/15 text-emerald-light'
                            : 'border-gold/30 bg-gold/15 text-gold-light'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="text-sm font-bold text-white">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-16 max-w-3xl text-center"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">Who We Empower</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-deep-navy sm:text-4xl">
              Who We Empower
            </h2>
            <p className="mt-4 text-base leading-relaxed text-medium-gray">
              Every business journey is different. Antara Global supports organizations at different stages
              by providing the right combination of strategy, knowledge, partnerships, and ecosystem access.
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-emerald/20 bg-emerald/5 p-7">
              <Rocket className="mb-5 h-8 w-8 text-emerald" />
              <h3 className="text-2xl font-extrabold text-deep-navy">Startups</h3>
              <p className="mt-3 text-sm leading-relaxed text-medium-gray">
                Supporting founders and innovation-driven businesses with strategic direction, business readiness, and growth preparation.
              </p>
            </div>
            <div className="rounded-3xl border border-gold/20 bg-gold/5 p-7 lg:translate-y-8">
              <Building2 className="mb-5 h-8 w-8 text-gold" />
              <h3 className="text-2xl font-extrabold text-deep-navy">MSMEs</h3>
              <p className="mt-3 text-sm leading-relaxed text-medium-gray">
                Helping established businesses strengthen operations, improve financial preparedness, and unlock sustainable growth opportunities.
              </p>
            </div>
            <div className="rounded-3xl border border-deep-navy/10 bg-light-gray p-7">
              <Lightbulb className="mb-5 h-8 w-8 text-deep-navy" />
              <h3 className="text-2xl font-extrabold text-deep-navy">Emerging Businesses</h3>
              <p className="mt-3 text-sm leading-relaxed text-medium-gray">
                Supporting new-age businesses across industries with strategic advisory, ecosystem access, and growth support.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-light-gray py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald">Startups</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-deep-navy sm:text-4xl">
              Startups
            </h2>
            <p className="mt-4 text-base leading-relaxed text-medium-gray">
              Supporting founders and innovation-driven businesses with strategic direction, business readiness, and growth preparation.
            </p>
            <div className="mt-8 rounded-3xl border border-emerald/20 bg-white p-6 shadow-md">
              <p className="text-sm font-semibold text-deep-navy">Built for founders moving from uncertainty to structured growth.</p>
            </div>
          </motion.div>

          <div className="space-y-5">
            {startupGroups.map((group, index) => {
              const Icon = group.icon

              return (
                <motion.article
                  key={group.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group rounded-3xl border border-border-gray bg-white p-7 shadow-md transition-all duration-500 hover:-translate-y-1 hover:border-emerald/30 hover:shadow-2xl"
                >
                  <div className="grid gap-6 md:grid-cols-[4rem_1fr]">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald/15 bg-emerald/10 text-emerald transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-deep-navy">{group.title}</h3>
                      <p className="mt-2 text-sm text-medium-gray">{group.desc}</p>
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {group.points.map((point) => (
                          <div key={point} className="flex items-center gap-3 rounded-2xl border border-border-gray bg-light-gray/60 px-4 py-3 text-sm font-semibold text-deep-navy">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald" />
                            {point}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 max-w-3xl"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">MSMEs</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-deep-navy sm:text-4xl">MSMEs</h2>
            <p className="mt-4 text-base leading-relaxed text-medium-gray">
              Helping established businesses strengthen operations, improve financial preparedness, and unlock sustainable growth opportunities.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {msmeGroups.map((group, index) => {
              const Icon = group.icon

              return (
                <motion.article
                  key={group.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className={`group rounded-3xl border border-border-gray bg-light-gray/50 p-7 shadow-md transition-all duration-500 hover:-translate-y-1 hover:border-gold/30 hover:shadow-2xl ${index % 2 === 1 ? 'md:translate-y-8' : ''}`}
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/15 bg-gold/10 text-gold transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-extrabold text-deep-navy">{group.title}</h3>
                  <p className="mt-2 text-sm font-semibold text-medium-gray">{group.desc}</p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {group.points.map((point) => (
                      <div key={point} className="flex items-center gap-3 rounded-2xl border border-border-gray bg-white px-4 py-3 text-sm font-semibold text-deep-navy">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-gold" />
                        {point}
                      </div>
                    ))}
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-deep-navy py-24 lg:py-32">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-16 max-w-3xl text-center"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-gold-light">Emerging Businesses</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Emerging Businesses
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/65">
              Supporting new-age businesses across industries with strategic advisory, ecosystem access, and growth support.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {emergingIndustries.map((industry, index) => {
              const IndustryIcon = industry.icon

              return (
                <motion.article
                  key={industry.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-gold/30 hover:bg-white/[0.07]"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-gold transition-transform duration-300 group-hover:scale-110">
                    <IndustryIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-white">{industry.label}</h3>
                  <div className="mt-5 space-y-3 border-t border-white/10 pt-5">
                    {industry.points.map((point) => (
                      <div key={point} className="flex items-center gap-2 text-sm font-medium text-white/70">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                        {point}
                      </div>
                    ))}
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-light-gray py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-16 max-w-3xl text-center"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">Business Growth Journey</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-deep-navy sm:text-4xl">
              From Foundation To Scale
            </h2>
          </motion.div>

          <div className="relative">
            <div className="hidden lg:block absolute left-[12.5%] right-[12.5%] top-10 h-px bg-border-gray">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="h-full origin-left bg-gradient-to-r from-emerald via-gold to-emerald"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {journeyStages.map((stage, index) => (
                <motion.article
                  key={stage.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="relative z-10 mb-6 hidden h-20 items-start justify-center lg:flex">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/20 bg-white shadow-lg shadow-gold/10">
                      {index === 0 && <ShieldCheck className="h-7 w-7 text-emerald" />}
                      {index === 1 && <TrendingUp className="h-7 w-7 text-gold" />}
                      {index === 2 && <Scale className="h-7 w-7 text-emerald" />}
                      {index === 3 && <Network className="h-7 w-7 text-gold" />}
                    </div>
                  </div>

                  <div className="h-full rounded-3xl border border-border-gray bg-white p-6 text-center shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gold">{stage.stage}</span>
                    <h3 className="mt-2 text-xl font-extrabold text-deep-navy">{stage.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-medium-gray">{stage.desc}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
