import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, BarChart3, TrendingUp, TrendingDown, DollarSign, Plus } from 'lucide-react'
import { useTurnoverHistory, useAddTurnover, useFinancialHealth } from '../../../lib/msme-hooks'

export default function FinancialHealth() {
  const { data: turnover, isLoading: turnoverLoading, refetch: refetchTurnover } = useTurnoverHistory()
  const addTurnover = useAddTurnover()
  const { data: financial, isLoading: financialLoading } = useFinancialHealth()

  const [fiscalYear, setFiscalYear] = useState(new Date().getFullYear().toString())
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('INR')

  const handleAddTurnover = async () => {
    if (!fiscalYear || !amount) return
    await addTurnover.mutateAsync({
      msmeId: '',
      fiscalYear,
      amount: parseFloat(amount),
      currency,
      isVerified: false,
    })
    setFiscalYear(new Date().getFullYear().toString())
    setAmount('')
    refetchTurnover()
  }

  if (turnoverLoading || financialLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-gold" />
          <div>
            <h1 className="text-2xl font-extrabold text-deep-navy">Financial Health</h1>
            <p className="text-sm text-medium-gray">Track your turnover and financial metrics.</p>
          </div>
        </div>
      </motion.div>

      {financial && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border-gray bg-white p-6"
        >
          <h2 className="text-lg font-bold text-deep-navy mb-4">Health Assessment</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10">
              <span className="text-2xl font-extrabold text-gold">{financial.overallScore}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-deep-navy">Overall Score</p>
              <p className="text-xs text-medium-gray">out of 100</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border-gray bg-light-gray/50 p-4">
              <div className="flex items-center gap-2 text-sm text-medium-gray mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="font-semibold">Revenue Growth</span>
              </div>
              <p className={`text-lg font-extrabold ${financial.revenueGrowth >= 0 ? 'text-success' : 'text-error'}`}>
                {financial.revenueGrowth >= 0 ? '+' : ''}{financial.revenueGrowth}%
              </p>
            </div>
            <div className="rounded-xl border border-border-gray bg-light-gray/50 p-4">
              <div className="flex items-center gap-2 text-sm text-medium-gray mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="font-semibold">Profit Margin</span>
              </div>
              <p className={`text-lg font-extrabold ${financial.profitMargin >= 0 ? 'text-success' : 'text-error'}`}>
                {financial.profitMargin}%
              </p>
            </div>
            <div className="rounded-xl border border-border-gray bg-light-gray/50 p-4">
              <div className="flex items-center gap-2 text-sm text-medium-gray mb-1">
                <TrendingDown className="h-4 w-4" />
                <span className="font-semibold">Debt Ratio</span>
              </div>
              <p className="text-lg font-extrabold text-deep-navy">{financial.debtRatio}%</p>
            </div>
            <div className="rounded-xl border border-border-gray bg-light-gray/50 p-4">
              <div className="flex items-center gap-2 text-sm text-medium-gray mb-1">
                <BarChart3 className="h-4 w-4" />
                <span className="font-semibold">Liquidity Ratio</span>
              </div>
              <p className="text-lg font-extrabold text-deep-navy">{financial.liquidityRatio}</p>
            </div>
          </div>

          {financial.recommendations && (
            <div className="mt-4 rounded-xl bg-gold/5 border border-gold/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold mb-1">Recommendations</p>
              <p className="text-sm text-medium-gray">{financial.recommendations}</p>
            </div>
          )}
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border-gray bg-white p-6 space-y-4"
      >
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-gold" />
          <h2 className="text-lg font-bold text-deep-navy">Turnover History</h2>
        </div>

        {turnover?.map(entry => (
          <div key={entry.id} className="flex items-center justify-between rounded-xl border border-border-gray bg-light-gray/50 p-4">
            <div>
              <p className="text-sm font-bold text-deep-navy">FY {entry.fiscalYear}</p>
              <p className="text-xs text-medium-gray">{entry.currency} {entry.amount.toLocaleString()}</p>
            </div>
            <span className={`text-xs font-bold ${entry.isVerified ? 'text-success' : 'text-warning'}`}>
              {entry.isVerified ? 'Verified' : 'Pending'}
            </span>
          </div>
        ))}

        {(!turnover || turnover.length === 0) && (
          <p className="text-sm text-medium-gray text-center py-4">No turnover entries yet.</p>
        )}

        <div className="grid sm:grid-cols-4 gap-3">
          <input value={fiscalYear} onChange={e => setFiscalYear(e.target.value)}
            placeholder="FY" className="rounded-xl border border-border-gray bg-light-gray/50 px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
          <input value={amount} onChange={e => setAmount(e.target.value)} type="number"
            placeholder="Amount" className="rounded-xl border border-border-gray bg-light-gray/50 px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
          <select value={currency} onChange={e => setCurrency(e.target.value)}
            className="rounded-xl border border-border-gray bg-light-gray/50 px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          <button onClick={handleAddTurnover} disabled={addTurnover.isPending || !amount}
            className="flex items-center justify-center gap-2 rounded-xl bg-deep-navy px-4 py-2.5 text-sm font-bold text-white hover:bg-deep-navy-light transition-all disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </motion.div>
    </div>
  )
}
