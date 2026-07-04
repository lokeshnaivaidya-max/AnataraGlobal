import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './api'
import type { InvestorContact, CommunicationLog, MeetingNote, InvestorTask } from './investor-crm-types'

export function useInvestorContacts() {
  return useQuery({
    queryKey: ['investor-contacts'],
    queryFn: () => api.get<InvestorContact[]>('/investor-crm/contacts').then(res => res.data),
  })
}

export function useInvestorContact(id: string) {
  return useQuery({
    queryKey: ['investor-contact', id],
    queryFn: () => api.get<InvestorContact>(`/investor-crm/contacts/${id}`).then(res => res.data),
    enabled: !!id,
  })
}

export function useCreateContact() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<InvestorContact>) =>
      api.post<InvestorContact>('/investor-crm/contacts', data).then(res => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['investor-contacts'] }),
  })
}

export function useUpdateContact() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InvestorContact> }) =>
      api.put<InvestorContact>(`/investor-crm/contacts/${id}`, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investor-contacts'] })
      queryClient.invalidateQueries({ queryKey: ['investor-contact'] })
    },
  })
}

export function useDeleteContact() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/investor-crm/contacts/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['investor-contacts'] }),
  })
}

export function useCommunications(contactId: string) {
  return useQuery({
    queryKey: ['communications', contactId],
    queryFn: () => api.get<CommunicationLog[]>(`/investor-crm/contacts/${contactId}/communications`).then(res => res.data),
    enabled: !!contactId,
  })
}

export function useAddCommunication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ contactId, data }: { contactId: string; data: Partial<CommunicationLog> }) =>
      api.post(`/investor-crm/contacts/${contactId}/communications`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['communications'] }),
  })
}

export function useMeetingNotes(contactId: string) {
  return useQuery({
    queryKey: ['meeting-notes', contactId],
    queryFn: () => api.get<MeetingNote[]>(`/investor-crm/contacts/${contactId}/meetings`).then(res => res.data),
    enabled: !!contactId,
  })
}

export function useAddMeetingNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ contactId, data }: { contactId: string; data: Partial<MeetingNote> }) =>
      api.post(`/investor-crm/contacts/${contactId}/meetings`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meeting-notes'] }),
  })
}

export function useInvestorTasks(contactId: string) {
  return useQuery({
    queryKey: ['investor-tasks', contactId],
    queryFn: () => api.get<InvestorTask[]>(`/investor-crm/contacts/${contactId}/tasks`).then(res => res.data),
    enabled: !!contactId,
  })
}

export function useAddTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ contactId, data }: { contactId: string; data: Partial<InvestorTask> }) =>
      api.post(`/investor-crm/contacts/${contactId}/tasks`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['investor-tasks'] }),
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: Partial<InvestorTask> }) =>
      api.put(`/investor-crm/tasks/${taskId}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['investor-tasks'] }),
  })
}
