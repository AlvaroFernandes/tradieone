import type { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import AppHeader from '@/components/AppHeader';
import { logout } from '@/services/auth';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppHeader onLogout={handleLogout} setCurrentPage={() => {}} />
          {children}
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
