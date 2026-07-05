import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './api'
import type { KnowledgeResource } from './knowledge-types'

export function useResources(category?: string) {
  return useQuery({
    queryKey: ['resources', category],
    queryFn: () => {
      const url = category ? `/knowledge?category=${category}` : '/knowledge'
      return api.get<KnowledgeResource[]>(url).then(res => res.data)
    },
  })
}

export function useResource(id: string) {
  return useQuery({
    queryKey: ['resource', id],
    queryFn: () => api.get<KnowledgeResource>(`/knowledge/${id}`).then(res => res.data),
    enabled: !!id,
  })
}

export function useToggleBookmark() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.post(`/knowledge/${id}/bookmark`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resources'] }),
  })
}
