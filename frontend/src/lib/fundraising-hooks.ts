import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './api'
import type { FundraisingRound, InvestorPipeline, FundraisingMetric } from './fundraising-types'

export function useFundraisingRounds() {
  return useQuery({
    queryKey: ['fundraising-rounds'],
    queryFn: () => api.get<FundraisingRound[]>('/fundraising/rounds').then(res => res.data),
  })
}

export function useFundraisingRound(id: string) {
  return useQuery({
    queryKey: ['fundraising-round', id],
    queryFn: () => api.get<FundraisingRound>(`/fundraising/rounds/${id}`).then(res => res.data),
    enabled: !!id,
  })
}

export function useCreateRound() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<FundraisingRound>) =>
      api.post<FundraisingRound>('/fundraising/rounds', data).then(res => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fundraising-rounds'] }),
  })
}

export function useUpdateRound() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FundraisingRound> }) =>
      api.put<FundraisingRound>(`/fundraising/rounds/${id}`, data).then(res => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fundraising-rounds'] }),
  })
}

export function useInvestorPipeline(roundId?: string) {
  return useQuery({
    queryKey: ['investor-pipeline', roundId],
    queryFn: () => {
      const url = roundId ? `/fundraising/investors?roundId=${roundId}` : '/fundraising/investors'
      return api.get<InvestorPipeline[]>(url).then(res => res.data)
    },
  })
}

export function useAddInvestor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<InvestorPipeline>) =>
      api.post<InvestorPipeline>('/fundraising/investors', data).then(res => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['investor-pipeline'] }),
  })
}

export function useUpdateInvestorStage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) =>
      api.put(`/fundraising/investors/${id}/stage`, { stage }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['investor-pipeline'] }),
  })
}

export function useFundraisingMetrics() {
  return useQuery({
    queryKey: ['fundraising-metrics'],
    queryFn: () => api.get<FundraisingMetric>('/fundraising/metrics').then(res => res.data),
  })
}
