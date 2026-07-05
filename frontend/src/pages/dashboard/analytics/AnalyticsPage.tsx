import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, BarChart3, Users, Eye, DollarSign, Activity, ArrowUp, ArrowDown } from 'lucide-react'
import { useAnalytics } from '../../../lib/analytics-hooks'

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="h-12 rounded-lg overflow-hidden" style={{ width: `${(value / max) * 100}%`, backgroundColor: color, minWidth: 4 }} />
  )
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('month')
  const { data: report, isLoading } = useAnalytics(period)

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-gold" />
          <div><h1 className="text-2xl font-extrabold text-deep-navy">Analytics</h1><p className="text-sm text-medium-gray">Platform performance and growth metrics.</p></div>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'quarter', 'year'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all capitalize ${period === p ? 'bg-deep-navy text-white' : 'bg-light-gray text-medium-gray hover:bg-border-gray'}`}
            >{p}</button>
          ))}
        </div>
      </motion.div>

      {report && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border-gray bg-white p-5">
              <div className="flex items-center gap-2 mb-2"><Eye className="h-4 w-4 text-gold" /><span className="text-xs font-semibold uppercase tracking-wider text-medium-gray">Total Views</span></div>
              <p className="text-2xl font-extrabold text-deep-navy">{report.overview.totalViews.toLocaleString()}</p>
              <p className="text-xs text-medium-gray mt-1">{report.overview.periodLabel}</p>
            </div>
            <div className="rounded-2xl border border-border-gray bg-white p-5">
              <div className="flex items-center gap-2 mb-2"><Users className="h-4 w-4 text-gold" /><span className="text-xs font-semibold uppercase tracking-wider text-medium-gray">Active Users</span></div>
              <p className="text-2xl font-extrabold text-deep-navy">{report.overview.activeUsers.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-xs mt-1">
                {report.overview.growthRate >= 0 ? <ArrowUp className="h-3 w-3 text-success" /> : <ArrowDown className="h-3 w-3 text-error" />}
                <span className={report.overview.growthRate >= 0 ? 'text-success' : 'text-error'}>{Math.abs(report.overview.growthRate)}%</span>
                <span className="text-medium-gray">vs last period</span>
              </div>
            </div>
            <div className="rounded-2xl border border-border-gray bg-white p-5">
              <div className="flex items-center gap-2 mb-2"><Activity className="h-4 w-4 text-gold" /><span className="text-xs font-semibold uppercase tracking-wider text-medium-gray">Conversion</span></div>
              <p className="text-2xl font-extrabold text-deep-navy">{report.overview.conversionRate}%</p>
              <p className="text-xs text-medium-gray mt-1">{report.overview.totalLeads} leads</p>
            </div>
            <div className="rounded-2xl border border-border-gray bg-white p-5">
              <div className="flex items-center gap-2 mb-2"><DollarSign className="h-4 w-4 text-gold" /><span className="text-xs font-semibold uppercase tracking-wider text-medium-gray">Revenue</span></div>
              <p className="text-2xl font-extrabold text-deep-navy">${report.overview.revenue.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="rounded-2xl border border-border-gray bg-white p-6"
            >
              <h3 className="text-sm font-bold text-deep-navy mb-4">Page Views</h3>
              <div className="flex items-end gap-1.5 h-32">
                {report.pageViews.map((pv, i) => {
                  const max = Math.max(...report.pageViews.map(x => x.views))
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <MiniBar value={pv.views} max={max} color="#D4AF37" />
                      <span className="text-[8px] text-medium-gray rotate-45 origin-left whitespace-nowrap">
                        {new Date(pv.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="rounded-2xl border border-border-gray bg-white p-6"
            >
              <h3 className="text-sm font-bold text-deep-navy mb-4">Leads by Source</h3>
              <div className="space-y-3">
                {report.leadsBySource.map((src, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-medium-gray">{src.label}</span>
                      <span className="font-bold text-deep-navy">{src.value} ({src.percentage}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-light-gray overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${src.percentage}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="h-full rounded-full" style={{ backgroundColor: src.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="rounded-2xl border border-border-gray bg-white p-6"
            >
              <h3 className="text-sm font-bold text-deep-navy mb-4">User Growth</h3>
              <div className="flex items-end gap-1.5 h-32">
                {report.userGrowth.map((ug, i) => {
                  const max = Math.max(...report.userGrowth.map(x => x.users))
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <MiniBar value={ug.users} max={max} color="#1B2A4A" />
                      <span className="text-[8px] text-medium-gray rotate-45 origin-left whitespace-nowrap">
                        {new Date(ug.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="rounded-2xl border border-border-gray bg-white p-6"
            >
              <h3 className="text-sm font-bold text-deep-navy mb-4">Revenue History</h3>
              <div className="flex items-end gap-1.5 h-32">
                {report.revenueHistory.map((rv, i) => {
                  const max = Math.max(...report.revenueHistory.map(x => x.revenue))
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <MiniBar value={rv.revenue} max={max} color="#22c55e" />
                      <span className="text-[8px] text-medium-gray rotate-45 origin-left whitespace-nowrap">
                        {new Date(rv.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl border border-border-gray bg-white p-6"
          >
            <h3 className="text-sm font-bold text-deep-navy mb-4">Top Pages</h3>
            <div className="space-y-3">
              {report.topPages.map((pg, i) => (
                <div key={i} className="flex items-center gap-4 text-sm">
                  <span className="text-xs font-bold text-medium-gray w-5">{i + 1}</span>
                  <span className="flex-1 font-semibold text-deep-navy">{pg.path}</span>
                  <span className="text-medium-gray">{pg.views.toLocaleString()} views</span>
                  <span className="text-medium-gray">{pg.avgTime.toFixed(0)}s avg</span>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}

      {!report && (
        <div className="text-center py-20"><BarChart3 className="h-12 w-12 text-medium-gray/20 mx-auto mb-3" /><p className="text-sm font-semibold text-medium-gray">No analytics data available yet.</p></div>
      )}
    </div>
  )
}
