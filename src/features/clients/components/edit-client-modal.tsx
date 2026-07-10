import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, ChevronDown, Mail, Pencil, Phone, Save, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  CLIENT_STATUSES,
  CLIENT_TYPES,
  GST_OPTIONS,
  PAYMENT_TERMS,
  editClientSchema,
  type EditClientFormData,
} from '@/types/client.types'
import type { ClientDetail } from '@/types/client.types'

interface EditClientModalProps {
  client: ClientDetail
  onClose: () => void
  onSave: (data: EditClientFormData) => void
}

export function EditClientModal({ client, onClose, onSave }: EditClientModalProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsOpen(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditClientFormData>({
    resolver: zodResolver(editClientSchema),
    defaultValues: {
      clientName: client.name,
      clientType: client.type,
      status: client.status,
      email: client.email ?? '',
      phone: client.phone ?? '',
      address: client.address ?? '',
      abn: client.abn ?? '',
      paymentTerms: client.paymentTerms ?? PAYMENT_TERMS[2],
      gstStatus: GST_OPTIONS[0],
      notes: client.notes ?? '',
    },
  })

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarPreview(URL.createObjectURL(file))
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex justify-end bg-black/30 transition-opacity duration-300',
        isOpen ? 'opacity-100' : 'opacity-0',
      )}
    >
      <div
        className={cn(
          'flex h-full w-full max-w-[600px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-start justify-between border-b border-[#e5e7eb] p-6">
          <div>
            <h2 className="font-manrope text-2xl font-bold text-[#1c1b1b]">Edit Client</h2>
            <p className="font-inter text-sm text-[#424656]">Update the client information below.</p>
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
          id="edit-client-form"
          onSubmit={handleSubmit(onSave)}
          className="flex-1 space-y-4 overflow-y-auto p-6"
        >
          <SectionHeading icon={<Building2 className="h-4 w-4" />} label="Client Information" />

          <div className="flex items-start gap-6">
            <div className="relative shrink-0">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#001849] font-manrope text-2xl font-bold text-white">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Client avatar" className="h-full w-full object-cover" />
                ) : (
                  client.initials
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
                  {...register('clientName')}
                  className={inputClass(!!errors.clientName)}
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Client Type" required error={errors.clientType?.message}>
                  <div className="relative">
                    <select
                      {...register('clientType')}
                      className={cn(inputClass(!!errors.clientType), 'cursor-pointer appearance-none pr-10')}
                    >
                      {CLIENT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                  </div>
                </FormField>
                <FormField label="Status">
                  <div className="relative">
                    <select
                      {...register('status')}
                      className={cn(inputClass(false), 'cursor-pointer appearance-none pr-10')}
                    >
                      {CLIENT_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                  </div>
                </FormField>
              </div>
            </div>
          </div>

          <FormField label="Email" error={errors.email?.message}>
            <div className="relative">
              <IconWrap>
                <Mail className="h-4 w-4 text-[#9ca3af]" />
              </IconWrap>
              <input type="email" {...register('email')} className={cn(inputClass(!!errors.email), 'pl-11')} />
            </div>
          </FormField>

          <FormField label="Phone">
            <div className="relative">
              <IconWrap>
                <Phone className="h-4 w-4 text-[#9ca3af]" />
              </IconWrap>
              <input type="tel" {...register('phone')} className={cn(inputClass(false), 'pl-11')} />
            </div>
          </FormField>

          <FormField label="Address">
            <input
              type="text"
              placeholder="Search for address..."
              {...register('address')}
              className={inputClass(false)}
            />
          </FormField>

          <FormField label="ABN" required={false} error={errors.abn?.message}>
            <input type="text" {...register('abn')} className={inputClass(!!errors.abn)} />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Payment Terms">
              <div className="relative">
                <select
                  {...register('paymentTerms')}
                  className={cn(inputClass(false), 'cursor-pointer appearance-none pr-10')}
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
            <FormField label="GST Status">
              <div className="relative">
                <select
                  {...register('gstStatus')}
                  className={cn(inputClass(false), 'cursor-pointer appearance-none pr-10')}
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
              rows={4}
              {...register('notes')}
              className={cn(inputClass(false), 'h-auto py-3')}
            />
          </FormField>
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
              form="edit-client-form"
              disabled={isSubmitting}
              className={cn(
                'flex h-11 items-center gap-2 rounded-xl bg-[#0050cb] px-6 font-inter text-sm font-semibold text-white',
                'transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60',
              )}
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
          <p className="flex items-center justify-center gap-1.5 font-inter text-xs text-[#9ca3af]">
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
