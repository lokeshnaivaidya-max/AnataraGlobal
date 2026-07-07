import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Plus, Trash2, Save, GraduationCap, Briefcase, Wrench } from 'lucide-react'
import {
  useFounderProfile,
  useUpdateFounderProfile,
  useEducation,
  useAddEducation,
  useDeleteEducation,
  useExperience,
  useAddExperience,
  useDeleteExperience,
  useSkills,
  useAddSkill,
  useDeleteSkill,
} from '../../../lib/founder-hooks'

export default function ProfilePage() {
  const { data: founder, isLoading, refetch } = useFounderProfile()
  const updateProfile = useUpdateFounderProfile()
  const { data: education } = useEducation()
  const addEducation = useAddEducation()
  const deleteEducation = useDeleteEducation()
  const { data: experience } = useExperience()
  const addExperience = useAddExperience()
  const deleteExperience = useDeleteExperience()
  const { data: skills } = useSkills()
  const addSkill = useAddSkill()
  const deleteSkill = useDeleteSkill()

  const [bio, setBio] = useState(founder?.bio || '')
  const [phone, setPhone] = useState(founder?.phone || '')
  const [linkedinUrl, setLinkedinUrl] = useState(founder?.linkedinUrl || '')
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (founder) {
      setBio(founder.bio || '')
      setPhone(founder.phone || '')
      setLinkedinUrl(founder.linkedinUrl || '')
    }
  }, [founder])

  const [newEdu, setNewEdu] = useState({ degree: '', institution: '', startYear: new Date().getFullYear() })
  const [newExp, setNewExp] = useState({ company: '', role: '', startYear: new Date().getFullYear() })
  const [newSkill, setNewSkill] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setSaveSuccess(false)
    setSaveError('')
    try {
      await updateProfile.mutateAsync({ bio, phone, linkedinUrl })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : 'Failed to save changes.'
      setSaveError(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleAddEdu = async () => {
    if (!newEdu.degree || !newEdu.institution) return
    await addEducation.mutateAsync({ ...newEdu, isCurrent: false })
    setNewEdu({ degree: '', institution: '', startYear: new Date().getFullYear() })
    refetch()
  }

  const handleAddExp = async () => {
    if (!newExp.company || !newExp.role) return
    await addExperience.mutateAsync({ ...newExp, startMonth: 'January', isCurrent: false })
    setNewExp({ company: '', role: '', startYear: new Date().getFullYear() })
    refetch()
  }

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return
    await addSkill.mutateAsync({ name: newSkill.trim() })
    setNewSkill('')
    refetch()
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-deep-navy">My Profile</h1>
        <p className="text-sm text-medium-gray mt-1">Manage your personal information and background.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border-gray bg-white p-6 space-y-4"
      >
        <h2 className="text-lg font-bold text-deep-navy">Basic Information</h2>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Bio</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
            className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
              placeholder="+91 98765 43210" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5">LinkedIn URL</label>
            <input value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)}
              className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm text-charcoal placeholder:text-medium-gray/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
              placeholder="https://linkedin.com/in/..." />
          </div>
        </div>

        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success font-medium"
          >
            Changes saved successfully!
          </motion.div>
        )}

        {saveError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error font-medium"
          >
            {saveError}
          </motion.div>
        )}

        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-deep-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-deep-navy-light transition-all disabled:opacity-60"
        >
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Changes</>}
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border-gray bg-white p-6 space-y-4"
      >
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-gold" />
          <h2 className="text-lg font-bold text-deep-navy">Education</h2>
        </div>

        {education?.map(edu => (
          <div key={edu.id} className="flex items-center justify-between rounded-xl border border-border-gray bg-light-gray/50 p-4">
            <div>
              <p className="text-sm font-bold text-deep-navy">{edu.degree}</p>
              <p className="text-xs text-medium-gray">{edu.institution} &middot; {edu.startYear}{edu.endYear ? ` - ${edu.endYear}` : ' - Present'}</p>
            </div>
            <button onClick={() => deleteEducation.mutateAsync(edu.id).then(() => refetch())} className="p-2 text-error/60 hover:text-error transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        <div className="grid sm:grid-cols-3 gap-3">
          <input value={newEdu.degree} onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })}
            placeholder="Degree" className="rounded-xl border border-border-gray bg-light-gray/50 px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
          <input value={newEdu.institution} onChange={e => setNewEdu({ ...newEdu, institution: e.target.value })}
            placeholder="Institution" className="rounded-xl border border-border-gray bg-light-gray/50 px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
          <button onClick={handleAddEdu} disabled={addEducation.isPending}
            className="flex items-center justify-center gap-2 rounded-xl bg-deep-navy px-4 py-2.5 text-sm font-bold text-white hover:bg-deep-navy-light transition-all"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-2xl border border-border-gray bg-white p-6 space-y-4"
      >
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-gold" />
          <h2 className="text-lg font-bold text-deep-navy">Experience</h2>
        </div>

        {experience?.map(exp => (
          <div key={exp.id} className="flex items-center justify-between rounded-xl border border-border-gray bg-light-gray/50 p-4">
            <div>
              <p className="text-sm font-bold text-deep-navy">{exp.role}</p>
              <p className="text-xs text-medium-gray">{exp.company} &middot; {exp.startYear}{exp.endYear ? ` - ${exp.endYear}` : ' - Present'}</p>
            </div>
            <button onClick={() => deleteExperience.mutateAsync(exp.id).then(() => refetch())} className="p-2 text-error/60 hover:text-error transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        <div className="grid sm:grid-cols-3 gap-3">
          <input value={newExp.company} onChange={e => setNewExp({ ...newExp, company: e.target.value })}
            placeholder="Company" className="rounded-xl border border-border-gray bg-light-gray/50 px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
          <input value={newExp.role} onChange={e => setNewExp({ ...newExp, role: e.target.value })}
            placeholder="Role" className="rounded-xl border border-border-gray bg-light-gray/50 px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
          <button onClick={handleAddExp} disabled={addExperience.isPending}
            className="flex items-center justify-center gap-2 rounded-xl bg-deep-navy px-4 py-2.5 text-sm font-bold text-white hover:bg-deep-navy-light transition-all"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="rounded-2xl border border-border-gray bg-white p-6 space-y-4"
      >
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-gold" />
          <h2 className="text-lg font-bold text-deep-navy">Skills</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills?.map(skill => (
            <span key={skill.id} className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 text-gold-dark px-3 py-1.5 text-xs font-semibold">
              {skill.name}
              <button onClick={() => deleteSkill.mutateAsync(skill.id).then(() => refetch())} className="hover:text-error transition-colors">
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          <input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
            placeholder="Add a skill..." className="flex-1 rounded-xl border border-border-gray bg-light-gray/50 px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" />
          <button onClick={handleAddSkill} disabled={addSkill.isPending || !newSkill.trim()}
            className="flex items-center gap-2 rounded-xl bg-deep-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-deep-navy-light transition-all disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </motion.div>
    </div>
  )
}
