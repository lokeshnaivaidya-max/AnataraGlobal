import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Users, Search, Shield, MoreVertical, CheckCircle2, XCircle } from 'lucide-react'
import { useAdminUsers, useUpdateUserRole, useUpdateUserStatus } from '../../../lib/admin-hooks'
import { ROLE_LABELS, STATUS_COLORS } from '../../../lib/admin-types'
import type { AdminUser } from '../../../lib/admin-types'

export default function AdminUsers() {
  const { data: users, isLoading } = useAdminUsers()
  const updateRole = useUpdateUserRole()
  const updateStatus = useUpdateUserStatus()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const filtered = users?.filter(u =>
    (u.name.toLowerCase().includes(search.toLowerCase()) ||
     u.email.toLowerCase().includes(search.toLowerCase())) &&
    (!roleFilter || u.role === roleFilter)
  )

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-gold" />
          <div>
            <h1 className="text-2xl font-extrabold text-deep-navy">User Management</h1>
            <p className="text-sm text-medium-gray">Manage all platform users, roles, and access.</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-medium-gray" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-xl border border-border-gray bg-white pl-9 pr-4 py-2.5 text-sm placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {['', 'admin', 'founder', 'msme', 'advisor'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                roleFilter === r ? 'bg-deep-navy text-white' : 'bg-light-gray text-medium-gray hover:bg-border-gray'
              }`}
            >{r ? ROLE_LABELS[r] : 'All'}</button>
          ))}
        </div>
      </motion.div>

      <div className="rounded-2xl border border-border-gray bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-gray bg-light-gray/50">
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-medium-gray">User</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-medium-gray">Role</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-medium-gray">Status</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-medium-gray">Registered</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-medium-gray">Docs</th>
                <th className="w-10 px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered?.map((user: AdminUser) => (
                <tr key={user.id} className="border-b border-border-gray last:border-0 hover:bg-light-gray/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10 text-xs font-bold text-gold shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-deep-navy">{user.name}</p>
                        <p className="text-xs text-medium-gray">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 text-gold-dark px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                      <Shield className="h-3 w-3" />
                      {ROLE_LABELS[user.role] || user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[user.status] || ''}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-medium-gray">
                    {new Date(user.registeredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-deep-navy">{user.documentsCount}</td>
                  <td className="px-5 py-4 relative">
                    <button onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                      className="p-1.5 rounded-lg text-medium-gray hover:bg-light-gray transition-colors"
                    ><MoreVertical className="h-4 w-4" /></button>
                    {openMenu === user.id && (
                      <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-xl border border-border-gray bg-white shadow-xl py-1">
                        <p className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-medium-gray">Change Role</p>
                        {['admin', 'founder', 'msme', 'advisor'].map(r => (
                          <button key={r} onClick={() => { updateRole.mutate({ userId: user.id, role: r }); setOpenMenu(null) }}
                            className={`w-full text-left px-4 py-1.5 text-sm hover:bg-light-gray transition-colors ${user.role === r ? 'font-bold text-gold' : 'text-medium-gray'}`}
                          >{ROLE_LABELS[r]}</button>
                        ))}
                        <div className="border-t border-border-gray my-1" />
                        {user.status === 'active' ? (
                          <button onClick={() => { updateStatus.mutate({ userId: user.id, status: 'suspended' }); setOpenMenu(null) }}
                            className="w-full text-left px-4 py-1.5 text-sm text-error hover:bg-error/5 transition-colors"
                          ><XCircle className="h-3.5 w-3.5 inline mr-1.5" /> Suspend User</button>
                        ) : (
                          <button onClick={() => { updateStatus.mutate({ userId: user.id, status: 'active' }); setOpenMenu(null) }}
                            className="w-full text-left px-4 py-1.5 text-sm text-success hover:bg-success/5 transition-colors"
                          ><CheckCircle2 className="h-3.5 w-3.5 inline mr-1.5" /> Activate User</button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(!filtered || filtered.length === 0) && (
        <div className="text-center py-16">
          <Users className="h-12 w-12 text-medium-gray/20 mx-auto mb-3" />
          <p className="text-sm font-semibold text-medium-gray">No users found</p>
        </div>
      )}
    </div>
  )
}
