import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './api'
import type { CapitalProvider, CapitalRequest } from './capital-types'

export function useCapitalProviders() {
  return useQuery({
    queryKey: ['capital-providers'],
    queryFn: () => api.get<CapitalProvider[]>('/capital/providers').then(res => res.data),
  })
}

export function useCapitalProvider(id: string) {
  return useQuery({
    queryKey: ['capital-provider', id],
    queryFn: () => api.get<CapitalProvider>(`/capital/providers/${id}`).then(res => res.data),
    enabled: !!id,
  })
}

export function useMyCapitalRequests() {
  return useQuery({
    queryKey: ['my-capital-requests'],
    queryFn: () => api.get<CapitalRequest[]>('/capital/my-requests').then(res => res.data),
  })
}

export function useSubmitCapitalRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<CapitalRequest>) =>
      api.post<CapitalRequest>('/capital/requests', data).then(res => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-capital-requests'] }),
  })
}
