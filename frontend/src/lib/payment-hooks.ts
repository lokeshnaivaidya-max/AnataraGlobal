import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './api'
import type { PaymentMethod, Transaction, Invoice } from './payment-types'

export function usePaymentMethods() {
  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: () => api.get<PaymentMethod[]>('/payments/methods').then(res => res.data),
  })
}

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: () => api.get<Transaction[]>('/payments/transactions').then(res => res.data),
  })
}

export function useInvoices() {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: () => api.get<Invoice[]>('/payments/invoices').then(res => res.data),
  })
}

export function useAddPaymentMethod() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<PaymentMethod>) =>
      api.post<PaymentMethod>('/payments/methods', data).then(res => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payment-methods'] }),
  })
}

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/payments/methods/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payment-methods'] }),
  })
}
