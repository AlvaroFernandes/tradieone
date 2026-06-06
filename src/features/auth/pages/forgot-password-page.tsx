import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import {
  Mail,
  KeyRound,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Activity,
  CheckCircle2,
} from 'lucide-react'
import { api } from '@/lib/api'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/types/auth.types'
import { cn } from '@/lib/utils'

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const { mutate: sendReset, isPending } = useMutation({
    mutationFn: ({ email }: ForgotPasswordFormData) =>
      // Endpoint not yet available — will be wired up when ready
      api.post('/forgot-password', { email }).catch((err) => {
        // Always show success to avoid email enumeration (security)
        if (isAxiosError(err) && err.response?.status === 404) return
        throw err
      }),
    onSuccess: () => setSentTo(getValues('email')),
    onError: () => setSentTo(getValues('email')), // treat all errors as "sent" for security
  })

  return (
    <div className="flex min-h-screen">
      {/* ── Left: Hero ── */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
        <img
          src="/assets/hero-forgot-bg.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(54.89deg, rgb(0,24,73) 0%, rgba(0,24,73,0.8) 50%, rgba(0,24,73,0) 100%)',
          }}
        />

        <div className="relative flex h-full w-full flex-col justify-center gap-16 p-16">
          {/* Logo + Headline */}
          <div className="flex flex-col gap-3">
            <span className="font-manrope text-2xl font-bold tracking-[-0.6px] text-white">
              TradieOne
            </span>
            <h1 className="font-manrope text-[48px] font-bold leading-[56px] tracking-[-0.96px] text-white">
              Built for the site. Polished for the office.
            </h1>
            <p className="max-w-[512px] pt-3 font-inter text-lg leading-7 text-white/90">
              The all-in-one management platform designed specifically for Australian trade
              businesses seeking elite operational efficiency.
            </p>
          </div>

          {/* Bento cards */}
          <div className="grid grid-cols-2 gap-6">
            <BentoCard
              iconBg="bg-[rgba(0,80,203,0.2)]"
              icon={<ShieldCheck className="h-5 w-5 text-[#0050cb]" />}
              title="Secure Access"
              description="Bank-grade encryption for your business data and financial records."
            />
            <BentoCard
              iconBg="bg-[rgba(68,66,227,0.2)]"
              icon={<Activity className="h-5 w-5 text-[#4442e3]" />}
              title="Job Tracking"
              description="Real-time oversight of every site, technician, and material cost."
            />
          </div>
        </div>
      </div>

      {/* ── Right: Form ── */}
      <div className="flex w-full flex-col items-center justify-between bg-[#fcf9f8] px-6 py-12 lg:w-1/2 lg:px-8">
        <div className="flex flex-1 items-center justify-center w-full">
          <div className="w-full max-w-[448px]">
            <div className="rounded-2xl border border-[rgba(226,232,240,0.8)] bg-white/70 p-10 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] backdrop-blur-md">
              {sentTo ? (
                <SentState email={sentTo} onResend={() => sendReset({ email: sentTo })} isPending={isPending} />
              ) : (
                <FormState
                  register={register}
                  handleSubmit={handleSubmit}
                  errors={errors}
                  isPending={isPending}
                  onSubmit={(d) => sendReset(d)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-6">
            {(['Support', 'Privacy Policy', 'Security'] as const).map((label) => (
              <a
                key={label}
                href="#"
                className="font-inter text-[11px] font-semibold tracking-[0.6px] text-[#424656] hover:text-[#1c1b1b]"
              >
                {label}
              </a>
            ))}
          </div>
          <p className="font-inter text-[11px] font-semibold tracking-[0.6px] text-[#727687]/70">
            © 2024 TradieOne. Australian owned &amp; operated.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Form state ──────────────────────────────────────────────────

function FormState({
  register,
  handleSubmit,
  errors,
  isPending,
  onSubmit,
}: {
  register: ReturnType<typeof useForm<ForgotPasswordFormData>>['register']
  handleSubmit: ReturnType<typeof useForm<ForgotPasswordFormData>>['handleSubmit']
  errors: ReturnType<typeof useForm<ForgotPasswordFormData>>['formState']['errors']
  isPending: boolean
  onSubmit: (d: ForgotPasswordFormData) => void
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Icon illustration */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(0,102,255,0.1)]">
            <Mail className="h-8 w-8 text-[#0050cb]" />
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0050cb] bg-white shadow-sm">
            <KeyRound className="h-3.5 w-3.5 text-[#0050cb]" />
          </div>
        </div>
      </div>

      {/* Heading */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="font-manrope text-[32px] font-semibold leading-10 tracking-[-0.32px] text-[#1c1b1b]">
          Forgot your password?
        </h2>
        <p className="font-inter text-base leading-6 text-[#424656]">
          Enter your email and we'll send you a secure reset link to get you back on site.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 py-4" noValidate>
        <div className="space-y-1">
          <label
            htmlFor="email"
            className="block px-1 font-inter text-[11px] font-semibold uppercase tracking-[0.6px] text-[#424656]"
          >
            Email Address
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-[16px] flex items-center">
              <Mail className="h-4 w-5 text-[#9ca3af]" />
            </span>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com.au"
              {...register('email')}
              className={cn(
                'h-12 w-full rounded-xl border bg-white py-[10px] pl-[49px] pr-[17px]',
                'font-inter text-base text-[#1c1b1b] placeholder:text-[#c2c6d8]',
                'outline-none transition-colors',
                'focus:border-[#0050cb] focus:ring-2 focus:ring-[#0050cb]/20',
                errors.email
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                  : 'border-[#c2c6d8]',
              )}
            />
          </div>
          {errors.email && (
            <p className="font-inter text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={cn(
            'flex h-12 w-full items-center justify-center gap-2 rounded-lg',
            'bg-[#0050cb] font-inter text-base font-semibold text-white',
            'shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]',
            'transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60',
          )}
        >
          {isPending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              Send Reset Link
              <ArrowRight className="h-[13px] w-[13px]" />
            </>
          )}
        </button>
      </form>

      {/* Back to login */}
      <div className="border-t border-[rgba(194,198,216,0.3)] pt-6 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1 font-inter text-base font-semibold text-[#0050cb] hover:underline"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to login
        </Link>
      </div>
    </div>
  )
}

// ── Sent state ──────────────────────────────────────────────────

function SentState({
  email,
  onResend,
  isPending,
}: {
  email: string
  onResend: () => void
  isPending: boolean
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Success icon */}
      <div className="flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(0,102,255,0.1)]">
          <CheckCircle2 className="h-8 w-8 text-[#0050cb]" />
        </div>
      </div>

      {/* Heading */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="font-manrope text-[32px] font-semibold leading-10 tracking-[-0.32px] text-[#1c1b1b]">
          Check your inbox
        </h2>
        <p className="font-inter text-base leading-6 text-[#424656]">
          We've sent a password reset link to{' '}
          <span className="font-semibold text-[#1c1b1b]">{email}</span>. It expires in 15 minutes.
        </p>
      </div>

      <div className="flex flex-col gap-3 py-4">
        <button
          type="button"
          onClick={onResend}
          disabled={isPending}
          className={cn(
            'flex h-12 w-full items-center justify-center gap-2 rounded-lg',
            'bg-[#0050cb] font-inter text-base font-semibold text-white',
            'shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]',
            'transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60',
          )}
        >
          {isPending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            'Resend email'
          )}
        </button>
      </div>

      {/* Back to login */}
      <div className="border-t border-[rgba(194,198,216,0.3)] pt-6 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1 font-inter text-base font-semibold text-[#0050cb] hover:underline"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to login
        </Link>
      </div>
    </div>
  )
}

// ── Bento card ──────────────────────────────────────────────────

function BentoCard({
  iconBg,
  icon,
  title,
  description,
}: {
  iconBg: string
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-[rgba(226,232,240,0.8)] bg-[rgba(252,249,248,0.7)] p-[25px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] backdrop-blur-md">
      <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', iconBg)}>
        {icon}
      </div>
      <h3 className="pt-3 font-manrope text-2xl font-semibold text-[#1c1b1b]">{title}</h3>
      <p className="font-inter text-base leading-6 text-[#424656]">{description}</p>
    </div>
  )
}
