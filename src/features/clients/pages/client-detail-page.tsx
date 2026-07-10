import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
  Archive,
  Building2,
  ChevronDown,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  Loader2,
  Mail,
  MapPin,
  MoreHorizontal,
  Pencil,
  Phone,
  Trash2,
  User,
  UserPlus,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useClientDetail } from '@/features/clients/hooks/use-client-detail'
import { ContactsTab, buildInitialContacts } from '@/features/clients/components/contacts-tab'
import type { ClientDetail, ContactRow } from '@/types/client.types'

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'contacts', label: 'Contacts' },
  { key: 'projects', label: 'Projects' },
  { key: 'jobs', label: 'Jobs' },
  { key: 'invoices', label: 'Invoices' },
  { key: 'activity', label: 'Activity' },
  { key: 'notes', label: 'Notes & Files' },
] as const

type TabKey = (typeof TABS)[number]['key']

function formatCurrency(value: number) {
  return `$${value.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function notConnected(feature: string) {
  toast.info(`${feature} isn't connected to the server yet.`)
}

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: client, isLoading, isError, error } = useClientDetail(id)
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [contacts, setContacts] = useState<ContactRow[]>([])

  useEffect(() => {
    if (client) setContacts(buildInitialContacts(client))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client?.id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-[#9ca3af]">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading client...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="py-24 text-center text-red-500">
        {error instanceof Error ? error.message : 'Failed to load this client.'}
      </div>
    )
  }

  if (!client) {
    return (
      <div className="space-y-4 py-24 text-center">
        <p className="text-[#424656]">This client couldn&apos;t be found.</p>
        <button
          type="button"
          onClick={() => navigate('/clients')}
          className="font-inter text-sm font-semibold text-[#0050cb] hover:underline"
        >
          Back to Clients
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 font-inter text-sm text-[#9ca3af]">
        <Link to="/clients" className="hover:text-[#0050cb] hover:underline">
          Clients
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-[#1c1b1b]">{client.name}</span>
      </div>

      <ClientHeader client={client} onAddContact={() => setActiveTab('contacts')} />

      <div>
        <div className="flex flex-wrap gap-6 border-b border-[#e5e7eb]">
          {TABS.map((tab) => {
            const count = tabCount(client, contacts.length, tab.key)
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  '-mb-px flex items-center gap-1.5 border-b-2 pb-3 font-inter text-sm font-semibold',
                  activeTab === tab.key
                    ? 'border-[#0050cb] text-[#0050cb]'
                    : 'border-transparent text-[#9ca3af] hover:text-[#424656]',
                )}
              >
                {tab.label}
                {count !== null && <span className="text-xs">({count})</span>}
              </button>
            )
          })}
        </div>

        <div className="mt-6">
          {activeTab === 'overview' ? (
            <OverviewTab client={client} />
          ) : activeTab === 'contacts' ? (
            <ContactsTab contacts={contacts} onContactsChange={setContacts} />
          ) : (
            <EmptyTab tab={activeTab} />
          )}
        </div>
      </div>
    </div>
  )
}

function tabCount(client: ClientDetail, contactsCount: number, tab: TabKey): number | null {
  switch (tab) {
    case 'contacts':
      return contactsCount
    case 'projects':
      return client.totals.projects
    case 'jobs':
      return client.totals.jobs
    case 'invoices':
      return client.totals.totalInvoices
    default:
      return null
  }
}

