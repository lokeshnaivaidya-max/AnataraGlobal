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
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'


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
      <section className="relative min-h-[82vh] overflow-hidden pt-28 pb-16" style={{ backgroundColor: '#FFF8F2' }}>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold border text-white" style={{ backgroundColor: '#000000', borderColor: '#000000' }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Premium Ecosystem Services
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
              style={{ color: '#FD7C06' }}
            >
              Strategic Guidance.<br />
              Capital Readiness.<br />
              Sustainable Growth.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg"
              style={{ color: 'rgba(0,0,0,0.6)' }}
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
                className="group inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold border-2 border-black shadow-lg transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: '#FFFFFF', color: '#000000' }}
              >
                Book Consultation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="/ecosystem"
                className="inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: '#000000' }}
              >
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
            <div className="relative mx-auto max-w-xl rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden border" style={{ backgroundColor: '#FFF8F2', borderColor: 'rgba(0,0,0,0.15)' }}>
              <div className="relative rounded-2xl p-5 border" style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.15)' }}>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(0,0,0,0.5)' }}>Ecosystem Flow</p>
                    <h2 className="mt-1 text-xl font-extrabold" style={{ color: '#FD7C06' }}>From foundation to growth</h2>
                  </div>
                  <Network className="h-8 w-8" style={{ color: '#FD7C06' }} />
                </div>
                <div className="space-y-3">
                  {ecosystemFlow.map((item, index) => (
                    <div key={item} className="grid grid-cols-[2.5rem_1fr] items-center gap-3">
                      <div className="relative flex justify-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xs font-black border z-10" style={{ color: '#FD7C06', borderColor: 'rgba(0,0,0,0.15)' }}>
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        {index < ecosystemFlow.length - 1 && (
                          <span className="absolute top-10 w-0.5" style={{ height: '44px', backgroundColor: '#FD7C06' }} />
                        )}
                      </div>
                      <div className="rounded-xl px-4 py-3 border" style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.15)' }}>
                        <span className="text-sm font-bold" style={{ color: 'rgba(0,0,0,0.6)' }}>{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24 lg:py-32" style={{ backgroundColor: '#FFF8F2' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-16 max-w-3xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold border text-white" style={{ backgroundColor: '#000000', borderColor: '#000000' }}>What We Do</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl" style={{ color: '#FD7C06' }}>
              Structured support for every growth inflection point
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: 'rgba(0,0,0,0.6)' }}>
              We support startups, MSMEs, entrepreneurs, and growth-stage businesses through structured
              advisory services, funding readiness support, ecosystem connections, and growth-focused solutions.
            </p>
          </motion.div>

          <div className="space-y-6">
            {serviceCards.map((card, index) => {
              const Icon = card.icon

              return (
                <motion.article
                  key={card.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group relative overflow-hidden rounded-3xl border shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl" style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.1)' }}
                >
                  <div className="absolute left-0 top-0 h-full w-1.5" style={{ backgroundColor: '#FD7C06' }} />
                  <div className="grid gap-0 lg:grid-cols-[0.9fr_1.35fr]">
                    <div className="relative border-b p-7 lg:border-b-0 lg:border-r lg:p-9" style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.1)' }}>
                      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border" style={{ backgroundColor: '#FD7C06', borderColor: '#FD7C06' }}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-widest text-black">
                        {card.eyebrow}
                      </span>
                      <h3 className="mt-3 text-2xl font-extrabold tracking-tight" style={{ color: '#FD7C06' }}>
                        {card.title}
                      </h3>
                      <p className="mt-4 text-sm leading-relaxed text-black/60">
                        {card.desc}
                      </p>
                      {card.highlight && (
                        <div className="mt-6 rounded-2xl border px-4 py-3 text-sm font-extrabold" style={{ backgroundColor: 'rgba(253,124,6,0.08)', borderColor: 'rgba(253,124,6,0.2)', color: '#000000' }}>
                          {card.highlight}
                        </div>
                      )}
                    </div>

                    <div className="p-7 lg:p-9">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {card.items.map((item) => (
                          <div key={item} className="flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold" style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.1)', color: '#000000' }}>
                            <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: '#FD7C06' }} />
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

      <section className="relative overflow-hidden py-24 lg:py-32" style={{ backgroundColor: '#FFF8F2' }}>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold border text-white" style={{ backgroundColor: '#000000', borderColor: '#000000' }}>Capital Ecosystem Access</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl" style={{ color: '#FD7C06' }}>
                Connecting Businesses With Opportunities
              </h2>
              <p className="mt-4 text-base leading-relaxed" style={{ color: 'rgba(0,0,0,0.6)' }}>
                Through our ecosystem network and partnerships, businesses may gain access to relevant
                capital providers and strategic stakeholders.
              </p>
              <div className="mt-8 rounded-2xl border p-5" style={{ backgroundColor: 'rgba(253,124,6,0.06)', borderColor: 'rgba(253,124,6,0.2)' }}>
                <p className="text-xs leading-relaxed text-black/60">
                  <strong className="text-black">Disclaimer:</strong> Antara Global does not guarantee funding,
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
              <div className="relative mx-auto max-w-2xl rounded-3xl border-2 p-5 shadow-xl sm:p-8 lg:flex lg:min-h-[560px] lg:items-center lg:justify-center" style={{ backgroundColor: '#FFFFFF', borderColor: '#000000' }}>
                <div className="absolute inset-8 hidden rounded-full border border-dashed lg:block" style={{ borderColor: '#FD7C06', opacity: 0.3 }} />
                <div className="absolute inset-20 hidden rounded-full border border-dashed lg:block" style={{ borderColor: '#FC9E00', opacity: 0.2 }} />
                <div className="relative z-10 mx-auto flex h-40 w-40 flex-col items-center justify-center rounded-full border-2 text-center shadow-2xl" style={{ backgroundColor: '#FD7C06', borderColor: '#FC9E00' }}>
                  <Sparkles className="mb-2 h-6 w-6 text-white/80" />
                  <span className="text-sm font-black tracking-tight text-white">ANTARA</span>
                  <span className="text-sm font-light text-white/70">GLOBAL</span>
                </div>

                <div className="relative z-10 mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:absolute lg:inset-8 lg:mt-0 lg:content-between">
                  {capitalNetwork.map((item, index) => {
                    const Icon = item.icon
                    const alignRight = index % 2 === 1

                    return (
                      <div key={item.label} className={`flex ${alignRight ? 'lg:justify-end' : 'lg:justify-start'}`}>
                        <div className="flex max-w-[11rem] items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold shadow-md" style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.1)', color: '#000000' }}>
                          <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: '#FD7C06' }} />
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

      <section className="relative overflow-hidden py-24 lg:py-32" style={{ backgroundColor: '#FFF8F2' }}>
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border p-7 shadow-xl sm:p-9" style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.12)' }}
          >
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: '#000000' }}>Services Included</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight flex items-center gap-3" style={{ color: '#F4C430' }}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border" style={{ backgroundColor: '#FD7C06', borderColor: '#FD7C06' }}>
                <Building2 className="h-5 w-5 text-white" />
              </div>
              MSME Growth Advisory
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-black/60">
              Helping MSMEs strengthen their business foundations, improve readiness, and build sustainable growth systems.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {msmeServices.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold" style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.1)', color: '#000000' }}>
                  <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: '#FD7C06' }} />
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
            className="rounded-3xl border p-7 shadow-xl sm:p-9" style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.12)' }}
          >
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: '#000000' }}>Knowledge & Awareness Initiatives</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight flex items-center gap-3" style={{ color: '#F4C430' }}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border" style={{ backgroundColor: '#FD7C06', borderColor: '#FD7C06' }}>
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                Financial Knowledge For Everyone
              </h2>
              <p className="mt-2 text-sm font-semibold" style={{ color: 'rgba(0,0,0,0.6)' }}>सर्वेषां वित्तज्ञानम्</p>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-black/60">
                Antara Global promotes business and financial awareness by empowering entrepreneurs with
                knowledge, resources, and practical learning opportunities.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {knowledgePrograms.map((program) => {
                  const ProgramIcon = program.icon

                  return (
                    <div key={program.label} className="flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold" style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.1)', color: '#000000' }}>
                      <ProgramIcon className="h-4 w-4 shrink-0" style={{ color: '#FD7C06' }} />
                      {program.label}
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      <section className="relative overflow-hidden py-24 lg:py-32" style={{ backgroundColor: '#FFF8F2' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-16 max-w-3xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-white" style={{ backgroundColor: '#000000' }}>Strategic Partnership Network</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl" style={{ color: '#FD7C06' }}>
              Building A Strong Business Ecosystem
            </h2>
            <p className="mt-4 text-base leading-relaxed text-black/60">
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
                  className="group relative overflow-hidden rounded-3xl border p-7 shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl" style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.12)' }}
                >
                  <div className="absolute left-0 top-0 h-1 w-full" style={{ backgroundColor: '#FD7C06' }} />
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border" style={{ backgroundColor: '#FFF8F2', borderColor: 'rgba(0,0,0,0.12)', color: '#FD7C06' }}>
                    <CategoryIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-extrabold" style={{ color: '#000000' }}>{category.title}</h3>
                  <ul className="mt-5 space-y-3 border-t pt-5" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                    {category.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm font-medium" style={{ color: 'rgba(0,0,0,0.6)' }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#FD7C06' }} />
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
    </>
  )
}
