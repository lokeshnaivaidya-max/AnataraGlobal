import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, ArrowLeft, Globe, Mail, ExternalLink, CheckCircle2, Send, X } from 'lucide-react'
import { Link, useParams } from 'wouter'
import { usePartner, useRequestPartnership } from '../../../lib/partner-hooks'
import { PARTNER_TYPES } from '../../../lib/partner-types'

export default function PartnerDetail() {
  const params = useParams()
  const id = params?.id || ''
  const { data: partner, isLoading } = usePartner(id)
  const request = useRequestPartnership()
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [sent, setSent] = useState(false)

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  if (!partner) return <div className="text-center py-20"><p className="text-sm font-semibold text-medium-gray">Partner not found.</p><Link href="/dashboard/partners" className="text-gold text-sm font-semibold hover:underline mt-2 inline-block">Back to partners</Link></div>

  const handleRequest = async () => {
    await request.mutateAsync({ partnerId: id, message: message || undefined })
    setSent(true)
    setShowForm(false)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/dashboard/partners" className="inline-flex items-center gap-1.5 text-sm text-medium-gray hover:text-gold transition-colors mb-4"><ArrowLeft className="h-4 w-4" /> Back to Partners</Link>
        <div className="rounded-2xl border border-border-gray bg-white p-6 sm:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10 text-2xl font-extrabold text-gold shrink-0">{partner.name.charAt(0)}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-extrabold text-deep-navy">{partner.name}</h1>
                <span className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${partner.status === 'active' ? 'text-success bg-success/10' : 'text-medium-gray bg-medium-gray/10'}`}>{partner.status}</span>
              </div>
              <span className="inline-block rounded-full bg-gold/10 text-gold-dark px-3 py-1 text-xs font-semibold">{PARTNER_TYPES.find(t => t.value === partner.type)?.label || partner.type}</span>
              <div className="flex items-center gap-3 mt-2 text-xs text-medium-gray">
                {partner.website && <a href={partner.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gold hover:underline"><Globe className="h-3.5 w-3.5" /> Website <ExternalLink className="h-3 w-3" /></a>}
                {partner.contactEmail && <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{partner.contactEmail}</span>}
              </div>
            </div>
          </div>
          <p className="text-sm text-medium-gray leading-relaxed mb-6">{partner.description}</p>
          <h3 className="text-sm font-bold text-deep-navy mb-3">Benefits</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {partner.benefits.map(b => (
              <span key={b} className="flex items-center gap-1.5 rounded-xl bg-success/5 text-success-dark px-4 py-2 text-xs font-semibold"><CheckCircle2 className="h-3.5 w-3.5" />{b}</span>
            ))}
          </div>
          {partner.eligibility && (
            <>
              <h3 className="text-sm font-bold text-deep-navy mb-3">Eligibility</h3>
              <p className="text-sm text-medium-gray">{partner.eligibility}</p>
            </>
          )}
        </div>
      </motion.div>

      {partner.status === 'active' && !sent && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {!showForm ? (
            <button onClick={() => setShowForm(true)} className="w-full rounded-xl bg-gradient-to-r from-gold to-gold-light py-3.5 text-sm font-bold text-white shadow-lg shadow-gold/20 hover:shadow-xl transition-all">
              <Send className="h-4 w-4 inline mr-2" />Request Partnership
            </button>
          ) : (
            <div className="rounded-2xl border border-border-gray bg-white p-6 space-y-4">
              <div className="flex items-center justify-between"><h3 className="text-lg font-bold text-deep-navy">Request Partnership</h3><button onClick={() => setShowForm(false)} className="p-1 text-medium-gray hover:text-error"><X className="h-5 w-5" /></button></div>
              <p className="text-sm text-medium-gray">Send a request to partner with <span className="font-bold text-deep-navy">{partner.name}</span></p>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Message (optional)</label><textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" placeholder="Tell them about your venture and why you'd like to partner..." /></div>
              <button onClick={handleRequest} disabled={request.isPending} className="w-full rounded-xl bg-deep-navy py-3 text-sm font-bold text-white hover:bg-deep-navy-light transition-all disabled:opacity-60">
                {request.isPending ? <Loader2 className="h-4 w-4 animate-spin inline" /> : 'Send Request'}
              </button>
            </div>
          )}
        </motion.div>
      )}

      {sent && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-success/20 bg-success/5 p-6 text-center"
        >
          <CheckCircle2 className="h-10 w-10 text-success mx-auto mb-2" />
          <p className="text-sm font-bold text-deep-navy">Request Sent!</p>
          <p className="text-xs text-medium-gray mt-1">The partner will review and respond to your request.</p>
        </motion.div>
      )}
    </div>
  )
}
