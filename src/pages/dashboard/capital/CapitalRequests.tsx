import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Plus, X, DollarSign, FileText, Clock } from 'lucide-react'
import { useMyCapitalRequests, useSubmitCapitalRequest, useCapitalProviders } from '../../../lib/capital-hooks'
import { CAPITAL_REQUEST_STATUSES } from '../../../lib/capital-types'

export default function CapitalRequests() {
  const { data: requests, isLoading, refetch } = useMyCapitalRequests()
  const { data: providers } = useCapitalProviders()
  const submit = useSubmitCapitalRequest()

  const [showForm, setShowForm] = useState(false)
  const [providerId, setProviderId] = useState('')
  const [amount, setAmount] = useState('')
  const [purpose, setPurpose] = useState('')

  const handleSubmit = async () => {
    if (!providerId || !amount || !purpose) return
    const provider = providers?.find(p => p.id === providerId)
    await submit.mutateAsync({
      providerId, providerName: provider?.name || '', amount: parseFloat(amount),
      purpose, status: 'submitted', createdAt: new Date().toISOString(),
    } as any)
    setShowForm(false)
    setProviderId('')
    setAmount('')
    setPurpose('')
    refetch()
  }

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-gold" />
          <div><h1 className="text-2xl font-extrabold text-deep-navy">Capital Requests</h1><p className="text-sm text-medium-gray">Manage your funding applications.</p></div>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-light px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-gold/20 hover:shadow-xl transition-all"><Plus className="h-4 w-4" /> New Request</button>
      </motion.div>

      <div className="space-y-3">
        {requests?.map((req, i) => {
          const statusDef = CAPITAL_REQUEST_STATUSES.find(s => s.value === req.status)
          return (
            <motion.div key={req.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border-gray bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-deep-navy">{req.providerName}</p>
                    <span className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusDef?.color || ''}`}>{statusDef?.label || req.status}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-medium-gray">
                    <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5 text-gold" />{req.amount.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <p className="text-xs text-medium-gray mt-1">{req.purpose}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {(!requests || requests.length === 0) && (
        <div className="text-center py-16"><FileText className="h-12 w-12 text-medium-gray/20 mx-auto mb-3" /><p className="text-sm font-semibold text-medium-gray">No capital requests yet</p></div>
      )}

      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-deep-navy/40 backdrop-blur-sm p-4"
          onClick={() => setShowForm(false)}
        >
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 space-y-4" onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold text-deep-navy">New Capital Request</h2><button onClick={() => setShowForm(false)} className="p-1 text-medium-gray hover:text-error"><X className="h-5 w-5" /></button></div>
            <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Provider</label><select value={providerId} onChange={e => setProviderId(e.target.value)} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all">
              <option value="">Select provider</option>
              {providers?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select></div>
            <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Amount</label><input value={amount} onChange={e => setAmount(e.target.value)} type="number" className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>
            <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Purpose</label><textarea value={purpose} onChange={e => setPurpose(e.target.value)} rows={3} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" placeholder="What is the funding for?" /></div>
            <button onClick={handleSubmit} disabled={submit.isPending || !providerId || !amount || !purpose}
              className="w-full rounded-xl bg-gradient-to-r from-gold to-gold-light py-3 text-sm font-bold text-white shadow-lg shadow-gold/20 hover:shadow-xl transition-all disabled:opacity-60"
            >{submit.isPending ? <Loader2 className="h-4 w-4 animate-spin inline" /> : 'Submit Request'}</button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
