import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Plus, Trash2, Users, UserPlus } from 'lucide-react'
import { useTeamMembers, useAddTeamMember, useDeleteTeamMember } from '../../../lib/founder-hooks'

export default function TeamPage() {
  const { data: members, isLoading, refetch } = useTeamMembers()
  const addMember = useAddTeamMember()
  const deleteMember = useDeleteTeamMember()

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', role: '', email: '', linkedinUrl: '', equity: 0, bio: '', isCoFounder: false,
  })

  const handleAdd = async () => {
    if (!form.name || !form.role) return
    await addMember.mutateAsync({ ...form, startupId: '' })
    setForm({ name: '', role: '', email: '', linkedinUrl: '', equity: 0, bio: '', isCoFounder: false })
    setShowForm(false)
    refetch()
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-gold" />
          <div>
            <h1 className="text-2xl font-extrabold text-deep-navy">Team Members</h1>
            <p className="text-sm text-medium-gray">Manage your startup team.</p>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-deep-navy px-4 py-2.5 text-sm font-bold text-white hover:bg-deep-navy-light transition-all"
        >
          <UserPlus className="h-4 w-4" /> Add Member
        </button>
      </motion.div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border-gray bg-white p-6 space-y-4"
        >
          <h2 className="text-sm font-bold text-deep-navy">New Team Member</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Role *</label>
              <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Equity (%)</label>
              <input type="number" value={form.equity} onChange={e => setForm({ ...form, equity: Number(e.target.value) })}
                className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Bio</label>
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={2}
                className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isCoFounder" checked={form.isCoFounder}
                onChange={e => setForm({ ...form, isCoFounder: e.target.checked })}
                className="h-4 w-4 rounded border-border-gray text-gold focus:ring-gold" />
              <label htmlFor="isCoFounder" className="text-sm font-medium text-medium-gray">Co-founder</label>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowForm(false)} className="px-4 py-2.5 text-sm font-semibold text-medium-gray hover:text-deep-navy transition-colors">Cancel</button>
            <button onClick={handleAdd} disabled={addMember.isPending || !form.name || !form.role}
              className="flex items-center gap-2 rounded-xl bg-deep-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-deep-navy-light transition-all disabled:opacity-60"
            >
              {addMember.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add Member
            </button>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {members?.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-medium-gray/20 mx-auto mb-3" />
            <p className="text-sm text-medium-gray">No team members added yet.</p>
          </div>
        )}
        {members?.map((member, i) => (
          <motion.div key={member.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 rounded-2xl border border-border-gray bg-white p-5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold/15 to-gold/5 text-gold text-sm font-bold shrink-0">
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-deep-navy">{member.name}</p>
                {member.isCoFounder && (
                  <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-dark">Co-founder</span>
                )}
              </div>
              <p className="text-xs text-medium-gray">{member.role}{member.equity ? ` · ${member.equity}% equity` : ''}</p>
            </div>
            <button onClick={() => deleteMember.mutateAsync(member.id).then(() => refetch())}
              className="p-2 text-error/60 hover:text-error transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
