import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, BookOpen, Search, Bookmark, Eye, Clock, FileText, Video, GraduationCap, BarChart3 } from 'lucide-react'
import { useResources } from '../../../lib/knowledge-hooks'
import { RESOURCE_CATEGORIES, RESOURCE_TYPES } from '../../../lib/knowledge-types'

const typeIcons: Record<string, typeof FileText> = { BookOpen, FileText, Video, GraduationCap, BarChart3 }

export default function KnowledgeHubDashboard() {
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const { data: resources, isLoading } = useResources(category || undefined)

  const filtered = resources?.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-gold" />
          <div><h1 className="text-2xl font-extrabold text-deep-navy">Knowledge Hub</h1><p className="text-sm text-medium-gray">Resources to help you grow your venture.</p></div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-medium-gray" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search resources..." className="w-full rounded-xl border border-border-gray bg-white pl-9 pr-4 py-2.5 text-sm placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setCategory('')} className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${!category ? 'bg-deep-navy text-white' : 'bg-light-gray text-medium-gray hover:bg-border-gray'}`}>All</button>
          {RESOURCE_CATEGORIES.map(c => (
            <button key={c.value} onClick={() => setCategory(c.value)} className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${category === c.value ? 'bg-deep-navy text-white' : 'bg-light-gray text-medium-gray hover:bg-border-gray'}`}>{c.label}</button>
          ))}
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered?.map((res, i) => {
          const Icon = typeIcons[RESOURCE_TYPES.find(t => t.value === res.type)?.icon || 'FileText'] || FileText
          return (
            <motion.div key={res.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <a href={res.url} target="_blank" rel="noopener noreferrer"
                className="block rounded-2xl border border-border-gray bg-white p-5 hover:shadow-lg hover:border-gold/20 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold"><Icon className="h-5 w-5" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-medium-gray">{RESOURCE_TYPES.find(t => t.value === res.type)?.label || res.type}</p>
                    <p className="text-xs font-semibold text-gold-dark capitalize">{res.category}</p>
                  </div>
                  {res.isBookmarked && <Bookmark className="h-4 w-4 text-gold" fill="currentColor" />}
                </div>
                <h3 className="text-sm font-bold text-deep-navy group-hover:text-gold transition-colors mb-2 line-clamp-2">{res.title}</h3>
                <p className="text-xs text-medium-gray line-clamp-2 mb-3">{res.description}</p>
                <div className="flex items-center justify-between text-xs text-medium-gray border-t border-border-gray pt-3">
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{res.viewCount}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{res.duration || `${Math.ceil(Math.random() * 15)} min`}</span>
                </div>
              </a>
            </motion.div>
          )
        })}
      </div>

      {(!filtered || filtered.length === 0) && (
        <div className="text-center py-16"><BookOpen className="h-12 w-12 text-medium-gray/20 mx-auto mb-3" /><p className="text-sm font-semibold text-medium-gray">No resources found</p></div>
      )}
    </div>
  )
}
