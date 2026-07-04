import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Calendar, Clock, Users, Search, Monitor, Building2 } from 'lucide-react'
import { Link } from 'wouter'
import { useEvents } from '../../../lib/event-hooks'
import { EVENT_TYPES, EVENT_STATUSES } from '../../../lib/event-types'

export default function EventsList() {
  const { data: events, isLoading } = useEvents()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const filtered = events?.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) &&
    (!typeFilter || e.type === typeFilter)
  )

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-gold" />
          <div><h1 className="text-2xl font-extrabold text-deep-navy">Events</h1><p className="text-sm text-medium-gray">Discover and register for events.</p></div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-medium-gray" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..." className="w-full rounded-xl border border-border-gray bg-white pl-9 pr-4 py-2.5 text-sm placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setTypeFilter('')} className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${!typeFilter ? 'bg-deep-navy text-white' : 'bg-light-gray text-medium-gray hover:bg-border-gray'}`}>All</button>
          {EVENT_TYPES.map(t => (
            <button key={t.value} onClick={() => setTypeFilter(t.value)} className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${typeFilter === t.value ? 'bg-deep-navy text-white' : 'bg-light-gray text-medium-gray hover:bg-border-gray'}`}>{t.label}</button>
          ))}
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered?.map((event, i) => {
          const statusDef = EVENT_STATUSES.find(s => s.value === event.status)
          return (
            <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Link href={`/dashboard/events/${event.id}`}
                className="block rounded-2xl border border-border-gray bg-white p-5 hover:shadow-lg hover:border-gold/20 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="rounded-full bg-gold/10 text-gold-dark px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                    {EVENT_TYPES.find(t => t.value === event.type)?.label || event.type}
                  </span>
                  <span className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusDef?.color || ''}`}>
                    {statusDef?.label || event.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-deep-navy group-hover:text-gold transition-colors mb-2 line-clamp-2">{event.title}</h3>
                <p className="text-xs text-medium-gray line-clamp-2 mb-4">{event.description}</p>
                <div className="space-y-1.5 text-xs text-medium-gray">
                  <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{new Date(event.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  <div className="flex items-center gap-1.5">{event.mode === 'online' ? <Monitor className="h-3.5 w-3.5" /> : <Building2 className="h-3.5 w-3.5" />}{event.mode === 'online' ? 'Online' : event.location || 'Offline'}</div>
                  <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{event.registeredCount}/{event.capacity}</div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {(!filtered || filtered.length === 0) && (
        <div className="text-center py-16"><Calendar className="h-12 w-12 text-medium-gray/20 mx-auto mb-3" /><p className="text-sm font-semibold text-medium-gray">No events found</p></div>
      )}
    </div>
  )
}
