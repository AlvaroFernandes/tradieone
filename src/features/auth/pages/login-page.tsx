import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Briefcase, ReceiptText } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'
import { loginSchema, type LoginFormData } from '@/types/auth.types'
import { cn } from '@/lib/utils'

interface LoginResponse {
  token: string
}

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const { mutate: login, isPending } = useMutation({
    mutationFn: ({ email, password }: LoginFormData) =>
      api.post<LoginResponse>('/login', { username: email, password }).then((r) => r.data),
    onSuccess: ({ token }, { email }) => {
      setAuth(token, { id: '', name: '', email, role: 'user' })
      navigate('/dashboard')
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const data = error.response?.data
        const msg = data?.message ?? data?.title ?? 'Invalid email or password.'
        toast.error(msg)
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    },
  })

  return (
    <div className="flex min-h-screen">
      {/* ── Left: Hero ── */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
        <img
          src="/assets/hero-bg.jpg"
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

        <div className="relative flex h-full w-full flex-col justify-between p-16">
          {/* Logo */}
          <span className="font-manrope text-2xl font-extrabold tracking-tight text-white">
            TradieOne
          </span>

          {/* Headline + stats */}
          <div className="max-w-[512px] space-y-6">
            <h1 className="font-manrope text-[48px] font-bold leading-[60px] tracking-[-0.96px] text-[#fcf9f8]">
              Run your entire trade business from one platform
            </h1>
            <p className="text-xl leading-7 text-[#e5e2e1]/90">
              From scheduling and quotes to invoicing and compliance. The all-in-one toolkit
              designed for the Australian trades.
            </p>

            {/* Floating stat cards */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <StatCard
                icon={<Briefcase className="h-5 w-5 text-white" />}
                iconBg="bg-[#0066ff]"
                label="Upcoming Jobs"
                value="12 Today"
              />
              <StatCard
                icon={<ReceiptText className="h-5 w-5 text-white" />}
                iconBg="bg-[#d100b1]"
                label="Invoice Paid"
                value="$4,250.00"
              />
            </div>
          </div>

          {/* Footer metrics */}
          <div className="flex gap-8">
            <Metric value="12,000+" label="Jobs Managed" />
            <Metric value="4,500+" label="Active Tradies" />
          </div>
        </div>
      </div>

      {/* ── Right: Login form ── */}
      <div className="flex w-full flex-col items-center justify-center bg-white px-6 py-12 lg:w-1/2 lg:px-8">
        <div className="w-full max-w-[448px] space-y-6">
          {/* Card */}
          <div className="relative rounded-3xl border border-[rgba(194,198,216,0.3)] bg-white/70 px-10 py-10 shadow-2xl backdrop-blur-sm">
            {/* Heading */}
            <div className="mb-6 space-y-2">
              <h2 className="font-manrope text-[32px] font-semibold leading-10 tracking-[-0.32px] text-[#1c1b1b]">
                Welcome back
              </h2>
              <p className="font-inter text-base text-[#424656]">
                Access your dashboard and manage your jobs.
              </p>
            </div>

            <form onSubmit={handleSubmit((d) => login(d))} className="space-y-6" noValidate>
              {/* Email */}
              <div className="space-y-[5px] pt-4">
                <label
                  htmlFor="email"
                  className="block font-inter text-[11px] font-semibold uppercase tracking-[0.6px] text-[#424656]"
                >
                  Work Email
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-[17px] flex items-center">
                    <Mail className="h-[16px] w-[20px] text-[#9ca3af]" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    {...register('email')}
                    className={cn(
                      'h-12 w-full rounded-xl border bg-white py-[10px] pl-[49px] pr-[17px]',
                      'font-inter text-base text-[#1c1b1b] placeholder:text-[#6b7280]',
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

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between px-1">
                  <label
                    htmlFor="password"
                    className="block font-inter text-[11px] font-semibold uppercase tracking-[0.6px] text-[#424656]"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="font-inter text-[11px] font-semibold tracking-[0.6px] text-[#0050cb] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-[16px] flex items-center">
                    <Lock className="h-[21px] w-4 text-[#9ca3af]" />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...register('password')}
                    className={cn(
                      'h-12 w-full rounded-xl border bg-white py-[10px] pl-[49px] pr-12',
                      'font-inter text-base text-[#1c1b1b] placeholder:text-[#6b7280]',
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
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-5 w-5 rounded border-[#c2c6d8] accent-[#0050cb]"
                />
                <label htmlFor="remember" className="font-inter text-sm text-[#424656]">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                style={{ background: 'linear-gradient(90deg, #0050cb 0%, #4442e3 100%)' }}
                className={cn(
                  'relative flex h-12 w-full items-center justify-center gap-2',
                  'rounded-xl font-inter text-base font-semibold text-white',
                  'shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]',
                  'transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60',
                )}
              >
                {isPending ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative mt-6 pt-4">
              <div className="absolute inset-x-0 top-4 flex items-center">
                <div className="w-full border-t border-[rgba(194,198,216,0.5)]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 font-inter text-[11px] font-semibold uppercase tracking-[1.2px] text-[#424656]">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google SSO */}
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                className="flex h-12 items-center gap-2 rounded-xl border border-[#c2c6d8] px-6 font-inter text-base text-[#1c1b1b] transition-colors hover:bg-gray-50"
              >
                <GoogleIcon />
                Sign in with Google
              </button>
            </div>

            {/* Sign up link */}
            <div className="mt-6 flex justify-center pt-4">
              <p className="font-inter text-sm text-[#424656]">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-[#0050cb] hover:underline">
                  Start your 14-day free trial
                </Link>
              </p>
            </div>
          </div>

          {/* Footer links */}
          <div className="flex justify-center gap-6">
            {(['Privacy Policy', 'Terms of Service', 'Help Center'] as const).map((label) => (
              <a
                key={label}
                href="#"
                className="font-inter text-[11px] font-semibold tracking-[0.6px] text-[#727687] hover:text-[#424656]"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────────

function StatCard({
  icon,
  iconBg,
  label,
  value,
}: {
  icon: React.ReactNode
  iconBg: string
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/10 p-[17px] shadow-xl backdrop-blur-md">
      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', iconBg)}>
        {icon}
      </div>
      <div>
        <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.6px] text-[#e5e2e1]">
          {label}
        </p>
        <p className="font-manrope text-base font-semibold text-[#fcf9f8]">{value}</p>
      </div>
    </div>
  )
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-manrope text-2xl font-semibold text-[#dae1ff]">{value}</p>
      <p className="font-inter text-sm text-[#e5e2e1]">{label}</p>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.68 8.18C15.68 7.61 15.63 7.07 15.54 6.55H8v3.1h4.31c-.19 1-.74 1.84-1.59 2.41v2.01h2.6C14.81 12.67 15.68 10.62 15.68 8.18Z"
        fill="#4285F4"
      />
      <path
        d="M8 16c2.16 0 3.97-.72 5.29-1.93l-2.6-2.01c-.72.48-1.63.77-2.69.77-2.08 0-3.84-1.4-4.47-3.3H.84v2.07C2.16 14.21 4.87 16 8 16Z"
        fill="#34A853"
      />
      <path
        d="M3.53 9.53A4.8 4.8 0 0 1 3.27 8c0-.53.09-1.04.26-1.53V4.4H.84A8 8 0 0 0 0 8c0 1.3.31 2.54.84 3.6l2.69-2.07Z"
        fill="#FBBC05"
      />
      <path
        d="M8 3.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3C11.97.79 10.16 0 8 0 4.87 0 2.16 1.79.84 4.41l2.69 2.06C4.16 4.58 5.92 3.18 8 3.18Z"
        fill="#EA4335"
      />
    </svg>
  )
}
