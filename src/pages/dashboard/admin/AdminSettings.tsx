import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Settings, Save } from 'lucide-react'
import { usePlatformSettings, useUpdateSettings } from '../../../lib/admin-hooks'

export default function AdminSettings() {
  const { data: settings, isLoading } = usePlatformSettings()
  const updateSettings = useUpdateSettings()

  const [platformName, setPlatformName] = useState(settings?.platformName || '')
  const [description, setDescription] = useState(settings?.platformDescription || '')
  const [supportEmail, setSupportEmail] = useState(settings?.supportEmail || '')
  const [maintenanceMode, setMaintenanceMode] = useState(settings?.maintenanceMode || false)
  const [allowRegistrations, setAllowRegistrations] = useState(settings?.allowNewRegistrations ?? true)

  const handleSave = async () => {
    await updateSettings.mutateAsync({
      platformName: platformName || undefined,
      platformDescription: description || undefined,
      supportEmail: supportEmail || undefined,
      maintenanceMode,
      allowNewRegistrations: allowRegistrations,
    })
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-gold" />
          <div>
            <h1 className="text-2xl font-extrabold text-deep-navy">Platform Settings</h1>
            <p className="text-sm text-medium-gray">Manage platform configuration and preferences.</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border-gray bg-white p-6 space-y-5"
      >
        <h2 className="text-lg font-bold text-deep-navy">General</h2>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Platform Name</label>
          <input value={platformName} onChange={e => setPlatformName(e.target.value)}
            className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
            placeholder="Antara Global" />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
            className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
            placeholder="Platform description..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Support Email</label>
          <input value={supportEmail} onChange={e => setSupportEmail(e.target.value)} type="email"
            className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
            placeholder="support@antaraglobal.com" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border-gray bg-white p-6 space-y-5"
      >
        <h2 className="text-lg font-bold text-deep-navy">Features</h2>

        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm font-bold text-deep-navy">Maintenance Mode</p>
            <p className="text-xs text-medium-gray">Block new access and show maintenance page</p>
          </div>
          <div className={`relative w-11 h-6 rounded-full transition-colors ${maintenanceMode ? 'bg-error' : 'bg-medium-gray/30'}`}>
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${maintenanceMode ? 'translate-x-5' : ''}`} />
            <input type="checkbox" checked={maintenanceMode} onChange={e => setMaintenanceMode(e.target.checked)} className="sr-only" />
          </div>
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm font-bold text-deep-navy">Allow New Registrations</p>
            <p className="text-xs text-medium-gray">Let new users create accounts</p>
          </div>
          <div className={`relative w-11 h-6 rounded-full transition-colors ${allowRegistrations ? 'bg-success' : 'bg-medium-gray/30'}`}>
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${allowRegistrations ? 'translate-x-5' : ''}`} />
            <input type="checkbox" checked={allowRegistrations} onChange={e => setAllowRegistrations(e.target.checked)} className="sr-only" />
          </div>
        </label>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <button onClick={handleSave} disabled={updateSettings.isPending}
          className="flex items-center gap-2 rounded-xl bg-deep-navy px-6 py-3 text-sm font-bold text-white hover:bg-deep-navy-light transition-all disabled:opacity-60"
        >
          {updateSettings.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Settings</>}
        </button>
      </motion.div>
    </div>
  )
}
