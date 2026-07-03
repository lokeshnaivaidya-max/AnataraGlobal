import { motion } from 'framer-motion'
import {
  ArrowRight, Play, Sparkles, Target, ShieldCheck, Network, TrendingUp,
  Building2, Rocket, Briefcase, LineChart, CheckCircle2, BookOpen,
  Users, Handshake, Globe, FileText, Lightbulb
} from 'lucide-react'
import ContactSection from '../components/about/ContactSection'
import BrandClosingCTA from '../components/about/BrandClosingCTA'

const serviceCards = [
  {
    icon: Target,
    title: 'Strategic Business Advisory',
    desc: 'Helping organizations build strong foundations, improve decision-making, and create sustainable growth strategies.',
    items: [
      'Business Strategy', 'Growth Planning', 'Market Positioning',
      'Business Transformation', 'Operational Excellence', 'Expansion Planning',
    ],
    accent: 'emerald',
  },
  {
    icon: Rocket,
    title: 'Venture Readiness Advisory',
    desc: 'Preparing businesses for funding opportunities and growth by improving their investment readiness and business structure.',
    items: [
      'Business Diagnostics', 'Investment Readiness Assessment', 'Investor Preparedness',
      'Pitch Deck Development', 'Financial Modelling', 'Due Diligence Preparation',
      'Fundraising Strategy',
    ],
    accent: 'gold',
  },
  {
    icon: Briefcase,
    title: 'Fundraising Support & Capital Connectivity',
    desc: 'Supporting businesses throughout their fundraising journey by helping them prepare, position, and connect with relevant capital ecosystem participants.',
    items: [
      'Fundraising Strategy', 'Capital Planning', 'Investor Readiness Assessment',
      'Pitch Deck Support', 'Financial Projections', 'Data Room Preparation',
      'Investor Communication Support', 'Fundraising Process Coordination',
      'Strategic Introductions',
    ],
    accent: 'emerald',
  },
]

const capitalNetwork = [
  { icon: Users, label: 'Individual Investors' },
  { icon: Users, label: 'Angel Investors' },
  { icon: Network, label: 'Angel Networks' },
  { icon: LineChart, label: 'Venture Capital Firms' },
  { icon: Building2, label: 'Family Offices' },
  { icon: Target, label: 'Strategic Investors' },
  { icon: ShieldCheck, label: 'Corporate Investors' },
  { icon: Building2, label: 'Institutional Investors' },
  { icon: Briefcase, label: 'NBFCs' },
  { icon: Building2, label: 'Lending Institutions' },
  { icon: Globe, label: 'Alternative Funding Platforms' },
]

const partnerCategories = [
  {
    icon: FileText,
    title: 'Financial Experts',
    items: ['Chartered Accountants', 'Financial Professionals'],
  },
  {
    icon: ShieldCheck,
    title: 'Legal & Compliance',
    items: ['Company Secretaries', 'Legal Advisors'],
  },
  {
    icon: TrendingUp,
    title: 'Growth Partners',
    items: ['Industry Experts', 'Mentors', 'Consultants'],
  },
  {
    icon: Handshake,
    title: 'Ecosystem Partners',
    items: ['Venture Networks', 'Incubators', 'Accelerators', 'Institutional Partners'],
  },
]

const programs = [
  { icon: Lightbulb, label: 'Workshops' },
  { icon: BookOpen, label: 'Webinars' },
  { icon: Users, label: 'Founder Bootcamps' },
  { icon: Globe, label: 'Industry Sessions' },
  { icon: Users, label: 'Expert Panels' },
  { icon: FileText, label: 'Business Knowledge Resources' },
  { icon: Sparkles, label: 'Financial Literacy Initiatives' },
]

