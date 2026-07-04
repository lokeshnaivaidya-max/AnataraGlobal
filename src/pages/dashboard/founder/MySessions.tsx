import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Calendar, Video, XCircle, Clock, User } from 'lucide-react'
import { useMySessions, useCancelSession } from '../../../lib/advisory-hooks'
import { SESSION_STATUS_LABELS, SESSION_STATUS_COLORS } from '../../../lib/advisory-types'

export default function MySessions() {
  const { data: sessions, isLoading, refetch } = useMySessions()
  const cancelSession = useCancelSession()
  const [filter, setFilter] = useState<string>('')

  const filtered = filter ? sessions?.filter(s => s.status === filter) : sessions

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-gold" />
          <div>
            <h1 className="text-2xl font-extrabold text-deep-navy">My Sessions</h1>
            <p className="text-sm text-medium-gray">View and manage your advisory sessions.</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex gap-2 flex-wrap"
      >
        {['', 'scheduled', 'confirmed', 'completed', 'cancelled'].map(status => (
          <button key={status} onClick={() => setFilter(status)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              filter === status
                ? 'bg-deep-navy text-white'
                : 'bg-light-gray text-medium-gray hover:bg-border-gray'
            }`}
          >
            {status ? SESSION_STATUS_LABELS[status] : 'All'}
          </button>
        ))}
      </motion.div>

      <div className="space-y-4">
        {filtered?.map((session, i) => (
          <motion.div key={session.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border-gray bg-white p-5"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold shrink-0">
                {session.advisorAvatarUrl
                  ? <img src={session.advisorAvatarUrl} alt="" className="h-full w-full rounded-xl object-cover" />
                  : <User className="h-6 w-6" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-deep-navy">{session.topic}</p>
                    <p className="text-xs text-medium-gray">
                      with {session.advisorName} &middot; {session.advisorTitle}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${SESSION_STATUS_COLORS[session.status]}`}>
                    {SESSION_STATUS_LABELS[session.status]}
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-3 text-xs text-medium-gray">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{new Date(session.scheduledAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}</span>
                  </div>
                  <span>{session.duration} min</span>
                </div>

                {session.status === 'confirmed' && session.meetingLink && (
                  <a href={session.meetingLink} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 rounded-lg bg-success/10 text-success px-3 py-1.5 text-xs font-bold hover:bg-success/20 transition-colors"
                  >
                    <Video className="h-3.5 w-3.5" /> Join Meeting
                  </a>
                )}

                {(session.status === 'scheduled' || session.status === 'confirmed') && (
                  <button onClick={() => cancelSession.mutateAsync(session.id).then(() => refetch())}
                    className="inline-flex items-center gap-1 mt-3 text-xs text-error/60 hover:text-error transition-colors"
                  >
                    <XCircle className="h-3.5 w-3.5" /> Cancel Session
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {(!filtered || filtered.length === 0) && (
          <div className="text-center py-20">
            <Calendar className="h-12 w-12 text-medium-gray/20 mx-auto mb-3" />
            <p className="text-sm font-semibold text-medium-gray">No sessions found</p>
            <p className="text-xs text-medium-gray/60 mt-1">
              {filter ? 'No sessions with this status.' : 'Book an advisor to get started.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
