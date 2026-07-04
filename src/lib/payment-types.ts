export interface PaymentMethod {
  id: string
  type: 'card' | 'bank' | 'upi' | 'wallet'
  label: string
  isDefault: boolean
  lastFour?: string
  bankName?: string
  upiId?: string
  expiresAt?: string
}

export interface Transaction {
  id: string
  type: 'subscription' | 'service_fee' | 'payout' | 'refund' | 'other'
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  description: string
  paymentMethod?: string
  invoiceUrl?: string
  createdAt: string
}

export interface Invoice {
  id: string
  number: string
  amount: number
  currency: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  description: string
  dueDate: string
  paidAt?: string
  items: InvoiceItem[]
}

export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export const TRANSACTION_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'text-warning bg-warning/10' },
  { value: 'completed', label: 'Completed', color: 'text-success bg-success/10' },
  { value: 'failed', label: 'Failed', color: 'text-error bg-error/10' },
  { value: 'refunded', label: 'Refunded', color: 'text-medium-gray bg-medium-gray/10' },
] as const

export const INVOICE_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'text-medium-gray bg-medium-gray/10' },
  { value: 'sent', label: 'Sent', color: 'text-blue-600 bg-blue-100' },
  { value: 'paid', label: 'Paid', color: 'text-success bg-success/10' },
  { value: 'overdue', label: 'Overdue', color: 'text-error bg-error/10' },
  { value: 'cancelled', label: 'Cancelled', color: 'text-medium-gray bg-medium-gray/10' },
] as const
