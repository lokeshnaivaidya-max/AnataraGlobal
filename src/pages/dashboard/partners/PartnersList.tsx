import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Users, Search, Building2, Globe, Mail, ExternalLink } from 'lucide-react'
import { Link } from 'wouter'
import { usePartners } from '../../../lib/partner-hooks'
import { PARTNER_TYPES } from '../../../lib/partner-types'

export default function PartnersList() {
  const { data: partners, isLoading } = usePartners()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const filtered = partners?.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (!typeFilter || p.type === typeFilter)
  )

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-gold" />
          <div><h1 className="text-2xl font-extrabold text-deep-navy">Partner Network</h1><p className="text-sm text-medium-gray">Discover partners and grow your venture.</p></div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-medium-gray" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search partners..." className="w-full rounded-xl border border-border-gray bg-white pl-9 pr-4 py-2.5 text-sm placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setTypeFilter('')} className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${!typeFilter ? 'bg-deep-navy text-white' : 'bg-light-gray text-medium-gray hover:bg-border-gray'}`}>All</button>
          {PARTNER_TYPES.map(t => (
            <button key={t.value} onClick={() => setTypeFilter(t.value)} className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${typeFilter === t.value ? 'bg-deep-navy text-white' : 'bg-light-gray text-medium-gray hover:bg-border-gray'}`}>{t.label}</button>
          ))}
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered?.map((partner, i) => (
          <motion.div key={partner.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Link href={`/dashboard/partners/${partner.id}`}
              className="block rounded-2xl border border-border-gray bg-white p-5 hover:shadow-lg hover:border-gold/20 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-lg font-extrabold text-gold shrink-0">{partner.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-deep-navy group-hover:text-gold transition-colors truncate">{partner.name}</p>
                  <span className="rounded-full bg-light-gray text-medium-gray px-2.5 py-0.5 text-[10px] font-semibold">{PARTNER_TYPES.find(t => t.value === partner.type)?.label || partner.type}</span>
                </div>
              </div>
              <p className="text-xs text-medium-gray line-clamp-2 mb-3">{partner.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {partner.benefits.slice(0, 3).map(b => (
                  <span key={b} className="rounded-full bg-gold/5 text-gold-dark px-2 py-0.5 text-[10px] font-semibold">{b}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-medium-gray border-t border-border-gray pt-3">
                {partner.website && <Globe className="h-3.5 w-3.5" />}
                {partner.contactEmail && <Mail className="h-3.5 w-3.5" />}
                <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${partner.status === 'active' ? 'text-success bg-success/10' : 'text-medium-gray bg-medium-gray/10'}`}>{partner.status}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {(!filtered || filtered.length === 0) && (
        <div className="text-center py-16"><Users className="h-12 w-12 text-medium-gray/20 mx-auto mb-3" /><p className="text-sm font-semibold text-medium-gray">No partners found</p></div>
      )}
    </div>
  )
}
