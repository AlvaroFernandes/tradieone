import { useMemo, useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
  AlertTriangle,
  Briefcase,
  Calendar,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  DollarSign,
  Eye,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  UserCircle2,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { MOCK_JOBS, TEAM } from '@/features/jobs/data/mock-jobs'
import { JOB_PRIORITIES, JOB_STATUSES } from '@/types/job.types'
import type { JobPriority, JobStatus } from '@/types/job.types'

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50]
const MAX_VISIBLE_AVATARS = 3

function priorityBadgeClasses(priority: JobPriority) {
  return priority === 'Urgent' ? 'bg-red-50 text-red-600' : 'bg-[#eef2ff] text-[#0050cb]'
}

function statusBadgeClasses(status: JobStatus) {
  switch (status) {
    case 'In Progress':
      return 'bg-[#eef2ff] text-[#0050cb]'
    case 'Completed':
      return 'bg-green-50 text-green-700'
    case 'Scheduled':
      return 'bg-violet-50 text-violet-700'
    case 'Draft':
      return 'bg-amber-50 text-amber-700'
    case 'Cancelled':
      return 'bg-gray-100 text-gray-500'
  }
}

function notConnected(action: string) {
  toast.info(`${action} isn't connected to the server yet.`)
}

export default function JobsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | JobStatus>('All')
  const [priorityFilter, setPriorityFilter] = useState<'All' | JobPriority>('All')
  const [assigneeFilter, setAssigneeFilter] = useState('All')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return MOCK_JOBS.filter((job) => {
      const matchesSearch =
        !search ||
        job.name.toLowerCase().includes(search.toLowerCase()) ||
        job.code.toLowerCase().includes(search.toLowerCase()) ||
        job.client.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'All' || job.status === statusFilter
      const matchesPriority = priorityFilter === 'All' || job.priority === priorityFilter
      const matchesAssignee =
        assigneeFilter === 'All' || job.assignees.some((a) => a.name === assigneeFilter)
      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
    })
  }, [search, statusFilter, priorityFilter, assigneeFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * rowsPerPage
  const pageRows = filtered.slice(pageStart, pageStart + rowsPerPage)

  const stats = useMemo(() => {
    const active = MOCK_JOBS.filter((j) => j.status === 'In Progress' || j.status === 'Scheduled')
    const scheduledToday = MOCK_JOBS.filter((j) => j.scheduledDate === MOCK_JOBS[0]!.scheduledDate)
    const completedToday = scheduledToday.filter((j) => j.status === 'Completed')
    const totalValue = MOCK_JOBS.filter((j) => j.status !== 'Cancelled').reduce((sum, j) => sum + j.value, 0)
    const overdue = MOCK_JOBS.filter((j) => j.status === 'In Progress' && j.progress < 50)
    return {
      active: active.length,
      scheduledToday: scheduledToday.length,
      completedToday: completedToday.length,
      totalValue,
      overdue: overdue.length,
    }
  }, [])

  function handleClearFilters() {
    setSearch('')
    setStatusFilter('All')
    setPriorityFilter('All')
    setAssigneeFilter('All')
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-manrope text-2xl font-bold text-foreground">Jobs</h1>
          <p className="text-sm text-muted-foreground">Manage every job from scheduling to invoicing.</p>
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
            <CalendarDays className="h-4 w-4" />
            Calendar View
          </button>
          <button
            type="button"
            onClick={() => notConnected('Creating a job')}
            className="flex h-10 items-center gap-2 rounded-xl bg-[#0050cb] px-4 font-inter text-sm font-semibold text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New Job
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Jobs"
          value={stats.active.toLocaleString()}
          hint="Currently in progress"
          accent="#0050cb"
          icon={<Briefcase className="h-5 w-5 text-[#0050cb]" />}
        />
        <StatCard
          label="Today's Schedule"
          value={stats.scheduledToday.toLocaleString()}
          hint={`${stats.completedToday} of ${stats.scheduledToday} jobs completed today`}
          accent="#16a34a"
          icon={<Calendar className="h-5 w-5 text-green-600" />}
        />
        <StatCard
          label="Total Job Value"
          value={`$${stats.totalValue.toLocaleString()}`}
          hint="Across all active jobs"
          accent="#7c3aed"
          icon={<DollarSign className="h-5 w-5 text-violet-600" />}
        />
        <StatCard
          label="Overdue Jobs"
          value={stats.overdue.toLocaleString()}
          hint="Past due date"
          accent="#d97706"
          icon={<AlertTriangle className="h-5 w-5 text-amber-600" />}
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
              placeholder="Search jobs..."
              className="h-11 w-full rounded-xl border border-[#c2c6d8] bg-white pl-11 pr-4 font-inter text-sm text-[#1c1b1b] placeholder:text-[#9ca3af] outline-none focus:border-[#0050cb] focus:ring-2 focus:ring-[#0050cb]/20"
            />
          </div>

          <FilterSelect
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v as typeof statusFilter)
              setPage(1)
            }}
            options={['All', ...JOB_STATUSES]}
            label="Status"
            leading={<span className="h-2 w-2 rounded-full bg-green-500" />}
          />
          <FilterSelect
            value={priorityFilter}
            onChange={(v) => {
              setPriorityFilter(v as typeof priorityFilter)
              setPage(1)
            }}
            options={['All', ...JOB_PRIORITIES]}
            label="Priority"
          />
          <FilterSelect
            value={assigneeFilter}
            onChange={(v) => {
              setAssigneeFilter(v)
              setPage(1)
            }}
            options={['All', ...TEAM.map((m) => m.name)]}
            label="Assigned to"
            leading={<UserCircle2 className="h-4 w-4 text-[#9ca3af]" />}
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
          <table className="w-full min-w-[1000px] border-collapse font-inter text-sm">
            <thead>
              <tr className="border-b border-[#e5e7eb] text-left text-[#424656]">
                <th className="pb-3 font-semibold">Job ID &amp; Name</th>
                <th className="pb-3 font-semibold">Client</th>
                <th className="pb-3 font-semibold">Scheduled Date</th>
                <th className="pb-3 font-semibold">Priority</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Progress</th>
                <th className="pb-3 font-semibold">Assigned To</th>
                <th className="pb-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((job) => {
                const visibleAssignees = job.assignees.slice(0, MAX_VISIBLE_AVATARS)
                const extra = job.assignees.length - visibleAssignees.length
                return (
                  <tr key={job.id} className="border-b border-[#e5e7eb] last:border-0">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#001849] font-inter text-xs font-semibold text-white">
                          {job.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-[#1c1b1b]">{job.name}</p>
                          <p className="text-xs text-[#9ca3af]">{job.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-[#1c1b1b]">{job.client}</td>
                    <td className="py-4 pr-4">
                      <p className="text-[#1c1b1b]">{job.scheduledDate}</p>
                      <p className="text-xs text-[#9ca3af]">{job.scheduledTime}</p>
                    </td>
                    <td className="py-4 pr-4">
                      <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', priorityBadgeClasses(job.priority))}>
                        {job.priority}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', statusBadgeClasses(job.status))}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="w-9 shrink-0 text-[#1c1b1b]">{job.progress}%</span>
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#e5e7eb]">
                          <div
                            className="h-full rounded-full bg-[#0050cb]"
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center">
                        {visibleAssignees.map((a, i) => (
                          <div
                            key={a.name}
                            title={a.name}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white font-inter text-[10px] font-semibold text-white"
                            style={{ backgroundColor: a.color, marginLeft: i === 0 ? 0 : -8 }}
                          >
                            {a.initials}
                          </div>
                        ))}
                        {extra > 0 && (
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white bg-gray-200 font-inter text-[10px] font-semibold text-[#424656]"
                            style={{ marginLeft: -8 }}
                          >
                            +{extra}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4">
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-full text-[#9ca3af] hover:bg-gray-100"
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
                            <DropdownMenu.Item
                              onSelect={() => notConnected('Viewing job details')}
                              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-[#1c1b1b] outline-none hover:bg-gray-50"
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              onSelect={() => notConnected('Editing a job')}
                              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-[#1c1b1b] outline-none hover:bg-gray-50"
                            >
                              <Pencil className="h-4 w-4" />
                              Edit Job
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              onSelect={() => notConnected('Duplicating a job')}
                              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-[#1c1b1b] outline-none hover:bg-gray-50"
                            >
                              <Copy className="h-4 w-4" />
                              Duplicate Job
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              onSelect={() => notConnected('Deleting a job')}
                              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-red-600 outline-none hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete Job
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </td>
                  </tr>
                )
              })}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-[#9ca3af]">
                    No jobs match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="font-inter text-sm text-[#424656]">
            Showing {filtered.length === 0 ? 0 : pageStart + 1} to{' '}
            {Math.min(pageStart + rowsPerPage, filtered.length)} of {filtered.length} jobs
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
  leading,
}: {
  value: string
  onChange: (value: string) => void
  options: string[]
  label: string
  leading?: React.ReactNode
}) {
  return (
    <div className="relative">
      {leading && (
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">{leading}</span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'h-11 cursor-pointer appearance-none rounded-xl border border-[#c2c6d8] bg-white py-2 pr-9 font-inter text-sm text-[#1c1b1b] outline-none focus:border-[#0050cb]',
          leading ? 'pl-9' : 'pl-4',
        )}
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