export default function Services() {

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-deep-navy via-deep-navy-dark to-deep-navy pt-28 pb-16">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-gold/10 blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-emerald/10 blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold text-gold-light border border-gold/20 mb-6"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Services / What We Do
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight"
            >
              Strategic Guidance.<br />
              <span className="bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
                Capital Readiness.
              </span><br />
              Sustainable Growth.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-white/70 leading-relaxed max-w-xl"
            >
              Antara Global helps businesses strengthen their foundations, prepare for opportunities,
              connect with relevant ecosystems, and build scalable growth through strategy, knowledge,
              partnerships, and capital connectivity.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <a
                href="#contact"
                className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-dark px-6 py-3.5 text-sm font-semibold text-deep-navy shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30 hover:scale-105 transition-all duration-300"
              >
                Book Consultation
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/ecosystem"
                className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/25 hover:scale-105 transition-all duration-300"
              >
                <Play className="h-4 w-4 fill-white/10" />
                Explore Our Ecosystem
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-xs font-semibold tracking-widest uppercase text-gold">What We Do</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-deep-navy tracking-tight">
              Comprehensive Business Support
            </h2>
            <p className="mt-4 text-medium-gray text-base leading-relaxed">
              We support startups, MSMEs, entrepreneurs, and growth-stage businesses through structured
              advisory services, funding readiness support, ecosystem connections, and growth-focused solutions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {serviceCards.map((card, idx) => {
              const Icon = card.icon
              const isGold = card.accent === 'gold'
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.12 }}
                  whileHover={{ y: -6 }}
                  className="group relative rounded-3xl border border-border-gray bg-light-gray/50 p-7 shadow-md hover:shadow-2xl transition-all duration-500"
                >
                  <div className={`absolute top-0 left-0 w-full h-1 rounded-t-3xl bg-gradient-to-r ${
                    isGold ? 'from-gold via-gold/40' : 'from-emerald via-emerald/40'
                  } to-transparent`} />
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border mb-5 transition-all duration-300 group-hover:scale-110 ${
                    isGold
                      ? 'bg-gradient-to-br from-gold/15 to-gold/5 text-gold border-gold/15'
                      : 'bg-gradient-to-br from-emerald/15 to-emerald/5 text-emerald border-emerald/15'
                  }`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className={`text-lg font-extrabold text-deep-navy ${isGold ? 'group-hover:text-gold' : 'group-hover:text-emerald'} transition-colors`}>
                    {card.title}
                  </h3>
                  <p className="mt-2 text-xs text-medium-gray leading-relaxed">{card.desc}</p>
                  <ul className="mt-5 pt-5 border-t border-border-gray space-y-2">
                    {card.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-deep-navy/70 font-medium">
                        <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 ${isGold ? 'text-gold' : 'text-emerald'}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Capital Ecosystem Access */}
      <section className="relative py-24 lg:py-32 bg-light-gray overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-xs font-semibold tracking-widest uppercase text-gold">Capital Ecosystem</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-deep-navy tracking-tight">
              Connecting Businesses With Opportunities
            </h2>
            <p className="mt-4 text-medium-gray text-base leading-relaxed">
              Through our ecosystem network and partnerships, businesses may gain access to relevant
              capital providers and strategic stakeholders.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {capitalNetwork.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-2 rounded-xl border border-border-gray bg-white px-4 py-2.5 text-xs font-semibold text-deep-navy hover:border-gold/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Icon className="h-3.5 w-3.5 text-gold shrink-0" />
                  {item.label}
                </div>
              )
            })}
          </div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 max-w-2xl mx-auto text-center"
          >
            <div className="rounded-2xl border border-gold/20 bg-gold/5 p-5">
              <p className="text-xs text-medium-gray leading-relaxed">
                <strong className="text-deep-navy">Disclaimer:</strong> Antara Global does not guarantee funding,
                investments, loans, or capital commitments. Our role is to assist businesses in becoming
                funding-ready, investment-ready, and strategically connected with relevant ecosystem participants.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MSME Growth Advisory */}
      <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-semibold tracking-widest uppercase text-gold">MSME Growth</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-deep-navy tracking-tight">
                MSME Growth Advisory
              </h2>
              <p className="mt-4 text-medium-gray text-base leading-relaxed">
                Helping MSMEs strengthen their business foundations, improve readiness, and build sustainable growth systems.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Growth Strategy', 'Financial Preparedness', 'Debt Readiness Support',
                  'Business Diagnostics', 'Compliance Awareness', 'Government Scheme Awareness',
                  'Capacity Building',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-deep-navy font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-gradient-to-br from-deep-navy via-deep-navy to-deep-navy-dark p-8 border border-white/5 shadow-2xl"
            >
              <h3 className="text-lg font-extrabold text-white mb-4">Knowledge & Awareness Initiatives</h3>
              <p className="text-xs text-sanskrit mb-6 font-medium">
                सर्वेषां वित्तज्ञानम्
              </p>
              <p className="text-sm text-white/60 mb-6">
                Antara Global promotes business and financial awareness by empowering entrepreneurs with
                knowledge, resources, and practical learning opportunities.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {programs.map((prog) => {
                  const ProgIcon = prog.icon
                  return (
                    <div key={prog.label} className="flex items-center gap-2 rounded-xl bg-white/[0.03] border border-white/5 px-3 py-2.5">
                      <ProgIcon className="h-3.5 w-3.5 text-gold shrink-0" />
                      <span className="text-xs text-white/80 font-medium">{prog.label}</span>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Strategic Partnership Network */}
      <section className="relative py-24 lg:py-32 bg-light-gray overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-xs font-semibold tracking-widest uppercase text-gold">Partners</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-deep-navy tracking-tight">
              Building A Strong Business Ecosystem
            </h2>
            <p className="mt-4 text-medium-gray text-base leading-relaxed">
              Antara Global collaborates with professionals and organizations that help businesses grow stronger.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerCategories.map((cat, idx) => {
              const CatIcon = cat.icon
              return (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-2xl border border-border-gray bg-white p-6 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold/15 to-gold/5 text-gold border border-gold/15 mb-4">
                    <CatIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-extrabold text-deep-navy mb-3">{cat.title}</h3>
                  <ul className="space-y-2">
                    {cat.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-medium-gray">
                        <span className="h-1 w-1 rounded-full bg-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <BrandClosingCTA />
      <ContactSection />
    </>
  )
}
