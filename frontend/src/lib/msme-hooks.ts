import { useMutation, useQuery } from '@tanstack/react-query'
import api from './api'
import type {
  MSME,
  GSTDetail,
  Turnover,
  EmployeeInfo,
  ExportStatus,
  FinancialHealth,
  ComplianceStatus,
} from './msme-types'

export function useMsmeProfile() {
  return useQuery({
    queryKey: ['msme-profile'],
    queryFn: () => api.get<MSME>('/msme/profile').then(res => res.data),
  })
}

export function useUpdateMsmeProfile() {
  return useMutation({
    mutationFn: (data: Partial<MSME>) =>
      api.put<MSME>('/msme/profile', data).then(res => res.data),
  })
}

export function useGstDetails() {
  return useQuery({
    queryKey: ['msme-gst'],
    queryFn: () => api.get<GSTDetail>('/msme/gst').then(res => res.data),
  })
}

export function useUpdateGst() {
  return useMutation({
    mutationFn: (data: Partial<GSTDetail>) =>
      api.put<GSTDetail>('/msme/gst', data).then(res => res.data),
  })
}

export function useTurnoverHistory() {
  return useQuery({
    queryKey: ['msme-turnover'],
    queryFn: () => api.get<Turnover[]>('/msme/turnover').then(res => res.data),
  })
}

export function useAddTurnover() {
  return useMutation({
    mutationFn: (data: Omit<Turnover, 'id'>) =>
      api.post<Turnover>('/msme/turnover', data).then(res => res.data),
  })
}

export function useEmployeeInfo() {
  return useQuery({
    queryKey: ['msme-employees'],
    queryFn: () => api.get<EmployeeInfo>('/msme/employees').then(res => res.data),
  })
}

export function useUpdateEmployees() {
  return useMutation({
    mutationFn: (data: Omit<EmployeeInfo, 'id' | 'msmeId'>) =>
      api.put<EmployeeInfo>('/msme/employees', data).then(res => res.data),
  })
}

export function useExportStatus() {
  return useQuery({
    queryKey: ['msme-export'],
    queryFn: () => api.get<ExportStatus>('/msme/export-status').then(res => res.data),
  })
}

export function useUpdateExportStatus() {
  return useMutation({
    mutationFn: (data: Partial<ExportStatus>) =>
      api.put<ExportStatus>('/msme/export-status', data).then(res => res.data),
  })
}

export function useFinancialHealth() {
  return useQuery({
    queryKey: ['msme-financial-health'],
    queryFn: () => api.get<FinancialHealth>('/msme/financial-health').then(res => res.data),
  })
}

export function useComplianceStatus() {
  return useQuery({
    queryKey: ['msme-compliance'],
    queryFn: () => api.get<ComplianceStatus>('/msme/compliance').then(res => res.data),
  })
}
