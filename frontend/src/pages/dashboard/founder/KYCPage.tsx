import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Upload, ShieldCheck, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { useFounderProfile, useUploadKycDocument } from '../../../lib/founder-hooks'

export default function KYCPage() {
  const { data: founder, isLoading, refetch } = useFounderProfile()
  const uploadKyc = useUploadKycDocument()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !founder) return
    setUploadSuccess(false)
    setUploadError('')
    const formData = new FormData()
    formData.append('kycDocument', file)
    try {
      await uploadKyc.mutateAsync(formData)
      setUploadSuccess(true)
      refetch()
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to upload document.'
      setUploadError(msg)
    }
  }

  const statusConfig = {
    pending: { icon: Clock, text: 'Not Submitted', color: 'text-medium-gray', bg: 'bg-medium-gray/10' },
    submitted: { icon: Clock, text: 'Under Review', color: 'text-warning', bg: 'bg-warning/10' },
    verified: { icon: CheckCircle2, text: 'Verified', color: 'text-success', bg: 'bg-success/10' },
    rejected: { icon: XCircle, text: 'Rejected', color: 'text-error', bg: 'bg-error/10' },
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

        <div className="border-t border-border-gray pt-6">
          <h3 className="text-sm font-bold text-deep-navy mb-4">Submit KYC Document</h3>
          <p className="text-xs text-medium-gray mb-4">Please upload a government-issued ID (PAN Card, Aadhaar, or Passport).</p>

          {uploadSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-success/20 bg-success/10 px-4 py-2.5 text-sm text-success font-medium mb-4"
            >
              KYC document uploaded successfully! Your status is now Under Review.
            </motion.div>
          )}

          {uploadError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-error/20 bg-error/10 px-4 py-2.5 text-sm text-error font-medium mb-4"
            >
              {uploadError}
            </motion.div>
          )}

          <input ref={fileRef} type="file" onChange={handleUpload} className="hidden" accept=".pdf,.png,.jpg,.jpeg" />

          <div className="rounded-2xl border border-dashed border-border-gray bg-light-gray/50 p-8 text-center">
            <Upload className="h-10 w-10 text-medium-gray/30 mx-auto mb-3" />
            <p className="text-sm font-semibold text-medium-gray mb-1">Upload KYC Document</p>
            <p className="text-xs text-medium-gray/60 mb-4">PDF, PNG, JPG — up to 5MB</p>
            <button onClick={() => fileRef.current?.click()} disabled={uploadKyc.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-deep-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-deep-navy-light transition-all disabled:opacity-60 cursor-pointer"
            >
              {uploadKyc.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</> : <><Upload className="h-4 w-4" /> Upload Document</>}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
