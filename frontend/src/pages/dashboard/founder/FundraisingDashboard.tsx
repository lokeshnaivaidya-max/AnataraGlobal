import { motion } from 'framer-motion'
import {
  Loader2, TrendingUp, DollarSign, Users, Target, PieChart,
  Plus, ArrowUpRight,
} from 'lucide-react'
import { Link } from 'wouter'
import { useFundraisingRounds, useFundraisingMetrics } from '../../../lib/fundraising-hooks'

export default function FundraisingDashboard() {
  const { data: rounds, isLoading: roundsLoading } = useFundraisingRounds()
  const { data: metrics, isLoading: metricsLoading } = useFundraisingMetrics()

  if (roundsLoading || metricsLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  }

  const activeRound = rounds?.find(r => r.status === 'active')

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-gold" />
          <div>
            <h1 className="text-2xl font-extrabold text-deep-navy">Fundraising</h1>
            <p className="text-sm text-medium-gray">Track rounds, investors, and fundraising progress.</p>
          </div>
        </div>
        <Link href="/dashboard/founder/fundraising/rounds"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-light px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-gold/20 hover:shadow-xl transition-all"
        >
          <Plus className="h-4 w-4" /> New Round
        </Link>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border-gray bg-white p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-gold" />
            <p className="text-xs font-semibold uppercase tracking-wider text-medium-gray">Total Raised</p>
          </div>
          <p className="text-xl font-extrabold text-deep-navy">
            ${(metrics?.totalRaised || 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-border-gray bg-white p-5">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-gold" />
            <p className="text-xs font-semibold uppercase tracking-wider text-medium-gray">Total Target</p>
          </div>
          <p className="text-xl font-extrabold text-deep-navy">
            ${(metrics?.totalTarget || 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-border-gray bg-white p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-gold" />
            <p className="text-xs font-semibold uppercase tracking-wider text-medium-gray">Investors</p>
          </div>
          <p className="text-xl font-extrabold text-deep-navy">{metrics?.totalInvestors || 0}</p>
        </div>
        <div className="rounded-2xl border border-border-gray bg-white p-5">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="h-4 w-4 text-gold" />
            <p className="text-xs font-semibold uppercase tracking-wider text-medium-gray">Rounds</p>
          </div>
          <p className="text-xl font-extrabold text-deep-navy">{metrics?.roundsCompleted || 0}</p>
        </div>
      </div>

      {activeRound && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-2xl border border-success/20 bg-success/5 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-deep-navy">Active Round</p>
              <p className="text-xs text-medium-gray capitalize">{activeRound.type.replace('_', ' ')}</p>
            </div>
            <Link href="/dashboard/founder/fundraising/rounds"
              className="flex items-center gap-1 text-xs font-bold text-gold hover:underline"
            >
              View Details <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-semibold text-medium-gray">Progress</span>
            <span className="font-bold text-deep-navy">
              ${activeRound.raisedAmount.toLocaleString()} / ${activeRound.targetAmount.toLocaleString()}
            </span>
          </div>
          <div className="h-3 rounded-full bg-light-gray overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((activeRound.raisedAmount / activeRound.targetAmount) * 100, 100)}%` }}
              transition={{ duration: 1 }}
              className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light"
            />
          </div>
        </motion.div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Link href="/dashboard/founder/fundraising/rounds"
            className="block rounded-2xl border border-border-gray bg-white p-6 hover:shadow-lg hover:border-gold/20 transition-all group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold">
                <PieChart className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-deep-navy group-hover:text-gold transition-colors">Rounds</p>
                <p className="text-xs text-medium-gray">Manage fundraising rounds</p>
              </div>
            </div>
            <div className="text-xs text-medium-gray">
              {rounds?.length || 0} rounds &middot; {rounds?.filter(r => r.status === 'active').length || 0} active
            </div>
          </Link>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Link href="/dashboard/founder/fundraising/investors"
            className="block rounded-2xl border border-border-gray bg-white p-6 hover:shadow-lg hover:border-gold/20 transition-all group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-deep-navy group-hover:text-gold transition-colors">Investor Pipeline</p>
                <p className="text-xs text-medium-gray">Track investor relationships</p>
              </div>
            </div>
            <div className="text-xs text-medium-gray">
              {metrics?.totalInvestors || 0} total investors
            </div>
          </Link>
        </motion.div>
      </div>

      {(!rounds || rounds.length === 0) && (
        <div className="text-center py-16">
          <TrendingUp className="h-12 w-12 text-medium-gray/20 mx-auto mb-3" />
          <p className="text-sm font-semibold text-medium-gray">No fundraising rounds yet</p>
          <p className="text-xs text-medium-gray/60 mt-1">Start by creating your first round.</p>
        </div>
      )}
    </div>
  )
}
