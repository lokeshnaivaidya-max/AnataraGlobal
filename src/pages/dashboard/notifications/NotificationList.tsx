import { motion } from 'framer-motion'
import {
  Loader2, Bell, CheckCheck, Mail, User, FileText, Calendar,
  Gauge, ShieldCheck, Settings, ClipboardCheck,
} from 'lucide-react'
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '../../../lib/notification-hooks'
import { CATEGORY_ICONS } from '../../../lib/notification-types'

const iconMap: Record<string, typeof Bell> = {
  User, FileText, Calendar, Gauge, ShieldCheck, Settings, ClipboardCheck,
}

function NotificationIcon({ category }: { category: string }) {
  const iconName = CATEGORY_ICONS[category] || 'Bell'
  const Icon = iconMap[iconName] || Bell
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold shrink-0">
      <Icon className="h-5 w-5" />
    </div>
  )
}

export default function NotificationList() {
  const { data: notifications, isLoading } = useNotifications()
  const markAsRead = useMarkAsRead()
  const markAllAsRead = useMarkAllAsRead()

  const unread = notifications?.filter(n => !n.read).length || 0

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-gold" />
          <div>
            <h1 className="text-2xl font-extrabold text-deep-navy">Notifications</h1>
            <p className="text-sm text-medium-gray">{unread > 0 ? `${unread} unread` : 'No unread notifications'}</p>
          </div>
        </div>
        {unread > 0 && (
          <button onClick={() => markAllAsRead.mutateAsync()}
            className="flex items-center gap-1.5 rounded-xl bg-deep-navy px-4 py-2 text-xs font-bold text-white hover:bg-deep-navy-light transition-all"
          >
            <CheckCheck className="h-4 w-4" /> Mark All Read
          </button>
        )}
      </motion.div>

      <div className="space-y-2">
        {notifications?.map((notif, i) => (
          <motion.div key={notif.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className={`rounded-2xl border p-5 transition-all cursor-pointer ${
              !notif.read
                ? 'border-gold/20 bg-gold/5 hover:bg-gold/10'
                : 'border-border-gray bg-white hover:bg-light-gray/50'
            }`}
            onClick={() => { if (!notif.read) markAsRead.mutateAsync(notif.id) }}
          >
            <div className="flex items-start gap-4">
              <NotificationIcon category={notif.category} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm ${notif.read ? 'text-medium-gray' : 'font-bold text-deep-navy'}`}>
                    {notif.title}
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    {notif.emailSent && (
                      <span className="text-xs text-medium-gray/60" title="Email sent">
                        <Mail className="h-3.5 w-3.5 inline" />
                      </span>
                    )}
                    {!notif.read && (
                      <span className="h-2 w-2 rounded-full bg-gold" />
                    )}
                  </div>
                </div>
                <p className={`text-xs mt-1 ${notif.read ? 'text-medium-gray/60' : 'text-medium-gray'}`}>
                  {notif.message}
                </p>
                <p className="text-xs text-medium-gray/40 mt-2">
                  {new Date(notif.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
                {notif.actionUrl && (
                  <a href={notif.actionUrl}
                    className="inline-block mt-2 text-xs font-bold text-gold hover:underline"
                  >View Details</a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {(!notifications || notifications.length === 0) && (
        <div className="text-center py-20">
          <Bell className="h-12 w-12 text-medium-gray/20 mx-auto mb-3" />
          <p className="text-sm font-semibold text-medium-gray">No notifications yet</p>
          <p className="text-xs text-medium-gray/60 mt-1">Notifications will appear here when you receive them.</p>
        </div>
      )}
    </div>
  )
}
