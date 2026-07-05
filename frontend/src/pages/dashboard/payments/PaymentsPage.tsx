import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, CreditCard, Plus, X, Trash2, Download, ArrowUpRight, ArrowDownLeft, Ban as Bank, Smartphone } from 'lucide-react'
import { usePaymentMethods, useTransactions, useInvoices, useAddPaymentMethod, useDeletePaymentMethod } from '../../../lib/payment-hooks'
import { TRANSACTION_STATUSES, INVOICE_STATUSES } from '../../../lib/payment-types'

const methodIcons: Record<string, typeof CreditCard> = { card: CreditCard, bank: Bank, upi: Smartphone, wallet: CreditCard }

export default function PaymentsPage() {
  const { data: methods, isLoading: methodsLoading } = usePaymentMethods()
  const { data: transactions, isLoading: txLoading } = useTransactions()
  const { data: invoices, isLoading: invLoading } = useInvoices()
  const addMethod = useAddPaymentMethod()
  const deleteMethod = useDeletePaymentMethod()

  const [tab, setTab] = useState<'methods' | 'transactions' | 'invoices'>('methods')
  const [showForm, setShowForm] = useState(false)
  const [type, setType] = useState('card')
  const [label, setLabel] = useState('')
  const [lastFour, setLastFour] = useState('')

  const handleAddMethod = async () => {
    if (!label) return
    await addMethod.mutateAsync({ type: type as any, label, lastFour: lastFour || undefined, isDefault: (methods?.length || 0) === 0 } as any)
    setShowForm(false)
    setLabel('')
    setLastFour('')
  }

  if (methodsLoading || txLoading || invLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="h-6 w-6 text-gold" />
          <div><h1 className="text-2xl font-extrabold text-deep-navy">Payments</h1><p className="text-sm text-medium-gray">Manage payment methods, transactions, and invoices.</p></div>
        </div>
        <div className="flex gap-2">
          {(['methods', 'transactions', 'invoices'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all capitalize ${tab === t ? 'bg-deep-navy text-white' : 'bg-light-gray text-medium-gray hover:bg-border-gray'}`}
            >{t}</button>
          ))}
        </div>
      </motion.div>

      {tab === 'methods' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-deep-navy">Payment Methods</h2>
            <button onClick={() => setShowForm(true)} className="flex items-center gap-1 text-xs font-bold text-gold hover:underline"><Plus className="h-3 w-3" /> Add</button>
          </div>
          {methods?.map(m => {
            const Icon = methodIcons[m.type] || CreditCard
            return (
              <div key={m.id} className="flex items-center gap-4 rounded-2xl border border-border-gray bg-white p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold"><Icon className="h-5 w-5" /></div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-deep-navy">{m.label}</p>
                  <p className="text-xs text-medium-gray capitalize">{m.type}{m.lastFour ? ` ···· ${m.lastFour}` : ''}{m.upiId ? ` · ${m.upiId}` : ''}</p>
                </div>
                {m.isDefault && <span className="rounded-full bg-success/10 text-success px-2.5 py-0.5 text-[10px] font-bold">Default</span>}
                <button onClick={() => deleteMethod.mutateAsync(m.id)} className="p-2 text-error/60 hover:text-error transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
            )
          })}
          {(!methods || methods.length === 0) && <div className="text-center py-12 text-medium-gray"><p className="text-sm font-semibold">No payment methods added yet.</p></div>}
        </motion.div>
      )}

      {tab === 'transactions' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          {transactions?.map((tx) => {
            const statusDef = TRANSACTION_STATUSES.find(s => s.value === tx.status)
            return (
              <div key={tx.id} className="flex items-center gap-4 rounded-2xl border border-border-gray bg-white p-4">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${tx.type === 'payout' ? 'bg-error/10 text-error' : 'bg-success/10 text-success'}`}>
                  {tx.type === 'payout' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-deep-navy">{tx.description}</p>
                  <p className="text-xs text-medium-gray capitalize">{tx.type.replace('_', ' ')} · {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-extrabold ${tx.type === 'payout' ? 'text-error' : 'text-success'}`}>
                    {tx.type === 'payout' ? '-' : '+'}{tx.currency} {tx.amount.toLocaleString()}
                  </p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusDef?.color || ''}`}>{statusDef?.label || tx.status}</span>
                </div>
              </div>
            )
          })}
          {(!transactions || transactions.length === 0) && <div className="text-center py-12 text-medium-gray"><p className="text-sm font-semibold">No transactions yet.</p></div>}
        </motion.div>
      )}

      {tab === 'invoices' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          {invoices?.map((inv) => {
            const statusDef = INVOICE_STATUSES.find(s => s.value === inv.status)
            return (
              <div key={inv.id} className="flex items-center gap-4 rounded-2xl border border-border-gray bg-white p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-deep-navy">{inv.number}</p>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusDef?.color || ''}`}>{statusDef?.label || inv.status}</span>
                  </div>
                  <p className="text-xs text-medium-gray mt-0.5">{inv.description} · Due {new Date(inv.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-deep-navy">{inv.currency} {inv.amount.toLocaleString()}</p>
                  <a href="#" className="text-[10px] text-gold hover:underline flex items-center gap-0.5 justify-end"><Download className="h-3 w-3" /> PDF</a>
                </div>
              </div>
            )
          })}
          {(!invoices || invoices.length === 0) && <div className="text-center py-12 text-medium-gray"><p className="text-sm font-semibold">No invoices yet.</p></div>}
        </motion.div>
      )}

      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-deep-navy/40 backdrop-blur-sm p-4"
          onClick={() => setShowForm(false)}
        >
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 space-y-4" onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold text-deep-navy">Add Payment Method</h2><button onClick={() => setShowForm(false)} className="p-1 text-medium-gray hover:text-error"><X className="h-5 w-5" /></button></div>
            <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Type</label><select value={type} onChange={e => setType(e.target.value)} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all">
              <option value="card">Card</option><option value="bank">Bank Account</option><option value="upi">UPI</option><option value="wallet">Wallet</option>
            </select></div>
            <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Label</label><input value={label} onChange={e => setLabel(e.target.value)} placeholder="My Business Card" className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>
            {type === 'card' && <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Last 4 Digits</label><input value={lastFour} onChange={e => setLastFour(e.target.value)} maxLength={4} placeholder="1234" className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>}
            <button onClick={handleAddMethod} disabled={addMethod.isPending || !label} className="w-full rounded-xl bg-deep-navy py-3 text-sm font-bold text-white hover:bg-deep-navy-light transition-all disabled:opacity-60">{addMethod.isPending ? <Loader2 className="h-4 w-4 animate-spin inline" /> : 'Add Method'}</button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
