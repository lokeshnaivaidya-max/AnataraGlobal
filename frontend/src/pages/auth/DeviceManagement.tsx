import { motion } from 'framer-motion'
import { Smartphone, Monitor, Laptop, Tablet, Trash2, Loader2, AlertCircle } from 'lucide-react'
import ProtectedRoute from '../../components/auth/ProtectedRoute'
import { useDevices, useRemoveDevice } from '../../lib/auth-hooks'
import type { Device } from '../../lib/auth-types'

const deviceIcons: Record<string, typeof Monitor> = {
  mobile: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
  desktop: Monitor,
}

function DeviceManagementContent() {
  const { data: devices, isLoading, refetch } = useDevices()
  const removeDevice = useRemoveDevice()

  const handleRemove = async (deviceId: string) => {
    await removeDevice.mutateAsync(deviceId)
    refetch()
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-deep-navy via-deep-navy-dark to-deep-navy pt-28 pb-16">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Device Management</h1>
          <p className="mt-2 text-white/60 text-sm">View and manage devices that have access to your account.</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        ) : devices && devices.length > 0 ? (
          <div className="space-y-3">
            {devices.map((device: Device, index: number) => {
              const DeviceIcon = deviceIcons[device.deviceType] || Monitor
              return (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold shrink-0">
                    <DeviceIcon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white truncate">{device.deviceName}</p>
                      {device.isCurrentDevice && (
                        <span className="shrink-0 rounded-full bg-success/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/40 mt-0.5">
                      {device.browser} &middot; {device.ip} &middot; Last active {new Date(device.lastActive).toLocaleDateString()}
                    </p>
                  </div>
                  {!device.isCurrentDevice && (
                    <button
                      onClick={() => handleRemove(device.id)}
                      disabled={removeDevice.isPending}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-error/20 text-error/60 hover:text-error hover:bg-error/10 transition-all duration-200 disabled:opacity-40"
                      aria-label={`Remove ${device.deviceName}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <AlertCircle className="h-12 w-12 text-white/20" />
            <p className="text-white/40 text-sm">No devices found.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default function DeviceManagement() {
  return (
    <ProtectedRoute>
      <DeviceManagementContent />
    </ProtectedRoute>
  )
}
