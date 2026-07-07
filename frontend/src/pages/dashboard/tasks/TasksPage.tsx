import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, CheckSquare, Plus, X, Calendar, Trash2 } from 'lucide-react'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../../../lib/task-hooks'
import { TASK_PRIORITIES, DEFAULT_TASK_LISTS } from '../../../lib/task-types'

export default function TasksPage() {
  const { data: tasks, isLoading, refetch } = useTasks()
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newPriority, setNewPriority] = useState('medium')
  const [newListId, setNewListId] = useState('todo')
  const [newDue, setNewDue] = useState('')
  const [successMsg, setSuccessMsg] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const columns = DEFAULT_TASK_LISTS.map(list => ({
    ...list,
    tasks: tasks?.filter(t => t.status === list.id) || [],
  }))

  const handleCreate = async () => {
    if (!newTitle) return
    setSuccessMsg(false)
    setErrorMsg('')
    try {
      await createTask.mutateAsync({ 
        title: newTitle, 
        priority: newPriority as any, 
        status: newListId as any, 
        listId: newListId, 
        dueDate: newDue || undefined, 
        labels: [], 
        attachments: 0, 
        comments: 0 
      } as any)
      setSuccessMsg(true)
      setNewTitle('')
      setNewPriority('medium')
      setNewListId('todo')
      setNewDue('')
      refetch()
      setTimeout(() => {
        setShowForm(false)
        setSuccessMsg(false)
      }, 1500)
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to create task.'
      setErrorMsg(msg)
    }
  }

  const moveTask = (taskId: string, newStatus: string) => {
    updateTask.mutateAsync({ id: taskId, data: { status: newStatus as any, listId: newStatus } })
  }

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckSquare className="h-6 w-6 text-gold" />
          <div><h1 className="text-2xl font-extrabold text-deep-navy">Tasks</h1><p className="text-sm text-medium-gray">Manage your tasks and workflow.</p></div>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-light px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-gold/20 hover:shadow-xl transition-all"
        ><Plus className="h-4 w-4" /> Add Task</button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(col => (
          <div key={col.id} className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-light-gray/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                <span className="text-sm font-bold text-deep-navy">{col.name}</span>
              </div>
              <span className="text-xs font-bold text-medium-gray">{col.tasks.length}</span>
            </div>
            <div className="space-y-2 min-h-[100px]">
              {col.tasks.map((task, i) => {
                const priDef = TASK_PRIORITIES.find(p => p.value === task.priority)
                return (
                  <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className="rounded-xl border border-border-gray bg-white p-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-xs font-bold text-deep-navy flex-1">{task.title}</p>
                      <button onClick={() => deleteTask.mutateAsync(task.id)} className="p-0.5 text-medium-gray/40 hover:text-error transition-colors"><Trash2 className="h-3 w-3" /></button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${priDef?.color || ''}`}>{task.priority}</span>
                      {task.dueDate && <span className="flex items-center gap-0.5 text-[10px] text-medium-gray"><Calendar className="h-3 w-3" />{new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
                    </div>
                    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border-gray">
                      {col.id !== 'todo' && <button onClick={() => moveTask(task.id, col.id === 'done' ? 'review' : 'todo')} className="text-[10px] text-medium-gray hover:text-deep-navy transition-colors">←</button>}
                      <span className="flex-1" />
                      {col.id !== 'done' && <button onClick={() => moveTask(task.id, col.id === 'todo' ? 'in_progress' : col.id === 'in_progress' ? 'review' : 'done')} className="text-[10px] text-medium-gray hover:text-deep-navy transition-colors">→</button>}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {(!tasks || tasks.length === 0) && (
        <div className="text-center py-16"><CheckSquare className="h-12 w-12 text-medium-gray/20 mx-auto mb-3" /><p className="text-sm font-semibold text-medium-gray">No tasks yet</p><p className="text-xs text-medium-gray/60 mt-1">Add your first task to get started.</p></div>
      )}

      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-deep-navy/40 backdrop-blur-sm p-4"
          onClick={() => setShowForm(false)}
        >
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 space-y-4" onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold text-deep-navy">New Task</h2><button onClick={() => setShowForm(false)} className="p-1 text-medium-gray hover:text-error"><X className="h-5 w-5" /></button></div>
            
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-success/20 bg-success/10 px-4 py-2.5 text-sm text-success font-medium"
              >
                Task created successfully!
              </motion.div>
            )}

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-error/20 bg-error/10 px-4 py-2.5 text-sm text-error font-medium"
              >
                {errorMsg}
              </motion.div>
            )}

            <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Title</label><input value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" placeholder="What needs to be done?" /></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">List</label><select value={newListId} onChange={e => setNewListId(e.target.value)} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all">
                {DEFAULT_TASK_LISTS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Priority</label><select value={newPriority} onChange={e => setNewPriority(e.target.value)} className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all">
                {TASK_PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select></div>
            </div>
            <div><label className="text-xs font-semibold uppercase tracking-wider text-medium-gray mb-1.5 block">Due Date</label><input value={newDue} onChange={e => setNewDue(e.target.value)} type="date" className="w-full rounded-xl border border-border-gray bg-light-gray/50 px-4 py-3 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all" /></div>
            <button onClick={handleCreate} disabled={createTask.isPending || !newTitle || successMsg}
              className="w-full rounded-xl bg-gradient-to-r from-gold to-gold-light py-3 text-sm font-bold text-white shadow-lg shadow-gold/20 hover:shadow-xl transition-all disabled:opacity-60 cursor-pointer"
            >{createTask.isPending ? <Loader2 className="h-4 w-4 animate-spin inline" /> : 'Create Task'}</button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
