import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Upload, ShieldCheck, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { useFounderProfile, useUploadKycDocument, useDocuments, useDeleteDocument } from '../../../lib/founder-hooks'

export default function KYCPage() {
  const { data: founder, isLoading, refetch } = useFounderProfile()
  const { data: documents, refetch: refetchDocs } = useDocuments()
  const uploadKyc = useUploadKycDocument()
  const deleteDoc = useDeleteDocument()
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !founder) return
    const formData = new FormData()
    formData.append('kycDocument', file)
    await uploadKyc.mutateAsync(formData)
    refetch()
    refetchDocs()
  }

  const kycDocs = documents?.filter(d => d.type === 'KYC') || []

  const handleDelete = async (docId: string) => {
    await deleteDoc.mutateAsync(docId)
    refetch()
    refetchDocs()
  }

  const statusConfig = {
    pending: { icon: Clock, text: 'Not Submitted', color: 'text-medium-gray', bg: 'bg-medium-gray/10' },
    submitted: { icon: Clock, text: 'Under Review', color: 'text-warning', bg: 'bg-warning/10' },
    verified: { icon: CheckCircle2, text: 'Verified', color: 'text-success', bg: 'bg-success/10' },
    rejected: { icon: XCircle, text: 'Rejected', color: 'text-error', bg: 'bg-error/10' },
  }

  const handleDownload = async (doc: { fileUrl: string; fileName: string }) => {
    try {
      const token = localStorage.getItem('token')
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
      // fileUrl is relative like /api/documents/:id/download
      // strip the /api prefix since baseUrl already has it
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
      a.download = doc.fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download error:', err)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  }

  const status = statusConfig[founder?.kycStatus || 'pending']
  const StatusIcon = status.icon

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-gold" />
          <div>
            <h1 className="text-2xl font-extrabold text-deep-navy">KYC Verification</h1>
            <p className="text-sm text-medium-gray">Verify your identity to unlock full platform access.</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border-gray bg-white p-6 space-y-6"
      >
        <div className="flex items-center gap-4 p-4 rounded-xl bg-light-gray/50">
          <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${status.bg}`}>
            <StatusIcon className={`h-7 w-7 ${status.color}`} />
          </div>
          <div>
            <p className="text-sm font-bold text-deep-navy">KYC Status</p>
            <p className={`text-sm font-semibold ${status.color}`}>{status.text}</p>
          </div>
        </div>

        <div className="border-t border-border-gray pt-6 space-y-6">
          {kycDocs.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-deep-navy">Submitted KYC Documents</h3>
              {kycDocs.map((doc) => (
                <div key={doc.id} className="rounded-2xl border border-border-gray p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold shrink-0">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-deep-navy truncate max-w-[200px] sm:max-w-md">{doc.fileName}</p>
                      <p className="text-[10px] text-medium-gray mt-0.5">
                        Uploaded on {new Date(doc.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="rounded-xl border border-border-gray px-4 py-2 text-xs font-bold text-deep-navy hover:bg-light-gray transition-all text-center"
                    >
                      Download
                    </button>
                    <button onClick={() => handleDelete(doc.id)} disabled={deleteDoc.isPending}
                      className="rounded-xl bg-error/10 hover:bg-error/20 px-4 py-2 text-xs font-bold text-error transition-all disabled:opacity-60 flex items-center gap-1 justify-center min-w-[70px]"
                    >
                      {deleteDoc.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-deep-navy">Upload KYC Document</h3>
            <p className="text-xs text-medium-gray">Please upload a government-issued ID (PAN Card, Aadhaar, or Passport). You can upload multiple documents if required.</p>

            <input ref={fileRef} type="file" onChange={handleUpload} className="hidden" accept=".pdf,.png,.jpg,.jpeg" />

            <div className="rounded-2xl border border-dashed border-border-gray bg-light-gray/50 p-8 text-center">
              <Upload className="h-10 w-10 text-medium-gray/30 mx-auto mb-3" />
              <p className="text-sm font-semibold text-medium-gray mb-1">Upload KYC Document</p>
              <p className="text-xs text-medium-gray/60 mb-4">PDF, PNG, JPG — up to 5MB</p>
              <button onClick={() => fileRef.current?.click()} disabled={uploadKyc.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-deep-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-deep-navy-light transition-all disabled:opacity-60"
              >
                {uploadKyc.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</> : <><Upload className="h-4 w-4" /> Upload Document</>}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
