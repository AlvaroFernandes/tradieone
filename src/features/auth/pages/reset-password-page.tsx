import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import {
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Activity,
} from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/types/auth.types'
import { cn } from '@/lib/utils'

// ── Password strength ────────────────────────────────────────────

type Strength = 'weak' | 'fair' | 'good' | 'strong'

function getStrength(password: string): Strength {
  if (password.length < 8) return 'weak'
  const checks = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^a-zA-Z0-9]/.test(password),
  ].filter(Boolean).length
  if (checks <= 1) return 'weak'
  if (checks === 2) return 'fair'
  if (checks === 3) return 'good'
  return 'strong'
}

const strengthConfig: Record<Strength, { label: string; color: string; segments: number }> = {
  weak:   { label: 'Weak',   color: 'bg-red-400',    segments: 1 },
  fair:   { label: 'Fair',   color: 'bg-amber-400',  segments: 2 },
  good:   { label: 'Good',   color: 'bg-blue-400',   segments: 3 },
  strong: { label: 'Strong', color: 'bg-emerald-500', segments: 4 },
}

// ── Page ─────────────────────────────────────────────────────────

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [done, setDone] = useState(false)

  if (!token) return <InvalidTokenState />
  if (done)   return <SuccessState />

  return <FormView token={token} onSuccess={() => setDone(true)} />
}

// ── Form view ────────────────────────────────────────────────────

