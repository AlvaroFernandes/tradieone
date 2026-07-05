import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import { tdoApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'

export function useConfirmFreePlan(onSuccess: () => void) {
  const tenantId = useAuthStore((s) => s.tenantId)

  return useMutation({
    mutationFn: () =>
      tdoApi
        .post('/api/Subscriptions/upgrade', {
          tenantId,
          subscriptionTier: 'FreeForever',
          maxTeamMembers: 1,
          maxInvoicesPerMonth: 10,
          pricePerMonth: 0,
          amountCharged: 0,
          amountGST: 0,
          totalAmount: 0,
          paymentStatus: 'NotApplicable',
          stripePaymentIntentId: '',
          cardLast4: '',
          receiptUrl: '',
        })
        .then((r) => r.data),
    onSuccess,
    onError: (error) => {
      if (isAxiosError(error)) {
        const raw = error.response?.data
        const data = typeof raw === 'object' && raw !== null ? raw : null
        const msg =
          (typeof raw === 'string' && raw) ||
          data?.message ||
          data?.title ||
          Object.values(data?.errors ?? {}).flat().join(' ') ||
          'Failed to confirm your plan.'
        toast.error(String(msg))
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    },
  })
}
