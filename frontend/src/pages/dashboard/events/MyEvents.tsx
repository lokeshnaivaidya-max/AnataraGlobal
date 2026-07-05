import { motion } from 'framer-motion'
import { Loader2, Calendar, Clock } from 'lucide-react'
import { Link } from 'wouter'
import { useMyRegistrations } from '../../../lib/event-hooks'

const statusColors: Record<string, string> = {
  confirmed: 'text-success bg-success/10',
  attended: 'text-gold bg-gold/10',
  cancelled: 'text-error bg-error/10',
  waitlisted: 'text-warning bg-warning/10',
}

const statusLabels: Record<string, string> = {
  confirmed: 'Confirmed',
  attended: 'Attended',
  cancelled: 'Cancelled',
  waitlisted: 'Waitlisted',
}

export default function MyEvents() {
  const { data: registrations, isLoading } = useMyRegistrations()

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-gold" />
          <div><h1 className="text-2xl font-extrabold text-deep-navy">My Events</h1><p className="text-sm text-medium-gray">Events you've registered for.</p></div>
        </div>
      </motion.div>

      <div className="space-y-3">
        {registrations?.map((reg, i) => (
          <motion.div key={reg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border-gray bg-white p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <Link href={`/dashboard/events/${reg.eventId}`} className="text-sm font-bold text-deep-navy hover:text-gold transition-colors">{reg.eventTitle}</Link>
                <div className="flex items-center gap-3 mt-1 text-xs text-medium-gray">
                  <span className="capitalize">{reg.eventType.replace('_', ' ')}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(reg.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusColors[reg.status] || ''}`}>
                {statusLabels[reg.status] || reg.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {(!registrations || registrations.length === 0) && (
        <div className="text-center py-16"><Calendar className="h-12 w-12 text-medium-gray/20 mx-auto mb-3" /><p className="text-sm font-semibold text-medium-gray">No registrations yet</p><Link href="/dashboard/events" className="text-gold text-sm font-bold hover:underline mt-2 inline-block">Browse Events</Link></div>
      )}
    </div>
  )
}