function FormView({ token, onSuccess }: { token: string; onSuccess: () => void }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: ({ password }: ResetPasswordFormData) =>
      // Endpoint not yet available — will be wired up when ready
      api.post('/reset-password', { token, password }).catch((err) => {
        if (isAxiosError(err) && err.response?.status === 404) return
        throw err
      }),
    onSuccess,
    onError: (error) => {
      toast.error(
        isAxiosError(error)
          ? (error.response?.data?.title ?? error.response?.data?.message ?? 'Reset link is invalid or expired.')
          : 'Something went wrong. Please try again.',
      )
    },
  })

  const strength = passwordValue ? getStrength(passwordValue) : null
  const { label, color, segments } = strength ? strengthConfig[strength] : { label: '', color: '', segments: 0 }

  return (
    <div className="flex min-h-screen">
      <HeroPanel />

      <div className="flex w-full flex-col items-center justify-between bg-[#fcf9f8] px-6 py-12 lg:w-1/2 lg:px-8">
        <div className="flex flex-1 items-center justify-center w-full">
          <div className="w-full max-w-[448px]">
            <div className="rounded-2xl border border-[rgba(226,232,240,0.8)] bg-white/70 p-10 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] backdrop-blur-md">
              <div className="flex flex-col gap-6">
                {/* Icon */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(0,102,255,0.1)]">
                      <Lock className="h-8 w-8 text-[#0050cb]" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0050cb] bg-white shadow-sm">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#0050cb]" />
                    </div>
                  </div>
                </div>

                {/* Heading */}
                <div className="flex flex-col items-center gap-2 text-center">
                  <h2 className="font-manrope text-[32px] font-semibold leading-10 tracking-[-0.32px] text-[#1c1b1b]">
                    Set new password
                  </h2>
                  <p className="font-inter text-base leading-6 text-[#424656]">
                    Choose a strong password to keep your account secure.
                  </p>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit((d) => resetPassword(d))}
                  className="flex flex-col gap-5 py-2"
                  noValidate
                >
                  {/* New password */}
                  <div className="space-y-1">
                    <label
                      htmlFor="password"
                      className="block px-1 font-inter text-[11px] font-semibold uppercase tracking-[0.6px] text-[#424656]"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-[16px] flex items-center">
                        <Lock className="h-[21px] w-4 text-[#9ca3af]" />
                      </span>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        {...register('password', {
                          onChange: (e) => setPasswordValue(e.target.value),
                        })}
                        className={cn(
                          'h-12 w-full rounded-xl border bg-white py-[10px] pl-[49px] pr-12',
                          'font-inter text-base text-[#1c1b1b] placeholder:text-[#c2c6d8]',
                          'outline-none transition-colors',
                          'focus:border-[#0050cb] focus:ring-2 focus:ring-[#0050cb]/20',
                          errors.password
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                            : 'border-[#c2c6d8]',
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute inset-y-0 right-[14px] flex items-center text-[#9ca3af] hover:text-[#424656]"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="font-inter text-xs text-red-500">{errors.password.message}</p>
                    )}

                    {/* Strength meter */}
                    {passwordValue && (
                      <div className="space-y-1 pt-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={cn(
                                'h-1 flex-1 rounded-full transition-all duration-300',
                                i <= segments ? color : 'bg-[#e5e7eb]',
                              )}
                            />
                          ))}
                        </div>
                        <p className={cn('font-inter text-xs font-medium', {
                          'text-red-400':    strength === 'weak',
                          'text-amber-500':  strength === 'fair',
                          'text-blue-500':   strength === 'good',
                          'text-emerald-600': strength === 'strong',
                        })}>
                          {label} password
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div className="space-y-1">
                    <label
                      htmlFor="confirmPassword"
                      className="block px-1 font-inter text-[11px] font-semibold uppercase tracking-[0.6px] text-[#424656]"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-[16px] flex items-center">
                        <Lock className="h-[21px] w-4 text-[#9ca3af]" />
                      </span>
                      <input
                        id="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        {...register('confirmPassword')}
                        className={cn(
                          'h-12 w-full rounded-xl border bg-white py-[10px] pl-[49px] pr-12',
                          'font-inter text-base text-[#1c1b1b] placeholder:text-[#c2c6d8]',
                          'outline-none transition-colors',
                          'focus:border-[#0050cb] focus:ring-2 focus:ring-[#0050cb]/20',
                          errors.confirmPassword
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                            : 'border-[#c2c6d8]',
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        aria-label={showConfirm ? 'Hide password' : 'Show password'}
                        className="absolute inset-y-0 right-[14px] flex items-center text-[#9ca3af] hover:text-[#424656]"
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="font-inter text-xs text-red-500">{errors.confirmPassword.message}</p>
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
                        Reset Password
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
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}

// ── Success state ────────────────────────────────────────────────

function SuccessState() {
  return (
    <div className="flex min-h-screen">
      <HeroPanel />

      <div className="flex w-full flex-col items-center justify-between bg-[#fcf9f8] px-6 py-12 lg:w-1/2 lg:px-8">
        <div className="flex flex-1 items-center justify-center w-full">
          <div className="w-full max-w-[448px]">
            <div className="rounded-2xl border border-[rgba(226,232,240,0.8)] bg-white/70 p-10 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] backdrop-blur-md">
              <div className="flex flex-col gap-6">
                <div className="flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(16,185,129,0.1)]">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 text-center">
                  <h2 className="font-manrope text-[32px] font-semibold leading-10 tracking-[-0.32px] text-[#1c1b1b]">
                    Password updated
                  </h2>
                  <p className="font-inter text-base leading-6 text-[#424656]">
                    Your password has been reset successfully. You can now sign in with your new password.
                  </p>
                </div>

                <div className="py-2">
                  <Link
                    to="/login"
                    className={cn(
                      'flex h-12 w-full items-center justify-center gap-2 rounded-lg',
                      'bg-[#0050cb] font-inter text-base font-semibold text-white',
                      'shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]',
                      'transition-opacity hover:opacity-90',
                    )}
                  >
                    Sign in to your account
                    <ArrowRight className="h-[13px] w-[13px]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}

// ── Invalid token state ──────────────────────────────────────────

function InvalidTokenState() {
  return (
    <div className="flex min-h-screen">
      <HeroPanel />

      <div className="flex w-full flex-col items-center justify-between bg-[#fcf9f8] px-6 py-12 lg:w-1/2 lg:px-8">
        <div className="flex flex-1 items-center justify-center w-full">
          <div className="w-full max-w-[448px]">
            <div className="rounded-2xl border border-[rgba(226,232,240,0.8)] bg-white/70 p-10 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] backdrop-blur-md">
              <div className="flex flex-col gap-6">
                <div className="flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                    <ShieldAlert className="h-8 w-8 text-red-400" />
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 text-center">
                  <h2 className="font-manrope text-[32px] font-semibold leading-10 tracking-[-0.32px] text-[#1c1b1b]">
                    Link expired
                  </h2>
                  <p className="font-inter text-base leading-6 text-[#424656]">
                    This password reset link is invalid or has expired. Request a new one from the forgot password page.
                  </p>
                </div>

                <div className="flex flex-col gap-3 py-2">
                  <Link
                    to="/forgot-password"
                    className={cn(
                      'flex h-12 w-full items-center justify-center gap-2 rounded-lg',
                      'bg-[#0050cb] font-inter text-base font-semibold text-white',
                      'shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]',
                      'transition-opacity hover:opacity-90',
                    )}
                  >
                    Request new link
                    <ArrowRight className="h-[13px] w-[13px]" />
                  </Link>
                  <div className="border-t border-[rgba(194,198,216,0.3)] pt-4 text-center">
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1 font-inter text-base font-semibold text-[#0050cb] hover:underline"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      Back to login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}

// ── Shared: hero + footer ────────────────────────────────────────

function HeroPanel() {
  return (
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
        <div className="flex flex-col gap-3">
          <span className="font-manrope text-2xl font-bold tracking-[-0.6px] text-white">
            TradieOne
          </span>
          <h1 className="font-manrope text-[48px] font-bold leading-[56px] tracking-[-0.96px] text-white">
            Built for the site. Polished for the office.
          </h1>
          <p className="max-w-[512px] pt-3 font-inter text-lg leading-7 text-white/90">
            The all-in-one management platform designed specifically for Australian trade businesses
            seeking elite operational efficiency.
          </p>
        </div>

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
  )
}

function Footer() {
  return (
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
  )
}

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
