import { motion } from 'framer-motion'
import {
  ArrowRight, Sparkles, BookOpen, FileText, Monitor,
  Users, Globe, GraduationCap, Lightbulb
} from 'lucide-react'
import ResourcesSection from '../components/about/ResourcesSection'
import BrandClosingCTA from '../components/about/BrandClosingCTA'
import ContactSection from '../components/about/ContactSection'

const knowledgeCategories = [
  {
    icon: BookOpen,
    title: 'Resources',
    items: [
      { label: 'Financial Knowledge', href: '/knowledge/financial-knowledge' },
      { label: 'Business Resources', href: '/knowledge/business-resources' },
      { label: 'Blogs', href: '/knowledge/blogs' },
      { label: 'Downloads', href: '/knowledge/downloads' },
      { label: 'Financial Literacy', href: '/knowledge/financial-literacy' },
    ],
  },
  {
    icon: Lightbulb,
    title: 'Events & Programs',
    items: [
      { label: 'Workshops', href: '/knowledge/workshops' },
      { label: 'Webinars', href: '/knowledge/webinars' },
      { label: 'Founder Bootcamps', href: '/knowledge/founder-bootcamps' },
      { label: 'Industry Sessions', href: '/knowledge/industry-sessions' },
      { label: 'Expert Panels', href: '/knowledge/expert-panels' },
    ],
  },
]

export default function KnowledgeHub() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-center overflow-hidden bg-gradient-to-br from-deep-navy via-deep-navy-dark to-deep-navy pt-28 pb-16">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-80 h-80 rounded-full bg-gold/10 blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-emerald/10 blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
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
              Knowledge Hub
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight"
            >
              Financial Knowledge<br />
              <span className="bg-gradient-to-r from-gold-light via-gold to-emerald bg-clip-text text-transparent">
                For Everyone
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-base sm:text-lg text-white/50 font-medium"
            >
              सर्वेषां वित्तज्ञानम्
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-2 text-sm sm:text-base text-white/70 leading-relaxed max-w-xl"
            >
              Antara Global promotes business and financial awareness by empowering entrepreneurs with
              knowledge, resources, and practical learning opportunities.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Knowledge Categories */}
      <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {knowledgeCategories.map((cat, idx) => {
              const CatIcon = cat.icon
              return (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="rounded-3xl border border-border-gray bg-light-gray/50 p-8 shadow-md hover:shadow-xl transition-all duration-500"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/15 to-gold/5 text-gold border border-gold/15">
                      <CatIcon className="h-7 w-7" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-deep-navy">{cat.title}</h2>
                  </div>
                  <ul className="space-y-3">
                    {cat.items.map((item) => (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          className="group flex items-center justify-between rounded-xl border border-border-gray bg-white px-5 py-3.5 hover:border-gold/30 hover:shadow-md transition-all duration-200"
                        >
                          <span className="text-sm font-medium text-deep-navy group-hover:text-gold transition-colors">
                            {item.label}
                          </span>
                          <ArrowRight className="h-4 w-4 text-gold/30 group-hover:text-gold group-hover:translate-x-0.5 transition-all duration-200" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="relative py-24 lg:py-32 bg-light-gray overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-xs font-semibold tracking-widest uppercase text-gold">Programs</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-deep-navy tracking-tight">
              Learn. Connect. Grow.
            </h2>
            <p className="mt-4 text-medium-gray text-base leading-relaxed">
              Practical learning opportunities designed for founders, entrepreneurs, and business leaders.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Monitor, label: 'Workshops', desc: 'Hands-on sessions covering business and financial topics.' },
              { icon: Globe, label: 'Webinars', desc: 'Expert-led online sessions on industry trends and strategies.' },
              { icon: Users, label: 'Founder Bootcamps', desc: 'Intensive programs for early-stage founder acceleration.' },
              { icon: GraduationCap, label: 'Industry Sessions', desc: 'Deep dives into specific sectors and market opportunities.' },
              { icon: Users, label: 'Expert Panels', desc: 'Multi-perspective discussions with industry leaders.' },
              { icon: FileText, label: 'Business Resources', desc: 'Curated guides, templates, and toolkits for business growth.' },
            ].map((prog, idx) => {
              const ProgIcon = prog.icon
              return (
                <motion.div
                  key={prog.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl bg-white border border-border-gray p-6 shadow-md hover:shadow-xl hover:border-gold/30 transition-all duration-300"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold/15 to-gold/5 text-gold border border-gold/15 mb-4">
                    <ProgIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-deep-navy">{prog.label}</h3>
                  <p className="text-xs text-medium-gray mt-2 leading-relaxed">{prog.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <ResourcesSection />
      <BrandClosingCTA />
      <ContactSection />
    </>
  )
}
