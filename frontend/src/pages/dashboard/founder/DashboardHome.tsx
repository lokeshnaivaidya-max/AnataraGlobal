import { motion } from 'framer-motion'
import { Loader2, User, Building2, Users, FileText, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react'
import { Link } from 'wouter'
import { useFounderProfile, useStartup, useDocuments } from '../../../lib/founder-hooks'

const completionItems = [
  { key: 'profile', label: 'Personal Profile', icon: User, href: '/dashboard/founder/profile' },
  { key: 'startup', label: 'Startup Details', icon: Building2, href: '/dashboard/founder/startup' },
  { key: 'team', label: 'Team Members', icon: Users, href: '/dashboard/founder/team' },
  { key: 'documents', label: 'Documents', icon: FileText, href: '/dashboard/founder/documents' },
  { key: 'kyc', label: 'KYC Verification', icon: ShieldCheck, href: '/dashboard/founder/kyc' },
]

export default function DashboardHome() {
  const { data: founder, isLoading: founderLoading } = useFounderProfile()
  const { data: startup, isLoading: startupLoading } = useStartup()
  const { data: documents, isLoading: docsLoading } = useDocuments()

  const completed = founder ? Math.round(founder.profileCompletion) : 0

  const stats = [
    { label: 'Profile', value: `${completed}%`, color: completed === 100 ? 'text-success' : 'text-gold' },
    { label: 'Startup', value: startup?.name ? 'Set' : 'Not Set', color: startup?.name ? 'text-success' : 'text-warning' },
    { label: 'Documents', value: documents?.length || 0, color: (documents?.length || 0) > 0 ? 'text-success' : 'text-medium-gray' },
  ]

  if (founderLoading || startupLoading || docsLoading) {
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
          Welcome back{founder?.userId ? ', ' + (founder as { userId: string }).userId : ''}!
        </h1>
        <p className="mt-1 text-sm text-medium-gray">
          Here's an overview of your founder profile and startup journey.
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
