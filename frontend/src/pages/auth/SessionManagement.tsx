import { motion } from 'framer-motion'
import { LogOut, Globe, Loader2, AlertCircle } from 'lucide-react'
import ProtectedRoute from '../../components/auth/ProtectedRoute'
import { useSessions, useEndSession, useEndAllSessions } from '../../lib/auth-hooks'
import type { Session } from '../../lib/auth-types'

function SessionManagementContent() {
  const { data: sessions, isLoading, refetch } = useSessions()
  const endSession = useEndSession()
  const endAllSessions = useEndAllSessions()

  const handleEndSession = async (sessionId: string) => {
    await endSession.mutateAsync(sessionId)
    refetch()
  }

  const handleEndAll = async () => {
    await endAllSessions.mutateAsync()
    refetch()
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-deep-navy via-deep-navy-dark to-deep-navy pt-28 pb-16">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Session Management</h1>
            <p className="mt-2 text-white/60 text-sm">Manage your active sessions across devices.</p>
          </div>
          {sessions && sessions.length > 1 && (
            <button
              onClick={handleEndAll}
              disabled={endAllSessions.isPending}
              className="flex items-center gap-2 rounded-xl border border-error/20 bg-error/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-error hover:bg-error/20 transition-all duration-200 disabled:opacity-50"
            >
              {endAllSessions.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <LogOut className="h-3.5 w-3.5" />
              )}
              End All Other Sessions
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        ) : sessions && sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.map((session: Session, index: number) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold shrink-0">
                  <Globe className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white truncate">{session.deviceName}</p>
                    {session.isCurrentSession && (
                      <span className="shrink-0 rounded-full bg-success/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/40 mt-0.5">
                    {session.browser} on {session.os} &middot; {session.ip} &middot; Last active {new Date(session.lastActive).toLocaleDateString()}
                  </p>
                </div>
                {!session.isCurrentSession && (
                  <button
                    onClick={() => handleEndSession(session.id)}
                    disabled={endSession.isPending}
                    className="flex items-center gap-2 rounded-xl border border-error/20 bg-error/10 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-error hover:bg-error/20 transition-all duration-200 disabled:opacity-50"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    End
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <AlertCircle className="h-12 w-12 text-white/20" />
            <p className="text-white/40 text-sm">No active sessions found.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default function SessionManagement() {
  return (
    <ProtectedRoute>
      <SessionManagementContent />
    </ProtectedRoute>
  )
}
