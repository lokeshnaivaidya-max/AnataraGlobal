import { motion } from 'framer-motion'
import { Loader2, Store, Receipt, BarChart3, ClipboardCheck, FileText, CheckCircle2, AlertCircle } from 'lucide-react'
import { Link } from 'wouter'
import { useMsmeProfile, useGstDetails, useFinancialHealth, useComplianceStatus } from '../../../lib/msme-hooks'

const completionItems = [
  { key: 'business', label: 'Business Details', icon: Store, href: '/dashboard/msme/business' },
  { key: 'financial', label: 'Financial Health', icon: BarChart3, href: '/dashboard/msme/financial-health' },
  { key: 'compliance', label: 'Compliance', icon: ClipboardCheck, href: '/dashboard/msme/compliance' },
  { key: 'employees', label: 'Employees & Export', icon: Receipt, href: '/dashboard/msme/employees' },
  { key: 'documents', label: 'Documents', icon: FileText, href: '/dashboard/msme/documents' },
]

export default function DashboardHome() {
  const { data: msme, isLoading: msmeLoading } = useMsmeProfile()
  const { data: gst } = useGstDetails()
  const { data: financial } = useFinancialHealth()
  const { data: compliance } = useComplianceStatus()

  const completed = msme ? Math.round(msme.profileCompletion) : 0

  const stats = [
    { label: 'Profile', value: `${completed}%`, color: completed === 100 ? 'text-success' : 'text-gold' },
    { label: 'GST', value: gst?.gstStatus === 'verified' ? 'Verified' : gst?.gstStatus === 'pending' ? 'Pending' : 'Not Set', color: gst?.gstStatus === 'verified' ? 'text-success' : 'text-warning' },
    { label: 'Financial Score', value: financial ? `${financial.overallScore}/100` : 'N/A', color: financial && financial.overallScore >= 70 ? 'text-success' : 'text-medium-gray' },
  ]

  if (msmeLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-deep-navy tracking-tight">
          Welcome back{msme?.businessName ? `, ${msme.businessName}` : ''}!
        </h1>
        <p className="mt-1 text-sm text-medium-gray">
          Here's an overview of your MSME profile and business status.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-border-gray bg-white p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-medium-gray">{stat.label}</p>
            <p className={`text-2xl font-extrabold mt-1 ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {compliance && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`rounded-2xl border p-6 ${
            compliance.overallStatus === 'good' ? 'border-success/20 bg-success/5' :
            compliance.overallStatus === 'attention' ? 'border-warning/20 bg-warning/5' :
            'border-error/20 bg-error/5'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              compliance.overallStatus === 'good' ? 'bg-success/10 text-success' :
              compliance.overallStatus === 'attention' ? 'bg-warning/10 text-warning' :
              'bg-error/10 text-error'
            }`}>
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-deep-navy">Compliance Status</p>
              <p className="text-xs text-medium-gray">
                {compliance.overallStatus === 'good' ? 'All compliance requirements are met.' :
                 compliance.overallStatus === 'attention' ? 'Some areas need attention.' :
                 'Critical compliance issues detected.'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border-gray bg-white p-6"
      >
        <h2 className="text-lg font-extrabold text-deep-navy mb-4">Profile Completion</h2>
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="font-semibold text-medium-gray">Overall Progress</span>
            <span className="font-bold text-deep-navy">{completed}%</span>
          </div>
          <div className="h-3 rounded-full bg-light-gray overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completed}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${completed === 100 ? 'bg-success' : 'bg-gradient-to-r from-gold to-gold-light'}`}
            />
          </div>
        </div>

        <div className="space-y-3">
          {completionItems.map((item, i) => {
            const Icon = item.icon
            const isComplete = completed > i * 20
            return (
              <Link
                key={item.key}
                href={item.href}
                className="flex items-center gap-3 rounded-xl border border-border-gray bg-light-gray/50 p-4 hover:bg-light-gray transition-colors group"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  isComplete ? 'bg-success/10 text-success' : 'bg-medium-gray/10 text-medium-gray'
                }`}>
                  {isComplete ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-deep-navy group-hover:text-gold transition-colors">
                    {item.label}
                  </p>
                  <p className="text-xs text-medium-gray">
                    {isComplete ? 'Completed' : 'Pending'}
                  </p>
                </div>
                {!isComplete && <AlertCircle className="h-4 w-4 text-warning" />}
              </Link>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
