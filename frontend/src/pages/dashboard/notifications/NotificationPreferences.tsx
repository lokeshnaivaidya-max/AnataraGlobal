import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Bell, Save, Mail } from 'lucide-react'
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from '../../../lib/notification-hooks'
import { NOTIFICATION_CATEGORIES } from '../../../lib/notification-types'

export default function NotificationPreferences() {
  const { data: prefs, isLoading } = useNotificationPreferences()
  const updatePrefs = useUpdateNotificationPreferences()

  const [emailEnabled, setEmailEnabled] = useState(prefs?.emailNotifications ?? true)
  const [categories, setCategories] = useState(prefs?.categories ?? {
    profile: true, document: true, session: true,
    assessment: true, compliance: true, system: true, kyc: true,
  })
  const [digest, setDigest] = useState(prefs?.digestFrequency || 'immediate')

  const handleSave = async () => {
    await updatePrefs.mutateAsync({ emailNotifications: emailEnabled, categories, digestFrequency: digest })
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-gold" />
          <div>
            <h1 className="text-2xl font-extrabold text-deep-navy">Notification Preferences</h1>
            <p className="text-sm text-medium-gray">Control what email notifications you receive.</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border-gray bg-white p-6 space-y-5"
      >
        <h2 className="text-lg font-bold text-deep-navy">Email Notifications</h2>

        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-gold" />
            <div>
              <p className="text-sm font-bold text-deep-navy">Enable Email Notifications</p>
              <p className="text-xs text-medium-gray">Receive notifications via email</p>
            </div>
          </div>
          <div className={`relative w-11 h-6 rounded-full transition-colors ${emailEnabled ? 'bg-success' : 'bg-medium-gray/30'}`}>
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${emailEnabled ? 'translate-x-5' : ''}`} />
            <input type="checkbox" checked={emailEnabled} onChange={e => setEmailEnabled(e.target.checked)} className="sr-only" />
          </div>
        </label>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border-gray bg-white p-6 space-y-5"
      >
        <h2 className="text-lg font-bold text-deep-navy">Categories</h2>
        <p className="text-xs text-medium-gray">Choose which types of notifications to receive.</p>

        <div className="space-y-3">
          {NOTIFICATION_CATEGORIES.map(cat => (
            <label key={cat.key} className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-light-gray/50 transition-colors">
              <span className="text-sm font-semibold text-deep-navy">{cat.label}</span>
              <div className={`relative w-11 h-6 rounded-full transition-colors ${categories[cat.key as keyof typeof categories] ? 'bg-success' : 'bg-medium-gray/30'}`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${categories[cat.key as keyof typeof categories] ? 'translate-x-5' : ''}`} />
                <input type="checkbox" checked={categories[cat.key as keyof typeof categories]}
                  onChange={e => setCategories({ ...categories, [cat.key]: e.target.checked })} className="sr-only" />
              </div>
            </label>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-2xl border border-border-gray bg-white p-6 space-y-4"
      >
        <h2 className="text-lg font-bold text-deep-navy">Digest Frequency</h2>
        <p className="text-xs text-medium-gray">How often to receive email digests.</p>

        <div className="flex gap-3">
          {(['immediate', 'daily', 'weekly'] as const).map(f => (
            <button key={f} onClick={() => setDigest(f)}
              className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all ${
                digest === f ? 'bg-deep-navy text-white' : 'bg-light-gray text-medium-gray hover:bg-border-gray'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <button onClick={handleSave} disabled={updatePrefs.isPending}
          className="flex items-center gap-2 rounded-xl bg-deep-navy px-6 py-3 text-sm font-bold text-white hover:bg-deep-navy-light transition-all disabled:opacity-60"
        >
          {updatePrefs.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Preferences</>}
        </button>
      </motion.div>
    </div>
  )
}
