import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, Mail, Phone, User, UserPlus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CONTACT_TYPES, contactSchema, type ContactFormData } from '@/types/client.types'

interface AddContactModalProps {
  onClose: () => void
  onCreate: (data: ContactFormData) => void
}

export function AddContactModal({ onClose, onCreate }: AddContactModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsOpen(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { contactType: 'Management', isPrimary: false },
  })

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex justify-end bg-black/30 transition-opacity duration-300',
        isOpen ? 'opacity-100' : 'opacity-0',
      )}
    >
      <div
        className={cn(
          'flex h-full w-full max-w-[480px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-start justify-between border-b border-[#e5e7eb] p-6">
          <div className="flex items-center gap-2 text-[#1c1b1b]">
            <User className="h-4 w-4" />
            <h2 className="font-manrope text-xl font-bold">Add Contact</h2>
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
          id="add-contact-form"
          onSubmit={handleSubmit(onCreate)}
          className="flex-1 space-y-4 overflow-y-auto p-6"
        >
          <FormField label="Contact Name" required error={errors.name?.message}>
            <input
              type="text"
              placeholder="e.g. Sarah Richards"
              {...register('name')}
              className={inputClass(!!errors.name)}
            />
          </FormField>

          <FormField label="Job Title">
            <input
              type="text"
              placeholder="e.g. Accounts Manager"
              {...register('jobTitle')}
              className={inputClass(false)}
            />
          </FormField>

          <FormField label="Contact Type" required error={errors.contactType?.message}>
            <div className="relative">
              <select
                {...register('contactType')}
                className={cn(inputClass(!!errors.contactType), 'cursor-pointer appearance-none pr-10')}
              >
                {CONTACT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
            </div>
          </FormField>

          <FormField label="Email" error={errors.email?.message}>
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

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Phone">
              <div className="relative">
                <IconWrap>
                  <Phone className="h-4 w-4 text-[#9ca3af]" />
                </IconWrap>
                <input
                  type="tel"
                  placeholder="Landline"
                  {...register('phone')}
                  className={cn(inputClass(false), 'pl-11')}
                />
              </div>
            </FormField>
            <FormField label="Mobile">
              <div className="relative">
                <IconWrap>
                  <Phone className="h-4 w-4 text-[#9ca3af]" />
                </IconWrap>
                <input
                  type="tel"
                  placeholder="Mobile"
                  {...register('mobile')}
                  className={cn(inputClass(false), 'pl-11')}
                />
              </div>
            </FormField>
          </div>

          <label className="flex items-center gap-2 font-inter text-sm text-[#424656]">
            <input type="checkbox" {...register('isPrimary')} className="h-4 w-4 rounded accent-[#0050cb]" />
            Set as primary contact
          </label>
        </form>

        <div className="flex items-center justify-end gap-3 border-t border-[#e5e7eb] p-6">
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 items-center rounded-xl border border-[#c2c6d8] bg-white px-6 font-inter text-sm font-semibold text-[#1c1b1b] hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-contact-form"
            disabled={isSubmitting}
            className={cn(
              'flex h-11 items-center gap-2 rounded-xl bg-[#0050cb] px-6 font-inter text-sm font-semibold text-white',
              'transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60',
            )}
          >
            <UserPlus className="h-4 w-4" />
            Add Contact
          </button>
        </div>
      </div>
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
  return <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center">{children}</span>
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
