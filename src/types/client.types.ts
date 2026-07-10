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

export const CONTACT_TYPES = ['Management', 'Billing', 'Site Contact', 'Other'] as const
export type ContactType = (typeof CONTACT_TYPES)[number]

export const contactSchema = z.object({
  name: z.string().min(1, 'Contact name is required'),
  jobTitle: z.string().optional(),
  contactType: z.enum(CONTACT_TYPES, { error: () => ({ message: 'Select a contact type' }) }),
  email: z.email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  isPrimary: z.boolean(),
})

export type ContactFormData = z.infer<typeof contactSchema>

export interface ContactRow {
  id: string
  initials: string
  name: string
  jobTitle: string | null
  contactType: ContactType
  email: string | null
  phone: string | null
  mobile: string | null
  isPrimary: boolean
}

export const CLIENT_STATUSES = ['Active', 'Inactive'] as const
export type ClientStatus = (typeof CLIENT_STATUSES)[number]

export const editClientSchema = z
  .object({
    clientName: z.string().min(1, 'Client name is required'),
    clientType: z.enum(CLIENT_TYPES, { error: () => ({ message: 'Select a client type' }) }),
    status: z.enum(CLIENT_STATUSES),
    email: z.email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional(),
    abn: z.string().optional(),
    paymentTerms: z.string().optional(),
    gstStatus: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine((data) => data.clientType !== 'Commercial' || !!data.abn?.trim(), {
    message: 'ABN is required for commercial clients',
    path: ['abn'],
  })

export type EditClientFormData = z.infer<typeof editClientSchema>

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
  addressLines: string[] | null
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
