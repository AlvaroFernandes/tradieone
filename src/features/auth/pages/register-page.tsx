import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import {
  Briefcase,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  BarChart2,
  CalendarDays,
} from 'lucide-react'
import { toast } from 'sonner'
import { api, tdoApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'
import { registerSchema, type RegisterFormData } from '@/types/auth.types'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const setTenantId = useAuthStore((s) => s.setTenantId)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const { mutate: createAccount, isPending } = useMutation({
    mutationFn: async ({ email, password, businessName, firstName, lastName }: RegisterFormData) => {
      // 1. Auth signup → token
      const { token } = await api
        .post<{ token: string }>('/signup', { username: email, password })
        .then((r) => r.data)

      // 2. Create user + tenant → tenantId
      const { tenantId } = await tdoApi
        .post<{ tenantId: string }>('/api/Users', {
          firstName,
          lastName,
          phone: '',
          tenant: {
            name: businessName,
            email: '',
            phone: '',
            abn: '',
            isGstregistered: false,
            addressLine1: '',
            addressLine2: '',
            suburb: '',
            state: '',
            postcode: '',
            country: 'Australia',
            logoUrl: '',
          },
        }, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.data)

      return { token, tenantId, email, firstName, lastName, businessName }
    },
    onSuccess: ({ token, tenantId, email, firstName, lastName, businessName }) => {
      setAuth(token, { id: '', name: `${firstName} ${lastName}`, email, role: 'user' })
      setTenantId(tenantId)
      localStorage.setItem(
        'tradieone-pending-profile',
        JSON.stringify({ businessName, firstName, lastName }),
      )
      navigate('/onboarding')
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
          'Registration failed. Please try again.'
        toast.error(String(msg))
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
          src="/assets/hero-register-bg.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(53.13deg, rgb(0,24,73) 0%, rgba(0,24,73,0.8) 50%, rgba(0,24,73,0) 100%)',
          }}
        />

        <div className="relative flex h-full w-full flex-col justify-between p-16">
          {/* Logo */}
          <span className="font-manrope text-2xl font-extrabold tracking-tight text-white">
            TradieOne
          </span>

          {/* Headline block */}
          <div className="flex max-w-[560px] flex-col gap-12">
            <div className="flex flex-col gap-6">
              {/* Badge */}
              <div className="w-fit rounded-full border border-white/20 bg-white/10 px-[17px] py-[5px] backdrop-blur-md">
                <span className="font-inter text-[11px] font-semibold uppercase tracking-[1.2px] text-white">
                  Built for Australia
                </span>
              </div>

              <h1 className="font-manrope text-[48px] font-bold leading-[60px] tracking-[-0.96px] text-white">
                Everything your trade business needs in one platform.
              </h1>

              <p className="font-inter text-lg leading-7 text-white/80">
                Manage jobs, clients, invoices, teams, and payments with TradieOne. The
                high-performance tool for modern trades.
              </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-6">
              <HeroCard
                icon={<BarChart2 className="h-5 w-5 text-white/80" />}
                label="Total Impact"
                value="12,000+"
                description="Jobs Managed Successfully"
              />
              <HeroCard
                icon={<CalendarDays className="h-5 w-5 text-white/80" />}
                label="Next Job"
                value="Sydney Metro Project"
                valueSize="sm"
                description="Starts in 45 minutes"
              />
            </div>
          </div>

          {/* Footer */}
          <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.6px] text-white/70">
            Trusted by 10,000+ Tradies
          </p>
        </div>
      </div>

      {/* ── Right: Register form ── */}
      <div className="flex w-full flex-col items-center justify-center bg-[#fcf9f8] px-6 py-12 lg:w-1/2 lg:px-8">
        <div className="w-full max-w-[540px] space-y-6">
          {/* Card */}
          <div className="relative rounded-2xl border border-[rgba(194,198,216,0.3)] bg-white/70 px-10 pb-14 pt-10 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] backdrop-blur-sm">
            {/* Heading */}
            <div className="mb-10 space-y-1">
              <h2 className="font-manrope text-[32px] font-semibold leading-10 tracking-[-0.32px] text-[#1c1b1b]">
                Create Your Account
              </h2>
              <p className="font-inter text-base text-[#424656]">
                Start managing your trade business smarter with TradieOne.
              </p>
            </div>

            <form onSubmit={handleSubmit((d) => createAccount(d))} className="space-y-4" noValidate>
              {/* Business Name */}
              <Field label="Business Name" error={errors.businessName?.message}>
                <InputWrapper icon={<Briefcase className="h-[19px] w-5 text-[#9ca3af]" />}>
                  <input
                    type="text"
                    autoComplete="organization"
                    placeholder="e.g. Peak Plumbing Services"
                    {...register('businessName')}
                    className={inputClass(!!errors.businessName)}
                  />
                </InputWrapper>
              </Field>

              {/* First + Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="First Name" error={errors.firstName?.message}>
                  <InputWrapper icon={<User className="h-[19px] w-5 text-[#9ca3af]" />}>
                    <input
                      type="text"
                      autoComplete="given-name"
                      placeholder="John"
                      {...register('firstName')}
                      className={inputClass(!!errors.firstName)}
                    />
                  </InputWrapper>
                </Field>
                <Field label="Last Name" error={errors.lastName?.message}>
                  <InputWrapper icon={<Briefcase className="h-[19px] w-5 text-[#9ca3af]" />}>
                    <input
                      type="text"
                      autoComplete="family-name"
                      placeholder="Smith"
                      {...register('lastName')}
                      className={inputClass(!!errors.lastName)}
                    />
                  </InputWrapper>
                </Field>
              </div>

              {/* Email */}
              <Field label="Email Address" error={errors.email?.message}>
                <InputWrapper icon={<Mail className="h-4 w-5 text-[#9ca3af]" />}>
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="john@tradieservices.com.au"
                    {...register('email')}
                    className={inputClass(!!errors.email)}
                  />
                </InputWrapper>
              </Field>

              {/* Password */}
              <Field label="Password" error={errors.password?.message}>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-[16px] flex items-center">
                    <Lock className="h-[21px] w-4 text-[#9ca3af]" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    {...register('password')}
                    className={cn(inputClass(!!errors.password), 'pr-12')}
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
              </Field>

              {/* Terms */}
              <div className="py-2">
                <div className="flex items-start gap-3">
                  <input
                    id="terms"
                    type="checkbox"
                    {...register('terms')}
                    className="mt-0.5 h-5 w-5 shrink-0 rounded border-[#c2c6d8] accent-[#0050cb]"
                  />
                  <label htmlFor="terms" className="font-inter text-sm text-[#424656]">
                    I agree to the{' '}
                    <a href="#" className="font-semibold text-[#0050cb] hover:underline">
                      Terms &amp; Conditions
                    </a>{' '}
                    and{' '}
                    <a href="#" className="font-semibold text-[#0050cb] hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </label>
                </div>
                {errors.terms && (
                  <p className="mt-1 font-inter text-xs text-red-500">{errors.terms.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                style={{ background: 'linear-gradient(90deg, #0050cb 0%, #4442e3 100%)' }}
                className={cn(
                  'flex h-12 w-full items-center justify-center gap-2',
                  'rounded-xl font-inter text-base font-semibold text-white',
                  'shadow-[0px_10px_15px_-3px_rgba(0,80,203,0.2),0px_4px_6px_-4px_rgba(0,80,203,0.2)]',
                  'transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60',
                )}
              >
                {isPending ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-x-0 top-1/2 border-t border-[rgba(194,198,216,0.4)]" />
                <div className="relative flex justify-center">
                  <span className="bg-white/80 px-4 font-inter text-sm text-[#424656]">
                    or join with
                  </span>
                </div>
              </div>

              {/* Social SSO */}
              <div className="grid grid-cols-2 gap-4">
                <SocialButton icon={<GoogleIcon />} label="Google" />
                <SocialButton icon={<MicrosoftIcon />} label="Microsoft" />
              </div>

              {/* Sign in link */}
              <div className="flex items-center justify-center gap-1 pt-2 font-inter text-base">
                <span className="text-[#424656]">Already have an account?</span>
                <Link to="/login" className="font-bold text-[#0050cb] hover:underline">
                  Sign In
                </Link>
              </div>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center font-inter text-[11px] font-semibold tracking-[0.6px] text-[#c2c6d8]">
            © 2024 TradieOne. Australian owned &amp; operated.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label className="block px-1 font-inter text-[11px] font-semibold uppercase tracking-[0.6px] text-[#424656]">
        {label}
      </label>
      {children}
      {error && <p className="font-inter text-xs text-red-500">{error}</p>}
    </div>
  )
}

function InputWrapper({
  icon,
  children,
}: {
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-[16px] flex items-center">
        {icon}
      </span>
      {children}
    </div>
  )
}

function inputClass(hasError: boolean) {
  return cn(
    'h-12 w-full rounded-xl border bg-white py-[10px] pl-[49px] pr-[17px]',
    'font-inter text-base text-[#1c1b1b] placeholder:text-[#c2c6d8]',
    'outline-none transition-colors',
    'focus:border-[#0050cb] focus:ring-2 focus:ring-[#0050cb]/20',
    hasError
      ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
      : 'border-[#c2c6d8]',
  )
}

function SocialButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="flex h-12 items-center justify-center gap-3 rounded-xl border border-[#c2c6d8] bg-white font-inter text-base text-[#1c1b1b] transition-colors hover:bg-gray-50"
    >
      {icon}
      {label}
    </button>
  )
}

function HeroCard({
  icon,
  label,
  value,
  valueSize = 'lg',
  description,
}: {
  icon: React.ReactNode
  label: string
  value: string
  valueSize?: 'lg' | 'sm'
  description: string
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/20 bg-white/10 p-[25px] shadow-xl backdrop-blur-xl">
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-inter text-base text-white/70">{label}</span>
      </div>
      <div>
        <p
          className={cn(
            'font-manrope font-bold text-white',
            valueSize === 'lg' ? 'text-2xl leading-8' : 'text-base font-semibold leading-6',
          )}
        >
          {value}
        </p>
        <p className="mt-0.5 font-inter text-sm text-white/60">{description}</p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 0 1-1.996 3.014v2.505h3.232C18.51 15.836 19.6 13.273 19.6 10.227Z"
        fill="#4285F4"
      />
      <path
        d="M10 20c2.7 0 4.964-.895 6.618-2.43l-3.232-2.506c-.895.6-2.04.955-3.386.955-2.6 0-4.8-1.755-5.59-4.114H1.064v2.59A9.996 9.996 0 0 0 10 20Z"
        fill="#34A853"
      />
      <path
        d="M4.41 11.905A6.01 6.01 0 0 1 4.1 10c0-.664.114-1.309.31-1.905V5.505H1.063A9.996 9.996 0 0 0 0 10c0 1.614.386 3.14 1.064 4.495l3.345-2.59Z"
        fill="#FBBC05"
      />
      <path
        d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.991 12.695 0 10 0A9.996 9.996 0 0 0 1.064 5.505l3.345 2.59C5.2 5.732 7.4 3.977 10 3.977Z"
        fill="#EA4335"
      />
    </svg>
  )
}

function MicrosoftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="8.5" height="8.5" fill="#F25022" />
      <rect x="10.5" y="1" width="8.5" height="8.5" fill="#7FBA00" />
      <rect x="1" y="10.5" width="8.5" height="8.5" fill="#00A4EF" />
      <rect x="10.5" y="10.5" width="8.5" height="8.5" fill="#FFB900" />
    </svg>
  )
}
