import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Users, Plus, X, Search, DollarSign, Mail, Phone, Building2 } from 'lucide-react'
import { Link } from 'wouter'
import { useLeads, useCreateLead, useUpdateLead } from '../../../lib/crm-hooks'
import { LEAD_SOURCES, LEAD_STAGES, LEAD_STAGE_ORDER } from '../../../lib/crm-types'

export default function LeadsPage() {
  const { data: leads, isLoading, refetch } = useLeads()
  const createLead = useCreateLead()
  const updateLead = useUpdateLead()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [source, setSource] = useState('referral')
  const [value, setValue] = useState('')

  const filtered = leads?.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.company?.toLowerCase().includes(search.toLowerCase()) ||
    l.email?.toLowerCase().includes(search.toLowerCase())
  )

  const columns = LEAD_STAGES.map(stage => ({
    ...stage,
    leads: filtered?.filter(l => l.stage === stage.value) || [],
  }))

  const handleCreate = async () => {
    if (!name) return
    await createLead.mutateAsync({ name, email: email || undefined, company: company || undefined, source: source as any, stage: 'new', value: parseFloat(value) || 0, currency: 'USD', tags: [], createdAt: new Date().toISOString() } as any)
    setShowForm(false)
    setName(''); setEmail(''); setCompany(''); setSource('referral'); setValue('')
    refetch()
  }

  const advanceStage = (leadId: string, currentStage: string) => {
    const idx = LEAD_STAGE_ORDER.indexOf(currentStage as any)
    if (idx >= 0 && idx < LEAD_STAGE_ORDER.length - 2) {
      updateLead.mutateAsync({ id: leadId, data: { stage: LEAD_STAGE_ORDER[idx + 1] } as any })
    }
  }

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>

  return (
    <div className="max-w-full mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-gold" />
          <div><h1 className="text-2xl font-extrabold text-deep-navy">CRM (Leads)</h1><p className="text-sm text-medium-gray">Track and manage your sales pipeline.</p></div>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-light px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-gold/20 hover:shadow-xl transition-all"
        ><Plus className="h-4 w-4" /> Add Lead</button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-medium-gray" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads..." className="w-full rounded-xl border border-border-gray bg-white pl-9 pr-4 py-2.5 text-sm placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
        </div>
      </motion.div>

      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${LEAD_STAGES.length}, minmax(180px, 1fr))` }}>
        {columns.map(col => (
          <div key={col.value} className="space-y-3">
            <div className={`rounded-xl px-4 py-3 text-center ${col.color}`}>
              <p className="text-xs font-bold uppercase tracking-wider">{col.label}</p>
              <p className="text-lg font-extrabold mt-1">{col.leads.length}</p>
            </div>
            <div className="space-y-2">
              {col.leads.map(lead => (
                <div key={lead.id} className="rounded-xl border border-border-gray bg-white p-3 hover:shadow-md transition-shadow">
                  <Link href={`/dashboard/crm/${lead.id}`} className="text-xs font-bold text-deep-navy hover:text-gold transition-colors">{lead.name}</Link>
                  {lead.company && <p className="text-[10px] text-medium-gray flex items-center gap-1 mt-0.5"><Building2 className="h-3 w-3" />{lead.company}</p>}
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-medium-gray">
                    {lead.value > 0 && <span className="flex items-center gap-0.5 text-gold font-bold"><DollarSign className="h-3 w-3" />{lead.value.toLocaleString()}</span>}
                    {lead.email && <Mail className="h-3 w-3" />}
                    {lead.phone && <Phone className="h-3 w-3" />}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-gray">
                    {col.value !== 'won' && col.value !== 'lost' && (
                      <button onClick={() => advanceStage(lead.id, lead.stage)} className="text-[10px] font-bold text-gold hover:underline">Advance</button>
                    )}
                    <span className="text-[10px] text-medium-gray">{new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {(!leads || leads.length === 0) && (
        <div className="text-center py-16"><Users className="h-12 w-12 text-medium-gray/20 mx-auto mb-3" /><p className="text-sm font-semibold text-medium-gray">No leads yet</p></div>
      )}

      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-deep-navy/40 backdrop-blur-sm p-4"
          onClick={() => setShowForm(false)}
        >
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 space-y-4" onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold text-deep-navy">Add Lead</h2><button onClick={() => setShowForm(false)} className="p-1 text-medium-gray hover:text-error"><X className="h-5 w-5" /></button></div>
            <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Name *</label><input value={name} onChange={e => setName(e.target.value)} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Email</label><input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Company</label><input value={company} onChange={e => setCompany(e.target.value)} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Source</label><select value={source} onChange={e => setSource(e.target.value)} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all">
                {LEAD_SOURCES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Value (USD)</label><input value={value} onChange={e => setValue(e.target.value)} type="number" className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>
            </div>
            <button onClick={handleCreate} disabled={createLead.isPending || !name}
              className="w-full rounded-xl bg-gradient-to-r from-gold to-gold-light py-3 text-sm font-bold text-white shadow-lg shadow-gold/20 hover:shadow-xl transition-all disabled:opacity-60"
            >{createLead.isPending ? <Loader2 className="h-4 w-4 animate-spin inline" /> : 'Add Lead'}</button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
