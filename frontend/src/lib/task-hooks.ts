import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './api'
import type { Task } from './task-types'

export function useTasks(listId?: string) {
  return useQuery({
    queryKey: ['tasks', listId],
    queryFn: () => {
      const url = listId ? `/tasks?listId=${listId}` : '/tasks'
      return api.get<Task[]>(url).then(res => res.data)
    },
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Task>) => api.post<Task>('/tasks', data).then(res => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
      api.put<Task>(`/tasks/${id}`, data).then(res => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })
}
