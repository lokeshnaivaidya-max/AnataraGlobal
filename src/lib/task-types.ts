export interface Task {
  id: string
  title: string
  description?: string
  listId: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'todo' | 'in_progress' | 'review' | 'done'
  assignee?: string
  dueDate?: string
  labels: string[]
  attachments: number
  comments: number
  createdAt: string
  updatedAt: string
}

export interface TaskList {
  id: string
  name: string
  color: string
  taskCount: number
}

export const TASK_PRIORITIES = [
  { value: 'urgent', label: 'Urgent', color: 'text-error bg-error/10' },
  { value: 'high', label: 'High', color: 'text-warning bg-warning/10' },
  { value: 'medium', label: 'Medium', color: 'text-gold bg-gold/10' },
  { value: 'low', label: 'Low', color: 'text-medium-gray bg-medium-gray/10' },
] as const

export const TASK_STATUSES = ['todo', 'in_progress', 'review', 'done'] as const

export const TASK_STATUS_LABELS: Record<string, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done',
}

export const DEFAULT_TASK_LISTS: TaskList[] = [
  { id: 'todo', name: 'To Do', color: '#94a3b8', taskCount: 0 },
  { id: 'in_progress', name: 'In Progress', color: '#f59e0b', taskCount: 0 },
  { id: 'review', name: 'Review', color: '#8b5cf6', taskCount: 0 },
  { id: 'done', name: 'Done', color: '#22c55e', taskCount: 0 },
]
