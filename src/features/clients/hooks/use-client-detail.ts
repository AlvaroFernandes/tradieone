import { useQuery } from '@tanstack/react-query'
import { tdoApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'
import type { ClientDto } from './use-clients'
import { getInitials } from './use-clients'
import type { ClientDetail, ClientType } from '@/types/client.types'

function formatAddress(dto: ClientDto): string | null {
  const parts = [dto.addressLine1, dto.addressLine2, dto.suburb, dto.state, dto.postcode, dto.country]
    .map((p) => p?.trim())
    .filter(Boolean)
  return parts.length ? parts.join(', ') : null
}

function formatClientSince(createdOnUtc: string): string {
  const date = new Date(createdOnUtc)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })
}

export function mapClientDtoToDetail(dto: ClientDto): ClientDetail {
  const name = dto.name?.trim() || 'Unnamed client'
  const outstanding = dto.outstandingAmount ?? 0
  return {
    id: String(dto.clientId),
    initials: getInitials(name),
    name,
    type: dto.clientType === 'Residential' ? 'Residential' : ('Commercial' as ClientType),
    status: dto.status === 'Inactive' ? 'Inactive' : 'Active',
    clientSinceLabel: formatClientSince(dto.createdOnUtc),
    phone: dto.phone?.trim() || null,
    email: dto.email?.trim() || null,
    address: formatAddress(dto),
    abn: dto.abn?.trim() || null,
    paymentTerms: dto.paymentTerms?.trim() || null,
    contact: {
      name: dto.contact?.trim() || name,
      jobTitle: dto.jobTitle?.trim() || null,
      email: dto.email?.trim() || null,
      phone: dto.phone?.trim() || null,
      mobile: dto.mobile?.trim() || null,
    },
    notes: dto.notes?.trim() || null,
    totals: {
      contacts: dto.totalContacts,
      projects: dto.totalProjects,
      jobs: dto.totalJobs,
      totalInvoices: dto.totalInvoice,
      paidInvoices: dto.totalPaidInvoice,
      overdueInvoices: dto.totalOutstandingInvoices,
      totalInvoiceAmount: dto.totalAmount ?? 0,
      paidAmount: dto.paidAmount,
      outstandingAmount: outstanding,
    },
  }
}

export function useClientDetail(clientId: string | undefined) {
  const tenantId = useAuthStore((s) => s.tenantId)

  return useQuery({
    queryKey: ['clients', tenantId],
    queryFn: () =>
      tdoApi.get<ClientDto[]>('/api/Clients', { params: { tenantId } }).then((r) => r.data),
    enabled: !!tenantId && !!clientId,
    select: (data) => {
      const dto = data.find((c) => String(c.clientId) === clientId)
      return dto ? mapClientDtoToDetail(dto) : undefined
    },
  })
}
