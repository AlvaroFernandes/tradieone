import { useState } from 'react'
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import type { StripeCardNumberElementOptions } from '@stripe/stripe-js'
import { Lock, Rocket, ShieldCheck, X } from 'lucide-react'
import { toast } from 'sonner'
import { stripePromise } from '@/lib/stripe'
import { useAuthStore } from '@/store/auth.store'
import { cn } from '@/lib/utils'
import { annualEquivalent, type PlanTier } from '@/features/auth/constants/plans'
import type { BillingCycle } from '@/features/auth/pages/upgrade-plan-page'

const GST_RATE = 0.1

const ELEMENT_STYLE: StripeCardNumberElementOptions['style'] = {
  base: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    color: '#1c1b1b',
    '::placeholder': { color: '#c2c6d8' },
  },
  invalid: { color: '#ef4444' },
}

interface PlanPaymentModalProps {
  plan: PlanTier
  billingCycle: BillingCycle
  onClose: () => void
}

export function PlanPaymentModal({ plan, billingCycle, onClose }: PlanPaymentModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative grid w-full max-w-[900px] grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-2xl sm:grid-cols-[1fr_340px]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-[#9ca3af] hover:bg-gray-100 hover:text-[#1c1b1b]"
        >
          <X className="h-5 w-5" />
        </button>

        <Elements stripe={stripePromise}>
          <PaymentForm plan={plan} billingCycle={billingCycle} onClose={onClose} />
        </Elements>

        <SummaryPanel plan={plan} billingCycle={billingCycle} onClose={onClose} />
      </div>
    </div>
  )
}

function PaymentForm({
  plan,
  onClose,
}: {
  plan: PlanTier
  billingCycle: BillingCycle
  onClose: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const user = useAuthStore((s) => s.user)

  const [email, setEmail] = useState(user?.email ?? '')
  const [cardHolderName, setCardHolderName] = useState('')
  const [billingAddressMode, setBillingAddressMode] = useState<'same' | 'different'>('different')
  const [address, setAddress] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    if (!email || !cardHolderName || (billingAddressMode === 'different' && !address)) {
      toast.error('Please fill in all required fields.')
      return
    }

    const cardNumberElement = elements.getElement(CardNumberElement)
    if (!cardNumberElement) return

    setIsSubmitting(true)
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement,
      billing_details: {
        name: cardHolderName,
        email,
        address: billingAddressMode === 'different' ? { line1: address, country: 'AU' } : undefined,
      },
    })

    if (error) {
      toast.error(error.message ?? 'Failed to process card details.')
      setIsSubmitting(false)
      return
    }

    // Tokenization succeeded — paymentMethod.id is ready to send to the backend.
    // The subscription charge flow (create + confirm the PaymentIntent server-side
    // for plan "${plan.apiTier}") is not wired up yet: pending the backend endpoint
    // that creates a PaymentIntent from this payment method.
    console.info('Stripe payment method created:', paymentMethod.id)
    toast.info('Card verified. Payment processing is not connected to the backend yet.')
    setIsSubmitting(false)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-8 sm:p-10">
      <div className="space-y-1">
        <h2 className="font-manrope text-3xl font-bold text-[#1c1b1b]">Payment Information</h2>
        <p className="font-inter text-sm text-[#424656]">
          Confirm your subscription details to get started.
        </p>
      </div>

      <FormField label="Email for Receipt" hint="(will receive payment confirmation)">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john.smith@example.com"
          className={inputClass()}
        />
      </FormField>

      <FormField label="Card Holder Name">
        <input
          type="text"
          required
          value={cardHolderName}
          onChange={(e) => setCardHolderName(e.target.value)}
          placeholder="John Smith"
          className={inputClass()}
        />
      </FormField>

      <FormField label="Card Information">
        <div className={inputClass()}>
          <CardNumberElement options={{ style: ELEMENT_STYLE, placeholder: '0000 0000 0000 0000' }} />
        </div>
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Expiry Date">
          <div className={inputClass()}>
            <CardExpiryElement options={{ style: ELEMENT_STYLE }} />
          </div>
        </FormField>
        <FormField label="CVC">
          <div className={inputClass()}>
            <CardCvcElement options={{ style: ELEMENT_STYLE }} />
          </div>
        </FormField>
      </div>

      <div className="space-y-2">
        <span className="block font-inter text-sm font-semibold text-[#1c1b1b]">
          Billing Address
        </span>
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 font-inter text-sm text-[#424656]">
            <input
              type="radio"
              name="billingAddressMode"
              checked={billingAddressMode === 'same'}
              onChange={() => setBillingAddressMode('same')}
              className="h-4 w-4 accent-[#0050cb]"
            />
            Same as registered address
          </label>
          <label className="flex items-center gap-2 font-inter text-sm text-[#424656]">
            <input
              type="radio"
              name="billingAddressMode"
              checked={billingAddressMode === 'different'}
              onChange={() => setBillingAddressMode('different')}
              className="h-4 w-4 accent-[#0050cb]"
            />
            Different billing address
          </label>
        </div>
        {billingAddressMode === 'different' && (
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            className={inputClass()}
          />
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !stripe}
        className={cn(
          'flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0050cb] font-inter text-base font-semibold text-white',
          'transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60',
        )}
      >
        {isSubmitting ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <>
            Upgrade Now
            <Rocket className="h-4 w-4" />
          </>
        )}
      </button>

      <p className="flex items-center justify-center gap-1.5 font-inter text-xs font-semibold uppercase tracking-[0.6px] text-[#9ca3af]">
        <Lock className="h-3.5 w-3.5" />
        Secured by Stripe
      </p>
    </form>
  )
}

