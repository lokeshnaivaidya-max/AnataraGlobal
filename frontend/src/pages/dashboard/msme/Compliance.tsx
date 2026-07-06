import { motion } from 'framer-motion'
import { Loader2, ClipboardCheck, ShieldCheck, FileText, Users, Leaf, Calendar } from 'lucide-react'
import { useComplianceStatus } from '../../../lib/msme-hooks'
import { COMPLIANCE_LABELS } from '../../../lib/msme-types'

const complianceItems = [
  { key: 'gstFiling', label: 'GST Filing', icon: FileText },
  { key: 'itReturns', label: 'IT Returns', icon: ClipboardCheck },
  { key: 'companyFilings', label: 'Company Filings', icon: ShieldCheck },
  { key: 'laborCompliance', label: 'Labor Compliance', icon: Users },
  { key: 'environmentalCompliance', label: 'Environmental Compliance', icon: Leaf },
]

function StatusBadge({ status }: { status: string }) {
  const isGood = ['filed', 'regular', 'compliant'].includes(status)
  const isBad = ['irregular', 'pending', 'overdue', 'non_compliant'].includes(status)
  return (
    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
      isGood ? 'bg-success/10 text-success' :
      isBad ? 'bg-error/10 text-error' :
      'bg-warning/10 text-warning'
    }`}>
      {COMPLIANCE_LABELS[status] || status}
    </span>
  )
}

export default function Compliance() {
  const { data: compliance, isLoading } = useComplianceStatus()

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-gold" />
          <div>
            <h1 className="text-2xl font-extrabold text-deep-navy">Compliance</h1>
            <p className="text-sm text-medium-gray">Track your regulatory compliance status.</p>
          </div>
        </div>
      </motion.div>

      {compliance && (
        <>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className={`rounded-2xl border p-6 ${
              compliance.overallStatus === 'good' ? 'border-success/20 bg-success/5' :
              compliance.overallStatus === 'attention' ? 'border-warning/20 bg-warning/5' :
              'border-error/20 bg-error/5'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                compliance.overallStatus === 'good' ? 'bg-success/10 text-success' :
                compliance.overallStatus === 'attention' ? 'bg-warning/10 text-warning' :
                'bg-error/10 text-error'
              }`}>
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <p className="text-lg font-extrabold text-deep-navy">
                  {COMPLIANCE_LABELS[compliance.overallStatus] || compliance.overallStatus}
                </p>
                <p className="text-sm text-medium-gray">Overall Compliance Status</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border-gray bg-white p-6 space-y-4"
          >
            {complianceItems.map(item => {
              const Icon = item.icon
              const value = compliance[item.key as keyof typeof compliance]
              if (typeof value !== 'string') return null
              return (
                <div key={item.key}
                  className="flex items-center justify-between rounded-xl border border-border-gray bg-light-gray/50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold text-deep-navy">{item.label}</span>
                  </div>
                  <StatusBadge status={value} />
                </div>
              )
            })}
          </motion.div>

          {compliance.notes && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="rounded-2xl border border-border-gray bg-white p-6"
            >
              <h3 className="text-sm font-bold text-deep-navy mb-2">Notes</h3>
              <p className="text-sm text-medium-gray">{compliance.notes}</p>
            </motion.div>
          )}

          {compliance.lastAuditDate && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex items-center gap-3 rounded-2xl border border-border-gray bg-white p-6"
            >
              <Calendar className="h-5 w-5 text-gold" />
              <p className="text-sm text-medium-gray">
                <span className="font-semibold text-deep-navy">Last Audit:</span> {new Date(compliance.lastAuditDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </motion.div>
          )}
        </>
      )}

      {!compliance && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 text-medium-gray"
        >
          <ShieldCheck className="h-12 w-12 mx-auto mb-3 text-medium-gray/20" />
          <p className="text-sm font-semibold">No compliance data available yet.</p>
          <p className="text-xs mt-1">Complete your profile to get started.</p>
        </motion.div>
      )}
    </div>
  )
}