function ClientHeader({ client, onAddContact }: { client: ClientDetail; onAddContact: () => void }) {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#001849] font-manrope text-lg font-bold text-white">
            {client.initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-manrope text-xl font-bold text-[#1c1b1b]">{client.name}</h1>
              <span
                className={cn(
                  'rounded-full px-2.5 py-1 text-xs font-semibold',
                  client.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600',
                )}
              >
                {client.status}
              </span>
              <ClientMenu />
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-inter text-sm text-[#424656]">
              <span
                className={cn(
                  'rounded-full px-2.5 py-1 text-xs font-semibold',
                  client.type === 'Commercial' ? 'bg-[#eef2ff] text-[#0050cb]' : 'bg-green-50 text-green-700',
                )}
              >
                {client.type}
              </span>
              <span className="text-[#9ca3af]">•</span>
              <span>Client since {client.clientSinceLabel}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-inter text-sm text-[#424656]">
              {client.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#9ca3af]" />
                  {client.phone}
                </span>
              )}
              {client.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-[#9ca3af]" />
                  {client.email}
                </span>
              )}
              {client.address && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#9ca3af]" />
                  {client.address}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => notConnected('Editing a client')}
            className="flex h-10 items-center gap-2 rounded-xl border border-[#c2c6d8] bg-white px-4 font-inter text-sm font-semibold text-[#1c1b1b] hover:bg-gray-50"
          >
            <Pencil className="h-4 w-4" />
            Edit Client
          </button>
          <button
            type="button"
            onClick={onAddContact}
            className="flex h-10 items-center gap-2 rounded-xl border border-[#c2c6d8] bg-white px-4 font-inter text-sm font-semibold text-[#1c1b1b] hover:bg-gray-50"
          >
            <UserPlus className="h-4 w-4" />
            Add Contact
          </button>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className="flex h-10 items-center gap-2 rounded-xl bg-[#0050cb] px-4 font-inter text-sm font-semibold text-white hover:opacity-90"
              >
                More
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={6}
                className="z-50 min-w-[190px] rounded-xl border border-[#e5e7eb] bg-white p-1.5 font-inter text-sm shadow-lg"
              >
                <DropdownMenu.Item
                  onSelect={() => notConnected('Archiving a client')}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-[#1c1b1b] outline-none hover:bg-gray-50"
                >
                  <Archive className="h-4 w-4" />
                  Archive Client
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onSelect={() => notConnected('Deleting a client')}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-red-600 outline-none hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Client
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </div>
  )
}

function ClientMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-full text-[#9ca3af] hover:bg-gray-100"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className="z-50 min-w-[190px] rounded-xl border border-[#e5e7eb] bg-white p-1.5 font-inter text-sm shadow-lg"
        >
          <DropdownMenu.Item
            onSelect={() => notConnected('Editing a client')}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-[#1c1b1b] outline-none hover:bg-gray-50"
          >
            <Pencil className="h-4 w-4" />
            Edit Client
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => notConnected('Deleting a client')}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-red-600 outline-none hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete Client
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

function Card({
  title,
  icon,
  action,
  className,
  children,
}: {
  title: string
  icon: React.ReactNode
  action?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('rounded-2xl border border-[#e5e7eb] bg-white p-6', className)}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-manrope text-base font-bold text-[#1c1b1b]">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

function InfoRow({
  label,
  value,
  align = 'center',
}: {
  label: string
  value: React.ReactNode
  align?: 'center' | 'start'
}) {
  return (
    <div
      className={cn(
        'flex justify-between py-2 font-inter text-sm',
        align === 'center' ? 'items-center' : 'items-start',
      )}
    >
      <span className="text-[#9ca3af]">{label}</span>
      <span className="font-semibold text-[#1c1b1b]">{value}</span>
    </div>
  )
}

function OverviewTab({ client }: { client: ClientDetail }) {
  const [notes, setNotes] = useState(client.notes ?? '')
  const [isEditingNotes, setIsEditingNotes] = useState(false)

  function saveNotes() {
    setIsEditingNotes(false)
    toast.success('Notes saved locally — server sync isn’t connected yet.')
  }

  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
      <Card
        title="Client Information"
        icon={
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef2ff]">
            <Building2 className="h-4 w-4 text-[#0050cb]" />
          </div>
        }
      >
        <div className="divide-y divide-[#f3f4f6]">
          <InfoRow label="Client Type" value={client.type} />
          <InfoRow label="ABN" value={client.abn ?? '—'} />
          <InfoRow label="Payment Terms" value={client.paymentTerms ?? '—'} />
          <InfoRow label="Currency" value="AUD - Australian Dollar" />
          <InfoRow label="Phone" value={client.phone ?? '—'} />
          <InfoRow
            label="Address"
            align="start"
            value={
              client.addressLines ? (
                <span className="block text-right">
                  {client.addressLines.map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              ) : (
                '—'
              )
            }
          />
        </div>
      </Card>

      <Card
        title="Primary Contact"
        icon={
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef2ff]">
            <User className="h-4 w-4 text-[#0050cb]" />
          </div>
        }
        action={
          <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
            Primary
          </span>
        }
      >
        <div className="divide-y divide-[#f3f4f6]">
          <InfoRow label="Name" value={client.contact.name} />
          <InfoRow label="Job Title" value={client.contact.jobTitle ?? '—'} />
          <InfoRow label="Email" value={client.contact.email ?? '—'} />
          <InfoRow label="Phone" value={client.contact.phone ?? '—'} />
          <InfoRow label="Mobile" value={client.contact.mobile ?? '—'} />
        </div>
        <div className="mt-4 flex gap-2">
          <a
            href={client.contact.email ? `mailto:${client.contact.email}` : undefined}
            className={cn(
              'flex h-9 flex-1 items-center justify-center gap-2 rounded-xl border border-[#c2c6d8] font-inter text-sm font-semibold text-[#1c1b1b] hover:bg-gray-50',
              !client.contact.email && 'pointer-events-none opacity-40',
            )}
          >
            <Mail className="h-3.5 w-3.5" />
            Send Email
          </a>
          <a
            href={client.contact.mobile || client.contact.phone ? `tel:${client.contact.mobile || client.contact.phone}` : undefined}
            className={cn(
              'flex h-9 flex-1 items-center justify-center gap-2 rounded-xl border border-[#c2c6d8] font-inter text-sm font-semibold text-[#1c1b1b] hover:bg-gray-50',
              !(client.contact.mobile || client.contact.phone) && 'pointer-events-none opacity-40',
            )}
          >
            <Phone className="h-3.5 w-3.5" />
            Call
          </a>
        </div>
      </Card>

      <Card
        title="Financial Summary"
        icon={
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50">
            <DollarSign className="h-4 w-4 text-green-600" />
          </div>
        }
        action={
          <button
            type="button"
            onClick={() => notConnected('Finance view')}
            className="font-inter text-sm font-semibold text-[#0050cb] hover:underline"
          >
            View Finance
          </button>
        }
      >
        <p className="font-inter text-xs text-[#9ca3af]">Outstanding Balance</p>
        <p
          className={cn(
            'font-manrope text-2xl font-extrabold',
            client.totals.outstandingAmount > 0 ? 'text-red-500' : 'text-[#1c1b1b]',
          )}
        >
          {formatCurrency(client.totals.outstandingAmount)}
        </p>
        <div className="mt-4 divide-y divide-[#f3f4f6]">
          <InfoRow
            label={`Total Invoices  ${client.totals.totalInvoices}`}
            value={formatCurrency(client.totals.totalInvoiceAmount)}
          />
          <InfoRow
            label={`Paid Invoices  ${client.totals.paidInvoices}`}
            value={formatCurrency(client.totals.paidAmount)}
          />
          <InfoRow
            label={`Overdue Invoices  ${client.totals.overdueInvoices}`}
            value={formatCurrency(client.totals.outstandingAmount)}
          />
        </div>
      </Card>

      <Card
        title="Additional Information"
        className="lg:col-span-2"
        icon={
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef2ff]">
            <FileText className="h-4 w-4 text-[#0050cb]" />
          </div>
        }
        action={
          isEditingNotes ? (
            <button
              type="button"
              onClick={saveNotes}
              className="font-inter text-sm font-semibold text-[#0050cb] hover:underline"
            >
              Save
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingNotes(true)}
              className="flex items-center gap-1 font-inter text-sm font-semibold text-[#0050cb] hover:underline"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
          )
        }
      >
        <p className="mb-1 font-inter text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">
          Notes
        </p>
        {isEditingNotes ? (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-[#c2c6d8] p-3 font-inter text-sm text-[#1c1b1b] outline-none focus:border-[#0050cb]"
          />
        ) : (
          <p className="whitespace-pre-line font-inter text-sm text-[#1c1b1b]">
            {notes || 'No notes yet.'}
          </p>
        )}
      </Card>

      <Card
        title="Recent Activity"
        icon={
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef2ff]">
            <Clock className="h-4 w-4 text-[#0050cb]" />
          </div>
        }
        action={
          <button
            type="button"
            onClick={() => notConnected('Activity history')}
            className="font-inter text-sm font-semibold text-[#0050cb] hover:underline"
          >
            View All
          </button>
        }
      >
        <p className="py-6 text-center font-inter text-sm text-[#9ca3af]">No recent activity yet.</p>
      </Card>
    </div>
  )
}

const EMPTY_TAB_COPY: Record<Exclude<TabKey, 'overview' | 'contacts'>, { title: string; description: string }> = {
  projects: {
    title: 'No projects yet',
    description: 'Projects linked to this client will appear here once the Projects feature is connected.',
  },
  jobs: {
    title: 'No jobs yet',
    description: 'Jobs linked to this client will appear here once the Jobs feature is connected.',
  },
  invoices: {
    title: 'No invoices yet',
    description: 'Invoices for this client will appear here once the Invoices feature is connected.',
  },
  activity: {
    title: 'No activity yet',
    description: 'A timeline of everything that happens with this client will appear here.',
  },
  notes: {
    title: 'No files yet',
    description: 'Notes and files you attach to this client will appear here.',
  },
}

function EmptyTab({ tab }: { tab: Exclude<TabKey, 'overview' | 'contacts'> }) {
  const copy = EMPTY_TAB_COPY[tab]
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white py-16 text-center">
      <p className="font-manrope text-base font-bold text-[#1c1b1b]">{copy.title}</p>
      <p className="mx-auto mt-1 max-w-sm font-inter text-sm text-[#9ca3af]">{copy.description}</p>
    </div>
  )
}
