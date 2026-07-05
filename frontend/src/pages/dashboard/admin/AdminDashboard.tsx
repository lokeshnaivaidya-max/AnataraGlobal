import { motion } from 'framer-motion'
import {
  Loader2, Users, Building2, UserCheck, FileText, Calendar,
  TrendingUp, Activity, HardDrive,
} from 'lucide-react'
import { usePlatformStats } from '../../../lib/admin-hooks'

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: typeof Users; label: string; value: string; sub?: string; color: string
}) {
  return (
    <div className="rounded-2xl border border-border-gray bg-white p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-medium-gray">{label}</p>
      </div>
      <p className="text-2xl font-extrabold text-deep-navy">{value}</p>
      {sub && <p className="text-xs text-medium-gray mt-1">{sub}</p>}
    </div>
  )
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = usePlatformStats()

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-deep-navy tracking-tight">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-medium-gray">Platform overview and key metrics.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={stats?.totalUsers?.toLocaleString() || '0'} sub={`${stats?.newUsersThisMonth || 0} this month`} color="bg-blue-100 text-blue-600" />
        <StatCard icon={Building2} label="Founders" value={stats?.totalFounders?.toLocaleString() || '0'} color="bg-gold/10 text-gold" />
        <StatCard icon={Users} label="MSMEs" value={stats?.totalMsmes?.toLocaleString() || '0'} color="bg-emerald/10 text-emerald" />
        <StatCard icon={UserCheck} label="Advisors" value={stats?.totalAdvisors?.toLocaleString() || '0'} color="bg-purple-100 text-purple-600" />
        <StatCard icon={Calendar} label="Sessions" value={stats?.totalSessions?.toLocaleString() || '0'} color="bg-amber-100 text-amber-600" />
        <StatCard icon={FileText} label="Documents" value={stats?.totalDocuments?.toLocaleString() || '0'} color="bg-cyan-100 text-cyan-600" />
        <StatCard icon={Activity} label="Active Users" value={stats?.activeUsers?.toLocaleString() || '0'} color="bg-success/10 text-success" />
        <StatCard icon={HardDrive} label="Storage" value={stats?.storageUsed ? `${(stats.storageUsed / 1024 / 1024).toFixed(1)} GB` : '0 GB'} color="bg-orange-100 text-orange-600" />
      </div>

      {stats?.recentActivity && stats.recentActivity.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border-gray bg-white p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-gold" />
            <h2 className="text-lg font-bold text-deep-navy">Recent Activity</h2>
          </div>
          <div className="space-y-3">
            {stats.recentActivity.slice(0, 10).map(log => (
              <div key={log.id} className="flex items-start gap-3 text-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-light-gray text-[10px] font-bold text-medium-gray shrink-0">
                  {log.userName?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-medium-gray">
                    <span className="font-bold text-deep-navy">{log.userName}</span>
                    {' '}{log.details}
                  </p>
                  <p className="text-xs text-medium-gray/60 mt-0.5">
                    {new Date(log.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {(!stats || stats.recentActivity.length === 0) && (
        <div className="text-center py-16">
          <Activity className="h-12 w-12 text-medium-gray/20 mx-auto mb-3" />
          <p className="text-sm font-semibold text-medium-gray">No recent activity</p>
        </div>
      )}
    </div>
  )
}
