import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Check, ChevronDown, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useConfirmFreePlan } from '@/features/auth/hooks/use-confirm-free-plan'
import { PLANS, annualEquivalent, type PlanTier } from '@/features/auth/constants/plans'
import { PlanPaymentModal } from '@/features/auth/components/plan-payment-modal'

export type BillingCycle = 'monthly' | 'annual'

export default function UpgradePlanPage() {
  const navigate = useNavigate()
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')
  const [showComparison, setShowComparison] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PlanTier | null>(null)
  const { mutate: confirmFreePlan, isPending } = useConfirmFreePlan(() => navigate('/dashboard'))

  return (
    <div className="flex min-h-screen">
      <aside
        className="hidden w-[461px] shrink-0 flex-col justify-between p-10 lg:flex"
        style={{ background: '#001849' }}
      >
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-white" />
          <span className="font-manrope text-xl font-extrabold tracking-tight text-white">
            TRADIEONE
          </span>
        </div>

        <div className="space-y-5">
          <h2 className="font-manrope text-[40px] font-bold leading-[52px] tracking-[-0.8px] text-white">
            Ready to grow your business?
          </h2>
          <p className="font-inter text-base leading-7 text-white/70">
            Unlock professional tools designed for the modern Australian tradesperson. Spend less
            time on admin and more time on the tools.
          </p>
        </div>

        <div />
      </aside>

      <main className="flex flex-1 items-start justify-center overflow-y-auto bg-white px-6 py-14 lg:px-12">
        <div className="w-full max-w-[900px] space-y-8 text-center">
          <div className="space-y-3">
            <h1 className="font-manrope text-5xl font-extrabold tracking-tight">
              <span className="text-[#0b1330]">Upgrade Your </span>
              <span className="text-[#0050cb]">Workspace</span>
            </h1>
            <p className="mx-auto max-w-[560px] font-inter text-base text-[#424656]">
              Scale your trade business with precision tools, automated invoicing, and
              enterprise-grade security. Choose the plan that fits your growth trajectory.
            </p>
          </div>

          {/* Billing toggle */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-xl bg-[#f0f2f8] p-1">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={cn(
                  'rounded-lg px-5 py-2 font-inter text-sm font-semibold transition-colors',
                  billingCycle === 'monthly'
                    ? 'bg-white text-[#0050cb] shadow-sm'
                    : 'text-[#424656]',
                )}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-5 py-2 font-inter text-sm font-semibold transition-colors',
                  billingCycle === 'annual'
                    ? 'bg-white text-[#0050cb] shadow-sm'
                    : 'text-[#424656]',
                )}
              >
                Annual
                <span className="rounded-full bg-[#0050cb] px-2 py-0.5 font-inter text-[10px] font-semibold text-white">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Plan cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.key}
                plan={plan}
                billingCycle={billingCycle}
                onSelect={() => setSelectedPlan(plan)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowComparison((v) => !v)}
            className="mx-auto flex items-center gap-2 rounded-xl bg-[#f0f2f8] px-5 py-2.5 font-inter text-sm font-semibold text-[#1c1b1b] hover:bg-[#e5e8f2]"
          >
            Show Detailed Feature Comparison
            <ChevronDown className={cn('h-4 w-4 transition-transform', showComparison && 'rotate-180')} />
          </button>

          {showComparison && (
            <div className="grid grid-cols-1 gap-6 rounded-2xl border border-[#e5e7eb] p-6 text-left sm:grid-cols-3">
              {PLANS.map((plan) => (
                <div key={plan.key} className="space-y-2">
                  <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.6px] text-[#9ca3af]">
                    {plan.name}
                  </p>
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 font-inter text-sm text-[#424656]">
                      <Check className="h-4 w-4 shrink-0 rounded-full border border-[#0050cb] p-0.5 text-[#0050cb]" />
                      {feature}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              type="button"
              disabled={isPending}
              onClick={() => confirmFreePlan()}
              style={{ background: 'linear-gradient(90deg, #0050cb 0%, #4442e3 100%)' }}
              className={cn(
                'flex h-12 items-center gap-2 rounded-xl px-6',
                'font-inter text-base font-semibold text-white',
                'shadow-[0px_10px_15px_-3px_rgba(0,80,203,0.2),0px_4px_6px_-4px_rgba(0,80,203,0.2)]',
                'transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60',
              )}
            >
              {isPending ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  Go to Dashboard
                  <LayoutDashboard className="h-4 w-4" />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/onboarding', { state: { step: 3 } })}
              className="flex h-12 items-center rounded-xl border border-[#0050cb] bg-white px-6 font-inter text-base font-semibold text-[#0050cb] transition-colors hover:bg-[#f0f4ff]"
            >
              Return to Onboarding
            </button>
          </div>
        </div>
      </main>

      {selectedPlan && (
        <PlanPaymentModal
          plan={selectedPlan}
          billingCycle={billingCycle}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  )
}

function PlanCard({
  plan,
  billingCycle,
  onSelect,
}: {
  plan: PlanTier
  billingCycle: BillingCycle
  onSelect: () => void
}) {
  const price = billingCycle === 'monthly' ? plan.monthlyPrice : annualEquivalent(plan.monthlyPrice)

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl border p-6 text-left',
        plan.dark && 'border-transparent bg-[#0b1330] text-white',
        plan.highlight && 'border-[#0050cb] bg-white',
        !plan.dark && !plan.highlight && 'border-[#e5e7eb] bg-white',
      )}
    >
      {plan.highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0050cb] px-3 py-1 font-inter text-[10px] font-semibold uppercase tracking-[0.6px] text-white">
          Popular 🔥
        </span>
      )}

      <span
        className={cn(
          'font-inter text-[11px] font-semibold uppercase tracking-[0.6px]',
          plan.dark ? 'text-white/60' : plan.highlight ? 'text-[#0050cb]' : 'text-[#9ca3af]',
        )}
      >
        {plan.name}
      </span>

      <p className="mt-2 font-manrope text-3xl font-extrabold">
        ${price}
        <span
          className={cn(
            'ml-1 font-inter text-sm font-normal',
            plan.dark ? 'text-white/60' : 'text-[#9ca3af]',
          )}
        >
          /mo
        </span>
      </p>

      <div className="mt-4 space-y-2">
        {plan.features.map((feature) => (
          <div key={feature} className="flex items-center gap-2 font-inter text-sm">
            <Check
              className={cn(
                'h-4 w-4 shrink-0 rounded-full border p-0.5',
                plan.dark
                  ? 'border-white/30 text-white'
                  : plan.highlight
                    ? 'border-[#0050cb] bg-[#0050cb] text-white'
                    : 'border-[#0050cb] text-[#0050cb]',
              )}
            />
            <span className={plan.dark ? 'text-white/80' : 'text-[#424656]'}>{feature}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onSelect}
        className={cn(
          'mt-6 h-11 rounded-xl font-inter text-sm font-semibold transition-opacity hover:opacity-90',
          plan.dark && 'bg-[#0050cb] text-white',
          plan.highlight && 'bg-[#0050cb] text-white',
          !plan.dark && !plan.highlight && 'border border-[#e5e7eb] bg-white text-[#1c1b1b]',
        )}
      >
        {plan.cta}
      </button>
    </div>
  )
}
