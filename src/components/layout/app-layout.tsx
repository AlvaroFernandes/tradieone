import { Outlet } from 'react-router-dom'
import { Sidebar } from './sidebar'
import { useUIStore } from '@/store/ui.store'
import { cn } from '@/lib/utils'

export default function AppLayout() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main
        className={cn(
          'flex-1 overflow-auto transition-all duration-200',
          sidebarCollapsed ? 'ml-16' : 'ml-64',
        )}
      >
        <div className="min-h-full p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
