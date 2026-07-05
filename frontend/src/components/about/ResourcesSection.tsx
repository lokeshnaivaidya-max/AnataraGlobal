import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Download, Sparkles, BookOpen, CheckCircle, Clock, X
} from 'lucide-react'

interface Resource {
  id: string
  title: string
  category: string
  description: string
  readTime: string
  pages: number
  previewContent: string[]
}

const resources: Resource[] = [
  {
    id: 'readiness-checklist',
    title: 'Venture Readiness Checklist 2026',
    category: 'Checklist & Framework',
    description: 'A comprehensive 25-point framework covering corporate governance, financial structure, and market positioning that institutional investors analyze.',
    readTime: '8 min read',
    pages: 12,
    previewContent: [
      'Legal & Corporate Structure: Cap table health, clean corporate minutes, and intellectual property assignments.',
      'Financial Controls: Audited financials, robust bookkeeping, dynamic 3-5 year projection models.',
      'Product & IP Validation: Defensibility, competitive moat, tech scalability, and clear roadmap.',
      'Market & Commercial traction: LTV/CAC ratios, clear segment profiling, repeatable sales cycles.',
    ]
  },
  {
    id: 'forecasting-guide',
    title: 'Financial Forecasting Blueprint',
    category: 'Financial Modeling Guide',
    description: 'Step-by-step instructions on designing a three-statement financial projection model that highlights unit economics, margins, and capital efficiency.',
    readTime: '15 min read',
    pages: 34,
    previewContent: [
      'Revenue Modeling: Choosing bottom-up vs top-down forecasting based on pricing models.',
      'Cost Structure: Distinguishing variable costs (COGS) from fixed operating expenses (OpEx).',
      'Sensitivity Analysis: Stress-testing projections under varying churn rates and conversion scenarios.',
      'Key VC Metrics: Setting up automatic calculations for LTV, CAC, Runway, and Burn Rate.',
    ]
  },
  {
    id: 'msme-report',
    title: 'The MSME Capital Growth Report',
    category: 'Market Intelligence',
    description: 'A study on alternative financing paths for MSMEs in emerging markets, detailing venture debt, revenue-based financing, and grants.',
    readTime: '22 min read',
    pages: 48,
    previewContent: [
      'State of Alternative Lending: How fintech platforms are opening doors for asset-light businesses.',
      'Revenue-Based Financing: Calculating cost of capital versus traditional equity dilute paths.',
      'Venture Debt for Tech Startups: When to layer debt on top of an equity round for maximum runway.',
      'Strategic Corporate Partnerships: Leveraging joint venture structures to fund initial market expansions.',
    ]
  }
]

export default function ResourcesSection() {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null)

  const handleDownload = (title: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDownloadSuccess(title)
    setTimeout(() => {
      setDownloadSuccess(null)
    }, 3000)
  }

  return (
    <section id="resources" className="relative py-24 lg:py-32 bg-light-gray overflow-hidden">
      {/* Decorative ornaments */}
      <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-gold/5 blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-emerald/5 blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full bg-emerald/10 px-4 py-1.5 text-xs font-semibold text-emerald border border-emerald/20 mb-4"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald" />
            Insights & Tools
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-deep-navy tracking-tight"
          >
            Intellectual Capital Library
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-medium-gray text-lg"
          >
            Equip your business with proprietary frameworks, growth guides, and market intelligence compiled by our advisors.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, idx) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => setSelectedResource(resource)}
              className="group cursor-pointer relative rounded-2xl bg-white border border-border-gray p-8 hover:shadow-2xl hover:border-emerald/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald bg-emerald/10 px-3 py-1 rounded-full">
                    {resource.category}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-medium-gray">
                    <Clock className="h-3 w-3" />
                    <span>{resource.readTime}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-deep-navy group-hover:text-emerald transition-colors duration-300">
                  {resource.title}
                </h3>
                <p className="mt-3 text-sm text-medium-gray leading-relaxed">
                  {resource.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-border-gray flex items-center justify-between">
                <span className="text-xs text-medium-gray">{resource.pages} pages PDF</span>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleDownload(resource.title, e)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-light-gray hover:bg-emerald hover:text-white border border-border-gray hover:border-emerald transition-all duration-200"
                    title="Download Report"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="flex h-9 items-center justify-center rounded-lg bg-deep-navy text-white px-4 text-xs font-semibold hover:bg-emerald hover:scale-105 transition-all duration-200">
                    Quick View
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {downloadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-3 rounded-2xl bg-deep-navy text-white px-5 py-4 border border-emerald/20 shadow-2xl"
          >
            <CheckCircle className="h-5 w-5 text-emerald shrink-0 animate-bounce" />
            <div>
              <p className="text-xs font-bold">Download Started</p>
              <p className="text-[10px] text-white/60">{downloadSuccess} is downloading...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Quick View Modal */}
      <AnimatePresence>
        {selectedResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedResource(null)}
              className="absolute inset-0 bg-deep-navy/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative max-w-2xl w-full rounded-3xl bg-white border border-border-gray p-8 sm:p-10 shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setSelectedResource(null)}
                className="absolute top-6 right-6 p-2 text-medium-gray hover:text-deep-navy rounded-full hover:bg-light-gray transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald bg-emerald/10 px-3 py-1 rounded-full">
                  {selectedResource.category}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-deep-navy pr-8">
                {selectedResource.title}
              </h3>
              <p className="mt-3 text-sm text-medium-gray leading-relaxed">
                {selectedResource.description}
              </p>

              <div className="mt-6 bg-light-gray border border-border-gray rounded-2xl p-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-deep-navy mb-4 flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-emerald" />
                  Table of Contents & Core Insights Preview:
                </h4>
                <div className="space-y-3">
                  {selectedResource.previewContent.map((point, i) => (
                    <div key={i} className="flex gap-2.5 items-start text-xs text-medium-gray">
                      <span className="h-5 w-5 rounded-full bg-emerald/10 text-emerald flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="leading-relaxed"><strong className="text-deep-navy">{point.split(':')[0]}:</strong>{point.split(':')[1]}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-medium-gray">Ready to read? Get the full {selectedResource.pages}-page document.</span>
                <div className="flex gap-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setSelectedResource(null)}
                    className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-medium-gray hover:text-deep-navy hover:bg-light-gray rounded-xl transition-all cursor-pointer"
                  >
                    Close Preview
                  </button>
                  <button
                    onClick={(e) => {
                      handleDownload(selectedResource.title, e)
                      setSelectedResource(null)
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald text-white px-5 py-2.5 text-xs font-semibold hover:bg-emerald-dark hover:scale-105 transition-all shadow-md shadow-emerald/15 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download Full PDF
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
