import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Loader2, Mail, Phone, ArrowLeft,
  MessageSquare, Calendar, CheckSquare, Plus, X, Edit3, Trash2, ExternalLink,
} from 'lucide-react'
import { Link, useParams } from 'wouter'
import {
  useInvestorContact, useUpdateContact, useDeleteContact,
  useCommunications, useAddCommunication,
  useMeetingNotes, useAddMeetingNote,
  useInvestorTasks, useAddTask, useUpdateTask,
} from '../../../lib/investor-crm-hooks'
import { INVESTOR_TYPES, PRIORITY_LABELS, PRIORITY_COLORS } from '../../../lib/investor-crm-types'

export default function InvestorContactDetail() {
  const params = useParams()
  const id = params?.id || ''
  const { data: contact, isLoading, refetch } = useInvestorContact(id)
  const updateContact = useUpdateContact()
  const deleteContact = useDeleteContact()
  const { data: comms } = useCommunications(id)
  const addComm = useAddCommunication()
  const { data: meetings } = useMeetingNotes(id)
  const addMeeting = useAddMeetingNote()
  const { data: tasks } = useInvestorTasks(id)
  const addTask = useAddTask()
  const updateTask = useUpdateTask()

  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editFirm, setEditFirm] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editNotes, setEditNotes] = useState('')

  const [showCommForm, setShowCommForm] = useState(false)
  const [commType, setCommType] = useState('email')
  const [commSubject, setCommSubject] = useState('')
  const [commSummary, setCommSummary] = useState('')
  const [commDirection, setCommDirection] = useState('outbound')

  const [showMeetingForm, setShowMeetingForm] = useState(false)
  const [meetingTitle, setMeetingTitle] = useState('')
  const [meetingDate, setMeetingDate] = useState('')
  const [meetingNotes, setMeetingNotes] = useState('')

  const [showTaskForm, setShowTaskForm] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDue, setTaskDue] = useState('')
  const [taskPriority, setTaskPriority] = useState('medium')

  const startEdit = () => {
    if (!contact) return
    setEditName(contact.name)
    setEditFirm(contact.firm)
    setEditTitle(contact.title || '')
    setEditEmail(contact.email || '')
    setEditPhone(contact.phone || '')
    setEditNotes(contact.notes || '')
    setEditing(true)
  }

  const handleSaveEdit = async () => {
    if (!contact) return
    await updateContact.mutateAsync({ id, data: { name: editName, firm: editFirm, title: editTitle || undefined, email: editEmail || undefined, phone: editPhone || undefined, notes: editNotes || undefined } })
    setEditing(false)
  }

  const handleAddComm = async () => {
    await addComm.mutateAsync({ contactId: id, data: { type: commType as any, subject: commSubject, summary: commSummary, direction: commDirection as any, date: new Date().toISOString() } } as any)
    setShowCommForm(false)
    setCommSubject('')
    setCommSummary('')
    refetch()
  }

  const handleAddMeeting = async () => {
    await addMeeting.mutateAsync({ contactId: id, data: { title: meetingTitle, date: meetingDate || new Date().toISOString(), notes: meetingNotes, actionItems: [] } } as any)
    setShowMeetingForm(false)
    setMeetingTitle('')
    setMeetingDate('')
    setMeetingNotes('')
    refetch()
  }

  const handleAddTask = async () => {
    await addTask.mutateAsync({ contactId: id, data: { title: taskTitle, dueDate: taskDue || undefined, priority: taskPriority as any, status: 'pending' } } as any)
    setShowTaskForm(false)
    setTaskTitle('')
    setTaskDue('')
    setTaskPriority('medium')
    refetch()
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
  }

  if (!contact) {
    return (
      <div className="text-center py-20">
        <p className="text-sm font-semibold text-medium-gray">Contact not found.</p>
        <Link href="/dashboard/founder/investor-crm" className="text-gold text-sm font-semibold hover:underline mt-2 inline-block">Back to contacts</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/dashboard/founder/investor-crm"
          className="inline-flex items-center gap-1.5 text-sm text-medium-gray hover:text-gold transition-colors mb-4"
        ><ArrowLeft className="h-4 w-4" /> Back to Contacts</Link>

        {!editing ? (
          <div className="rounded-2xl border border-border-gray bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10 text-2xl font-extrabold text-gold shrink-0">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-deep-navy">{contact.name}</h1>
                  <p className="text-sm text-medium-gray">{contact.firm}{contact.title ? ` \u00B7 ${contact.title}` : ''}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-medium-gray">
                    {contact.email && <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{contact.email}</span>}
                    {contact.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{contact.phone}</span>}
                    {contact.linkedinUrl && (
                      <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-gold hover:underline"
                      ><ExternalLink className="h-3.5 w-3.5" />LinkedIn</a>
                    )}
                  </div>
                  <span className="inline-block mt-2 rounded-full bg-gold/10 text-gold-dark px-3 py-1 text-xs font-semibold">
                    {INVESTOR_TYPES.find(t => t.value === contact.type)?.label || contact.type}
                  </span>
                  {contact.notes && <p className="text-sm text-medium-gray mt-3">{contact.notes}</p>}
                </div>
              </div>
              <button onClick={startEdit} className="p-2 text-medium-gray hover:text-gold hover:bg-light-gray rounded-lg transition-colors"><Edit3 className="h-4 w-4" /></button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border-gray bg-white p-6 space-y-4">
            <h2 className="text-lg font-bold text-deep-navy">Edit Contact</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Name</label><input value={editName} onChange={e => setEditName(e.target.value)} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Firm</label><input value={editFirm} onChange={e => setEditFirm(e.target.value)} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Title</label><input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Email</label><input value={editEmail} onChange={e => setEditEmail(e.target.value)} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Phone</label><input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>
              <div className="sm:col-span-2"><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Notes</label><textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={2} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSaveEdit} disabled={updateContact.isPending} className="rounded-xl bg-deep-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-deep-navy-light transition-all disabled:opacity-60">
                {updateContact.isPending ? <Loader2 className="h-4 w-4 animate-spin inline" /> : 'Save'}
              </button>
              <button onClick={() => setEditing(false)} className="rounded-xl bg-light-gray px-5 py-2.5 text-sm font-bold text-medium-gray hover:bg-border-gray transition-all">Cancel</button>
            </div>
          </div>
        )}
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-6">
        <div className="sm:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border-gray bg-white p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-gold" /><h2 className="text-sm font-bold text-deep-navy">Communications</h2></div>
              <button onClick={() => setShowCommForm(true)} className="flex items-center gap-1 text-xs font-bold text-gold hover:underline"><Plus className="h-3 w-3" /> Log</button>
            </div>
            <div className="space-y-3">
              {comms?.map(c => (
                <div key={c.id} className="flex items-start gap-3 rounded-xl bg-light-gray/50 p-3">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold shrink-0 ${c.direction === 'outbound' ? 'bg-gold/10 text-gold' : 'bg-medium-gray/10 text-medium-gray'}`}>
                    {c.direction === 'outbound' ? 'OUT' : 'IN'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-deep-navy">{c.subject}</p>
                    <p className="text-xs text-medium-gray mt-0.5">{c.summary}</p>
                    <p className="text-[10px] text-medium-gray/60 mt-1">
                      {c.type} &middot; {new Date(c.date || (c as any).createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      {c.followUpDate && <>&middot; Follow up: {new Date(c.followUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</>}
                    </p>
                  </div>
                </div>
              ))}
              {(!comms || comms.length === 0) && <p className="text-xs text-medium-gray text-center py-4">No communications logged yet.</p>}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="rounded-2xl border border-border-gray bg-white p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-gold" /><h2 className="text-sm font-bold text-deep-navy">Meetings</h2></div>
              <button onClick={() => setShowMeetingForm(true)} className="flex items-center gap-1 text-xs font-bold text-gold hover:underline"><Plus className="h-3 w-3" /> Add</button>
            </div>
            <div className="space-y-3">
              {meetings?.map(m => (
                <div key={m.id} className="rounded-xl border border-border-gray p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold text-deep-navy">{m.title}</p>
                    <span className="text-[10px] text-medium-gray">{new Date(m.date || (m as any).scheduledAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <p className="text-xs text-medium-gray">{m.notes}</p>
                  {m.actionItems && m.actionItems.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {m.actionItems.map((a, i) => (
                        <span key={i} className="rounded-full bg-light-gray text-medium-gray px-2 py-0.5 text-[10px]">{a}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {(!meetings || meetings.length === 0) && <p className="text-xs text-medium-gray text-center py-4">No meetings recorded yet.</p>}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border-gray bg-white p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2"><CheckSquare className="h-5 w-5 text-gold" /><h2 className="text-sm font-bold text-deep-navy">Tasks</h2></div>
              <button onClick={() => setShowTaskForm(true)} className="flex items-center gap-1 text-xs font-bold text-gold hover:underline"><Plus className="h-3 w-3" /> Add</button>
            </div>
            <div className="space-y-2">
              {tasks?.map(t => (
                <label key={t.id} className="flex items-start gap-3 cursor-pointer rounded-xl bg-light-gray/50 p-3 hover:bg-light-gray transition-colors">
                  <input type="checkbox" checked={t.status === 'completed'}
                    onChange={() => updateTask.mutateAsync({ taskId: t.id, data: { status: t.status === 'completed' ? 'pending' : 'completed' } })}
                    className="mt-0.5 h-4 w-4 rounded border-border-gray text-gold focus:ring-gold/20" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold ${t.status === 'completed' ? 'line-through text-medium-gray' : 'text-deep-navy'}`}>{t.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${PRIORITY_COLORS[t.priority]}`}>{PRIORITY_LABELS[t.priority]}</span>
                      {t.dueDate && <span className="text-[10px] text-medium-gray">Due {new Date(t.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
                    </div>
                  </div>
                </label>
              ))}
              {(!tasks || tasks.length === 0) && <p className="text-xs text-medium-gray text-center py-4">No tasks yet.</p>}
            </div>
          </motion.div>

          <button onClick={() => deleteContact.mutateAsync(id).then(() => { window.location.href = '/dashboard/founder/investor-crm' })}
            className="w-full rounded-xl border border-error/20 text-error px-5 py-2.5 text-sm font-bold hover:bg-error/5 transition-all"
          ><Trash2 className="h-4 w-4 inline mr-1.5" /> Delete Contact</button>
        </div>
      </div>

      {showCommForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-deep-navy/40 backdrop-blur-sm p-4"
          onClick={() => setShowCommForm(false)}
        >
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 space-y-4" onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold text-deep-navy">Log Communication</h2><button onClick={() => setShowCommForm(false)} className="p-1 text-medium-gray hover:text-error"><X className="h-5 w-5" /></button></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Type</label><select value={commType} onChange={e => setCommType(e.target.value)} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"><option value="email">Email</option><option value="call">Call</option><option value="meeting">Meeting</option><option value="linkedin">LinkedIn</option></select></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Direction</label><select value={commDirection} onChange={e => setCommDirection(e.target.value)} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"><option value="outbound">Outbound</option><option value="inbound">Inbound</option></select></div>
            </div>
            <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Subject</label><input value={commSubject} onChange={e => setCommSubject(e.target.value)} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>
            <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Summary</label><textarea value={commSummary} onChange={e => setCommSummary(e.target.value)} rows={2} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>
            <button onClick={handleAddComm} disabled={addComm.isPending || !commSubject} className="w-full rounded-xl bg-deep-navy py-3 text-sm font-bold text-white hover:bg-deep-navy-light transition-all disabled:opacity-60">Log Communication</button>
          </motion.div>
        </motion.div>
      )}

      {showMeetingForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-deep-navy/40 backdrop-blur-sm p-4"
          onClick={() => setShowMeetingForm(false)}
        >
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 space-y-4" onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold text-deep-navy">Add Meeting Notes</h2><button onClick={() => setShowMeetingForm(false)} className="p-1 text-medium-gray hover:text-error"><X className="h-5 w-5" /></button></div>
            <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Title</label><input value={meetingTitle} onChange={e => setMeetingTitle(e.target.value)} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>
            <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Date</label><input value={meetingDate} onChange={e => setMeetingDate(e.target.value)} type="datetime-local" className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>
            <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Notes</label><textarea value={meetingNotes} onChange={e => setMeetingNotes(e.target.value)} rows={3} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>
            <button onClick={handleAddMeeting} disabled={addMeeting.isPending || !meetingTitle} className="w-full rounded-xl bg-deep-navy py-3 text-sm font-bold text-white hover:bg-deep-navy-light transition-all disabled:opacity-60">Save Notes</button>
          </motion.div>
        </motion.div>
      )}

      {showTaskForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-deep-navy/40 backdrop-blur-sm p-4"
          onClick={() => setShowTaskForm(false)}
        >
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 space-y-4" onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold text-deep-navy">Add Task</h2><button onClick={() => setShowTaskForm(false)} className="p-1 text-medium-gray hover:text-error"><X className="h-5 w-5" /></button></div>
            <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Task</label><input value={taskTitle} onChange={e => setTaskTitle(e.target.value)} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Due Date</label><input value={taskDue} onChange={e => setTaskDue(e.target.value)} type="date" className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Priority</label><select value={taskPriority} onChange={e => setTaskPriority(e.target.value)} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
            </div>
            <button onClick={handleAddTask} disabled={addTask.isPending || !taskTitle} className="w-full rounded-xl bg-deep-navy py-3 text-sm font-bold text-white hover:bg-deep-navy-light transition-all disabled:opacity-60">Add Task</button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
