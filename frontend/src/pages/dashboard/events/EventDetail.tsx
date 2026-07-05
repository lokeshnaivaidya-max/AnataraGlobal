import { motion } from 'framer-motion'
import { Loader2, Calendar, Clock, MapPin, Users, Monitor, ArrowLeft, DollarSign, ExternalLink, CheckCircle2 } from 'lucide-react'
import { Link, useParams } from 'wouter'
import { useEvent, useRegisterForEvent, useCancelRegistration, useMyRegistrations } from '../../../lib/event-hooks'
import { EVENT_TYPES, EVENT_STATUSES } from '../../../lib/event-types'

export default function EventDetail() {
  const params = useParams()
  const id = params?.id || ''
  const { data: event, isLoading } = useEvent(id)
  const register = useRegisterForEvent()
  const cancel = useCancelRegistration()
  const { data: registrations, refetch } = useMyRegistrations()

  const registered = registrations?.some(r => r.eventId === id)
  const registration = registrations?.find(r => r.eventId === id)

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  if (!event) return <div className="text-center py-20"><p className="text-sm font-semibold text-medium-gray">Event not found.</p><Link href="/dashboard/events" className="text-gold text-sm font-semibold hover:underline mt-2 inline-block">Back to events</Link></div>

  const statusDef = EVENT_STATUSES.find(s => s.value === event.status)
  const isFull = event.registeredCount >= event.capacity
  const isPast = new Date(event.endDate) < new Date()

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/dashboard/events" className="inline-flex items-center gap-1.5 text-sm text-medium-gray hover:text-gold transition-colors mb-4"><ArrowLeft className="h-4 w-4" /> Back to Events</Link>
        <div className="rounded-2xl border border-border-gray bg-white p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-gold/10 text-gold-dark px-3 py-1 text-xs font-bold uppercase tracking-wider">{EVENT_TYPES.find(t => t.value === event.type)?.label || event.type}</span>
                <span className={`rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${statusDef?.color || ''}`}>{statusDef?.label || event.status}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-deep-navy">{event.title}</h1>
            </div>
          </div>

          <p className="text-sm text-medium-gray leading-relaxed mb-6">{event.description}</p>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 rounded-xl bg-light-gray/50 p-4"><Calendar className="h-5 w-5 text-gold" /><div><p className="text-xs font-bold text-deep-navy">Date</p><p className="text-xs text-medium-gray">{new Date(event.startDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p></div></div>
            <div className="flex items-center gap-3 rounded-xl bg-light-gray/50 p-4"><Clock className="h-5 w-5 text-gold" /><div><p className="text-xs font-bold text-deep-navy">Time</p><p className="text-xs text-medium-gray">{new Date(event.startDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} - {new Date(event.endDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p></div></div>
            <div className="flex items-center gap-3 rounded-xl bg-light-gray/50 p-4">{event.mode === 'online' ? <Monitor className="h-5 w-5 text-gold" /> : <MapPin className="h-5 w-5 text-gold" />}<div><p className="text-xs font-bold text-deep-navy">Mode</p><p className="text-xs text-medium-gray capitalize">{event.mode}{event.mode !== 'online' && event.location ? ` - ${event.location}` : ''}</p></div></div>
            <div className="flex items-center gap-3 rounded-xl bg-light-gray/50 p-4"><Users className="h-5 w-5 text-gold" /><div><p className="text-xs font-bold text-deep-navy">Capacity</p><p className="text-xs text-medium-gray">{event.registeredCount}/{event.capacity} registered</p></div></div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-border-gray">
            <div className="flex items-center gap-2">
              <span className="text-xs text-medium-gray">Organized by</span>
              <span className="text-sm font-bold text-deep-navy">{event.organizer}</span>
            </div>
            {event.price > 0 && (
              <div className="flex items-center gap-1 text-sm font-bold text-deep-navy"><DollarSign className="h-4 w-4 text-gold" />{event.currency} {event.price}</div>
            )}
          </div>

          {event.meetingLink && (
            <a href={event.meetingLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 mt-4 text-sm font-bold text-gold hover:underline"><ExternalLink className="h-4 w-4" /> Join Meeting</a>
          )}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {registered ? (
          <div className="rounded-2xl border border-success/20 bg-success/5 p-6 text-center">
            <CheckCircle2 className="h-10 w-10 text-success mx-auto mb-2" />
            <p className="text-sm font-bold text-deep-navy">You're registered!</p>
            <p className="text-xs text-medium-gray mt-1">Status: {registration?.status}</p>
            {event.status === 'upcoming' && (
              <button onClick={() => cancel.mutateAsync(id).then(() => refetch())} className="mt-4 text-xs font-bold text-error hover:underline">Cancel Registration</button>
            )}
          </div>
        ) : event.status === 'upcoming' && !isPast ? (
          <button onClick={() => register.mutateAsync(id).then(() => refetch())} disabled={register.isPending || isFull}
            className="w-full rounded-xl bg-gradient-to-r from-gold to-gold-light py-3.5 text-sm font-bold text-white shadow-lg shadow-gold/20 hover:shadow-xl transition-all disabled:opacity-60"
          >
            {register.isPending ? <><Loader2 className="h-4 w-4 animate-spin inline" /> Registering...</> : isFull ? 'Event Full' : 'Register Now'}
          </button>
        ) : (
          <div className="rounded-2xl border border-border-gray bg-light-gray/50 p-6 text-center">
            <p className="text-sm font-semibold text-medium-gray">Registration is closed for this event.</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
