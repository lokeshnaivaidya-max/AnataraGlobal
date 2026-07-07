import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Building2, Search, DollarSign, Percent, Clock, ExternalLink } from 'lucide-react'
import { useCapitalProviders } from '../../../lib/capital-hooks'
import { CAPITAL_PROVIDER_TYPES } from '../../../lib/capital-types'

export default function CapitalProviders() {
  const { data: providers, isLoading } = useCapitalProviders()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const filtered = providers?.filter(p => {
    const nameToUse = p.name || 'Capital Provider';
    return nameToUse.toLowerCase().includes(search.toLowerCase()) &&
      (!typeFilter || p.type === typeFilter);
  })

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6 text-gold" />
          <div><h1 className="text-2xl font-extrabold text-deep-navy">Capital Connectivity</h1><p className="text-sm text-medium-gray">Explore capital providers and funding options.</p></div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-medium-gray" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search providers..." className="w-full rounded-xl border border-border-gray bg-white pl-9 pr-4 py-2.5 text-sm placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setTypeFilter('')} className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${!typeFilter ? 'bg-deep-navy text-white' : 'bg-light-gray text-medium-gray hover:bg-border-gray'}`}>All</button>
          {CAPITAL_PROVIDER_TYPES.map(t => (
            <button key={t.value} onClick={() => setTypeFilter(t.value)} className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${typeFilter === t.value ? 'bg-deep-navy text-white' : 'bg-light-gray text-medium-gray hover:bg-border-gray'}`}>{t.label}</button>
          ))}
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered?.map((provider, i) => (
          <motion.div key={provider.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="rounded-2xl border border-border-gray bg-white p-5 hover:shadow-lg hover:border-gold/20 transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-lg font-extrabold text-gold shrink-0">{(provider.name || 'C').charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-deep-navy truncate">{provider.name}</p>
                <span className="rounded-full bg-light-gray text-medium-gray px-2.5 py-0.5 text-[10px] font-semibold">{CAPITAL_PROVIDER_TYPES.find(t => t.value === provider.type)?.label || provider.type || 'VC Fund'}</span>
              </div>
            </div>
            <p className="text-xs text-medium-gray line-clamp-2 mb-3">{provider.description}</p>
            <div className="flex items-center gap-3 text-xs text-medium-gray mb-3">
              <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5 text-gold" />{provider.currency || 'USD'} {((provider.minAmount || 0) / 1000).toFixed(0)}K - {((provider.maxAmount || 0) / 1000).toFixed(0)}K</span>
              {provider.interestRate && <span className="flex items-center gap-1"><Percent className="h-3.5 w-3.5 text-gold" />{provider.interestRate}%</span>}
              {provider.tenure && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{provider.tenure}</span>}
            </div>
            <div className="flex flex-wrap gap-1">
              {(provider.products || []).slice(0, 3).map(p => (
                <span key={p} className="rounded-full bg-gold/5 text-gold-dark px-2 py-0.5 text-[10px] font-semibold">{p}</span>
              ))}
            </div>
            {provider.website && (
              <a href={provider.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 mt-3 pt-3 border-t border-border-gray text-xs text-gold hover:underline"
              ><ExternalLink className="h-3.5 w-3.5" /> Visit website</a>
            )}
          </motion.div>
        ))}
      </div>

      {(!filtered || filtered.length === 0) && (
        <div className="text-center py-16"><Building2 className="h-12 w-12 text-medium-gray/20 mx-auto mb-3" /><p className="text-sm font-semibold text-medium-gray">No providers found</p></div>
      )}
    </div>
  )
}
