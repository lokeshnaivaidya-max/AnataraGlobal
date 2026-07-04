import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './api'
import type { Event, EventRegistration } from './event-types'

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => api.get<Event[]>('/events').then(res => res.data),
  })
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => api.get<Event>(`/events/${id}`).then(res => res.data),
    enabled: !!id,
  })
}

export function useMyRegistrations() {
  return useQuery({
    queryKey: ['my-registrations'],
    queryFn: () => api.get<EventRegistration[]>('/events/my-registrations').then(res => res.data),
  })
}

export function useRegisterForEvent() {
  return useMutation({
    mutationFn: (eventId: string) => api.post(`/events/${eventId}/register`),
  })
}

export function useCancelRegistration() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (eventId: string) => api.delete(`/events/${eventId}/register`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-registrations'] }),
  })
}
