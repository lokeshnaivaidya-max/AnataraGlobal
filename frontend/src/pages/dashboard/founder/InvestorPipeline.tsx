import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Users, Plus, X } from 'lucide-react'
import { useInvestorPipeline, useAddInvestor, useUpdateInvestorStage } from '../../../lib/fundraising-hooks'
import { INVESTOR_STAGES, INVESTOR_TYPES } from '../../../lib/fundraising-types'

const stageOrder = ['identified', 'contacted', 'meeting_scheduled', 'due_diligence', 'term_sheet', 'closed', 'passed']

export default function InvestorPipeline() {
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const roundId = params.get('roundId') || ''

  const { data: investors, isLoading, refetch } = useInvestorPipeline(roundId)
  const addInvestor = useAddInvestor()
  const updateStage = useUpdateInvestorStage()

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [investorType, setInvestorType] = useState('vc')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [successMsg, setSuccessMsg] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const grouped = INVESTOR_STAGES.map(s => ({
    ...s,
    investors: investors?.filter(i => i.stage === s.value) || [],
  }))

  const handleAdd = async () => {
    if (!name) return
    setSuccessMsg(false)
    setErrorMsg('')
    try {
      await addInvestor.mutateAsync({
        investorName: name,
        investorType: investorType as any,
        contactEmail: email || undefined,
        notes: notes || undefined,
        stage: 'identified',
        roundId: roundId,
        createdAt: new Date().toISOString(),
      } as any)
      setSuccessMsg(true)
      setName('')
      setInvestorType('vc')
      setEmail('')
      setNotes('')
      refetch()
      setTimeout(() => {
        setShowForm(false)
        setSuccessMsg(false)
      }, 1500)
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to add investor.'
      setErrorMsg(msg)
    }
  }

  const advanceStage = (current: string) => {
    const idx = stageOrder.indexOf(current)
    if (idx < stageOrder.length - 1) return stageOrder[idx + 1]
    return current
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-gold" />
          <div>
            <h1 className="text-2xl font-extrabold text-deep-navy">Investor Pipeline</h1>
            <p className="text-sm text-medium-gray">Track investor relationships through your pipeline.</p>
          </div>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-light px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-gold/20 hover:shadow-xl transition-all"
        ><Plus className="h-4 w-4" /> Add Investor</button>
      </motion.div>

      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${INVESTOR_STAGES.length}, minmax(200px, 1fr))` }}>
        {grouped.map(stage => (
          <div key={stage.value} className="space-y-3">
            <div className={`rounded-xl px-4 py-3 text-center ${stage.color} bg-opacity-10`}>
              <p className="text-xs font-bold uppercase tracking-wider">{stage.label}</p>
              <p className="text-lg font-extrabold mt-1">{stage.investors.length}</p>
            </div>
            <div className="space-y-2">
              {stage.investors.map(inv => (
                <div key={inv.id}
                  className="rounded-xl border border-border-gray bg-white p-3 hover:shadow-md transition-shadow"
                >
                  <p className="text-sm font-bold text-deep-navy truncate">{inv.investorName}</p>
                  <p className="text-[10px] text-medium-gray uppercase tracking-wider mt-0.5">{inv.investorType.replace('_', ' ')}</p>
                  {inv.expectedAmount && (
                    <p className="text-xs text-gold font-bold mt-1">${inv.expectedAmount.toLocaleString()}</p>
                  )}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-gray">
                    {inv.stage !== 'passed' && inv.stage !== 'closed' && (
                      <button onClick={() => updateStage.mutateAsync({ id: inv.id, stage: advanceStage(inv.stage) }).then(() => refetch())}
                        className="text-[10px] font-bold text-gold hover:underline"
                      >Advance</button>
                    )}
                    <span className="text-[10px] text-medium-gray">
                      {new Date(inv.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {(!investors || investors.length === 0) && (
        <div className="text-center py-20">
          <Users className="h-12 w-12 text-medium-gray/20 mx-auto mb-3" />
          <p className="text-sm font-semibold text-medium-gray">No investors in pipeline</p>
          <p className="text-xs text-medium-gray/60 mt-1">Add investors to start tracking.</p>
        </div>
      )}

      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-deep-navy/40 backdrop-blur-sm p-4"
          onClick={() => setShowForm(false)}
        >
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-deep-navy">Add Investor</h2>
              <button onClick={() => setShowForm(false)} className="p-1 text-medium-gray hover:text-error"><X className="h-5 w-5" /></button>
            </div>

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-success/20 bg-success/10 px-4 py-2.5 text-sm text-success font-medium"
              >
                Investor added to pipeline successfully!
              </motion.div>
            )}

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-error/20 bg-error/10 px-4 py-2.5 text-sm text-error font-medium"
              >
                {errorMsg}
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Investor Name</label>
              <input value={name} onChange={e => setName(e.target.value)}
                className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
                placeholder="Name or firm" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Type</label>
              <select value={investorType} onChange={e => setInvestorType(e.target.value)}
                className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
              >
                {INVESTOR_TYPES.map(t => (
                  <option key={t} value={t}>{t.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email"
                className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
                placeholder="investor@example.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
                placeholder="Any notes..."
              />
            </div>
            <button onClick={handleAdd} disabled={addInvestor.isPending || !name || successMsg}
              className="w-full rounded-xl bg-gradient-to-r from-gold to-gold-light py-3 text-sm font-bold text-white shadow-lg shadow-gold/20 hover:shadow-xl transition-all disabled:opacity-60 cursor-pointer"
            >
              {addInvestor.isPending ? <><Loader2 className="h-4 w-4 animate-spin inline" /> Adding...</> : 'Add to Pipeline'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
