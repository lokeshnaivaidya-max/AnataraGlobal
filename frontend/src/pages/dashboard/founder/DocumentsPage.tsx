import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Loader2, Upload, FileText, Trash2, Search, X, Download, Share2, Edit3,
  BarChart3, ShieldCheck, Package, Users, TrendingUp, Folder,
  LayoutGrid, List,
} from 'lucide-react'
import {
  useDocuments,
  useUploadDocument,
  useDeleteDocument,
  useUpdateDocument,
  useShareDocument,
} from '../../../lib/document-hooks'
import {
  DOCUMENT_CATEGORIES,
  DOCUMENT_STATUS_LABELS,
  DOCUMENT_STATUS_COLORS,
} from '../../../lib/document-types'
import type { Document } from '../../../lib/document-types'

const iconMap: Record<string, typeof FileText> = {
  FileText, BarChart3, ShieldCheck, Package, Users, TrendingUp, Folder,
}

function DocumentIcon({ categoryId }: { categoryId: string }) {
  const cat = DOCUMENT_CATEGORIES.find(c => c.id === categoryId)
  const Icon = iconMap[cat?.icon || 'Folder'] || FileText
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold shrink-0">
      <Icon className="h-6 w-6" />
    </div>
  )
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function DocumentsPage() {
  const [categoryFilter, setCategoryFilter] = useState('')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [showUpload, setShowUpload] = useState(false)

  const [editDoc, setEditDoc] = useState<Document | null>(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')

  const [shareDoc, setShareDoc] = useState<Document | null>(null)
  const [shareEmail, setShareEmail] = useState('')

  const { data: documents, isLoading } = useDocuments(categoryFilter || undefined)
  const uploadDoc = useUploadDocument()
  const deleteDoc = useDeleteDocument()
  const updateDoc = useUpdateDocument()
  const shareDocMutation = useShareDocument()

  const fileRef = useRef<HTMLInputElement>(null)
  const [uploadName, setUploadName] = useState('')
  const [uploadCategory, setUploadCategory] = useState(DOCUMENT_CATEGORIES[0].id)
  const [uploadDesc, setUploadDesc] = useState('')

  const handleDownload = async (doc: Document) => {
    try {
      const token = localStorage.getItem('token')
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
      const relativePath = doc.fileUrl.replace(/^\/api/, '')
      const fullUrl = `${baseUrl}${relativePath}`
      const response = await fetch(fullUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!response.ok) throw new Error('Download failed')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = doc.name
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download error:', err)
    }
  }

  const filtered = documents?.filter(d =>
    (d.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (d.description ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (d.tags ?? []).some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', uploadName || file.name)
    formData.append('categoryId', uploadCategory)
    if (uploadDesc) formData.append('description', uploadDesc)
    await uploadDoc.mutateAsync(formData)
    setShowUpload(false)
    setUploadName('')
    setUploadCategory(DOCUMENT_CATEGORIES[0].id)
    setUploadDesc('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleEdit = async () => {
    if (!editDoc) return
    await updateDoc.mutateAsync({ id: editDoc.id, data: { name: editName, description: editDesc } })
    setEditDoc(null)
  }

  const handleShare = async () => {
    if (!shareDoc || !shareEmail) return
    await shareDocMutation.mutateAsync({ id: shareDoc.id, email: shareEmail })
    setShareDoc(null)
    setShareEmail('')
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-gold" />
          <div>
            <h1 className="text-2xl font-extrabold text-deep-navy">Documents</h1>
            <p className="text-sm text-medium-gray">Manage, organize, and share your documents.</p>
          </div>
        </div>
        <button onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-light px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-gold/20 hover:shadow-xl transition-all"
        >
          <Upload className="h-4 w-4" /> Upload
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
      >
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setCategoryFilter('')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              !categoryFilter ? 'bg-deep-navy text-white' : 'bg-light-gray text-medium-gray hover:bg-border-gray'
            }`}
          >All</button>
          {DOCUMENT_CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setCategoryFilter(cat.id)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                categoryFilter === cat.id ? 'bg-deep-navy text-white' : 'bg-light-gray text-medium-gray hover:bg-border-gray'
              }`}
            >{cat.name}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-medium-gray" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search documents..."
              className="w-full sm:w-56 rounded-xl border border-border-gray bg-white pl-9 pr-4 py-2 text-sm placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
            />
          </div>
          <div className="flex rounded-xl border border-border-gray overflow-hidden">
            <button onClick={() => setView('grid')}
              className={`p-2 ${view === 'grid' ? 'bg-deep-navy text-white' : 'text-medium-gray hover:bg-light-gray'}`}
            ><LayoutGrid className="h-4 w-4" /></button>
            <button onClick={() => setView('list')}
              className={`p-2 ${view === 'list' ? 'bg-deep-navy text-white' : 'text-medium-gray hover:bg-light-gray'}`}
            ><List className="h-4 w-4" /></button>
          </div>
        </div>
      </motion.div>

      {view === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered?.map((doc, i) => (
            <motion.div key={doc.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="rounded-2xl border border-border-gray bg-white p-5 hover:shadow-lg hover:border-gold/20 transition-all group"
            >
              <div className="flex items-start gap-3 mb-3">
                <DocumentIcon categoryId={doc.categoryId} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-deep-navy truncate group-hover:text-gold transition-colors">{doc.name}</p>
                  {doc.description && <p className="text-xs text-medium-gray truncate mt-0.5">{doc.description}</p>}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {doc.tags?.slice(0, 3).map(t => (
                  <span key={t} className="rounded-full bg-light-gray text-medium-gray px-2 py-0.5 text-[10px] font-semibold">{t}</span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-medium-gray border-t border-border-gray pt-3">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${DOCUMENT_STATUS_COLORS[doc.status]}`}>
                    {DOCUMENT_STATUS_LABELS[doc.status]}
                  </span>
                  <span>v{doc.currentVersion}</span>
                </div>
                <span>{formatSize(doc.fileSize)}</span>
              </div>

              <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border-gray">
                <button onClick={() => handleDownload(doc)}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-medium-gray hover:bg-light-gray hover:text-deep-navy transition-colors"
                ><Download className="h-3.5 w-3.5" /> Download</button>
                <button onClick={() => { setShareDoc(doc); setShareEmail('') }}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-medium-gray hover:bg-light-gray hover:text-deep-navy transition-colors"
                ><Share2 className="h-3.5 w-3.5" /> Share</button>
                <button onClick={() => { setEditDoc(doc); setEditName(doc.name); setEditDesc(doc.description || '') }}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-medium-gray hover:bg-light-gray hover:text-deep-navy transition-colors"
                ><Edit3 className="h-3.5 w-3.5" /> Edit</button>
                <button onClick={() => deleteDoc.mutateAsync(doc.id)}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-error/60 hover:bg-error/5 hover:text-error transition-colors ml-auto"
                ><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered?.map((doc, i) => (
            <motion.div key={doc.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              className="flex items-center gap-4 rounded-xl border border-border-gray bg-white p-4 hover:bg-light-gray/50 transition-colors"
            >
              <DocumentIcon categoryId={doc.categoryId} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-deep-navy truncate">{doc.name}</p>
                <p className="text-xs text-medium-gray">
                  {DOCUMENT_CATEGORIES.find(c => c.id === doc.categoryId)?.name || 'Other'} &middot; v{doc.currentVersion} &middot; {formatSize(doc.fileSize)}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${DOCUMENT_STATUS_COLORS[doc.status]}`}>
                {DOCUMENT_STATUS_LABELS[doc.status]}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => handleDownload(doc)} className="p-2 text-medium-gray hover:text-deep-navy hover:bg-light-gray rounded-lg transition-colors"><Download className="h-4 w-4" /></button>
                <button onClick={() => { setShareDoc(doc); setShareEmail('') }} className="p-2 text-medium-gray hover:text-deep-navy hover:bg-light-gray rounded-lg transition-colors"><Share2 className="h-4 w-4" /></button>
                <button onClick={() => deleteDoc.mutateAsync(doc.id)} className="p-2 text-error/60 hover:text-error hover:bg-error/5 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {(!filtered || filtered.length === 0) && (
        <div className="text-center py-20">
          <FileText className="h-12 w-12 text-medium-gray/20 mx-auto mb-3" />
          <p className="text-sm font-semibold text-medium-gray">
            {categoryFilter ? `No documents in this category` : search ? 'No documents match your search' : 'No documents yet'}
          </p>
          <p className="text-xs text-medium-gray/60 mt-1">Upload your first document to get started.</p>
          {!search && !categoryFilter && (
            <button onClick={() => setShowUpload(true)}
              className="inline-flex items-center gap-2 mt-4 rounded-xl bg-deep-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-deep-navy-light transition-all"
            ><Upload className="h-4 w-4" /> Upload Document</button>
          )}
        </div>
      )}

      <AnimatePresence>
        {showUpload && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-deep-navy/40 backdrop-blur-sm p-4"
            onClick={() => setShowUpload(false)}
          >
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl bg-white p-6 space-y-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-deep-navy">Upload Document</h2>
                <button onClick={() => setShowUpload(false)} className="p-1 text-medium-gray hover:text-error transition-colors"><X className="h-5 w-5" /></button>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">File</label>
                <input ref={fileRef} type="file" onChange={handleUpload}
                  className="w-full text-sm text-medium-gray file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gold/10 file:text-gold hover:file:bg-gold/20 transition-all"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.txt"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Name</label>
                <input value={uploadName} onChange={e => setUploadName(e.target.value)}
                  placeholder="Leave empty to use filename"
                  className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Category</label>
                <select value={uploadCategory} onChange={e => setUploadCategory(e.target.value)}
                  className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
                >
                  {DOCUMENT_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Description</label>
                <textarea value={uploadDesc} onChange={e => setUploadDesc(e.target.value)} rows={2}
                  className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
                  placeholder="Optional description..."
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editDoc && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-deep-navy/40 backdrop-blur-sm p-4"
            onClick={() => setEditDoc(null)}
          >
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 space-y-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-deep-navy">Edit Document</h2>
                <button onClick={() => setEditDoc(null)} className="p-1 text-medium-gray hover:text-error transition-colors"><X className="h-5 w-5" /></button>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Name</label>
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Description</label>
                <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={2}
                  className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
              </div>
              <button onClick={handleEdit} disabled={updateDoc.isPending || !editName}
                className="w-full rounded-xl bg-deep-navy py-3 text-sm font-bold text-white hover:bg-deep-navy-light transition-all disabled:opacity-60"
              >
                {updateDoc.isPending ? <><Loader2 className="h-4 w-4 animate-spin inline" /> Saving...</> : 'Save Changes'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shareDoc && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-deep-navy/40 backdrop-blur-sm p-4"
            onClick={() => setShareDoc(null)}
          >
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 space-y-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-deep-navy">Share Document</h2>
                <button onClick={() => setShareDoc(null)} className="p-1 text-medium-gray hover:text-error transition-colors"><X className="h-5 w-5" /></button>
              </div>
              <p className="text-sm text-medium-gray">Share <span className="font-bold text-deep-navy">{shareDoc.name}</span> with:</p>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Email Address</label>
                <input value={shareEmail} onChange={e => setShareEmail(e.target.value)} type="email"
                  placeholder="colleague@example.com"
                  className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
              </div>
              <button onClick={handleShare} disabled={shareDocMutation.isPending || !shareEmail}
                className="w-full rounded-xl bg-deep-navy py-3 text-sm font-bold text-white hover:bg-deep-navy-light transition-all disabled:opacity-60"
              >
                {shareDocMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin inline" /> Sending...</> : 'Send Invite'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
