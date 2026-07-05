import { useMutation, useQuery } from '@tanstack/react-query'
import api from './api'
import type { VentureReadiness, ReadinessResponse } from './venture-readiness-types'

export function useVentureReadiness() {
  return useQuery({
    queryKey: ['venture-readiness'],
    queryFn: () => api.get<VentureReadiness>('/venture-readiness').then(res => res.data),
  })
}

export function useSubmitAssessment() {
  return useMutation({
    mutationFn: (responses: ReadinessResponse[]) =>
      api.post<VentureReadiness>('/venture-readiness/assess', { responses }).then(res => res.data),
  })
}

export function useRequestReassessment() {
  return useMutation({
    mutationFn: () =>
      api.post<VentureReadiness>('/venture-readiness/reassess').then(res => res.data),
  })
}
