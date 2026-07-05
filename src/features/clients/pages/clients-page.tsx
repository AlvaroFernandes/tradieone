import { useMemo, useState } from 'react'
import {
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  DollarSign,
  MoreHorizontal,
  Plus,
  Search,
  TrendingUp,
  Upload,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { MOCK_CLIENTS, type ClientRow } from '@/features/clients/constants/mock-clients'
import { NewClientModal } from '@/features/clients/components/new-client-modal'
import type { NewClientFormData } from '@/types/client.types'

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50]

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientRow[]>(MOCK_CLIENTS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All')
  const [typeFilter, setTypeFilter] = useState<'All' | 'Commercial' | 'Residential'>('All')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const [showNewClientModal, setShowNewClientModal] = useState(false)

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.contactName.toLowerCase().includes(search.toLowerCase()) ||
        c.contactEmail.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter
      const matchesType = typeFilter === 'All' || c.type === typeFilter
      return matchesSearch && matchesStatus && matchesType
    })
  }, [clients, search, statusFilter, typeFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * rowsPerPage
  const pageRows = filtered.slice(pageStart, pageStart + rowsPerPage)

  const stats = useMemo(() => {
    const active = clients.filter((c) => c.status === 'Active')
    const outstandingClients = clients.filter((c) => c.outstanding > 0)
    return {
      total: clients.length,
      active: active.length,
      totalProjects: clients.reduce((sum, c) => sum + c.projects, 0),
      outstandingBalance: clients.reduce((sum, c) => sum + c.outstanding, 0),
      outstandingClientsCount: outstandingClients.length,
    }
  }, [clients])

  function handleClearFilters() {
    setSearch('')
    setStatusFilter('All')
    setTypeFilter('All')
    setPage(1)
  }

  function handleCreateClient(data: NewClientFormData) {
    const newRow: ClientRow = {
      id: crypto.randomUUID(),
      initials: data.clientName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 3)
        .toUpperCase(),
      name: data.clientName,
      contactName: data.primaryContactSameAsClient ? data.clientName : data.contactName,
      contactEmail: (data.primaryContactSameAsClient ? data.email : data.contactEmail) || '—',
      type: data.clientType,
      projects: 0,
      jobs: 0,
      outstanding: 0,
      invoiceLabel: 'Up to date',
      status: 'Active',
    }
    setClients((prev) => [newRow, ...prev])
    setShowNewClientModal(false)
    toast.success('Client added locally — saving to the server is not connected yet.')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-manrope text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-sm text-muted-foreground">
            Manage your clients, track relationships and grow your business.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-xl border border-[#c2c6d8] bg-white px-4 font-inter text-sm font-semibold text-[#1c1b1b] hover:bg-gray-50"
          >
            <Upload className="h-4 w-4" />
            Import
          </button>
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-xl border border-[#c2c6d8] bg-white px-4 font-inter text-sm font-semibold text-[#1c1b1b] hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            type="button"
            onClick={() => setShowNewClientModal(true)}
            className="flex h-10 items-center gap-2 rounded-xl bg-[#0050cb] px-4 font-inter text-sm font-semibold text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New Client
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Clients"
          value={stats.total.toLocaleString()}
          hint="All time clients"
          accent="#0050cb"
          icon={<Users className="h-5 w-5 text-[#0050cb]" />}
        />
        <StatCard
          label="Active Clients"
          value={stats.active.toLocaleString()}
          hint={`${stats.total ? Math.round((stats.active / stats.total) * 100) : 0}% of total`}
          accent="#16a34a"
          icon={<TrendingUp className="h-5 w-5 text-green-600" />}
        />
        <StatCard
          label="Projects in Progress"
          value={stats.totalProjects.toLocaleString()}
          hint="Across all clients"
          accent="#7c3aed"
          icon={<Building2 className="h-5 w-5 text-violet-600" />}
        />
        <StatCard
          label="Outstanding Balance"
          value={`$${stats.outstandingBalance.toLocaleString()}`}
          hint={`From ${stats.outstandingClientsCount} clients`}
          accent="#d97706"
          icon={<DollarSign className="h-5 w-5 text-amber-600" />}
        />
      </div>

      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[280px] flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search clients by name, contact, email..."
              className="h-11 w-full rounded-xl border border-[#c2c6d8] bg-white pl-11 pr-4 font-inter text-sm text-[#1c1b1b] placeholder:text-[#9ca3af] outline-none focus:border-[#0050cb] focus:ring-2 focus:ring-[#0050cb]/20"
            />
          </div>

          <FilterSelect
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v as typeof statusFilter)
              setPage(1)
            }}
            options={['All', 'Active', 'Inactive']}
            label="Status"
          />
          <FilterSelect
            value={typeFilter}
            onChange={(v) => {
              setTypeFilter(v as typeof typeFilter)
              setPage(1)
            }}
            options={['All', 'Commercial', 'Residential']}
            label="Client Type"
          />

          <button
            type="button"
            onClick={handleClearFilters}
            className="ml-auto font-inter text-sm font-semibold text-[#0050cb] hover:underline"
          >
            Clear
          </button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse font-inter text-sm">
            <thead>
              <tr className="border-b border-[#e5e7eb] text-left text-[#424656]">
                <th className="pb-3 font-semibold">Client &amp; Contact</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Projects</th>
                <th className="pb-3 font-semibold">Jobs</th>
                <th className="pb-3 font-semibold">Outstanding</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((client) => (
                <tr key={client.id} className="border-b border-[#e5e7eb] last:border-0">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#001849] font-inter text-xs font-semibold text-white">
                        {client.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1c1b1b]">{client.name}</p>
                        <p className="text-xs text-[#9ca3af]">
                          {client.contactName} • {client.contactEmail}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-semibold',
                        client.type === 'Commercial'
                          ? 'bg-[#eef2ff] text-[#0050cb]'
                          : 'bg-green-50 text-green-700',
                      )}
                    >
                      {client.type}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-[#1c1b1b]">{client.projects}</td>
                  <td className="py-4 pr-4 text-[#1c1b1b]">{client.jobs}</td>
                  <td className="py-4 pr-4">
                    <p className={cn('font-semibold', client.outstanding > 0 ? 'text-red-500' : 'text-[#1c1b1b]')}>
                      ${client.outstanding.toLocaleString()}
                    </p>
                    <p className="text-xs text-[#9ca3af]">{client.invoiceLabel}</p>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                      {client.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[#9ca3af] hover:bg-gray-100"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#9ca3af]">
                    No clients match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="font-inter text-sm text-[#424656]">
            Showing {filtered.length === 0 ? 0 : pageStart + 1} to{' '}
            {Math.min(pageStart + rowsPerPage, filtered.length)} of {filtered.length} clients
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e5e7eb] text-[#424656] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={cn(
                  'h-8 min-w-8 rounded-lg px-2 font-inter text-sm font-semibold',
                  p === currentPage ? 'bg-[#0050cb] text-white' : 'text-[#424656] hover:bg-gray-100',
                )}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e5e7eb] text-[#424656] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 font-inter text-sm text-[#424656]">
            Rows per page:
            <div className="relative">
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value))
                  setPage(1)
                }}
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

      {showNewClientModal && (
        <NewClientModal onClose={() => setShowNewClientModal(false)} onCreate={handleCreateClient} />
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  hint,
  accent,
  icon,
}: {
  label: string
  value: string
  hint: string
  accent: string
  icon: React.ReactNode
}) {
  return (
    <div
      className="rounded-2xl border border-[#e5e7eb] bg-white p-5"
      style={{ borderLeftWidth: 4, borderLeftColor: accent }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-inter text-sm text-[#424656]">{label}</p>
          <p className="mt-1 font-manrope text-3xl font-extrabold text-[#1c1b1b]">{value}</p>
        </div>
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `${accent}1a` }}
        >
          {icon}
        </div>
      </div>
      <p className="mt-2 font-inter text-xs text-[#9ca3af]">{hint}</p>
    </div>
  )
}

function FilterSelect({
  value,
  onChange,
  options,
  label,
}: {
  value: string
  onChange: (value: string) => void
  options: string[]
  label: string
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 cursor-pointer appearance-none rounded-xl border border-[#c2c6d8] bg-white py-2 pl-4 pr-9 font-inter text-sm text-[#1c1b1b] outline-none focus:border-[#0050cb]"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt === 'All' ? `${label}: All` : opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
    </div>
  )
}
