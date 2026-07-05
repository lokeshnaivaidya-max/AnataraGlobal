import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Loader2, PieChart, Plus, X, DollarSign, Calendar,
  ArrowUpRight,
} from 'lucide-react'
import { Link } from 'wouter'
import { useFundraisingRounds, useCreateRound } from '../../../lib/fundraising-hooks'
import { ROUND_TYPES, ROUND_STATUSES } from '../../../lib/fundraising-types'

export default function FundraisingRounds() {
  const { data: rounds, isLoading, refetch } = useFundraisingRounds()
  const createRound = useCreateRound()
  const [showForm, setShowForm] = useState(false)

  const [type, setType] = useState('seed')
  const [targetAmount, setTargetAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [description, setDescription] = useState('')

  const handleCreate = async () => {
    if (!targetAmount) return
    await createRound.mutateAsync({
      type: type as any,
      targetAmount: parseFloat(targetAmount),
      currency,
      description: description || undefined,
      raisedAmount: 0,
      status: 'planning',
      startedAt: new Date().toISOString(),
      investors: [],
    } as any)
    setShowForm(false)
    setType('seed')
    setTargetAmount('')
    setCurrency('USD')
    setDescription('')
    refetch()
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <PieChart className="h-6 w-6 text-gold" />
          <div>
            <h1 className="text-2xl font-extrabold text-deep-navy">Fundraising Rounds</h1>
            <p className="text-sm text-medium-gray">Create and manage your fundraising rounds.</p>
          </div>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-light px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-gold/20 hover:shadow-xl transition-all"
        ><Plus className="h-4 w-4" /> New Round</button>
      </motion.div>

      <div className="space-y-4">
        {rounds?.map((round, i) => {
          const progress = (round.targetAmount ?? 0) > 0 ? Math.min(((round.raisedAmount ?? 0) / round.targetAmount) * 100, 100) : 0
          const statusDef = ROUND_STATUSES.find(s => s.value === round.status)
          const typeDef = ROUND_TYPES.find(t => t.value === round.type)
          return (
            <motion.div key={round.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border-gray bg-white p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-deep-navy capitalize">{typeDef?.label || round.type}</h3>
                    <span className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusDef?.color || ''}`}>
                      {statusDef?.label || round.status}
                    </span>
                  </div>
                  {round.description && (
                    <p className="text-sm text-medium-gray mt-1">{round.description}</p>
                  )}
                </div>
                <Link href={`/dashboard/founder/fundraising/investors?roundId=${round.id}`}
                  className="flex items-center gap-1 text-xs font-bold text-gold hover:underline shrink-0"
                >
                  Pipeline <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
 
              <div className="flex items-center gap-4 mb-3 text-sm">
                <div className="flex items-center gap-1 text-medium-gray">
                  <DollarSign className="h-4 w-4 text-gold" />
                  <span className="font-bold text-deep-navy">{round.currency} {(round.raisedAmount ?? 0).toLocaleString()}</span>
                  <span className="text-medium-gray">/ {round.currency} {(round.targetAmount ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-medium-gray">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(round.startedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </div>
              </div>

              <div className="h-2.5 rounded-full bg-light-gray overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light"
                />
              </div>

              <div className="flex items-center justify-between mt-2 text-xs text-medium-gray">
                <span>{Math.round(progress)}% funded</span>
                <span>{round.investors?.length || 0} investors</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {(!rounds || rounds.length === 0) && (
        <div className="text-center py-20">
          <PieChart className="h-12 w-12 text-medium-gray/20 mx-auto mb-3" />
          <p className="text-sm font-semibold text-medium-gray">No rounds yet</p>
          <p className="text-xs text-medium-gray/60 mt-1">Create your first fundraising round.</p>
        </div>
      )}

      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-deep-navy/40 backdrop-blur-sm p-4"
          onClick={() => setShowForm(false)}
        >
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-2xl bg-white p-6 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-deep-navy">New Fundraising Round</h2>
              <button onClick={() => setShowForm(false)} className="p-1 text-medium-gray hover:text-error"><X className="h-5 w-5" /></button>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Round Type</label>
              <select value={type} onChange={e => setType(e.target.value)}
                className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
              >
                {ROUND_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Target Amount</label>
                <input value={targetAmount} onChange={e => setTargetAmount(e.target.value)} type="number"
                  className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
                  placeholder="500000" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Currency</label>
                <select value={currency} onChange={e => setCurrency(e.target.value)}
                  className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
                >
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
                placeholder="Round objectives, use of funds..."
              />
            </div>

            <button onClick={handleCreate} disabled={createRound.isPending || !targetAmount}
              className="w-full rounded-xl bg-gradient-to-r from-gold to-gold-light py-3 text-sm font-bold text-white shadow-lg shadow-gold/20 hover:shadow-xl transition-all disabled:opacity-60"
            >
              {createRound.isPending ? <><Loader2 className="h-4 w-4 animate-spin inline" /> Creating...</> : 'Create Round'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
