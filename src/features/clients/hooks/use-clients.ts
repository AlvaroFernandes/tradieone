import { useQuery } from '@tanstack/react-query'
import { tdoApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'
import type { ClientRow, ClientType } from '@/types/client.types'

export interface ClientDto {
  tenantId: string
  clientId: number
  name: string | null
  status: string | null
  clientType: string | null
  createdOnUtc: string
  phone: string | null
  mobile: string | null
  email: string | null
  addressLine1: string | null
  addressLine2: string | null
  suburb: string | null
  state: string | null
  postcode: string | null
  country: string | null
  abn: string | null
  paymentTerms: string | null
  contact: string | null
  jobTitle: string | null
  notes: string | null
  totalContacts: number
  totalProjects: number
  totalJobs: number
  totalPaidInvoice: number
  totalOutstandingInvoices: number
  paidAmount: number
  outstandingAmount: number | null
  totalInvoice: number
  totalAmount: number | null
}

function getInitials(name: string) {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .join('')
      .slice(0, 3)
      .toUpperCase() || '—'
  )
}

export function mapClientDtoToRow(dto: ClientDto): ClientRow {
  const name = dto.name?.trim() || 'Unnamed client'
  const outstanding = dto.outstandingAmount ?? 0
  return {
    id: String(dto.clientId),
    initials: getInitials(name),
    name,
    contactName: dto.contact?.trim() || name,
    contactEmail: dto.email?.trim() || '—',
    type: dto.clientType === 'Residential' ? 'Residential' : ('Commercial' as ClientType),
    projects: dto.totalProjects,
    jobs: dto.totalJobs,
    outstanding,
    invoiceLabel:
      outstanding > 0
        ? `${dto.totalOutstandingInvoices} invoice${dto.totalOutstandingInvoices === 1 ? '' : 's'}`
        : 'Up to date',
    status: dto.status === 'Inactive' ? 'Inactive' : 'Active',
  }
}

export function useClients() {
  const tenantId = useAuthStore((s) => s.tenantId)

  return useQuery({
    queryKey: ['clients', tenantId],
    queryFn: () =>
      tdoApi.get<ClientDto[]>('/api/Clients', { params: { tenantId } }).then((r) => r.data),
    enabled: !!tenantId,
    select: (data) => data.map(mapClientDtoToRow),
  })
}
