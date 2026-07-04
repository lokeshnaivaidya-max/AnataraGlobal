import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './api'
import type { Partner, PartnershipRequest } from './partner-types'

export function usePartners() {
  return useQuery({
    queryKey: ['partners'],
    queryFn: () => api.get<Partner[]>('/partners').then(res => res.data),
  })
}

export function usePartner(id: string) {
  return useQuery({
    queryKey: ['partner', id],
    queryFn: () => api.get<Partner>(`/partners/${id}`).then(res => res.data),
    enabled: !!id,
  })
}

export function useMyPartnerships() {
  return useQuery({
    queryKey: ['my-partnerships'],
    queryFn: () => api.get<PartnershipRequest[]>('/partners/my-requests').then(res => res.data),
  })
}

export function useRequestPartnership() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ partnerId, message }: { partnerId: string; message?: string }) =>
      api.post(`/partners/${partnerId}/request`, { message }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-partnerships'] }),
  })
}
