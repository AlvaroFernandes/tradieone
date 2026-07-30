import { useNavigate } from 'react-router-dom'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Bell, LogOut, Search, User } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return (parts[0]![0] + parts[parts.length - 1]![0]).toUpperCase()
}

// The login response doesn't include the user's real name yet — derive a
// friendlier display name from their email instead of a generic "User".
function getDisplayName(name: string | undefined, email: string | undefined) {
  if (name?.trim()) return name
  const local = email?.split('@')[0] ?? ''
  const words = local
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0]!.toUpperCase() + w.slice(1))
  return words.length ? words.join(' ') : 'User'
}

export function Topbar() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const name = getDisplayName(user?.name, user?.email)
  // 'user' is a hardcoded placeholder set at login/register, not a real job
  // title — hide it rather than show confusing placeholder data.
  const role = user?.role && user.role !== 'user' ? user.role : null
  // No notifications API exists yet — always empty until one is wired up.
  const hasUnreadNotifications = false

  function handleLogout() {
    clearAuth()
    navigate('/login')
  }

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
          {hasUnreadNotifications && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          )}
        </button>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="flex items-center gap-3 rounded-xl p-1 outline-none transition-colors hover:bg-[#f2f3f7]"
            >
              <div className="text-right">
                <p className="font-inter text-sm font-semibold leading-tight text-[#1c1b1b]">{name}</p>
                {role && <p className="font-inter text-xs leading-tight text-[#6b7280]">{role}</p>}
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0050cb] font-inter text-sm font-semibold text-white">
                {getInitials(name)}
              </div>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 min-w-[200px] rounded-xl border border-[#e5e7eb] bg-white p-1.5 font-inter text-sm shadow-lg"
            >
              <DropdownMenu.Item
                disabled
                title="Coming soon"
                className="flex cursor-not-allowed items-center gap-2 rounded-lg px-3 py-2 text-[#9ca3af] outline-none"
              >
                <User className="h-4 w-4" />
                My Profile
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-[#e5e7eb]" />
              <DropdownMenu.Item
                onSelect={handleLogout}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-red-600 outline-none hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  )
}
