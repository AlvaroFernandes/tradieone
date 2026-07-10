import { z } from 'zod'

export const CLIENT_TYPES = ['Commercial', 'Residential'] as const
export type ClientType = (typeof CLIENT_TYPES)[number]

export const PAYMENT_TERMS = ['Due on Receipt', '7 Days', '14 Days', '30 Days'] as const
export const GST_OPTIONS = ['Tax Registered', 'Not Registered'] as const

export const newClientSchema = z
  .object({
    clientName: z.string().min(1, 'Client name is required'),
    clientType: z.enum(CLIENT_TYPES, { error: () => ({ message: 'Select a client type' }) }),
    email: z.email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional(),
    abn: z.string().optional(),
    paymentTerms: z.string().optional(),
    defaultGst: z.string().optional(),
    notes: z.string().optional(),
    primaryContactSameAsClient: z.boolean(),
    contactName: z.string().min(1, 'Contact name is required'),
    contactMobile: z.string().optional(),
    contactEmail: z.email('Invalid email address').optional().or(z.literal('')),
  })
  .refine((data) => data.clientType !== 'Commercial' || !!data.abn?.trim(), {
    message: 'ABN is required for commercial clients',
    path: ['abn'],
  })

export type NewClientFormData = z.infer<typeof newClientSchema>

export interface ClientRow {
  id: string
  initials: string
  name: string
  contactName: string
  contactEmail: string
  type: ClientType
  projects: number
  jobs: number
  outstanding: number
  invoiceLabel: string
  status: 'Active' | 'Inactive'
}

export interface ClientDetail {
  id: string
  initials: string
  name: string
  type: ClientType
  status: 'Active' | 'Inactive'
  clientSinceLabel: string
  phone: string | null
  email: string | null
  address: string | null
  abn: string | null
  paymentTerms: string | null
  contact: {
    name: string
    jobTitle: string | null
    email: string | null
    phone: string | null
    mobile: string | null
  }
  notes: string | null
  totals: {
    contacts: number
    projects: number
    jobs: number
    totalInvoices: number
    paidInvoices: number
    overdueInvoices: number
    totalInvoiceAmount: number
    paidAmount: number
    outstandingAmount: number
  }
}
