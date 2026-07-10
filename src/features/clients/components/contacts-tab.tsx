import { useMemo, useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
  ChevronDown,
  Download,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Smartphone,
  Star,
  Trash2,
  Upload,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { getInitials } from '@/features/clients/hooks/use-clients'
import { AddContactModal } from '@/features/clients/components/add-contact-modal'
import type { ClientDetail, ContactFormData, ContactRow } from '@/types/client.types'

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50]

export function buildInitialContacts(client: ClientDetail): ContactRow[] {
  if (!client.contact.name) return []
  return [
    {
      id: 'primary',
      initials: getInitials(client.contact.name),
      name: client.contact.name,
      jobTitle: client.contact.jobTitle,
      contactType: 'Management',
      email: client.contact.email,
      phone: client.contact.phone,
      mobile: client.contact.mobile,
      isPrimary: true,
    },
  ]
}

interface ContactsTabProps {
  contacts: ContactRow[]
  onContactsChange: (contacts: ContactRow[]) => void
}

export function ContactsTab({ contacts, onContactsChange }: ContactsTabProps) {
  const [search, setSearch] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [showAddModal, setShowAddModal] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return contacts
    return contacts.filter(
      (c) => c.name.toLowerCase().includes(q) || (c.email ?? '').toLowerCase().includes(q),
    )
  }, [contacts, search])

  const pageRows = filtered.slice(0, rowsPerPage)

  function handleAddContact(data: ContactFormData) {
    const newContact: ContactRow = {
      id: crypto.randomUUID(),
      initials: getInitials(data.name),
      name: data.name,
      jobTitle: data.jobTitle?.trim() || null,
      contactType: data.contactType,
      email: data.email?.trim() || null,
      phone: data.phone?.trim() || null,
      mobile: data.mobile?.trim() || null,
      isPrimary: data.isPrimary,
    }
    const next = data.isPrimary ? contacts.map((c) => ({ ...c, isPrimary: false })) : contacts
    onContactsChange([...next, newContact])
    setShowAddModal(false)
    toast.success('Contact added locally — saving to the server isn’t connected yet.')
  }

  function handleSetPrimary(id: string) {
    onContactsChange(contacts.map((c) => ({ ...c, isPrimary: c.id === id })))
  }

  function handleRemove(id: string) {
    onContactsChange(contacts.filter((c) => c.id !== id))
    toast.success('Contact removed locally.')
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-manrope text-lg font-bold text-[#1c1b1b]">Contacts</h2>
            <p className="font-inter text-sm text-[#9ca3af]">Manage people associated with this client.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search contact by name, email..."
                className="h-10 w-72 rounded-xl border border-[#c2c6d8] bg-white pl-11 pr-4 font-inter text-sm text-[#1c1b1b] placeholder:text-[#9ca3af] outline-none focus:border-[#0050cb] focus:ring-2 focus:ring-[#0050cb]/20"
              />
            </div>
            <button
              type="button"
              onClick={() => toast.info("Exporting contacts isn't connected to the server yet.")}
              className="flex h-10 items-center gap-2 rounded-xl border border-[#c2c6d8] bg-white px-4 font-inter text-sm font-semibold text-[#1c1b1b] hover:bg-gray-50"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse font-inter text-sm">
            <thead>
              <tr className="border-b border-[#e5e7eb] text-left">
                <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">Contact</th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">Type</th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">Email</th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">
                  Phone / Mobile
                </th>
                <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">
                  Primary
                </th>
                <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((contact) => (
                <tr key={contact.id} className="border-b border-[#e5e7eb] last:border-0">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] font-inter text-xs font-semibold text-[#0050cb]">
                        {contact.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-[#1c1b1b]">{contact.name}</p>
                          {contact.isPrimary && (
                            <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-700">
                              Primary
                            </span>
                          )}
                        </div>
                        {contact.jobTitle && <p className="text-xs text-[#9ca3af]">{contact.jobTitle}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-[#1c1b1b]">{contact.contactType}</td>
                  <td className="py-4 pr-4 text-[#1c1b1b]">{contact.email ?? '—'}</td>
                  <td className="py-4 pr-4">
                    <p className="flex items-center gap-1.5 text-[#1c1b1b]">
                      <Phone className="h-3.5 w-3.5 text-[#9ca3af]" />
                      {contact.phone ?? '-'}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-[#1c1b1b]">
                      <Smartphone className="h-3.5 w-3.5 text-[#9ca3af]" />
                      {contact.mobile ?? '-'}
                    </p>
                  </td>
                  <td className="py-4 text-center">
                    {contact.isPrimary ? (
                      <span className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-green-50 text-green-600">
                        ✓
                      </span>
                    ) : (
                      <span className="text-[#9ca3af]">—</span>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button
                          type="button"
                          className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-[#9ca3af] hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          align="end"
                          sideOffset={6}
                          className="z-50 min-w-[180px] rounded-xl border border-[#e5e7eb] bg-white p-1.5 font-inter text-sm shadow-lg"
                        >
                          {!contact.isPrimary && (
                            <DropdownMenu.Item
                              onSelect={() => handleSetPrimary(contact.id)}
                              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-[#1c1b1b] outline-none hover:bg-gray-50"
                            >
                              <Star className="h-4 w-4" />
                              Set as Primary
                            </DropdownMenu.Item>
                          )}
                          <DropdownMenu.Item
                            onSelect={() => handleRemove(contact.id)}
                            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-red-600 outline-none hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#9ca3af]">
                    No contacts match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#c2c6d8] py-4 font-inter text-sm font-semibold text-[#0050cb] hover:bg-[#f8f9fc]"
        >
          <Plus className="h-4 w-4" />
          Add Contact
        </button>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="font-inter text-sm text-[#424656]">
            Showing {filtered.length === 0 ? 0 : 1} to {Math.min(rowsPerPage, filtered.length)} of{' '}
            {filtered.length} contacts
          </p>
          <div className="flex items-center gap-2 font-inter text-sm text-[#424656]">
            <div className="relative">
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="h-8 cursor-pointer appearance-none rounded-lg border border-[#e5e7eb] bg-white pl-3 pr-8 font-inter text-sm text-[#1c1b1b] outline-none"
              >
                {ROWS_PER_PAGE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n} per page
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9ca3af]" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e5e7eb] bg-[#f8f9fc] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef2ff]">
            <Users className="h-5 w-5 text-[#0050cb]" />
          </div>
          <div>
            <p className="font-manrope text-sm font-bold text-[#1c1b1b]">Need to add more contacts?</p>
            <p className="font-inter text-sm text-[#9ca3af]">
              Invite multiple stakeholders to keep everyone in the loop.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => toast.info("Bulk importing contacts isn't connected to the server yet.")}
          className="flex h-10 items-center gap-2 rounded-xl border border-[#c2c6d8] bg-white px-4 font-inter text-sm font-semibold text-[#1c1b1b] hover:bg-gray-50"
        >
          <Upload className="h-4 w-4" />
          Bulk Import
        </button>
      </div>

      {showAddModal && (
        <AddContactModal onClose={() => setShowAddModal(false)} onCreate={handleAddContact} />
      )}
    </div>
  )
}
