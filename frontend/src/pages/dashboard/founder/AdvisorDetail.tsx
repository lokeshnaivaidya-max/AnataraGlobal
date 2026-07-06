import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Star, Clock, Globe, DollarSign, ArrowLeft, Calendar, Video } from 'lucide-react'
import { Link, useParams } from 'wouter'
import { useAdvisor, useBookSession } from '../../../lib/advisory-hooks'

export default function AdvisorDetail() {
  const params = useParams()
  const id = params?.id || ''
  const { data: advisor, isLoading, refetch } = useAdvisor(id)
  const bookSession = useBookSession()

  const [topic, setTopic] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [duration, setDuration] = useState(60)
  const [notes, setNotes] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleBook = async () => {
    if (!topic || !scheduledAt) return
    await bookSession.mutateAsync({ advisorId: id, scheduledAt, duration, topic, notes: notes || undefined })
    setShowForm(false)
    setTopic('')
    setScheduledAt('')
    setDuration(60)
    setNotes('')
    refetch()
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  }

  if (!advisor) {
    return (
      <div className="text-center py-20">
        <p className="text-sm font-semibold text-medium-gray">Advisor not found.</p>
        <Link href="/dashboard/founder/advisors" className="text-gold text-sm font-semibold hover:underline mt-2 inline-block">
          Back to advisors
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/dashboard/founder/advisors"
          className="inline-flex items-center gap-1.5 text-sm text-medium-gray hover:text-gold transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Advisors
        </Link>

        <div className="rounded-2xl border border-border-gray bg-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gold/10 text-3xl font-extrabold text-gold shrink-0">
              {advisor.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold text-deep-navy">{advisor.name}</h1>
              <p className="text-sm text-medium-gray">{advisor.title}{advisor.company ? ` at ${advisor.company}` : ''}</p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-medium-gray">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-gold" fill="currentColor" />
                  <span className="font-semibold">{advisor.rating}</span>
                  <span>({advisor.sessionCount} sessions)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{advisor.experience} years experience</span>
                </div>
                {advisor.hourlyRate && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{advisor.currency || 'INR'} {advisor.hourlyRate}/hr</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {advisor.expertise.map(e => (
                  <span key={e} className="rounded-full bg-gold/10 text-gold-dark px-3 py-1 text-xs font-semibold">
                    {e}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm text-medium-gray mt-6 leading-relaxed">{advisor.bio}</p>

          <div className="flex items-center gap-4 mt-6 pt-6 border-t border-border-gray">
            <div className="flex items-center gap-1 text-xs text-medium-gray">
              <Globe className="h-4 w-4" />
              <span>{advisor.languages.join(', ')}</span>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              advisor.availability === 'available' ? 'bg-success/10 text-success' :
              advisor.availability === 'limited' ? 'bg-warning/10 text-warning' :
              'bg-error/10 text-error'
            }`}>
              {advisor.availability === 'available' ? 'Available' :
               advisor.availability === 'limited' ? 'Limited Slots' : 'Currently Unavailable'}
            </span>
          </div>
        </div>
      </motion.div>

      {advisor.availability !== 'unavailable' && !showForm && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <button onClick={() => setShowForm(true)}
            className="w-full rounded-2xl border-2 border-dashed border-gold/30 bg-gold/5 p-8 text-center hover:bg-gold/10 hover:border-gold/50 transition-all group"
          >
            <Video className="h-10 w-10 text-gold/40 mx-auto mb-3 group-hover:text-gold/60 transition-colors" />
            <p className="text-sm font-bold text-gold">Book a Session</p>
            <p className="text-xs text-medium-gray mt-1">Schedule a 1-on-1 advisory call</p>
          </button>
        </motion.div>
      )}

      {showForm && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border-gray bg-white p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-deep-navy">Book a Session</h2>
            <button onClick={() => setShowForm(false)} className="text-sm text-medium-gray hover:text-error transition-colors">Cancel</button>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Topic *</label>
            <input value={topic} onChange={e => setTopic(e.target.value)}
              className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
              placeholder="What would you like to discuss?" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Date & Time *</label>
              <input value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} type="datetime-local"
                className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Duration (minutes)</label>
              <select value={duration} onChange={e => setDuration(parseInt(e.target.value))}
                className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
              >
                <option value={30}>30 min</option>
                <option value={60}>60 min</option>
                <option value={90}>90 min</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Notes (optional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
              placeholder="Any specific topics or questions..."
            />
          </div>

          <button onClick={handleBook} disabled={bookSession.isPending || !topic || !scheduledAt}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-light px-6 py-3 text-sm font-bold text-white shadow-lg shadow-gold/20 hover:shadow-xl transition-all disabled:opacity-60"
          >
            {bookSession.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Booking...</> : <><Calendar className="h-4 w-4" /> Confirm Booking</>}
          </button>
        </motion.div>
      )}

      {bookSession.isSuccess && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-success/20 bg-success/5 p-6 text-center"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success mx-auto mb-3">
            <Calendar className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-deep-navy">Session Booked!</p>
          <p className="text-xs text-medium-gray mt-1">You'll receive a confirmation with meeting details.</p>
        </motion.div>
      )}
    </div>
  )
}
