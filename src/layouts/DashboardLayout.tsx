import type { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import AppHeader from '@/components/AppHeader';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const handleLogout = () => {
    // TODO: implement logout logic
  };

  const handleSetCurrentPage = (page: string) => {
    // TODO: implement page change logic

  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarProvider>
        <AppSidebar {...({ handleSetCurrentPage } as any)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppHeader onLogout={handleLogout} setCurrentPage={handleSetCurrentPage} />
          {children}
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
