import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  Globe,
  GraduationCap,
  Handshake,
  Landmark,
  Lightbulb,
  LineChart,
  Network,
  Play,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'
import ContactSection from '../components/about/ContactSection'
import BrandClosingCTA from '../components/about/BrandClosingCTA'

const ecosystemFlow = ['Business', 'Strategy', 'Readiness', 'Capital', 'Growth']

const serviceCards = [
  {
    icon: Target,
    title: 'Strategic Business Advisory',
    eyebrow: 'Services Included',
    desc: 'Helping organizations build strong foundations, improve decision-making, and create sustainable growth strategies.',
    items: [
      'Business Strategy',
      'Growth Planning',
      'Market Positioning',
      'Business Transformation',
      'Operational Excellence',
      'Expansion Planning',
    ],
    accent: 'emerald',
  },
  {
    icon: Rocket,
    title: 'Venture Readiness Advisory',
    eyebrow: 'Services Included',
    desc: 'Preparing businesses for funding opportunities and growth by improving their investment readiness and business structure.',
    items: [
      'Business Diagnostics',
      'Investment Readiness Assessment',
      'Investor Preparedness',
      'Pitch Deck Development',
      'Financial Modelling',
      'Due Diligence Preparation',
      'Fundraising Strategy',
    ],
    accent: 'gold',
  },
  {
    icon: CircleDollarSign,
    title: 'Fundraising Support & Capital Connectivity',
    eyebrow: 'Support Areas',
    desc: 'Supporting businesses throughout their fundraising journey by helping them prepare, position, and connect with relevant capital ecosystem participants.',
    items: [
      'Fundraising Strategy',
      'Capital Planning',
      'Investor Readiness Assessment',
      'Pitch Deck Support',
      'Financial Projections',
      'Data Room Preparation',
      'Investor Communication Support',
      'Fundraising Process Coordination',
      'Strategic Introductions',
    ],
    accent: 'emerald',
    highlight: 'Preparation before capital connection.',
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
  { icon: Landmark, label: 'Institutional Investors' },
  { icon: Briefcase, label: 'NBFCs' },
  { icon: Building2, label: 'Lending Institutions' },
  { icon: Globe, label: 'Alternative Funding Platforms' },
]

const msmeServices = [
  'Growth Strategy',
  'Financial Preparedness',
  'Debt Readiness Support',
  'Business Diagnostics',
  'Compliance Awareness',
  'Government Scheme Awareness',
  'Capacity Building',
]

const knowledgePrograms = [
  { icon: Lightbulb, label: 'Workshops' },
  { icon: BookOpen, label: 'Webinars' },
  { icon: Users, label: 'Founder Bootcamps' },
  { icon: Globe, label: 'Industry Sessions' },
  { icon: GraduationCap, label: 'Expert Panels' },
  { icon: FileText, label: 'Business Knowledge Resources' },
  { icon: Sparkles, label: 'Financial Literacy Initiatives' },
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

export default function Services() {
  return (
    <>
      <section className="relative min-h-[82vh] overflow-hidden bg-gradient-to-br from-deep-navy via-deep-navy-dark to-deep-navy pt-28 pb-16 flex items-center">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 h-96 w-96 rounded-full bg-gold/10 blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 left-10 h-80 w-80 rounded-full bg-emerald/10 blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-gold to-transparent" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-white/5 px-4 py-1.5 text-xs font-semibold text-gold-light"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Premium Ecosystem Services
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
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
              className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
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
                className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-dark px-6 py-3.5 text-sm font-semibold text-deep-navy shadow-lg shadow-gold/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gold/30"
              >
                Book Consultation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="/ecosystem"
                className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/25 hover:bg-white/10"
              >
                <Play className="h-4 w-4 fill-white/10" />
                Explore Our Ecosystem
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
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-gold/20 via-emerald/10 to-transparent blur-md" />
              <div className="relative rounded-2xl border border-white/10 bg-deep-navy-dark/60 p-5">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Ecosystem Flow</p>
                    <h2 className="mt-1 text-xl font-extrabold text-white">From foundation to growth</h2>
                  </div>
                  <Network className="h-8 w-8 text-gold" />
                </div>
                <div className="space-y-3">
                  {ecosystemFlow.map((item, index) => (
                    <div key={item} className="grid grid-cols-[2.5rem_1fr] items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl border text-xs font-black ${
                        index % 2 === 0
                          ? 'border-emerald/30 bg-emerald/15 text-emerald-light'
                          : 'border-gold/30 bg-gold/15 text-gold-light'
                      }`}>
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className="relative rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                        {index < ecosystemFlow.length - 1 && (
                          <span className="absolute left-[-1.9rem] top-10 h-3 w-px bg-white/20" />
                        )}
                        <span className="text-sm font-bold text-white">{item}</span>
                      </div>
                    </div>
                  ))}
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
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">What We Do</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-deep-navy sm:text-4xl">
              Structured support for every growth inflection point
            </h2>
            <p className="mt-4 text-base leading-relaxed text-medium-gray">
              We support startups, MSMEs, entrepreneurs, and growth-stage businesses through structured
              advisory services, funding readiness support, ecosystem connections, and growth-focused solutions.
            </p>
          </motion.div>

          <div className="space-y-6">
            {serviceCards.map((card, index) => {
              const Icon = card.icon
              const isGold = card.accent === 'gold'

              return (
                <motion.article
                  key={card.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group relative overflow-hidden rounded-3xl border border-border-gray bg-light-gray/50 shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className={`absolute left-0 top-0 h-full w-1.5 ${isGold ? 'bg-gold' : 'bg-emerald'}`} />
                  <div className="grid gap-0 lg:grid-cols-[0.9fr_1.35fr]">
                    <div className="relative border-b border-border-gray bg-white p-7 lg:border-b-0 lg:border-r lg:p-9">
                      <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border ${
                        isGold
                          ? 'border-gold/15 bg-gradient-to-br from-gold/15 to-gold/5 text-gold'
                          : 'border-emerald/15 bg-gradient-to-br from-emerald/15 to-emerald/5 text-emerald'
                      }`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <span className={`text-xs font-semibold uppercase tracking-widest ${isGold ? 'text-gold' : 'text-emerald'}`}>
                        {card.eyebrow}
                      </span>
                      <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-deep-navy">
                        {card.title}
                      </h3>
                      <p className="mt-4 text-sm leading-relaxed text-medium-gray">
                        {card.desc}
                      </p>
                      {card.highlight && (
                        <div className="mt-6 rounded-2xl border border-gold/20 bg-gold/5 px-4 py-3 text-sm font-extrabold text-deep-navy">
                          {card.highlight}
                        </div>
                      )}
                    </div>

                    <div className="p-7 lg:p-9">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {card.items.map((item) => (
                          <div key={item} className="flex items-center gap-3 rounded-2xl border border-border-gray bg-white px-4 py-3 text-sm font-semibold text-deep-navy">
                            <CheckCircle2 className={`h-4 w-4 shrink-0 ${isGold ? 'text-gold' : 'text-emerald'}`} />
                            <span>{item}</span>
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

      <section className="relative overflow-hidden bg-light-gray py-24 lg:py-32">
        <div className="absolute top-20 left-10 h-48 w-48 rounded-full bg-emerald/5 blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-gold/5 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">Capital Ecosystem Access</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-deep-navy sm:text-4xl">
                Connecting Businesses With Opportunities
              </h2>
              <p className="mt-4 text-base leading-relaxed text-medium-gray">
                Through our ecosystem network and partnerships, businesses may gain access to relevant
                capital providers and strategic stakeholders.
              </p>
              <div className="mt-8 rounded-2xl border border-gold/20 bg-gold/5 p-5">
                <p className="text-xs leading-relaxed text-medium-gray">
                  <strong className="text-deep-navy">Disclaimer:</strong> Antara Global does not guarantee funding,
                  investments, loans, or capital commitments. Our role is to assist businesses in becoming
                  funding-ready, investment-ready, and strategically connected with relevant ecosystem participants.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative mx-auto max-w-2xl rounded-3xl border border-border-gray bg-white p-5 shadow-xl sm:p-8 lg:flex lg:min-h-[560px] lg:items-center lg:justify-center">
                <div className="absolute inset-8 hidden rounded-full border border-dashed border-gold/25 lg:block" />
                <div className="absolute inset-20 hidden rounded-full border border-dashed border-emerald/20 lg:block" />
                <div className="relative z-10 mx-auto flex h-40 w-40 flex-col items-center justify-center rounded-full border border-gold/30 bg-gradient-to-br from-deep-navy to-deep-navy-dark text-center shadow-2xl shadow-deep-navy/20">
                  <Sparkles className="mb-2 h-6 w-6 text-gold" />
                  <span className="text-sm font-black tracking-tight text-white">ANTARA</span>
                  <span className="text-sm font-light text-gold-light">GLOBAL</span>
                </div>

                <div className="relative z-10 mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:absolute lg:inset-8 lg:mt-0 lg:content-between">
                  {capitalNetwork.map((item, index) => {
                    const Icon = item.icon
                    const alignRight = index % 2 === 1

                    return (
                      <div key={item.label} className={`flex ${alignRight ? 'lg:justify-end' : 'lg:justify-start'}`}>
                        <div className="flex max-w-[11rem] items-center gap-2 rounded-2xl border border-border-gray bg-white px-3 py-2 text-xs font-semibold text-deep-navy shadow-md">
                          <Icon className="h-3.5 w-3.5 shrink-0 text-gold" />
                          <span>{item.label}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-border-gray bg-light-gray/60 p-7 shadow-xl sm:p-9"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald/15 bg-emerald/10 text-emerald">
              <Building2 className="h-7 w-7" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">Services Included</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-deep-navy">
              MSME Growth Advisory
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-medium-gray">
              Helping MSMEs strengthen their business foundations, improve readiness, and build sustainable growth systems.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {msmeServices.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-border-gray bg-white px-4 py-3 text-sm font-semibold text-deep-navy">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald" />
                  {item}
                </div>
              ))}
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-deep-navy via-deep-navy to-deep-navy-dark p-7 shadow-2xl sm:p-9"
          >
            <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-gold/5 blur-3xl" />
            <div className="relative">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold-light">Knowledge & Awareness Initiatives</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
                Financial Knowledge For Everyone
              </h2>
              <p className="mt-2 text-sm font-semibold text-gold-light">सर्वेषां वित्तज्ञानम्</p>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/65">
                Antara Global promotes business and financial awareness by empowering entrepreneurs with
                knowledge, resources, and practical learning opportunities.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {knowledgePrograms.map((program) => {
                  const ProgramIcon = program.icon

                  return (
                    <div key={program.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/80">
                      <ProgramIcon className="h-4 w-4 shrink-0 text-gold" />
                      {program.label}
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.article>
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
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">Strategic Partnership Network</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-deep-navy sm:text-4xl">
              Building A Strong Business Ecosystem
            </h2>
            <p className="mt-4 text-base leading-relaxed text-medium-gray">
              Antara Global collaborates with professionals and organizations that help businesses grow stronger.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {partnerCategories.map((category, index) => {
              const CategoryIcon = category.icon

              return (
                <motion.article
                  key={category.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group relative overflow-hidden rounded-3xl border border-border-gray bg-white p-7 shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-gold via-gold/40 to-transparent" />
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/15 bg-gold/10 text-gold transition-transform duration-300 group-hover:scale-110">
                    <CategoryIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-deep-navy">{category.title}</h3>
                  <ul className="mt-5 space-y-3 border-t border-border-gray pt-5">
                    {category.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm font-medium text-medium-gray">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.article>
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
