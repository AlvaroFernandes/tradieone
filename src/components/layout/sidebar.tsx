import { Link, useLocation } from 'react-router-dom'
import {
  LayoutGrid,
  Workflow,
  Wrench,
  Calendar,
  Users,
  UserCog,
  Clock,
  Banknote,
  BarChart3,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  CirclePlus,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react'
import { useUIStore } from '@/store/ui.store'
import { useAuthStore } from '@/store/auth.store'
import { cn } from '@/lib/utils'

interface NavItem {
  to: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  hasSubmenu?: boolean
}

const navItems: NavItem[] = [
  { to: '/dashboard', icon: LayoutGrid, label: 'Home' },
  { to: '/projects', icon: Workflow, label: 'Projects' },
  { to: '/jobs', icon: Wrench, label: 'Jobs' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/clients', icon: Users, label: 'Clients' },
  { to: '/team', icon: UserCog, label: 'Team' },
  { to: '/timesheets', icon: Clock, label: 'Timesheets' },
  { to: '/finance', icon: Banknote, label: 'Finance', hasSubmenu: true },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
]

const IMPLEMENTED_ROUTES = new Set(['/dashboard', '/clients'])

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const location = useLocation()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-all duration-200',
        sidebarCollapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4">
        {!sidebarCollapsed && (
          <div>
            <p className="font-manrope text-lg font-extrabold leading-tight text-white">TradieOne</p>
            <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.6px] text-white/40">
              Trades Management
            </p>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/90 text-sidebar transition-colors hover:bg-white',
            sidebarCollapsed && 'mx-auto',
          )}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="space-y-1">
          {navItems.map(({ to, icon: Icon, label, hasSubmenu }) => {
            const isActive = location.pathname.startsWith(to)
            const isImplemented = IMPLEMENTED_ROUTES.has(to)

            const content = (
              <>
                <Icon className="h-5 w-5 shrink-0" />
                {!sidebarCollapsed && <span className="flex-1">{label}</span>}
                {!sidebarCollapsed && hasSubmenu && <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />}
              </>
            )

            const className = cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 font-inter text-sm transition-colors',
              isActive
                ? 'bg-sidebar-accent font-semibold text-white'
                : isImplemented
                  ? 'text-white/70 hover:bg-sidebar-accent/60 hover:text-white'
                  : 'cursor-default text-white/30',
            )

            return (
              <li key={to}>
                {isImplemented ? (
                  <Link to={to} title={sidebarCollapsed ? label : undefined} className={className}>
                    {content}
                  </Link>
                ) : (
                  <span title={sidebarCollapsed ? label : 'Coming soon'} className={className}>
                    {content}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Quick Actions + footer */}
      <div className="space-y-1 p-3">
        <button
          type="button"
          className={cn(
            'flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0050cb] font-inter text-sm font-semibold text-white transition-opacity hover:opacity-90',
            sidebarCollapsed && 'px-0',
          )}
          title={sidebarCollapsed ? 'Quick Actions' : undefined}
        >
          <CirclePlus className="h-4 w-4 shrink-0" />
          {!sidebarCollapsed && 'Quick Actions'}
        </button>

        <div className="pt-2">
          <span
            title={sidebarCollapsed ? 'Settings' : 'Coming soon'}
            className="flex cursor-default items-center gap-3 rounded-xl px-3 py-2.5 font-inter text-sm text-white/30"
          >
            <Settings className="h-5 w-5 shrink-0" />
            {!sidebarCollapsed && 'Settings'}
          </span>
          <span
            title={sidebarCollapsed ? 'Support' : 'Coming soon'}
            className="flex cursor-default items-center gap-3 rounded-xl px-3 py-2.5 font-inter text-sm text-white/30"
          >
            <HelpCircle className="h-5 w-5 shrink-0" />
            {!sidebarCollapsed && 'Support'}
          </span>
          <button
            onClick={clearAuth}
            title={sidebarCollapsed ? 'Sign out' : undefined}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-inter text-sm text-white/70 transition-colors hover:bg-sidebar-accent/60 hover:text-white"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!sidebarCollapsed && 'Sign out'}
          </button>
        </div>
      </div>
    </aside>
  )
}
