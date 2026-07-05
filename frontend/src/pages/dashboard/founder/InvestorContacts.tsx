import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Loader2, Users, Search, Plus, X, Mail, Phone,
  Building2, Tag, ExternalLink,
} from 'lucide-react'
import { useLocation } from 'wouter'
import { useInvestorContacts, useCreateContact } from '../../../lib/investor-crm-hooks'
import { INVESTOR_TYPES } from '../../../lib/investor-crm-types'

export default function InvestorContacts() {
  const [, setLocation] = useLocation()
  const { data: contacts, isLoading, refetch } = useInvestorContacts()
  const createContact = useCreateContact()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [showForm, setShowForm] = useState(false)

  const [name, setName] = useState('')
  const [firm, setFirm] = useState('')
  const [title, setTitle] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [type, setType] = useState('vc')
  const [notes, setNotes] = useState('')

  const filtered = contacts?.filter(c =>
    (c.name.toLowerCase().includes(search.toLowerCase()) ||
     c.firm.toLowerCase().includes(search.toLowerCase()) ||
     c.email?.toLowerCase().includes(search.toLowerCase())) &&
    (!typeFilter || c.type === typeFilter)
  )

  const handleCreate = async () => {
    if (!name || !firm) return
    await createContact.mutateAsync({
      name, firm, title: title || undefined, email: email || undefined,
      phone: phone || undefined, linkedinUrl: linkedinUrl || undefined,
      type: type as any, notes: notes || undefined, tags: [],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    } as any)
    setShowForm(false)
    setName(''); setFirm(''); setTitle(''); setEmail(''); setPhone(''); setLinkedinUrl(''); setType('vc'); setNotes('')
    refetch()
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-gold" />
          <div>
            <h1 className="text-2xl font-extrabold text-deep-navy">Investor CRM</h1>
            <p className="text-sm text-medium-gray">Manage investor contacts and relationships.</p>
          </div>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-light px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-gold/20 hover:shadow-xl transition-all"
        ><Plus className="h-4 w-4" /> Add Contact</button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-medium-gray" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, firm, or email..."
            className="w-full rounded-xl border border-border-gray bg-white pl-9 pr-4 py-2.5 text-sm placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[{ value: '', label: 'All' }, ...INVESTOR_TYPES].map(t => (
            <button key={t.value} onClick={() => setTypeFilter(t.value)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                typeFilter === t.value ? 'bg-deep-navy text-white' : 'bg-light-gray text-medium-gray hover:bg-border-gray'
              }`}
            >{t.label}</button>
          ))}
        </div>
      </motion.div>

      <div className="space-y-3">
        {filtered?.map((contact, i) => (
          <motion.div key={contact.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <div onClick={() => setLocation(`/dashboard/founder/investor-crm/${contact.id}`)}
              className="cursor-pointer flex items-start gap-4 rounded-2xl border border-border-gray bg-white p-5 hover:shadow-lg hover:border-gold/20 transition-all group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-lg font-extrabold text-gold shrink-0">
                {contact.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-deep-navy group-hover:text-gold transition-colors">{contact.name}</p>
                  <span className="rounded-full bg-light-gray text-medium-gray px-2.5 py-0.5 text-[10px] font-semibold">
                    {INVESTOR_TYPES.find(t => t.value === contact.type)?.label || contact.type}
                  </span>
                </div>
                <p className="text-xs text-medium-gray flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" /> {contact.firm}
                  {contact.title && <>&middot; {contact.title}</>}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-medium-gray">
                  {contact.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{contact.email}</span>}
                  {contact.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{contact.phone}</span>}
                </div>
                {contact.tags && contact.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {contact.tags.map(t => (
                      <span key={t} className="flex items-center gap-0.5 rounded-full bg-gold/5 text-gold-dark px-2 py-0.5 text-[10px] font-semibold">
                        <Tag className="h-2.5 w-2.5" />{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {contact.linkedinUrl && (
                <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer"
                  className="shrink-0 p-2 text-medium-gray hover:text-gold transition-colors"
                  onClick={e => e.stopPropagation()}
                ><ExternalLink className="h-4 w-4" /></a>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {(!filtered || filtered.length === 0) && (
        <div className="text-center py-16">
          <Users className="h-12 w-12 text-medium-gray/20 mx-auto mb-3" />
          <p className="text-sm font-semibold text-medium-gray">No contacts found</p>
          <p className="text-xs text-medium-gray/60 mt-1">Add your first investor contact.</p>
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
              <h2 className="text-lg font-extrabold text-deep-navy">Add Investor Contact</h2>
              <button onClick={() => setShowForm(false)} className="p-1 text-medium-gray hover:text-error"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Name *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name"
                  className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Firm *</label>
                <input value={firm} onChange={e => setFirm(e.target.value)} placeholder="Firm name"
                  className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Partner, Analyst..."
                  className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="email@example.com"
                  className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Phone</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234 567 8900"
                  className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">LinkedIn URL</label>
                <input value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..."
                  className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Type</label>
                <select value={type} onChange={e => setType(e.target.value)}
                  className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
                >
                  {INVESTOR_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                  className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
                  placeholder="Background, interests, notes..."
                />
              </div>
            </div>
            <button onClick={handleCreate} disabled={createContact.isPending || !name || !firm}
              className="w-full rounded-xl bg-gradient-to-r from-gold to-gold-light py-3 text-sm font-bold text-white shadow-lg shadow-gold/20 hover:shadow-xl transition-all disabled:opacity-60"
            >
              {createContact.isPending ? <><Loader2 className="h-4 w-4 animate-spin inline" /> Creating...</> : 'Add Contact'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
