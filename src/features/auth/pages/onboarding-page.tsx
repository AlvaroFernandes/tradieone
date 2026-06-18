import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import {
  MapPin,
  Mail,
  Phone,
  Building2,
  ChevronRight,
  ChevronLeft,
  User,
  Calendar,
  Briefcase,
  Camera,
} from 'lucide-react'
import { toast } from 'sonner'
import { tdoApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'
import {
  onboardingStep1Schema,
  onboardingStep2Schema,
  type OnboardingStep1Data,
  type OnboardingStep2Data,
} from '@/types/auth.types'
import { cn } from '@/lib/utils'

const AU_STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA']

const JOB_TITLES = [
  'Owner / Director',
  'Sole Trader',
  'Project Manager',
  'Site Supervisor',
  'Office Manager',
  'Estimator',
  'Other',
]

interface PendingProfile {
  businessName?: string
  firstName?: string
  lastName?: string
}

// ── Root ─────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const [step, setStep] = useState<1 | 2>(1)

  return (
    <div className="flex min-h-screen">
      <Sidebar step={step} />
      {step === 1 ? (
        <Step1Form onSuccess={() => setStep(2)} />
      ) : (
        <Step2Form onBack={() => setStep(1)} />
      )}
    </div>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────

const STEP_META = {
  1: {
    heading: 'Building the foundation.',
    description:
      "Your business details are used to generate professional quotes, invoices, and legal compliance documents. Let's get the basics right.",
    label: 'FIRST STEP: BUSINESS IDENTITY',
    progress: 'w-1/3',
  },
  2: {
    heading: 'Mastering the details.',
    description:
      'Your professional identity helps trades companies and clients quickly recognise your authority and ensures consistency across every work order and interaction.',
    label: 'SECOND STEP: USER IDENTITY',
    progress: 'w-2/3',
  },
}

function Sidebar({ step }: { step: 1 | 2 }) {
  const meta = STEP_META[step]
  return (
    <aside
      className="hidden w-[461px] shrink-0 flex-col justify-between p-10 lg:flex"
      style={{ background: '#001849' }}
    >
      <span className="font-manrope text-2xl font-extrabold tracking-tight text-white">
        TradieOne
      </span>

      <div className="space-y-5">
        <h2 className="font-manrope text-[40px] font-bold leading-[52px] tracking-[-0.8px] text-white">
          {meta.heading}
        </h2>
        <p className="font-inter text-base leading-7 text-white/70">{meta.description}</p>
      </div>

      <div className="space-y-3">
        <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.6px] text-white/50">
          STEP 0{step} OF 03
        </p>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
          <div className={cn('h-full rounded-full bg-white transition-all duration-500', meta.progress)} />
        </div>
        <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.6px] text-white/70">
          {meta.label}
        </p>
      </div>
    </aside>
  )
}

// ── Step 1 ────────────────────────────────────────────────────────

