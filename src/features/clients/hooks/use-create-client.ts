import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import { tdoApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'
import type { NewClientFormData } from '@/types/client.types'

interface CreateClientPayload {
  tenantId: string
  clientName: string
  clientType: string
  avatarUrl: string
  phone: string
  email: string
  addressLine1: string
  addressLine2: string
  suburb: string
  state: string
  postcode: string
  country: string
  abn: string
  paymentTerms: string
  isGSTRegistered: boolean
  notes: string
  contact: {
    isPrimary: boolean
    name: string
    // API contract spells this "moile" (not "mobile") — must match exactly.
    moile: string
    email: string
  }
}

function buildPayload(data: NewClientFormData, tenantId: string): CreateClientPayload {
  return {
    tenantId,
    clientName: data.clientName,
    clientType: data.clientType,
    avatarUrl: '',
    phone: data.phone || '',
    email: data.email || '',
    addressLine1: data.address || '',
    addressLine2: '',
    suburb: '',
    state: '',
    postcode: '',
    country: 'Australia',
    abn: data.abn || '',
    paymentTerms: data.paymentTerms || '',
    isGSTRegistered: data.defaultGst === 'Tax Registered',
    notes: data.notes || '',
    contact: {
      isPrimary: true,
      name: data.primaryContactSameAsClient ? data.clientName : data.contactName,
      moile: (data.primaryContactSameAsClient ? data.phone : data.contactMobile) || '',
      email: (data.primaryContactSameAsClient ? data.email : data.contactEmail) || '',
    },
  }
}

export function useCreateClient() {
  const tenantId = useAuthStore((s) => s.tenantId)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: NewClientFormData) =>
      tdoApi.post('/api/clients', buildPayload(data, tenantId ?? '')).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', tenantId] })
      toast.success('Client created successfully.')
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const raw = error.response?.data
        const data = typeof raw === 'object' && raw !== null ? raw : null
        const msg =
          (typeof raw === 'string' && raw) ||
          data?.message ||
          data?.title ||
          Object.values(data?.errors ?? {}).flat().join(' ') ||
          'Failed to create client.'
        toast.error(String(msg))
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    },
  })
}
