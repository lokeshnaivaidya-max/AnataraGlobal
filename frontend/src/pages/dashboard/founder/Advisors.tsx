import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Search, Users, Star, Clock, ChevronRight } from 'lucide-react'
import { Link } from 'wouter'
import { useAdvisors } from '../../../lib/advisory-hooks'

export default function Advisors() {
  const { data: advisors, isLoading } = useAdvisors()
  const [search, setSearch] = useState('')

  const filtered = advisors?.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.expertise.some(e => e.toLowerCase().includes(search.toLowerCase()))
  )

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-gold" />
          <div>
            <h1 className="text-2xl font-extrabold text-deep-navy">Advisors</h1>
            <p className="text-sm text-medium-gray">Connect with experienced mentors and advisors.</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-medium-gray" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search advisors by name or expertise..."
          className="w-full rounded-xl border border-border-gray bg-white pl-11 pr-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
        />
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered?.map((advisor, i) => (
          <motion.div key={advisor.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
            <Link href={`/dashboard/founder/advisors/${advisor.id}`}
              className="block rounded-2xl border border-border-gray bg-white p-6 hover:shadow-lg hover:border-gold/20 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold/10 text-lg font-extrabold text-gold shrink-0">
                  {advisor.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-deep-navy truncate group-hover:text-gold transition-colors">
                    {advisor.name}
                  </p>
                  <p className="text-xs text-medium-gray truncate">{advisor.title}</p>
                </div>
              </div>

              <p className="text-xs text-medium-gray line-clamp-2 mb-4">{advisor.bio}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {advisor.expertise.slice(0, 3).map(e => (
                  <span key={e} className="rounded-full bg-gold/10 text-gold-dark px-2.5 py-0.5 text-[10px] font-semibold">
                    {e}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-medium-gray border-t border-border-gray pt-4">
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-gold" fill="currentColor" />
                  <span className="font-semibold">{advisor.rating}</span>
                  <span>({advisor.sessionCount})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{advisor.experience}yrs</span>
                </div>
                <ChevronRight className="h-4 w-4 text-medium-gray/40 group-hover:text-gold transition-colors" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered?.length === 0 && (
        <div className="text-center py-20">
          <Users className="h-12 w-12 text-medium-gray/20 mx-auto mb-3" />
          <p className="text-sm font-semibold text-medium-gray">No advisors found</p>
          <p className="text-xs text-medium-gray/60 mt-1">Try adjusting your search.</p>
        </div>
      )}
    </div>
  )
}