function Step1Form({ onSuccess }: { onSuccess: () => void }) {
  const tenantId = useAuthStore((s) => s.tenantId)

  const pending: PendingProfile = JSON.parse(
    localStorage.getItem('tradieone-pending-profile') ?? '{}',
  )

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OnboardingStep1Data>({
    resolver: zodResolver(onboardingStep1Schema),
    defaultValues: { isGstRegistered: false },
  })

  const isGstRegistered = watch('isGstRegistered')

  const { mutate: updateTenant, isPending } = useMutation({
    mutationFn: (data: OnboardingStep1Data) =>
      tdoApi
        .put(`/api/Tenants/${tenantId}`, {
          name: pending.businessName ?? '',
          email: data.businessEmail,
          phone: data.businessPhone,
          abn: data.abn,
          isGstregistered: data.isGstRegistered,
          addressLine1: data.addressLine1,
          addressLine2: '',
          suburb: data.suburb,
          state: data.state,
          postcode: data.postcode,
          country: 'Australia',
          logoUrl: '',
        })
        .then((r) => r.data),
    onSuccess: () => {
      onSuccess()
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
          'Failed to save business details.'
        toast.error(String(msg))
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    },
  })

  return (
    <main className="flex flex-1 items-start justify-center overflow-y-auto bg-[#fcf9f8] px-6 py-10 lg:px-12">
      <div className="w-full max-w-[800px] space-y-8">
        <div className="space-y-2">
          <h1 className="font-manrope text-[40px] font-bold leading-[52px] tracking-[-0.8px] text-[#1c1b1b]">
            Tell us about your business
          </h1>
          <p className="font-inter text-base text-[#424656]">
            This helps us personalise your TradieOne experience.
          </p>
        </div>

        <form onSubmit={handleSubmit((d) => updateTenant(d))} noValidate>
          <div className="space-y-8 rounded-2xl border border-[rgba(194,198,216,0.3)] bg-white/70 p-10 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] backdrop-blur-sm">
            {/* Logo Upload */}
            <div className="space-y-2">
              <span className="block font-inter text-[11px] font-semibold uppercase tracking-[0.6px] text-[#424656]">
                BUSINESS LOGO
              </span>
              <label className="flex h-[140px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#c2c6d8] bg-[#f8f9fc] transition-colors hover:border-[#0050cb]/50 hover:bg-[#f0f4ff]">
                <input type="file" accept="image/*" className="sr-only" />
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0f4ff]">
                  <Building2 className="h-6 w-6 text-[#0050cb]" />
                </div>
                <div className="text-center">
                  <p className="font-inter text-sm font-semibold text-[#1c1b1b]">
                    Click to upload your logo
                  </p>
                  <p className="mt-0.5 font-inter text-xs text-[#9ca3af]">PNG, JPG up to 5MB</p>
                </div>
              </label>
            </div>

            {/* 2×2 Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field label="BUSINESS ABN" error={errors.abn?.message}>
                <input
                  type="text"
                  placeholder="11 000 000 000"
                  {...register('abn')}
                  className={inputClass(!!errors.abn)}
                />
              </Field>

              <Field label="BUSINESS EMAIL" error={errors.businessEmail?.message}>
                <div className="relative">
                  <IconWrap><Mail className="h-4 w-4 text-[#9ca3af]" /></IconWrap>
                  <input
                    type="email"
                    placeholder="hello@yourbusiness.com"
                    {...register('businessEmail')}
                    className={cn(inputClass(!!errors.businessEmail), 'pl-11')}
                  />
                </div>
              </Field>

              <Field label="BUSINESS PHONE" error={errors.businessPhone?.message}>
                <div className="relative">
                  <IconWrap><Phone className="h-4 w-4 text-[#9ca3af]" /></IconWrap>
                  <input
                    type="tel"
                    placeholder="0400 000 000"
                    {...register('businessPhone')}
                    className={cn(inputClass(!!errors.businessPhone), 'pl-11')}
                  />
                </div>
              </Field>

              <Field label="GST REGISTERED">
                <div className={cn(inputClass(false), 'flex items-center gap-4')}>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isGstRegistered}
                    onClick={() =>
                      setValue('isGstRegistered', !isGstRegistered, { shouldValidate: true })
                    }
                    className={cn(
                      'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none',
                      isGstRegistered ? 'bg-[#0050cb]' : 'bg-[#e5e7eb]',
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform',
                        isGstRegistered ? 'translate-x-5' : 'translate-x-0',
                      )}
                    />
                  </button>
                  <span className="font-inter text-sm text-[#424656]">
                    {isGstRegistered ? 'Yes, GST registered' : 'Not GST registered'}
                  </span>
                </div>
              </Field>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <Field label="BUSINESS ADDRESS" error={errors.addressLine1?.message}>
                <div className="relative">
                  <IconWrap><MapPin className="h-4 w-4 text-[#9ca3af]" /></IconWrap>
                  <input
                    type="text"
                    placeholder="Street address"
                    {...register('addressLine1')}
                    className={cn(inputClass(!!errors.addressLine1), 'pl-11')}
                  />
                </div>
              </Field>

              <div className="grid grid-cols-3 gap-4">
                <Field label="SUBURB" error={errors.suburb?.message}>
                  <input
                    type="text"
                    placeholder="Suburb"
                    {...register('suburb')}
                    className={inputClass(!!errors.suburb)}
                  />
                </Field>
                <Field label="STATE" error={errors.state?.message}>
                  <select
                    {...register('state')}
                    className={cn(inputClass(!!errors.state), 'cursor-pointer')}
                  >
                    <option value="">Select</option>
                    {AU_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="POSTCODE" error={errors.postcode?.message}>
                  <input
                    type="text"
                    placeholder="0000"
                    maxLength={4}
                    {...register('postcode')}
                    className={inputClass(!!errors.postcode)}
                  />
                </Field>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center justify-end gap-6 pt-2">
              <button
                type="button"
                onClick={() => window.location.href = '/dashboard'}
                className="font-inter text-sm font-semibold text-[#424656] hover:text-[#1c1b1b]"
              >
                Skip for now
              </button>
              <button
                type="submit"
                disabled={isPending}
                style={{ background: 'linear-gradient(90deg, #0050cb 0%, #4442e3 100%)' }}
                className={cn(
                  'flex h-12 items-center gap-2 rounded-xl px-8',
                  'font-inter text-base font-semibold text-white',
                  'shadow-[0px_10px_15px_-3px_rgba(0,80,203,0.2),0px_4px_6px_-4px_rgba(0,80,203,0.2)]',
                  'transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60',
                )}
              >
                {isPending ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Save and Continue
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}

// ── Step 2 ────────────────────────────────────────────────────────

function Step2Form({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate()
  const tenantId = useAuthStore((s) => s.tenantId)

  const pending: PendingProfile = JSON.parse(
    localStorage.getItem('tradieone-pending-profile') ?? '{}',
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingStep2Data>({
    resolver: zodResolver(onboardingStep2Schema),
    defaultValues: {
      firstName: pending.firstName ?? '',
      lastName: pending.lastName ?? '',
    },
  })

  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: (data: OnboardingStep2Data) =>
      tdoApi
        .put('/api/UserProfiles', data, {
          params: { tenantId },
        })
        .then((r) => r.data),
    onSuccess: () => {
      localStorage.removeItem('tradieone-pending-profile')
      navigate('/dashboard')
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
          'Failed to save profile.'
        toast.error(String(msg))
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    },
  })

  return (
    <main className="flex flex-1 items-start justify-center overflow-y-auto bg-[#fcf9f8] px-6 py-10 lg:px-12">
      <div className="w-full max-w-[800px] space-y-8">
        <div className="space-y-2">
          <h1 className="font-manrope text-[40px] font-bold leading-[52px] tracking-[-0.8px] text-[#1c1b1b]">
            Set up your profile
          </h1>
          <p className="font-inter text-base text-[#424656]">
            Let's personalise your account for you.
          </p>
        </div>

        <form onSubmit={handleSubmit((d) => saveProfile(d))} noValidate>
          <div className="space-y-8 rounded-2xl border border-[rgba(194,198,216,0.3)] bg-white/70 p-10 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] backdrop-blur-sm">
            {/* Avatar Upload */}
            <div className="flex items-center gap-8">
              <div className="relative shrink-0">
                <div className="flex h-[128px] w-[128px] items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#f0f4ff] shadow-lg">
                  <User className="h-14 w-14 text-[#0050cb]/40" />
                </div>
                <button
                  type="button"
                  className="absolute bottom-1 right-1 flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#0050cb] shadow-lg"
                >
                  <Camera className="h-3 w-3 text-white" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="font-manrope text-lg font-semibold text-[#1c1b1b]">Profile Photo</p>
                  <p className="font-inter text-sm text-[#424656]">
                    Upload a professional headshot
                  </p>
                </div>
                <div className="flex gap-3">
                  <label className="cursor-pointer rounded-lg border border-[#c2c6d8] px-4 py-2 font-inter text-sm font-semibold text-[#1c1b1b] transition-colors hover:bg-gray-50">
                    <input type="file" accept="image/*" className="sr-only" />
                    Upload Photo
                  </label>
                  <button
                    type="button"
                    className="rounded-lg px-4 py-2 font-inter text-sm font-semibold text-[#9ca3af] transition-colors hover:text-[#424656]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* 2×2 Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field label="FIRST NAME" error={errors.firstName?.message}>
                <div className="relative">
                  <IconWrap><User className="h-4 w-4 text-[#9ca3af]" /></IconWrap>
                  <input
                    type="text"
                    placeholder="Michael"
                    {...register('firstName')}
                    className={cn(inputClass(!!errors.firstName), 'pl-11')}
                  />
                </div>
              </Field>

              <Field label="LAST NAME" error={errors.lastName?.message}>
                <div className="relative">
                  <IconWrap><User className="h-4 w-4 text-[#9ca3af]" /></IconWrap>
                  <input
                    type="text"
                    placeholder="Smith"
                    {...register('lastName')}
                    className={cn(inputClass(!!errors.lastName), 'pl-11')}
                  />
                </div>
              </Field>

              <Field label="PHONE NUMBER" error={errors.phone?.message}>
                <div className="relative">
                  <IconWrap><Phone className="h-4 w-4 text-[#9ca3af]" /></IconWrap>
                  <input
                    type="tel"
                    placeholder="+61 400 000 000"
                    {...register('phone')}
                    className={cn(inputClass(!!errors.phone), 'pl-11')}
                  />
                </div>
              </Field>

              <Field label="DATE OF BIRTH" error={errors.dateOfBirth?.message}>
                <div className="relative">
                  <IconWrap><Calendar className="h-4 w-4 text-[#9ca3af]" /></IconWrap>
                  <input
                    type="date"
                    {...register('dateOfBirth')}
                    className={cn(inputClass(!!errors.dateOfBirth), 'pl-11')}
                  />
                </div>
              </Field>
            </div>

            {/* Job Title — full width */}
            <Field label="JOB TITLE" error={errors.jobTitle?.message}>
              <div className="relative">
                <IconWrap><Briefcase className="h-4 w-4 text-[#9ca3af]" /></IconWrap>
                <select
                  {...register('jobTitle')}
                  className={cn(inputClass(!!errors.jobTitle), 'cursor-pointer pl-11')}
                >
                  <option value="">Select your role</option>
                  {JOB_TITLES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </Field>

            {/* CTAs */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-2 rounded-xl border border-[#c2c6d8] px-6 py-3 font-inter text-sm font-semibold text-[#424656] transition-colors hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Go Back
              </button>

              <button
                type="submit"
                disabled={isPending}
                style={{ background: 'linear-gradient(90deg, #0050cb 0%, #4442e3 100%)' }}
                className={cn(
                  'flex h-12 items-center gap-2 rounded-xl px-8',
                  'font-inter text-base font-semibold text-white',
                  'shadow-[0px_10px_15px_-3px_rgba(0,80,203,0.2),0px_4px_6px_-4px_rgba(0,80,203,0.2)]',
                  'transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60',
                )}
              >
                {isPending ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Complete Setup
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}

// ── Shared helpers ────────────────────────────────────────────────

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
    <div className="space-y-1.5">
      <span className="block font-inter text-[11px] font-semibold uppercase tracking-[0.6px] text-[#424656]">
        {label}
      </span>
      {children}
      {error && <p className="font-inter text-xs text-red-500">{error}</p>}
    </div>
  )
}

function IconWrap({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
      {children}
    </span>
  )
}

function inputClass(hasError: boolean) {
  return cn(
    'h-12 w-full rounded-xl border bg-white px-4 py-[10px]',
    'font-inter text-base text-[#1c1b1b] placeholder:text-[#c2c6d8]',
    'outline-none transition-colors',
    'focus:border-[#0050cb] focus:ring-2 focus:ring-[#0050cb]/20',
    hasError ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : 'border-[#c2c6d8]',
  )
}
