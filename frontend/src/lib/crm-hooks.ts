import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './api'
import type { Lead, LeadActivity } from './crm-types'

export function useLeads() {
  return useQuery({
    queryKey: ['leads'],
    queryFn: () => api.get<Lead[]>('/crm/leads').then(res => res.data),
  })
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: () => api.get<Lead>(`/crm/leads/${id}`).then(res => res.data),
    enabled: !!id,
  })
}

export function useCreateLead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Lead>) => api.post<Lead>('/crm/leads', data).then(res => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  })
}

export function useUpdateLead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lead> }) =>
      api.put<Lead>(`/crm/leads/${id}`, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['lead'] })
    },
  })
}

export function useDeleteLead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/crm/leads/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  })
}

export function useLeadActivities(leadId: string) {
  return useQuery({
    queryKey: ['lead-activities', leadId],
    queryFn: () => api.get<LeadActivity[]>(`/crm/leads/${leadId}/activities`).then(res => res.data),
    enabled: !!leadId,
  })
}

export function useAddLeadActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ leadId, data }: { leadId: string; data: Partial<LeadActivity> }) =>
      api.post(`/crm/leads/${leadId}/activities`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lead-activities'] }),
  })
}
