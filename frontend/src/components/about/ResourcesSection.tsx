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
    <section id="resources" className="relative py-24 lg:py-32 overflow-hidden" style={{ backgroundColor: '#FFF8F2' }}>
      {/* Decorative ornaments */}
      <div className="absolute top-10 left-10 w-40 h-40 rounded-full opacity-[0.04] blur-3xl" style={{ backgroundColor: '#FD7C06' }} />
      <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full opacity-[0.04] blur-3xl" style={{ backgroundColor: '#CEA041' }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold border mb-4"
            style={{ backgroundColor: 'rgba(253,124,6,0.08)', borderColor: 'rgba(253,124,6,0.2)', color: '#FD7C06' }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Insights & Tools
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight" style={{ color: '#000000' }}
          >
            Intellectual Capital Library
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base leading-relaxed" style={{ color: 'rgba(0,0,0,0.5)' }}
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
              className="group cursor-pointer relative rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)' }}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full"
                    style={{ color: '#FD7C06', backgroundColor: 'rgba(253,124,6,0.08)' }}>
                    {resource.category}
                  </span>
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(0,0,0,0.4)' }}>
                    <Clock className="h-3 w-3" />
                    <span>{resource.readTime}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold transition-colors duration-300 group-hover:scale-[1.02]" style={{ color: '#000000' }}>
                  {resource.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgba(0,0,0,0.5)' }}>
                  {resource.description}
                </p>
              </div>

              <div className="mt-8 pt-6 flex items-center justify-between" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <span className="text-xs" style={{ color: 'rgba(0,0,0,0.4)' }}>{resource.pages} pages PDF</span>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleDownload(resource.title, e)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200"
                    style={{ backgroundColor: '#FFF8F2', color: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,0,0,0.06)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FD7C06'; e.currentTarget.style.color = '#FFFFFF' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFF8F2'; e.currentTarget.style.color = 'rgba(0,0,0,0.5)' }}
                    title="Download Report"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="flex h-9 items-center justify-center rounded-lg px-4 text-xs font-semibold text-white hover:scale-105 transition-all duration-200"
                    style={{ backgroundColor: '#000000' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FD7C06'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}>
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
            className="fixed bottom-8 right-8 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 shadow-2xl"
            style={{ backgroundColor: '#000000', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <CheckCircle className="h-5 w-5 shrink-0 animate-bounce" style={{ color: '#FD7C06' }} />
            <div>
              <p className="text-xs font-bold" style={{ color: '#FFFFFF' }}>Download Started</p>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.6)' }}>{downloadSuccess} is downloading...</p>
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
              className="absolute inset-0 backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative max-w-2xl w-full rounded-3xl p-8 sm:p-10 shadow-2xl overflow-hidden"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)' }}
            >
              <button
                onClick={() => setSelectedResource(null)}
                className="absolute top-6 right-6 p-2 rounded-full transition-all cursor-pointer"
                style={{ color: 'rgba(0,0,0,0.4)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFF8F2'; e.currentTarget.style.color = '#000000' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(0,0,0,0.4)' }}
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-4">
                <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full"
                  style={{ color: '#FD7C06', backgroundColor: 'rgba(253,124,6,0.08)' }}>
                  {selectedResource.category}
                </span>
              </div>

              <h3 className="text-2xl font-bold pr-8" style={{ color: '#000000' }}>
                {selectedResource.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgba(0,0,0,0.5)' }}>
                {selectedResource.description}
              </p>

              <div className="mt-6 rounded-2xl p-6" style={{ backgroundColor: '#FFF8F2', border: '1px solid rgba(0,0,0,0.06)' }}>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5" style={{ color: '#000000' }}>
                  <BookOpen className="h-4 w-4" style={{ color: '#FD7C06' }} />
                  Table of Contents & Core Insights Preview:
                </h4>
                <div className="space-y-3">
                  {selectedResource.previewContent.map((point, i) => (
                    <div key={i} className="flex gap-2.5 items-start text-xs" style={{ color: 'rgba(0,0,0,0.5)' }}>
                      <span className="h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                        style={{ color: '#FD7C06', backgroundColor: 'rgba(253,124,6,0.08)' }}>
                        {i + 1}
                      </span>
                      <p className="leading-relaxed"><strong style={{ color: '#000000' }}>{point.split(':')[0]}:</strong>{point.split(':')[1]}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs" style={{ color: 'rgba(0,0,0,0.4)' }}>Ready to read? Get the full {selectedResource.pages}-page document.</span>
                <div className="flex gap-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setSelectedResource(null)}
                    className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                    style={{ color: 'rgba(0,0,0,0.5)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFF8F2'; e.currentTarget.style.color = '#000000' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(0,0,0,0.5)' }}
                  >
                    Close Preview
                  </button>
                  <button
                    onClick={(e) => {
                      handleDownload(selectedResource.title, e)
                      setSelectedResource(null)
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl text-white px-5 py-2.5 text-xs font-semibold hover:scale-105 transition-all shadow-md cursor-pointer"
                    style={{ backgroundColor: '#FD7C06' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#000000'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FD7C06'}
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
