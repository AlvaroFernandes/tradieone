import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Building2,
  ChevronDown,
  FileText,
  Lock,
  Mail,
  MapPin,
  Pencil,
  Phone,
  User,
  UserPlus,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  GST_OPTIONS,
  PAYMENT_TERMS,
  newClientSchema,
  type NewClientFormData,
} from '@/types/client.types'

interface NewClientModalProps {
  onClose: () => void
  onCreate: (data: NewClientFormData) => void
}

export function NewClientModal({ onClose, onCreate }: NewClientModalProps) {
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NewClientFormData>({
    resolver: zodResolver(newClientSchema),
    defaultValues: { primaryContactSameAsClient: false },
  })

  const clientType = watch('clientType')
  const clientName = watch('clientName')
  const phone = watch('phone')
  const email = watch('email')
  const sameAsClient = watch('primaryContactSameAsClient')

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarPreview(URL.createObjectURL(file))
  }

  function toggleSameAsClient(checked: boolean) {
    setValue('primaryContactSameAsClient', checked)
    if (checked) {
      setValue('contactName', clientName ?? '')
      setValue('contactMobile', phone ?? '')
      setValue('contactEmail', email ?? '')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-[660px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#e5e7eb] p-6">
          <div>
            <h2 className="font-manrope text-2xl font-bold text-[#1c1b1b]">Create New Client</h2>
            <p className="font-inter text-sm text-[#424656]">
              Register a new residential or commercial partner.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#9ca3af] hover:bg-gray-100 hover:text-[#1c1b1b]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          id="new-client-form"
          onSubmit={handleSubmit(onCreate)}
          className="flex-1 space-y-6 overflow-y-auto p-6"
        >
          <section className="space-y-4">
            <SectionHeading icon={<Building2 className="h-4 w-4" />} label="Client Information" />

            <div className="flex items-start gap-6">
              <div className="relative shrink-0">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#f0f4ff] shadow-md">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Client avatar" className="h-full w-full object-cover" />
                  ) : (
                    <Building2 className="h-9 w-9 text-[#0050cb]/40" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#0050cb] shadow-md"
                >
                  <Pencil className="h-3 w-3 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <div className="flex-1 space-y-4">
                <FormField label="Client Name" required error={errors.clientName?.message}>
                  <input
                    type="text"
                    placeholder="e.g. ABC Corporation"
                    {...register('clientName')}
                    className={inputClass(!!errors.clientName)}
                  />
                </FormField>

                <FormField label="Client Type" required error={errors.clientType?.message}>
                  <div className="relative">
                    <select
                      {...register('clientType')}
                      defaultValue=""
                      className={cn(inputClass(!!errors.clientType), 'cursor-pointer appearance-none pr-10')}
                    >
                      <option value="" disabled>
                        Select client type
                      </option>
                      <option value="Commercial">Commercial</option>
                      <option value="Residential">Residential</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                  </div>
                </FormField>
              </div>
            </div>

            <FormField label="Email">
              <div className="relative">
                <IconWrap>
                  <Mail className="h-4 w-4 text-[#9ca3af]" />
                </IconWrap>
                <input
                  type="email"
                  placeholder="Enter email address"
                  {...register('email')}
                  className={cn(inputClass(!!errors.email), 'pl-11')}
                />
              </div>
            </FormField>

            <FormField label="Phone">
              <div className="relative">
                <IconWrap>
                  <Phone className="h-4 w-4 text-[#9ca3af]" />
                </IconWrap>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  {...register('phone')}
                  className={cn(inputClass(false), 'pl-11')}
                />
              </div>
            </FormField>

            <button
              type="button"
              onClick={() => setShowAdditionalDetails((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl border border-[#e5e7eb] bg-[#f8f9fc] px-4 py-3 text-left"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-[#424656]" />
                <div>
                  <p className="font-inter text-sm font-semibold text-[#1c1b1b]">Additional Details</p>
                  <p className="font-inter text-xs text-[#9ca3af]">
                    Address, ABN, payment terms, notes and more.
                  </p>
                </div>
              </div>
              <ChevronDown
                className={cn('h-4 w-4 text-[#9ca3af] transition-transform', showAdditionalDetails && 'rotate-180')}
              />
            </button>

            {showAdditionalDetails && (
              <div className="space-y-4 rounded-xl border border-[#e5e7eb] bg-[#f8f9fc] p-4">
                <FormField label="Address">
                  <div className="relative">
                    <IconWrap>
                      <MapPin className="h-4 w-4 text-[#9ca3af]" />
                    </IconWrap>
                    <input
                      type="text"
                      placeholder="Search for address..."
                      {...register('address')}
                      className={cn(inputClass(false), 'bg-white pl-11')}
                    />
                  </div>
                </FormField>

                <FormField
                  label="ABN"
                  required={clientType === 'Commercial'}
                  error={errors.abn?.message}
                >
                  <input
                    type="text"
                    placeholder="e.g. 12 345 678 910"
                    {...register('abn')}
                    className={cn(inputClass(!!errors.abn), 'bg-white')}
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Payment Terms">
                    <div className="relative">
                      <select
                        {...register('paymentTerms')}
                        defaultValue={PAYMENT_TERMS[1]}
                        className={cn(inputClass(false), 'cursor-pointer appearance-none bg-white pr-10')}
                      >
                        {PAYMENT_TERMS.map((term) => (
                          <option key={term} value={term}>
                            {term}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                    </div>
                  </FormField>
                  <FormField label="Default GST">
                    <div className="relative">
                      <select
                        {...register('defaultGst')}
                        defaultValue={GST_OPTIONS[0]}
                        className={cn(inputClass(false), 'cursor-pointer appearance-none bg-white pr-10')}
                      >
                        {GST_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                    </div>
                  </FormField>
                </div>

                <FormField label="Notes">
                  <textarea
                    rows={3}
                    placeholder="Add any internal notes about this client..."
                    {...register('notes')}
                    className={cn(inputClass(false), 'h-auto bg-white py-3')}
                  />
                </FormField>
              </div>
            )}
          </section>

          <section className="space-y-4 border-t border-[#e5e7eb] pt-6">
            <SectionHeading icon={<User className="h-4 w-4" />} label="Primary Contact" />

            <label className="flex items-center gap-2 font-inter text-sm text-[#424656]">
              <input
                type="checkbox"
                checked={sameAsClient}
                onChange={(e) => toggleSameAsClient(e.target.checked)}
                className="h-4 w-4 rounded accent-[#0050cb]"
              />
              Primary contact is same as client
            </label>

            <FormField label="Contact Name" required error={errors.contactName?.message}>
              <input
                type="text"
                placeholder="e.g. Michael Brown"
                disabled={sameAsClient}
                {...register('contactName')}
                className={cn(inputClass(!!errors.contactName), sameAsClient && 'bg-gray-100 text-[#9ca3af]')}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Mobile">
                <div className="relative">
                  <IconWrap>
                    <Phone className="h-4 w-4 text-[#9ca3af]" />
                  </IconWrap>
                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    disabled={sameAsClient}
                    {...register('contactMobile')}
                    className={cn(inputClass(false), 'pl-11', sameAsClient && 'bg-gray-100 text-[#9ca3af]')}
                  />
                </div>
              </FormField>
              <FormField label="Email">
                <div className="relative">
                  <IconWrap>
                    <Mail className="h-4 w-4 text-[#9ca3af]" />
                  </IconWrap>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    disabled={sameAsClient}
                    {...register('contactEmail')}
                    className={cn(inputClass(!!errors.contactEmail), 'pl-11', sameAsClient && 'bg-gray-100 text-[#9ca3af]')}
                  />
                </div>
              </FormField>
            </div>
          </section>
        </form>

        <div className="space-y-3 border-t border-[#e5e7eb] p-6">
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 items-center rounded-xl border border-[#c2c6d8] bg-white px-6 font-inter text-sm font-semibold text-[#1c1b1b] hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="new-client-form"
              disabled={isSubmitting}
              className={cn(
                'flex h-11 items-center gap-2 rounded-xl bg-[#0050cb] px-6 font-inter text-sm font-semibold text-white',
                'transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60',
              )}
            >
              <UserPlus className="h-4 w-4" />
              Create Client
            </button>
          </div>
          <p className="flex items-center justify-center gap-1.5 font-inter text-xs text-[#9ca3af]">
            <Lock className="h-3 w-3" />
            Your information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  )
}

function SectionHeading({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-[#1c1b1b]">
      {icon}
      <h3 className="font-manrope text-base font-bold">{label}</h3>
    </div>
  )
}

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <span className="block font-inter text-[11px] font-semibold uppercase tracking-[0.6px] text-[#424656]">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
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
