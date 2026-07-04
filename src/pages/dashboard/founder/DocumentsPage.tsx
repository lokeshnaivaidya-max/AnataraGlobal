import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Upload, FileText, Trash2, AlertCircle } from 'lucide-react'
import { useDocuments, useUploadDocument, useDeleteDocument } from '../../../lib/founder-hooks'

export default function DocumentsPage() {
  const { data: documents, isLoading, refetch } = useDocuments()
  const uploadDoc = useUploadDocument()
  const deleteDoc = useDeleteDocument()
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    await uploadDoc.mutateAsync(formData)
    refetch()
    if (fileRef.current) fileRef.current.value = ''
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-gold" />
          <div>
            <h1 className="text-2xl font-extrabold text-deep-navy">Documents</h1>
            <p className="text-sm text-medium-gray">Upload and manage your documents.</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl border border-dashed border-border-gray bg-light-gray/50 p-8 text-center"
      >
        <input ref={fileRef} type="file" onChange={handleUpload} className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" />
        <Upload className="h-10 w-10 text-medium-gray/30 mx-auto mb-3" />
        <p className="text-sm font-semibold text-medium-gray mb-1">Drop files here or click to upload</p>
        <p className="text-xs text-medium-gray/60 mb-4">PDF, DOC, XLS, PNG, JPG — up to 10MB</p>
        <button onClick={() => fileRef.current?.click()} disabled={uploadDoc.isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-deep-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-deep-navy-light transition-all disabled:opacity-60"
        >
          {uploadDoc.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</> : <><Upload className="h-4 w-4" /> Choose File</>}
        </button>
      </motion.div>

      <div className="space-y-3">
        {documents?.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-medium-gray/20 mx-auto mb-3" />
            <p className="text-sm text-medium-gray">No documents uploaded yet.</p>
          </div>
        )}
        {documents?.map((doc, i) => (
          <motion.div key={doc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 rounded-2xl border border-border-gray bg-white p-5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold shrink-0">
              <FileText className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-deep-navy truncate">{doc.fileName}</p>
              <p className="text-xs text-medium-gray">
                {doc.type || 'Uncategorized'} · {(doc.fileSize / 1024).toFixed(1)} KB
              </p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              doc.status === 'approved' ? 'bg-success/10 text-success' :
              doc.status === 'rejected' ? 'bg-error/10 text-error' :
              'bg-warning/10 text-warning'
            }`}>
              {doc.status}
            </span>
            <button onClick={() => deleteDoc.mutateAsync(doc.id).then(() => refetch())}
              className="p-2 text-error/60 hover:text-error transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
