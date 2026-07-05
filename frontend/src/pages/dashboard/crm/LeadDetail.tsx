import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, ArrowLeft, Mail, Phone, Building2, DollarSign, Tag, MessageSquare, Plus, X, Edit3, Trash2 } from 'lucide-react'
import { Link, useParams } from 'wouter'
import { useLead, useUpdateLead, useDeleteLead, useLeadActivities, useAddLeadActivity } from '../../../lib/crm-hooks'
import { LEAD_SOURCES, LEAD_STAGES } from '../../../lib/crm-types'

export default function LeadDetail() {
  const params = useParams()
  const id = params?.id || ''
  const { data: lead, isLoading, refetch } = useLead(id)
  const updateLead = useUpdateLead()
  const deleteLead = useDeleteLead()
  const { data: activities } = useLeadActivities(id)
  const addActivity = useAddLeadActivity()

  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editCompany, setEditCompany] = useState('')
  const [editNotes, setEditNotes] = useState('')

  const [showActivity, setShowActivity] = useState(false)
  const [actType, setActType] = useState('note')
  const [actSubject, setActSubject] = useState('')
  const [actDesc, setActDesc] = useState('')

  const startEdit = () => {
    if (!lead) return
    setEditName(lead.name)
    setEditEmail(lead.email || '')
    setEditCompany(lead.company || '')
    setEditNotes(lead.notes || '')
    setEditing(true)
  }

  const handleSave = async () => {
    if (!lead) return
    await updateLead.mutateAsync({ id, data: { name: editName, email: editEmail || undefined, company: editCompany || undefined, notes: editNotes || undefined } })
    setEditing(false)
  }

  const handleAddActivity = async () => {
    await addActivity.mutateAsync({ leadId: id, data: { type: actType as any, subject: actSubject, description: actDesc, createdAt: new Date().toISOString() } } as any)
    setShowActivity(false)
    setActSubject('')
    setActDesc('')
    refetch()
  }

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  if (!lead) return <div className="text-center py-20"><p className="text-sm font-semibold text-medium-gray">Lead not found.</p><Link href="/dashboard/crm" className="text-gold text-sm font-semibold hover:underline mt-2 inline-block">Back to leads</Link></div>

  const stageDef = LEAD_STAGES.find(s => s.value === lead.stage)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/dashboard/crm" className="inline-flex items-center gap-1.5 text-sm text-medium-gray hover:text-gold transition-colors mb-4"><ArrowLeft className="h-4 w-4" /> Back to Leads</Link>

        {!editing ? (
          <div className="rounded-2xl border border-border-gray bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-xl font-extrabold text-gold shrink-0">{lead.name.charAt(0)}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-xl font-extrabold text-deep-navy">{lead.name}</h1>
                    <span className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${stageDef?.color || ''}`}>{stageDef?.label || lead.stage}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-medium-gray mt-1">
                    {lead.company && <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{lead.company}</span>}
                    {lead.email && <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{lead.email}</span>}
                    {lead.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{lead.phone}</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-medium-gray">
                    <span className="rounded-full bg-gold/10 text-gold-dark px-2.5 py-0.5 font-semibold">{LEAD_SOURCES.find(s => s.value === lead.source)?.label || lead.source}</span>
                    {lead.value > 0 && <span className="flex items-center gap-1 font-bold text-gold"><DollarSign className="h-3.5 w-3.5" />{lead.currency} {lead.value.toLocaleString()}</span>}
                  </div>
                  {lead.notes && <p className="text-sm text-medium-gray mt-3">{lead.notes}</p>}
                </div>
              </div>
              <button onClick={startEdit} className="p-2 text-medium-gray hover:text-gold hover:bg-light-gray rounded-lg transition-colors"><Edit3 className="h-4 w-4" /></button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border-gray bg-white p-6 space-y-4">
            <h2 className="text-lg font-bold text-deep-navy">Edit Lead</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Name</label><input value={editName} onChange={e => setEditName(e.target.value)} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Email</label><input value={editEmail} onChange={e => setEditEmail(e.target.value)} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Company</label><input value={editCompany} onChange={e => setEditCompany(e.target.value)} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>
              <div className="sm:col-span-2"><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Notes</label><textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={2} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={updateLead.isPending} className="rounded-xl bg-deep-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-deep-navy-light transition-all disabled:opacity-60">{updateLead.isPending ? <Loader2 className="h-4 w-4 animate-spin inline" /> : 'Save'}</button>
              <button onClick={() => setEditing(false)} className="rounded-xl bg-light-gray px-5 py-2.5 text-sm font-bold text-medium-gray hover:bg-border-gray transition-all">Cancel</button>
            </div>
          </div>
        )}
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-6">
        <div className="sm:col-span-2 space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border-gray bg-white p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-gold" /><h2 className="text-sm font-bold text-deep-navy">Activity</h2></div>
              <button onClick={() => setShowActivity(true)} className="flex items-center gap-1 text-xs font-bold text-gold hover:underline"><Plus className="h-3 w-3" /> Log</button>
            </div>
            <div className="space-y-3">
              {activities?.map(a => (
                <div key={a.id} className="rounded-xl bg-light-gray/50 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-medium-gray">{a.type}</span>
                    <span className="text-[10px] text-medium-gray">{new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs font-bold text-deep-navy">{a.subject}</p>
                  <p className="text-xs text-medium-gray mt-0.5">{a.description}</p>
                </div>
              ))}
              {(!activities || activities.length === 0) && <p className="text-xs text-medium-gray text-center py-4">No activity logged yet.</p>}
            </div>
          </motion.div>
        </div>

        <div className="space-y-4">
          {lead.tags.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="rounded-2xl border border-border-gray bg-white p-5"
            >
              <div className="flex items-center gap-2 mb-3"><Tag className="h-5 w-5 text-gold" /><h2 className="text-sm font-bold text-deep-navy">Tags</h2></div>
              <div className="flex flex-wrap gap-1.5">
                {lead.tags.map(t => <span key={t} className="rounded-full bg-gold/5 text-gold-dark px-2.5 py-1 text-xs font-semibold">{t}</span>)}
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <button onClick={() => deleteLead.mutateAsync(id).then(() => { window.location.href = '/dashboard/crm' })}
              className="w-full rounded-xl border border-error/20 text-error px-5 py-2.5 text-sm font-bold hover:bg-error/5 transition-all"
            ><Trash2 className="h-4 w-4 inline mr-1.5" /> Delete Lead</button>
          </motion.div>
        </div>
      </div>

      {showActivity && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-deep-navy/40 backdrop-blur-sm p-4"
          onClick={() => setShowActivity(false)}
        >
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 space-y-4" onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold text-deep-navy">Log Activity</h2><button onClick={() => setShowActivity(false)} className="p-1 text-medium-gray hover:text-error"><X className="h-5 w-5" /></button></div>
            <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Type</label><select value={actType} onChange={e => setActType(e.target.value)} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all">
              <option value="note">Note</option><option value="email">Email</option><option value="call">Call</option><option value="meeting">Meeting</option><option value="proposal">Proposal</option>
            </select></div>
            <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Subject</label><input value={actSubject} onChange={e => setActSubject(e.target.value)} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>
            <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Description</label><textarea value={actDesc} onChange={e => setActDesc(e.target.value)} rows={3} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>
            <button onClick={handleAddActivity} disabled={addActivity.isPending || !actSubject}
              className="w-full rounded-xl bg-deep-navy py-3 text-sm font-bold text-white hover:bg-deep-navy-light transition-all disabled:opacity-60"
            >{addActivity.isPending ? <Loader2 className="h-4 w-4 animate-spin inline" /> : 'Log Activity'}</button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
