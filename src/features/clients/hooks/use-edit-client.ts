import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import { tdoApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'
import type { EditClientFormData } from '@/types/client.types'

interface EditClientPayload {
  name: string
  clientType: string
  email: string
  phone: string
  avatarUrl: string
  status: string
  isGSTRegistered: boolean
  abn: string
  paymentTerms: string
  notes: string
  addressLine1: string
  addressLine2: string
  suburb: string
  // DB CHECK: NT/ACT/TAS/WA/SA/QLD/VIC/NSW or NULL — never an empty string.
  state: string | null
  postcode: string
  country: string
}

function buildPayload(data: EditClientFormData): EditClientPayload {
  return {
    name: data.clientName,
    // DB CHECK allows only lowercase 'residential' / 'commercial'.
    clientType: data.clientType.toLowerCase(),
    email: data.email || '',
    phone: data.phone || '',
    avatarUrl: '',
    status: data.status.toLowerCase(),
    isGSTRegistered: data.gstStatus === 'Tax Registered',
    // DB CHECK rejects anything but digits — strip spaces/dashes people type when formatting an ABN.
    abn: data.abn?.replace(/\D/g, '') || '',
    paymentTerms: data.paymentTerms || '',
    notes: data.notes || '',
    addressLine1: data.address || '',
    addressLine2: '',
    suburb: '',
    state: null,
    postcode: '',
    country: 'AU',
  }
}

interface EditClientArgs {
  clientId: string
  data: EditClientFormData
}

export function useEditClient() {
  const tenantId = useAuthStore((s) => s.tenantId)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ clientId, data }: EditClientArgs) =>
      tdoApi.put(`/api/Clients/${clientId}`, buildPayload(data)).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', tenantId] })
      toast.success('Client updated successfully.')
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
          'Failed to update client.'
        toast.error(String(msg))
      } else if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    },
  })
}
