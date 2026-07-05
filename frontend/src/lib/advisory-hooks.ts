import { useMutation, useQuery } from '@tanstack/react-query'
import api from './api'
import type { Advisor, AdvisorSession, BookingRequest } from './advisory-types'

export function useAdvisors() {
  return useQuery({
    queryKey: ['advisors'],
    queryFn: () => api.get<Advisor[]>('/advisors').then(res => res.data),
  })
}

export function useAdvisor(id: string) {
  return useQuery({
    queryKey: ['advisor', id],
    queryFn: () => api.get<Advisor>(`/advisors/${id}`).then(res => res.data),
    enabled: !!id,
  })
}

export function useMySessions() {
  return useQuery({
    queryKey: ['my-sessions'],
    queryFn: () => api.get<AdvisorSession[]>('/advisors/sessions').then(res => res.data),
  })
}

export function useBookSession() {
  return useMutation({
    mutationFn: (data: BookingRequest) =>
      api.post<AdvisorSession>('/advisors/book', data).then(res => res.data),
  })
}

export function useCancelSession() {
  return useMutation({
    mutationFn: (sessionId: string) =>
      api.delete(`/advisors/sessions/${sessionId}`).then(res => res.data),
  })
}
