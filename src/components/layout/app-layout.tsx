import { Outlet } from 'react-router-dom'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'
import { useUIStore } from '@/store/ui.store'
import { cn } from '@/lib/utils'

export default function AppLayout() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div
        className={cn(
          'flex flex-1 flex-col overflow-hidden transition-all duration-200',
          sidebarCollapsed ? 'ml-16' : 'ml-64',
        )}
      >
        <Topbar />
        <main className="flex-1 overflow-auto">
          <div className="min-h-full p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