function SummaryPanel({
  plan,
  billingCycle,
  onClose,
}: {
  plan: PlanTier
  billingCycle: BillingCycle
  onClose: () => void
}) {
  const price = billingCycle === 'monthly' ? plan.monthlyPrice : annualEquivalent(plan.monthlyPrice)
  const gst = Math.round(price * GST_RATE * 100) / 100
  const total = Math.round((price + gst) * 100) / 100

  return (
    <div className="space-y-6 bg-[#f5f6fb] p-8">
      <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.6px] text-[#424656]">
        Subscription Summary
      </p>

      <div className="relative rounded-xl bg-white p-4 shadow-sm">
        <span className="absolute right-3 top-3 rounded-full bg-[#0050cb] px-2 py-0.5 font-inter text-[10px] font-semibold uppercase tracking-[0.6px] text-white">
          Active Choice
        </span>
        <p className="font-manrope text-lg font-extrabold text-[#0050cb]">{plan.name}</p>
        <p className="font-inter text-sm text-[#424656]">
          Billed {billingCycle === 'monthly' ? 'Monthly' : 'Annually'}
        </p>
        <p className="mt-2 font-manrope text-3xl font-extrabold text-[#1c1b1b]">
          ${price}
          <span className="ml-1 font-inter text-sm font-normal text-[#9ca3af]">/month</span>
        </p>
      </div>

      <div className="space-y-2 border-t border-[#e5e7eb] pt-4">
        <div className="flex items-center justify-between font-inter text-sm">
          <span className="text-[#424656]">Subtotal</span>
          <span className="font-semibold text-[#1c1b1b]">${price.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between font-inter text-sm">
          <span className="text-[#424656]">GST (10%)</span>
          <span className="font-semibold text-[#1c1b1b]">${gst.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex items-end justify-between border-t border-[#e5e7eb] pt-4">
        <div>
          <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.6px] text-[#424656]">
            Total Amount
          </p>
          <p className="font-manrope text-2xl font-extrabold text-[#0050cb]">${total.toFixed(2)}</p>
        </div>
        <span className="rounded bg-[#eef2ff] px-2 py-0.5 font-inter text-xs font-semibold text-[#0050cb]">
          AUD
        </span>
      </div>

      <div className="flex items-start gap-3 rounded-lg bg-white p-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef2ff]">
          <ShieldCheck className="h-5 w-5 text-[#0050cb]" />
        </div>
        <div>
          <p className="font-inter text-sm font-semibold text-[#1c1b1b]">30-Day Guarantee</p>
          <p className="font-inter text-xs text-[#424656]">
            Not satisfied? Get a full refund within your first month, no questions asked.
          </p>
        </div>
      </div>

      <div className="flex h-28 flex-col justify-end rounded-xl bg-gradient-to-br from-[#0b1330] to-[#001849] p-3">
        <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.6px] text-white/60">
          Join 5,000+ Pros
        </p>
        <p className="font-inter text-xs text-white/90">Powering their business with TradieOne</p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mx-auto block font-inter text-sm font-semibold text-[#0050cb] hover:underline"
      >
        Back to Plans
      </button>
    </div>
  )
}

function FormField({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block font-inter text-sm font-semibold text-[#1c1b1b]">
        {label}
        {hint && <span className="ml-1 font-normal text-[#9ca3af]">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

function inputClass() {
  return cn(
    'flex h-12 w-full items-center rounded-lg border border-[#c2c6d8] bg-white px-4',
    'font-inter text-base text-[#1c1b1b] placeholder:text-[#c2c6d8]',
    'outline-none transition-colors focus-within:border-[#0050cb] focus-within:ring-2 focus-within:ring-[#0050cb]/20',
  )
}
