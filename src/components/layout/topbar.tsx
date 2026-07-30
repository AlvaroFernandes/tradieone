import { Bell, Search } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return (parts[0]![0] + parts[parts.length - 1]![0]).toUpperCase()
}

export function Topbar() {
  const user = useAuthStore((s) => s.user)
  const name = user?.name || 'User'
  const role = user?.role

  return (
    <header className="flex h-20 shrink-0 items-center justify-between gap-4 border-b border-[#e5e7f0] bg-white px-6">
      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
        <input
          type="text"
          placeholder="Search projects, clients, or invoices..."
          className="h-11 w-full rounded-xl border border-[#c2c6d8] bg-[#f7f8fb] pl-11 pr-4 font-inter text-sm text-[#1c1b1b] outline-none placeholder:text-[#9ca3af] focus:border-[#0050cb] focus:ring-2 focus:ring-[#0050cb]/20"
        />
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <button
          type="button"
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#6b7280] transition-colors hover:bg-[#f2f3f7]"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-inter text-sm font-semibold leading-tight text-[#1c1b1b]">{name}</p>
            {role && <p className="font-inter text-xs leading-tight text-[#6b7280]">{role}</p>}
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0050cb] font-inter text-sm font-semibold text-white">
            {getInitials(name)}
          </div>
        </div>
      </div>
    </header>
  )
}
